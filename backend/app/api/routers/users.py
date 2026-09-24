"""User management, profiles, and admin governance endpoints."""
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import PaginationParams, get_current_user, get_db, require_role
from app.core.errors import NotFoundError
from app.db.models import TraineeProfile, TrainerProfile, User
from app.schemas.all_schemas import (
    PaginatedResponse,
    TraineeProfileOut,
    TraineeProfileUpdate,
    TrainerProfileOut,
    TrainerProfileUpdate,
    UserOut,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=PaginatedResponse[UserOut])
def list_users(
    db: Annotated[Session, Depends(get_db)],
    admin_user: Annotated[User, Depends(require_role("admin"))],
    pagination: Annotated[PaginationParams, Depends()],
    role: str | None = Query(None),
    status_filter: str | None = Query(None, alias="status"),
) -> PaginatedResponse[UserOut]:
    """Admin-only list of all users with status and role filtering."""
    query = select(User)
    if role:
        query = query.where(User.role == role)
    if status_filter:
        query = query.where(User.status == status_filter)
    if pagination.q:
        pattern = f"%{pagination.q}%"
        query = query.where(User.full_name.ilike(pattern) | User.email.ilike(pattern))

    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    users = db.scalars(
        query.order_by(User.created_at.desc())
        .offset(pagination.offset)
        .limit(pagination.limit)
    ).all()

    total_pages = max(1, (total + pagination.page_size - 1) // pagination.page_size)
    return PaginatedResponse(
        items=[UserOut.model_validate(u) for u in users],
        total=total,
        page=pagination.page,
        page_size=pagination.page_size,
        total_pages=total_pages,
    )


@router.patch("/{user_id}/status", response_model=UserOut)
def update_user_status(
    user_id: uuid.UUID,
    new_status: str,
    db: Annotated[Session, Depends(get_db)],
    admin_user: Annotated[User, Depends(require_role("admin"))],
) -> UserOut:
    """Admin action to approve, reject, activate, or suspend a user."""
    user = db.scalar(select(User).where(User.id == user_id))
    if not user:
        raise NotFoundError("User not found.", code="USER_NOT_FOUND")

    user.status = new_status
    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)


@router.get("/profile/trainee", response_model=TraineeProfileOut)
def get_trainee_profile(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> TraineeProfileOut:
    """Fetch current user's trainee profile."""
    prof = db.scalar(select(TraineeProfile).where(TraineeProfile.user_id == current_user.id))
    if not prof:
        prof = TraineeProfile(user_id=current_user.id)
        db.add(prof)
        db.commit()
        db.refresh(prof)
    return TraineeProfileOut.model_validate(prof)


@router.put("/profile/trainee", response_model=TraineeProfileOut)
def update_trainee_profile(
    req: TraineeProfileUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> TraineeProfileOut:
    """Update current user's trainee profile."""
    prof = db.scalar(select(TraineeProfile).where(TraineeProfile.user_id == current_user.id))
    if not prof:
        prof = TraineeProfile(user_id=current_user.id)
        db.add(prof)

    for field, val in req.model_dump(exclude_unset=True).items():
        setattr(prof, field, val)

    db.commit()
    db.refresh(prof)
    return TraineeProfileOut.model_validate(prof)


@router.get("/profile/trainer", response_model=TrainerProfileOut)
def get_trainer_profile(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> TrainerProfileOut:
    """Fetch current user's trainer profile."""
    prof = db.scalar(select(TrainerProfile).where(TrainerProfile.user_id == current_user.id))
    if not prof:
        prof = TrainerProfile(user_id=current_user.id)
        db.add(prof)
        db.commit()
        db.refresh(prof)
    return TrainerProfileOut.model_validate(prof)


@router.put("/profile/trainer", response_model=TrainerProfileOut)
def update_trainer_profile(
    req: TrainerProfileUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> TrainerProfileOut:
    """Update current user's trainer profile."""
    prof = db.scalar(select(TrainerProfile).where(TrainerProfile.user_id == current_user.id))
    if not prof:
        prof = TrainerProfile(user_id=current_user.id)
        db.add(prof)

    for field, val in req.model_dump(exclude_unset=True).items():
        setattr(prof, field, val)

    db.commit()
    db.refresh(prof)
    return TrainerProfileOut.model_validate(prof)
