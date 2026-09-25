"""Course catalog, learning player, and resource endpoints."""
import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import (
    PaginationParams,
    get_current_user,
    get_db,
    get_optional_user,
    require_role,
)
from app.db.models import Category, Enrollment, Skill, User
from app.schemas.all_schemas import (
    CategoryOut,
    CourseCreate,
    CourseModuleCreate,
    CourseModuleOut,
    CourseOut,
    CourseResourceCreate,
    CourseResourceOut,
    EnrollmentOut,
    PaginatedResponse,
    ResourceProgressUpdate,
    SkillOut,
)
from app.services.course_service import CourseService

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Annotated[Session, Depends(get_db)]) -> list[CategoryOut]:
    """List all active course categories."""
    cats = db.scalars(select(Category).where(Category.is_active == True)).all()  # noqa: E712
    return [CategoryOut.model_validate(c) for c in cats]


@router.get("/skills", response_model=list[SkillOut])
def list_skills(db: Annotated[Session, Depends(get_db)]) -> list[SkillOut]:
    """List all available skills from master taxonomy."""
    skills = db.scalars(select(Skill)).all()
    return [SkillOut.model_validate(s) for s in skills]


@router.get("", response_model=PaginatedResponse[CourseOut])
def list_courses(
    db: Annotated[Session, Depends(get_db)],
    pagination: Annotated[PaginationParams, Depends()],
    current_user: Annotated[User | None, Depends(get_optional_user)] = None,
    category: str | None = Query(None, description="Category slug"),
    level: str | None = Query(None, description="beginner, intermediate, advanced"),
    trainer_id: uuid.UUID | None = Query(None, description="Filter by trainer"),
) -> PaginatedResponse[CourseOut]:
    """List published courses with filters and trainee enrollment status."""
    courses, total = CourseService.list_courses(
        db=db,
        category_slug=category,
        level=level,
        search=pagination.q,
        trainer_id=trainer_id,
        current_user=current_user,
        page=pagination.page,
        page_size=pagination.page_size,
    )
    total_pages = max(1, (total + pagination.page_size - 1) // pagination.page_size)
    return PaginatedResponse(
        items=courses,
        total=total,
        page=pagination.page,
        page_size=pagination.page_size,
        total_pages=total_pages,
    )


@router.get("/my-enrolled", response_model=list[CourseOut])
def get_my_enrolled_courses(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> list[CourseOut]:
    """Get all courses the current trainee is enrolled in."""
    enrollments = db.scalars(
        select(Enrollment).where(Enrollment.user_id == current_user.id)
    ).all()
    course_ids = [e.course_id for e in enrollments]

    results: list[CourseOut] = []
    for cid in course_ids:
        try:
            c_out = CourseService.get_course_by_id(db, cid, current_user)
            results.append(c_out)
        except Exception:
            continue
    return results


@router.get("/{course_id}", response_model=CourseOut)
def get_course_detail(
    course_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User | None, Depends(get_optional_user)] = None,
) -> CourseOut:
    """Fetch complete course curriculum tree and trainee progress."""
    return CourseService.get_course_by_id(db, course_id, current_user)


@router.post("", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(
    req: CourseCreate,
    db: Annotated[Session, Depends(get_db)],
    trainer: Annotated[User, Depends(require_role("trainer", "admin"))],
) -> CourseOut:
    """Create a new course (Trainer/Admin only)."""
    course = CourseService.create_course(db, req, trainer)
    return CourseService.get_course_by_id(db, course.id, trainer)


@router.post("/{course_id}/modules", response_model=CourseModuleOut, status_code=status.HTTP_201_CREATED)
def add_module_to_course(
    course_id: uuid.UUID,
    req: CourseModuleCreate,
    db: Annotated[Session, Depends(get_db)],
    trainer: Annotated[User, Depends(require_role("trainer", "admin"))],
) -> CourseModuleOut:
    """Add a module to a course."""
    module = CourseService.add_module(db, course_id, req)
    return CourseModuleOut.model_validate(module)


@router.post("/modules/{module_id}/resources", response_model=CourseResourceOut, status_code=status.HTTP_201_CREATED)
def add_resource_to_module(
    module_id: uuid.UUID,
    req: CourseResourceCreate,
    db: Annotated[Session, Depends(get_db)],
    trainer: Annotated[User, Depends(require_role("trainer", "admin"))],
) -> CourseResourceOut:
    """Add a resource (video, pdf, text) to a module."""
    resource = CourseService.add_resource(db, module_id, req)
    return CourseResourceOut.model_validate(resource)


@router.post("/{course_id}/enroll", response_model=EnrollmentOut, status_code=status.HTTP_200_OK)
def enroll_course(
    course_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> EnrollmentOut:
    """Enroll current trainee in course."""
    enrollment = CourseService.enroll_trainee(db, course_id, current_user)
    return EnrollmentOut.model_validate(enrollment)


@router.post("/resources/{resource_id}/progress", response_model=dict[str, Any])
def update_resource_progress(
    resource_id: uuid.UUID,
    req: ResourceProgressUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> dict[str, Any]:
    """Mark a resource completed and calculate updated course percentage."""
    return CourseService.update_resource_progress(
        db=db,
        resource_id=resource_id,
        user=current_user,
        completed=req.completed,
        time_spent_seconds=req.time_spent_seconds,
    )
