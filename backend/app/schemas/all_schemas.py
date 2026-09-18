"""Pydantic v2 validation and serialization schemas for Capacity Connect."""
import uuid
from datetime import datetime
from typing import Any, Generic, Literal, TypeVar

from pydantic import BaseModel, ConfigDict, EmailStr, Field

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int


# --- Authentication & User Schemas ---

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str = Field(min_length=2, max_length=255)
    role: Literal["trainee", "trainer"] = "trainee"
    phone: str | None = None
    organization: str | None = None
    department: str | None = None
    designation: str | None = None
    expertise_subjects: list[str] | None = None
    experience_years: float = 0.0


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str | None = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    full_name: str
    role: str
    status: str
    phone: str | None = None
    organization: str | None = None
    avatar_url: str | None = None
    bio: str | None = None
    created_at: datetime
    updated_at: datetime | None = None


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserOut


class UserUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    organization: str | None = None
    avatar_url: str | None = None
    bio: str | None = None
    status: str | None = None
    role: str | None = None


# --- Trainee Profile ---

class TraineeProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    department: str | None = None
    designation: str | None = None
    employee_id: str | None = None
    qualifications: list[dict[str, Any]] = []
    experience_years: float = 0.0
    skills: list[dict[str, Any]] = []
    interests: list[str] = []
    resume_url: str | None = None


class TraineeProfileUpdate(BaseModel):
    department: str | None = None
    designation: str | None = None
    employee_id: str | None = None
    qualifications: list[dict[str, Any]] | None = None
    experience_years: float | None = None
    skills: list[dict[str, Any]] | None = None
    interests: list[str] | None = None
    resume_url: str | None = None


# --- Trainer Profile ---

class TrainerProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    expertise_subjects: list[str] = []
    skills: list[dict[str, Any]] = []
    qualifications: list[dict[str, Any]] = []
    experience_years: float = 0.0
    hourly_rate: float | None = None
    availability_status: bool = True
    approval_notes: str | None = None


class TrainerProfileUpdate(BaseModel):
    expertise_subjects: list[str] | None = None
    skills: list[dict[str, Any]] | None = None
    qualifications: list[dict[str, Any]] | None = None
    experience_years: float | None = None
    hourly_rate: float | None = None
    availability_status: bool | None = None
    approval_notes: str | None = None


# --- Taxonomy ---

class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    slug: str
    description: str | None = None
    icon: str | None = None
    is_active: bool


class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: str | None = None
    icon: str | None = "Folder"


class SkillOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    category_id: uuid.UUID | None = None
    description: str | None = None


class SkillCreate(BaseModel):
    name: str
    category_id: uuid.UUID | None = None
    description: str | None = None


# --- Course, Modules, Resources ---

class CourseResourceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    module_id: uuid.UUID
    title: str
    resource_type: str
    file_url: str | None = None
    content_text: str | None = None
    duration_minutes: int
    sequence_order: int
    is_downloadable: bool
    is_completed: bool = False


class CourseResourceCreate(BaseModel):
    title: str
    resource_type: Literal["video", "pdf", "document", "text"] = "video"
    file_url: str | None = None
    content_text: str | None = None
    duration_minutes: int = 10
    sequence_order: int = 1
    is_downloadable: bool = True


class CourseModuleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    course_id: uuid.UUID
    title: str
    description: str | None = None
    sequence_order: int
    duration_minutes: int
    resources: list[CourseResourceOut] = []


class CourseModuleCreate(BaseModel):
    title: str
    description: str | None = None
    sequence_order: int = 1
    duration_minutes: int = 30


class CourseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    slug: str
    description: str
    short_description: str | None = None
    category_id: uuid.UUID | None = None
    trainer_id: uuid.UUID
    trainer_name: str | None = None
    category_name: str | None = None
    level: str
    status: str
    thumbnail_url: str | None = None
    estimated_hours: float
    total_enrollments: int = 0
    modules: list[CourseModuleOut] = []
    is_enrolled: bool = False
    enrollment_progress: float = 0.0
    created_at: datetime
    updated_at: datetime | None = None


class CourseCreate(BaseModel):
    title: str
    description: str
    short_description: str | None = None
    category_id: uuid.UUID | None = None
    level: Literal["beginner", "intermediate", "advanced"] = "intermediate"
    status: Literal["draft", "published", "archived"] = "published"
    thumbnail_url: str | None = None
    estimated_hours: float = 2.0


class CourseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    short_description: str | None = None
    category_id: uuid.UUID | None = None
    level: str | None = None
    status: str | None = None
    thumbnail_url: str | None = None
    estimated_hours: float | None = None


# --- Enrollments ---

class EnrollmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    course_id: uuid.UUID
    status: str
    progress_percent: float
    started_at: datetime
    completed_at: datetime | None = None
    course: CourseOut | None = None


class ResourceProgressUpdate(BaseModel):
    completed: bool = True
    time_spent_seconds: int = 0


# --- Assessments ---

class OptionSchema(BaseModel):
    id: str
    text: str


class AssessmentQuestionCreate(BaseModel):
    question_text: str
    question_type: Literal["single_choice", "multiple_choice"] = "single_choice"
    marks: int = 10
    sequence_order: int = 1
    options: list[OptionSchema]
    correct_answers: list[str]  # e.g. ["A"]
    explanation: str | None = None


class AssessmentQuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    assessment_id: uuid.UUID
    question_text: str
    question_type: str
    marks: int
    sequence_order: int
    options: list[OptionSchema]
    # correct_answers and explanation hidden during attempt for anti-leakage


class AssessmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    course_id: uuid.UUID
    title: str
    description: str | None = None
    time_limit_minutes: int
    passing_percentage: float
    total_marks: int
    is_active: bool
    total_questions: int = 0
    questions: list[AssessmentQuestionOut] = []


class AssessmentCreate(BaseModel):
    course_id: uuid.UUID
    title: str
    description: str | None = None
    time_limit_minutes: int = 15
    passing_percentage: float = 70.0
    total_marks: int = 100
    questions: list[AssessmentQuestionCreate] = []


class AttemptSubmitRequest(BaseModel):
    answers: dict[str, list[str]]  # {question_id_str: ["A"]}


class QuestionResultDetail(BaseModel):
    question_id: str
    question_text: str
    options: list[OptionSchema]
    user_answers: list[str]
    correct_answers: list[str]
    is_correct: bool
    marks_awarded: int
    max_marks: int
    explanation: str | None = None


class AssessmentResultOut(BaseModel):
    attempt_id: uuid.UUID
    assessment_id: uuid.UUID
    course_id: uuid.UUID
    score: float
    percentage: float
    passed: bool
    started_at: datetime
    submitted_at: datetime
    question_breakdown: list[QuestionResultDetail] = []
    certificate_code: str | None = None


# --- Certificates ---

class CertificateOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    certificate_code: str
    user_id: uuid.UUID
    recipient_name: str | None = None
    course_id: uuid.UUID
    course_title: str | None = None
    issue_date: datetime
    pdf_url: str | None = None
    status: str
    verification_qr_data: str | None = None
    metadata_snapshot: dict[str, Any] = {}


class PublicVerificationOut(BaseModel):
    is_valid: bool
    certificate_code: str
    recipient_name: str
    course_title: str
    issue_date: datetime
    status: str
    organization: str
    score_percentage: float | None = None
    pdf_url: str | None = None


# --- Competency Matching ---

class SkillRequirement(BaseModel):
    name: str
    min_level: int = Field(default=3, ge=1, le=5)  # 1-5
    weight: int = Field(default=3, ge=1, le=5)     # 1-5 importance


class CompetencyRequirementCreate(BaseModel):
    title: str
    description: str | None = None
    target_role: str
    department: str | None = None
    required_skills: list[SkillRequirement]
    required_subjects: list[str]
    min_experience_years: float = 3.0
    min_qualification: str = "Bachelor"


class CompetencyRequirementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    description: str | None = None
    target_role: str
    department: str | None = None
    required_skills: list[dict[str, Any]]
    required_subjects: list[str]
    min_experience_years: float
    min_qualification: str
    created_at: datetime


class MatchComponentBreakdown(BaseModel):
    s_skill: float
    s_subject: float
    s_proficiency: float
    s_experience: float
    s_qualification: float


class TrainerMatchResult(BaseModel):
    trainer_id: uuid.UUID
    trainer_name: str
    email: str
    organization: str | None = None
    experience_years: float
    total_score: float  # 0 to 100
    rank: int
    breakdown: MatchComponentBreakdown
    matched_skills: list[str]
    missing_skills: list[str]
    explanation: str


class CompetencyMatchResponse(BaseModel):
    requirement_id: uuid.UUID
    requirement_title: str
    total_candidates_evaluated: int
    ranked_trainers: list[TrainerMatchResult]


# --- Notifications & Announcements ---

class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    message: str
    notification_type: str
    is_read: bool
    link_url: str | None = None
    created_at: datetime


class AnnouncementCreate(BaseModel):
    title: str
    content: str
    target_role: Literal["all", "trainee", "trainer", "admin"] = "all"


class AnnouncementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    content: str
    target_role: str
    created_by_id: uuid.UUID | None = None
    is_active: bool
    created_at: datetime


# --- Analytics Schemas ---

class AdminAnalyticsOut(BaseModel):
    total_users: int
    total_trainees: int
    total_trainers: int
    pending_approvals: int
    total_courses: int
    total_enrollments: int
    total_completions: int
    total_certificates_issued: int
    average_assessment_score: float
    monthly_enrollments: list[dict[str, Any]]
    category_distribution: list[dict[str, Any]]


class TrainerAnalyticsOut(BaseModel):
    total_courses: int
    total_students: int
    total_completions: int
    average_pass_rate: float
    recent_attempts: list[dict[str, Any]]


class TraineeAnalyticsOut(BaseModel):
    enrolled_courses_count: int
    completed_courses_count: int
    in_progress_count: int
    certificates_earned_count: int
    average_score: float
    total_learning_hours: float
