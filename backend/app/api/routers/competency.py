"""Competency requirement authoring and deterministic explainable matching endpoints."""
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_role
from app.db.models import User
from app.schemas.all_schemas import (
    CompetencyMatchResponse,
    CompetencyRequirementCreate,
    CompetencyRequirementOut,
)
from app.services.competency_service import CompetencyService

router = APIRouter(prefix="/competency", tags=["Competency Matching"])


@router.get("/requirements", response_model=list[CompetencyRequirementOut])
def list_competency_requirements(
    db: Annotated[Session, Depends(get_db)],
    admin_user: Annotated[User, Depends(require_role("admin"))],
) -> list[CompetencyRequirementOut]:
    """List all institutional capacity requirements (Admin only)."""
    return CompetencyService.list_requirements(db)


@router.post("/requirements", response_model=CompetencyRequirementOut, status_code=status.HTTP_201_CREATED)
def create_competency_requirement(
    req: CompetencyRequirementCreate,
    db: Annotated[Session, Depends(get_db)],
    admin_user: Annotated[User, Depends(require_role("admin"))],
) -> CompetencyRequirementOut:
    """Create a new competency requirement specification (Admin only)."""
    item = CompetencyService.create_requirement(db, req, admin_user)
    return CompetencyRequirementOut.model_validate(item)


@router.get("/requirements/{requirement_id}/match", response_model=CompetencyMatchResponse)
def evaluate_matching(
    requirement_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
    admin_user: Annotated[User, Depends(require_role("admin"))],
) -> CompetencyMatchResponse:
    """Run deterministic weighted matching formula and return ranked trainers with breakdown."""
    return CompetencyService.evaluate_matching(db, requirement_id)
