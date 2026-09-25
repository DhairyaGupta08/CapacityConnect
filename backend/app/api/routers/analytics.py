"""Analytics and KPI aggregation endpoints for Admin, Trainer, and Trainee dashboards."""
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_role
from app.db.models import User
from app.schemas.all_schemas import (
    AdminAnalyticsOut,
    TraineeAnalyticsOut,
    TrainerAnalyticsOut,
)
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/admin", response_model=AdminAnalyticsOut)
def get_admin_analytics(
    db: Annotated[Session, Depends(get_db)],
    admin_user: Annotated[User, Depends(require_role("admin"))],
) -> AdminAnalyticsOut:
    """Fetch system-wide administrative KPIs, course counts, and user distributions."""
    return AnalyticsService.get_admin_analytics(db)


@router.get("/trainer", response_model=TrainerAnalyticsOut)
def get_trainer_analytics(
    db: Annotated[Session, Depends(get_db)],
    trainer: Annotated[User, Depends(require_role("trainer", "admin"))],
) -> TrainerAnalyticsOut:
    """Fetch metrics for courses authored by the authenticated trainer."""
    return AnalyticsService.get_trainer_analytics(db, trainer.id)


@router.get("/trainee", response_model=TraineeAnalyticsOut)
def get_trainee_analytics(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> TraineeAnalyticsOut:
    """Fetch learning hours, courses in progress, and certificates earned for current trainee."""
    return AnalyticsService.get_trainee_analytics(db, current_user.id)
