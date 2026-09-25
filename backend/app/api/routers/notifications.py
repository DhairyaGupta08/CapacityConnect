"""Notifications and Announcements endpoints."""
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, get_optional_user, require_role
from app.db.models import User
from app.schemas.all_schemas import AnnouncementCreate, AnnouncementOut, NotificationOut
from app.services.notification_service import NotificationService

router = APIRouter(tags=["Notifications & Announcements"])


@router.get("/notifications", response_model=list[NotificationOut])
def get_my_notifications(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> list[NotificationOut]:
    """Fetch recent notifications for current user."""
    return NotificationService.get_user_notifications(db, current_user.id)


@router.patch("/notifications/{notification_id}/read", response_model=dict[str, bool])
def mark_notification_read(
    notification_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> dict[str, bool]:
    """Mark a specific notification as read."""
    success = NotificationService.mark_as_read(db, notification_id, current_user.id)
    return {"success": success}


@router.get("/announcements", response_model=list[AnnouncementOut])
def get_announcements(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User | None, Depends(get_optional_user)] = None,
) -> list[AnnouncementOut]:
    """Get announcements for public or authenticated user role."""
    role = current_user.role if current_user else "all"
    return NotificationService.get_active_announcements(db, role)


@router.post("/announcements", response_model=AnnouncementOut, status_code=status.HTTP_201_CREATED)
def create_announcement(
    req: AnnouncementCreate,
    db: Annotated[Session, Depends(get_db)],
    admin_user: Annotated[User, Depends(require_role("admin"))],
) -> AnnouncementOut:
    """Publish a targeted broadcast announcement (Admin only)."""
    return NotificationService.create_announcement(db, req, admin_user)
