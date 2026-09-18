"""SQLAlchemy 2.0 ORM Models for Capacity Connect."""
import uuid
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import GUID, Base, TimestampMixin, UUIDPkMixin


class User(Base, UUIDPkMixin, TimestampMixin):
    """User account model for Admin, Trainer, and Trainee roles."""
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="trainee", index=True, nullable=False)  # admin, trainer, trainee
    status: Mapped[str] = mapped_column(String(50), default="active", index=True, nullable=False)  # active, pending, rejected, suspended
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    organization: Mapped[str | None] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    trainee_profile: Mapped["TraineeProfile | None"] = relationship("TraineeProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    trainer_profile: Mapped["TrainerProfile | None"] = relationship("TrainerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    authored_courses: Mapped[list["Course"]] = relationship("Course", back_populates="trainer", cascade="all, delete-orphan")
    enrollments: Mapped[list["Enrollment"]] = relationship("Enrollment", back_populates="user", cascade="all, delete-orphan")
    assessment_attempts: Mapped[list["AssessmentAttempt"]] = relationship("AssessmentAttempt", back_populates="user", cascade="all, delete-orphan")
    certificates: Mapped[list["Certificate"]] = relationship("Certificate", back_populates="user", cascade="all, delete-orphan")
    notifications: Mapped[list["Notification"]] = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class TraineeProfile(Base, UUIDPkMixin, TimestampMixin):
    """Profile data specific to Trainee users."""
    __tablename__ = "trainee_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    department: Mapped[str | None] = mapped_column(String(255), nullable=True)
    designation: Mapped[str | None] = mapped_column(String(255), nullable=True)
    employee_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    qualifications: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)  # [{degree, institution, year}]
    experience_years: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    skills: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)  # [{name, level, category}]
    interests: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    resume_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="trainee_profile")


class TrainerProfile(Base, UUIDPkMixin, TimestampMixin):
    """Profile data specific to Trainer users."""
    __tablename__ = "trainer_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    expertise_subjects: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    skills: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)  # [{name, level, category, years}]
    qualifications: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)  # [{degree, institution, field}]
    experience_years: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    hourly_rate: Mapped[float | None] = mapped_column(Float, nullable=True)
    availability_status: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    approval_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="trainer_profile")


class Category(Base, UUIDPkMixin, TimestampMixin):
    """Master domain category taxonomy."""
    __tablename__ = "categories"

    name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    icon: Mapped[str | None] = mapped_column(String(100), default="Folder", nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    courses: Mapped[list["Course"]] = relationship("Course", back_populates="category")
    skills: Mapped[list["Skill"]] = relationship("Skill", back_populates="category")


class Skill(Base, UUIDPkMixin, TimestampMixin):
    """Master skill dictionary."""
    __tablename__ = "skills"

    name: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    category_id: Mapped[uuid.UUID | None] = mapped_column(GUID(), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    category: Mapped["Category | None"] = relationship("Category", back_populates="skills")


class Course(Base, UUIDPkMixin, TimestampMixin):
    """Course catalog item."""
    __tablename__ = "courses"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    short_description: Mapped[str | None] = mapped_column(String(500), nullable=True)
    category_id: Mapped[uuid.UUID | None] = mapped_column(GUID(), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    trainer_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    level: Mapped[str] = mapped_column(String(50), default="intermediate", nullable=False)  # beginner, intermediate, advanced
    status: Mapped[str] = mapped_column(String(50), default="published", index=True, nullable=False)  # draft, published, archived
    thumbnail_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    estimated_hours: Mapped[float] = mapped_column(Float, default=2.0, nullable=False)

    # Relationships
    category: Mapped["Category | None"] = relationship("Category", back_populates="courses")
    trainer: Mapped["User"] = relationship("User", back_populates="authored_courses")
    modules: Mapped[list["CourseModule"]] = relationship("CourseModule", back_populates="course", cascade="all, delete-orphan", order_by="CourseModule.sequence_order")
    enrollments: Mapped[list["Enrollment"]] = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    assessments: Mapped[list["Assessment"]] = relationship("Assessment", back_populates="course", cascade="all, delete-orphan")
    certificates: Mapped[list["Certificate"]] = relationship("Certificate", back_populates="course", cascade="all, delete-orphan")


class CourseModule(Base, UUIDPkMixin, TimestampMixin):
    """Module unit within a course."""
    __tablename__ = "course_modules"

    course_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    sequence_order: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=30, nullable=False)

    # Relationships
    course: Mapped["Course"] = relationship("Course", back_populates="modules")
    resources: Mapped[list["CourseResource"]] = relationship("CourseResource", back_populates="module", cascade="all, delete-orphan", order_by="CourseResource.sequence_order")


class CourseResource(Base, UUIDPkMixin, TimestampMixin):
    """Learning asset (video, PDF, document, text)."""
    __tablename__ = "course_resources"

    module_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("course_modules.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(50), default="video", nullable=False)  # video, pdf, document, text
    file_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    content_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    sequence_order: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    is_downloadable: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    module: Mapped["CourseModule"] = relationship("CourseModule", back_populates="resources")
    progress_records: Mapped[list["ResourceProgress"]] = relationship("ResourceProgress", back_populates="resource", cascade="all, delete-orphan")


class Enrollment(Base, UUIDPkMixin, TimestampMixin):
    """Trainee enrollment in a course."""
    __tablename__ = "enrollments"

    user_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="in_progress", index=True, nullable=False)  # enrolled, in_progress, completed, dropped
    progress_percent: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="enrollments")
    course: Mapped["Course"] = relationship("Course", back_populates="enrollments")
    resource_progresses: Mapped[list["ResourceProgress"]] = relationship("ResourceProgress", back_populates="enrollment", cascade="all, delete-orphan")
    assessment_attempts: Mapped[list["AssessmentAttempt"]] = relationship("AssessmentAttempt", back_populates="enrollment", cascade="all, delete-orphan")


class ResourceProgress(Base, UUIDPkMixin, TimestampMixin):
    """Tracking trainee progress per individual resource item."""
    __tablename__ = "resource_progresses"

    enrollment_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False)
    resource_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("course_resources.id", ondelete="CASCADE"), nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    time_spent_seconds: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_accessed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)

    # Relationships
    enrollment: Mapped["Enrollment"] = relationship("Enrollment", back_populates="resource_progresses")
    resource: Mapped["CourseResource"] = relationship("CourseResource", back_populates="progress_records")


class Assessment(Base, UUIDPkMixin, TimestampMixin):
    """MCQ assessment associated with a course."""
    __tablename__ = "assessments"

    course_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    time_limit_minutes: Mapped[int] = mapped_column(Integer, default=15, nullable=False)
    passing_percentage: Mapped[float] = mapped_column(Float, default=70.0, nullable=False)
    total_marks: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    course: Mapped["Course"] = relationship("Course", back_populates="assessments")
    questions: Mapped[list["AssessmentQuestion"]] = relationship("AssessmentQuestion", back_populates="assessment", cascade="all, delete-orphan", order_by="AssessmentQuestion.sequence_order")
    attempts: Mapped[list["AssessmentAttempt"]] = relationship("AssessmentAttempt", back_populates="assessment", cascade="all, delete-orphan")


class AssessmentQuestion(Base, UUIDPkMixin, TimestampMixin):
    """MCQ question item."""
    __tablename__ = "assessment_questions"

    assessment_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    question_type: Mapped[str] = mapped_column(String(50), default="single_choice", nullable=False)  # single_choice, multiple_choice
    marks: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    sequence_order: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    options: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)  # [{id: "A", text: "..."}]
    correct_answers: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)  # ["A"]
    explanation: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    assessment: Mapped["Assessment"] = relationship("Assessment", back_populates="questions")


class AssessmentAttempt(Base, UUIDPkMixin, TimestampMixin):
    """Trainee attempt at an assessment."""
    __tablename__ = "assessment_attempts"

    assessment_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    enrollment_id: Mapped[uuid.UUID | None] = mapped_column(GUID(), ForeignKey("enrollments.id", ondelete="SET NULL"), nullable=True)
    score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    percentage: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    passed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    answers: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)  # {question_id: [selected_option_ids]}

    # Relationships
    assessment: Mapped["Assessment"] = relationship("Assessment", back_populates="attempts")
    user: Mapped["User"] = relationship("User", back_populates="assessment_attempts")
    enrollment: Mapped["Enrollment | None"] = relationship("Enrollment", back_populates="assessment_attempts")
    certificate: Mapped["Certificate | None"] = relationship("Certificate", back_populates="attempt", uselist=False)


class Certificate(Base, UUIDPkMixin, TimestampMixin):
    """Course completion certificate with public verification code."""
    __tablename__ = "certificates"

    certificate_code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    assessment_attempt_id: Mapped[uuid.UUID | None] = mapped_column(GUID(), ForeignKey("assessment_attempts.id", ondelete="SET NULL"), nullable=True)
    issue_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    pdf_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="issued", nullable=False)  # issued, revoked
    verification_qr_data: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    metadata_snapshot: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="certificates")
    course: Mapped["Course"] = relationship("Course", back_populates="certificates")
    attempt: Mapped["AssessmentAttempt | None"] = relationship("AssessmentAttempt", back_populates="certificate")


class CompetencyRequirement(Base, UUIDPkMixin, TimestampMixin):
    """Institutional competency requirement profile for trainer matching."""
    __tablename__ = "competency_requirements"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    target_role: Mapped[str] = mapped_column(String(150), nullable=False)
    department: Mapped[str | None] = mapped_column(String(255), nullable=True)
    required_skills: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)  # [{name, level: 1-5, weight: 1-5}]
    required_subjects: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    min_experience_years: Mapped[float] = mapped_column(Float, default=3.0, nullable=False)
    min_qualification: Mapped[str] = mapped_column(String(150), default="Bachelor", nullable=False)
    created_by_id: Mapped[uuid.UUID | None] = mapped_column(GUID(), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)


class Notification(Base, UUIDPkMixin, TimestampMixin):
    """In-app user notification."""
    __tablename__ = "notifications"

    user_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    notification_type: Mapped[str] = mapped_column(String(50), default="info", nullable=False)  # info, success, warning, action
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, index=True, nullable=False)
    link_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="notifications")


class Announcement(Base, UUIDPkMixin, TimestampMixin):
    """System-wide or audience-targeted broadcast announcement."""
    __tablename__ = "announcements"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    target_role: Mapped[str] = mapped_column(String(50), default="all", nullable=False)  # all, trainee, trainer, admin
    created_by_id: Mapped[uuid.UUID | None] = mapped_column(GUID(), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class AuditLog(Base, UUIDPkMixin, TimestampMixin):
    """Platform governance and compliance audit log."""
    __tablename__ = "audit_logs"

    user_id: Mapped[uuid.UUID | None] = mapped_column(GUID(), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action: Mapped[str] = mapped_column(String(150), index=True, nullable=False)
    resource_type: Mapped[str] = mapped_column(String(100), nullable=False)
    resource_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    details: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    ip_address: Mapped[str | None] = mapped_column(String(50), nullable=True)
