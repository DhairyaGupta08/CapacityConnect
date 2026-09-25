"""Assessment authoring, timed exam sessions, grading, and score breakdowns."""
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_role
from app.core.errors import NotFoundError
from app.db.models import User
from app.schemas.all_schemas import (
    AssessmentCreate,
    AssessmentOut,
    AssessmentResultOut,
    AttemptSubmitRequest,
)
from app.services.assessment_service import AssessmentService

router = APIRouter(prefix="/assessments", tags=["Assessments"])


@router.get("/course/{course_id}", response_model=AssessmentOut)
def get_assessment_by_course(
    course_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> AssessmentOut:
    """Get assessment questions for taking the test (answers hidden)."""
    assessment = AssessmentService.get_assessment_for_course(db, course_id)
    if not assessment:
        raise NotFoundError("No assessment found for this course.", code="ASSESSMENT_NOT_FOUND")
    return assessment


@router.post("", response_model=AssessmentOut, status_code=status.HTTP_201_CREATED)
def create_assessment(
    req: AssessmentCreate,
    db: Annotated[Session, Depends(get_db)],
    trainer: Annotated[User, Depends(require_role("trainer", "admin"))],
) -> AssessmentOut:
    """Create a new MCQ assessment with timed questions (Trainer/Admin)."""
    assessment = AssessmentService.create_assessment(db, req)
    out = AssessmentService.get_assessment_for_course(db, assessment.course_id)
    if not out:
        raise NotFoundError("Failed to fetch created assessment.")
    return out


@router.post("/{assessment_id}/submit", response_model=AssessmentResultOut)
def submit_assessment_attempt(
    assessment_id: uuid.UUID,
    req: AttemptSubmitRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> AssessmentResultOut:
    """Submit trainee answers for instant server-side grading and certification trigger."""
    return AssessmentService.submit_attempt(
        db=db,
        assessment_id=assessment_id,
        user=current_user,
        req=req,
    )
