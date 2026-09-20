"""Authentication and User management service."""
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.errors import AuthenticationError, ConflictError, NotFoundError
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.db.models import TraineeProfile, TrainerProfile, User
from app.schemas.all_schemas import (
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    UserOut,
)


class AuthService:
    @staticmethod
    def register(db: Session, req: RegisterRequest) -> AuthResponse:
        """Register a new Trainee or Trainer."""
        existing = db.scalar(select(User).where(User.email == req.email.lower()))
        if existing:
            raise ConflictError(f"User with email '{req.email}' already exists.", code="USER_ALREADY_EXISTS")

        # Trainers start as pending approval; trainees are active immediately
        initial_status = "pending" if req.role == "trainer" else "active"

        user = User(
            email=req.email.lower(),
            password_hash=hash_password(req.password),
            full_name=req.full_name,
            role=req.role,
            status=initial_status,
            phone=req.phone,
            organization=req.organization,
        )
        db.add(user)
        db.flush()

        # Create role-specific profile
        if req.role == "trainee":
            trainee_prof = TraineeProfile(
                user_id=user.id,
                department=req.department,
                designation=req.designation,
                experience_years=req.experience_years,
            )
            db.add(trainee_prof)
        elif req.role == "trainer":
            trainer_prof = TrainerProfile(
                user_id=user.id,
                expertise_subjects=req.expertise_subjects or [],
                experience_years=req.experience_years,
            )
            db.add(trainer_prof)

        db.commit()
        db.refresh(user)

        access_token = create_access_token(user.id, user.email, user.role)
        refresh_token = create_refresh_token(user.id)

        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_TTL_MINUTES * 60,
            user=UserOut.model_validate(user),
        )

    @staticmethod
    def login(db: Session, req: LoginRequest) -> AuthResponse:
        """Authenticate user credentials and return JWT tokens."""
        user = db.scalar(select(User).where(User.email == req.email.lower()))
        if not user or not verify_password(req.password, user.password_hash):
            raise AuthenticationError("Invalid email or password.", code="INVALID_CREDENTIALS")

        access_token = create_access_token(user.id, user.email, user.role)
        refresh_token = create_refresh_token(user.id)

        return AuthResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_TTL_MINUTES * 60,
            user=UserOut.model_validate(user),
        )

    @staticmethod
    def refresh_access_token(db: Session, refresh_token: str) -> AuthResponse:
        """Generate a new access token using a valid refresh token."""
        payload = decode_token(refresh_token, expected_type="refresh")
        user_id_str = payload.get("sub")
        if not user_id_str:
            raise AuthenticationError("Invalid refresh token payload.", code="INVALID_TOKEN")

        user = db.scalar(select(User).where(User.id == uuid.UUID(user_id_str)))
        if not user:
            raise NotFoundError("User not found.", code="USER_NOT_FOUND")

        new_access = create_access_token(user.id, user.email, user.role)
        new_refresh = create_refresh_token(user.id)

        return AuthResponse(
            access_token=new_access,
            refresh_token=new_refresh,
            expires_in=settings.ACCESS_TOKEN_TTL_MINUTES * 60,
            user=UserOut.model_validate(user),
        )
