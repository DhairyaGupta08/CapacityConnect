"""Authentication endpoints."""
from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.db.models import User
from app.schemas.all_schemas import (
    AuthResponse,
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    UserOut,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


def set_auth_cookies(response: Response, auth_res: AuthResponse) -> None:
    """Set secure httpOnly cookies for access and refresh tokens."""
    response.set_cookie(
        key="cc_access_token",
        value=auth_res.access_token,
        max_age=settings.ACCESS_TOKEN_TTL_MINUTES * 60,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )
    response.set_cookie(
        key="cc_refresh_token",
        value=auth_res.refresh_token,
        max_age=settings.REFRESH_TOKEN_TTL_DAYS * 86400,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(
    req: RegisterRequest,
    response: Response,
    db: Annotated[Session, Depends(get_db)],
) -> AuthResponse:
    """Register a new user (trainee or trainer) and return session tokens."""
    auth_res = AuthService.register(db, req)
    set_auth_cookies(response, auth_res)
    return auth_res


@router.post("/login", response_model=AuthResponse)
def login(
    req: LoginRequest,
    response: Response,
    db: Annotated[Session, Depends(get_db)],
) -> AuthResponse:
    """Authenticate with email and password."""
    auth_res = AuthService.login(db, req)
    set_auth_cookies(response, auth_res)
    return auth_res


@router.post("/refresh", response_model=AuthResponse)
def refresh_token(
    req: RefreshRequest,
    response: Response,
    db: Annotated[Session, Depends(get_db)],
    cc_refresh_token: Annotated[str | None, Cookie()] = None,
) -> AuthResponse:
    """Refresh access token using cookie or request body token."""
    token = req.refresh_token or cc_refresh_token
    if not token:
        from app.core.errors import AuthenticationError
        raise AuthenticationError("Refresh token missing.", code="REFRESH_TOKEN_MISSING")

    auth_res = AuthService.refresh_access_token(db, token)
    set_auth_cookies(response, auth_res)
    return auth_res


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(response: Response) -> dict[str, str]:
    """Clear session authentication cookies."""
    response.delete_cookie("cc_access_token", path="/")
    response.delete_cookie("cc_refresh_token", path="/")
    return {"message": "Successfully logged out."}


@router.get("/me", response_model=UserOut)
def get_current_user_profile(
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserOut:
    """Get profile of currently logged-in user."""
    return UserOut.model_validate(current_user)
