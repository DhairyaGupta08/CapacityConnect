"""Course, Module, Resource, and Enrollment service."""
import re
import uuid
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.core.errors import NotFoundError
from app.db.models import (
    Category,
    Course,
    CourseModule,
    CourseResource,
    Enrollment,
    ResourceProgress,
    User,
)
from app.schemas.all_schemas import (
    CourseCreate,
    CourseModuleCreate,
    CourseOut,
    CourseResourceCreate,
)


def slugify(text: str) -> str:
    """Generate URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[\s_-]+", "-", text).strip("-")


class CourseService:
    @staticmethod
    def list_courses(
        db: Session,
        category_slug: str | None = None,
        level: str | None = None,
        search: str | None = None,
        trainer_id: uuid.UUID | None = None,
        current_user: User | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[CourseOut], int]:
        """List published courses with filters and trainee enrollment status."""
        query = select(Course).options(
            joinedload(Course.category),
            joinedload(Course.trainer),
            selectinload(Course.modules).selectinload(CourseModule.resources),
        )

        if trainer_id:
            query = query.where(Course.trainer_id == trainer_id)
        else:
            # Public view only shows published courses
            query = query.where(Course.status == "published")

        if category_slug:
            query = query.join(Course.category).where(Category.slug == category_slug)

        if level:
            query = query.where(Course.level == level)

        if search:
            pattern = f"%{search}%"
            query = query.where(Course.title.ilike(pattern) | Course.description.ilike(pattern))

        total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
        courses = db.scalars(
            query.order_by(Course.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        ).all()

        # Check trainee enrollments if user authenticated
        enrollment_map: dict[uuid.UUID, Enrollment] = {}
        if current_user:
            user_enrollments = db.scalars(
                select(Enrollment).where(Enrollment.user_id == current_user.id)
            ).all()
            enrollment_map = {e.course_id: e for e in user_enrollments}

        results: list[CourseOut] = []
        for c in courses:
            out = CourseOut.model_validate(c)
            out.category_name = c.category.name if c.category else None
            out.trainer_name = c.trainer.full_name if c.trainer else "Instructor"
            out.total_enrollments = db.scalar(
                select(func.count(Enrollment.id)).where(Enrollment.course_id == c.id)
            ) or 0

            if c.id in enrollment_map:
                out.is_enrolled = True
                out.enrollment_progress = enrollment_map[c.id].progress_percent

            results.append(out)

        return results, total

    @staticmethod
    def get_course_by_id(
        db: Session,
        course_id: uuid.UUID,
        current_user: User | None = None,
    ) -> CourseOut:
        """Fetch single course with module tree and user's progress records."""
        course = db.scalar(
            select(Course)
            .options(
                joinedload(Course.category),
                joinedload(Course.trainer),
                selectinload(Course.modules).selectinload(CourseModule.resources),
            )
            .where(Course.id == course_id)
        )
        if not course:
            raise NotFoundError(f"Course with ID '{course_id}' not found.", code="COURSE_NOT_FOUND")

        out = CourseOut.model_validate(course)
        out.category_name = course.category.name if course.category else None
        out.trainer_name = course.trainer.full_name if course.trainer else "Instructor"
        out.total_enrollments = db.scalar(
            select(func.count(Enrollment.id)).where(Enrollment.course_id == course.id)
        ) or 0

        if current_user:
            enrollment = db.scalar(
                select(Enrollment).where(
                    Enrollment.course_id == course.id,
                    Enrollment.user_id == current_user.id,
                )
            )
            if enrollment:
                out.is_enrolled = True
                out.enrollment_progress = enrollment.progress_percent

                # Load completed resources
                progresses = db.scalars(
                    select(ResourceProgress).where(
                        ResourceProgress.enrollment_id == enrollment.id,
                        ResourceProgress.completed == True,  # noqa: E712
                    )
                ).all()
                completed_res_ids = {p.resource_id for p in progresses}

                for m in out.modules:
                    for r in m.resources:
                        if r.id in completed_res_ids:
                            r.is_completed = True

        return out

    @staticmethod
    def create_course(
        db: Session,
        req: CourseCreate,
        trainer: User,
    ) -> Course:
        """Create a new course authored by the authenticated trainer/admin."""
        base_slug = slugify(req.title)
        slug = base_slug
        count = 1
        while db.scalar(select(Course).where(Course.slug == slug)):
            slug = f"{base_slug}-{count}"
            count += 1

        course = Course(
            title=req.title,
            slug=slug,
            description=req.description,
            short_description=req.short_description,
            category_id=req.category_id,
            trainer_id=trainer.id,
            level=req.level,
            status=req.status,
            thumbnail_url=req.thumbnail_url,
            estimated_hours=req.estimated_hours,
        )
        db.add(course)
        db.commit()
        db.refresh(course)
        return course

    @staticmethod
    def add_module(
        db: Session,
        course_id: uuid.UUID,
        req: CourseModuleCreate,
    ) -> CourseModule:
        """Add a module to a course."""
        course = db.scalar(select(Course).where(Course.id == course_id))
        if not course:
            raise NotFoundError("Course not found.", code="COURSE_NOT_FOUND")

        module = CourseModule(
            course_id=course_id,
            title=req.title,
            description=req.description,
            sequence_order=req.sequence_order,
            duration_minutes=req.duration_minutes,
        )
        db.add(module)
        db.commit()
        db.refresh(module)
        return module

    @staticmethod
    def add_resource(
        db: Session,
        module_id: uuid.UUID,
        req: CourseResourceCreate,
    ) -> CourseResource:
        """Add a resource item to a module."""
        module = db.scalar(select(CourseModule).where(CourseModule.id == module_id))
        if not module:
            raise NotFoundError("Module not found.", code="MODULE_NOT_FOUND")

        resource = CourseResource(
            module_id=module_id,
            title=req.title,
            resource_type=req.resource_type,
            file_url=req.file_url,
            content_text=req.content_text,
            duration_minutes=req.duration_minutes,
            sequence_order=req.sequence_order,
            is_downloadable=req.is_downloadable,
        )
        db.add(resource)
        db.commit()
        db.refresh(resource)
        return resource

    @staticmethod
    def enroll_trainee(
        db: Session,
        course_id: uuid.UUID,
        user: User,
    ) -> Enrollment:
        """Enroll a trainee into a course."""
        course = db.scalar(select(Course).where(Course.id == course_id))
        if not course:
            raise NotFoundError("Course not found.", code="COURSE_NOT_FOUND")

        existing = db.scalar(
            select(Enrollment).where(
                Enrollment.course_id == course_id,
                Enrollment.user_id == user.id,
            )
        )
        if existing:
            return existing

        enrollment = Enrollment(
            course_id=course_id,
            user_id=user.id,
            status="in_progress",
            progress_percent=0.0,
            started_at=datetime.now(UTC),
        )
        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)
        return enrollment

    @staticmethod
    def update_resource_progress(
        db: Session,
        resource_id: uuid.UUID,
        user: User,
        completed: bool = True,
        time_spent_seconds: int = 0,
    ) -> dict[str, Any]:
        """Mark a resource item as completed and recalculate course progress."""
        resource = db.scalar(
            select(CourseResource)
            .options(joinedload(CourseResource.module))
            .where(CourseResource.id == resource_id)
        )
        if not resource:
            raise NotFoundError("Resource not found.", code="RESOURCE_NOT_FOUND")

        course_id = resource.module.course_id
        enrollment = db.scalar(
            select(Enrollment).where(
                Enrollment.course_id == course_id,
                Enrollment.user_id == user.id,
            )
        )
        if not enrollment:
            # Auto-enroll if not already
            enrollment = CourseService.enroll_trainee(db, course_id, user)

        # Upsert ResourceProgress
        progress = db.scalar(
            select(ResourceProgress).where(
                ResourceProgress.enrollment_id == enrollment.id,
                ResourceProgress.resource_id == resource_id,
            )
        )
        if not progress:
            progress = ResourceProgress(
                enrollment_id=enrollment.id,
                resource_id=resource_id,
                completed=completed,
                time_spent_seconds=time_spent_seconds,
                last_accessed_at=datetime.now(UTC),
            )
            db.add(progress)
        else:
            progress.completed = completed
            progress.time_spent_seconds += time_spent_seconds
            progress.last_accessed_at = datetime.now(UTC)

        db.flush()

        # Recalculate course percentage
        all_resources_count = db.scalar(
            select(func.count(CourseResource.id))
            .join(CourseModule)
            .where(CourseModule.course_id == course_id)
        ) or 1

        completed_count = db.scalar(
            select(func.count(ResourceProgress.id))
            .where(
                ResourceProgress.enrollment_id == enrollment.id,
                ResourceProgress.completed == True,  # noqa: E712
            )
        ) or 0

        percent = min(100.0, round((completed_count / all_resources_count) * 100.0, 1))
        enrollment.progress_percent = percent
        if percent >= 100.0 and enrollment.status != "completed":
            enrollment.status = "completed"
            enrollment.completed_at = datetime.now(UTC)

        db.commit()
        db.refresh(enrollment)

        return {
            "resource_id": resource_id,
            "completed": completed,
            "progress_percent": enrollment.progress_percent,
            "course_status": enrollment.status,
        }
