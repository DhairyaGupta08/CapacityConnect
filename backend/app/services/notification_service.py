"""Notification and Announcement service."""
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models import Announcement, Notification, User
from app.schemas.all_schemas import AnnouncementCreate, AnnouncementOut, NotificationOut


class NotificationService:
    @staticmethod
    def get_user_notifications(db: Session, user_id: uuid.UUID) -> list[NotificationOut]:
        """Fetch notifications for a user."""
        items = db.scalars(
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
            .limit(20)
        ).all()
        return [NotificationOut.model_validate(n) for n in items]

    @staticmethod
    def mark_as_read(db: Session, notification_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        """Mark a notification as read."""
        notif = db.scalar(
            select(Notification).where(
                Notification.id == notification_id,
                Notification.user_id == user_id,
            )
        )
        if notif:
            notif.is_read = True
            db.commit()
            return True
        return False

    @staticmethod
    def create_announcement(db: Session, req: AnnouncementCreate, creator: User) -> AnnouncementOut:
        """Create a targeted or broadcast announcement."""
        ann = Announcement(
            title=req.title,
            content=req.content,
            target_role=req.target_role,
            created_by_id=creator.id,
            is_active=True,
        )
        db.add(ann)
        db.commit()
        db.refresh(ann)
        return AnnouncementOut.model_validate(ann)

    @staticmethod
    def get_active_announcements(db: Session, role: str = "all") -> list[AnnouncementOut]:
        """Fetch active announcements relevant to the user's role."""
        query = select(Announcement).where(Announcement.is_active == True)  # noqa: E712
        if role != "admin":
            query = query.where(Announcement.target_role.in_(["all", role]))

        items = db.scalars(query.order_by(Announcement.created_at.desc())).all()
        return [AnnouncementOut.model_validate(a) for a in items]
