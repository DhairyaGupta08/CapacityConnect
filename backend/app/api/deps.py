"""FastAPI Dependency Injection helpers for Authentication, RBAC, DB session, and pagination."""
import uuid
from typing import Annotated

from fastapi import Cookie, Depends, Header, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.errors import AuthenticationError, AuthorizationError, NotFoundError
from app.core.security import decode_token
from app.db.models import User
from app.db.session import get_db


class PaginationParams:
    """Standardized server-side pagination parameters."""
    def __init__(
        self,
        page: int = Query(default=1, ge=1, description="Page number (1-indexed)"),
        page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
        q: str | None = Query(default=None, description="Search query string"),
        sort: str | None = Query(default=None, description="Sort order e.g. created_at:desc"),
    ):
        self.page = page
        self.page_size = page_size
        self.q = q
        self.sort = sort
        self.offset = (page - 1) * page_size
        self.limit = page_size


def get_token_from_header_or_cookie(
    authorization: Annotated[str | None, Header()] = None,
    cc_access_token: Annotated[str | None, Cookie()] = None,
) -> str:
    """Extract JWT token from Bearer Authorization header or cookie."""
    if authorization and authorization.startswith("Bearer "):
        return authorization[7:].strip()
    if cc_access_token:
        return cc_access_token.strip()
    raise AuthenticationError(
        message="Authentication credentials were not provided.",
        code="NOT_AUTHENTICATED",
    )


def get_optional_token(
    authorization: Annotated[str | None, Header()] = None,
    cc_access_token: Annotated[str | None, Cookie()] = None,
) -> str | None:
    """Extract optional JWT token if present."""
    if authorization and authorization.startswith("Bearer "):
        return authorization[7:].strip()
    if cc_access_token:
        return cc_access_token.strip()
    return None


def get_current_user(
    token: Annotated[str, Depends(get_token_from_header_or_cookie)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    """Validate access token and return the authenticated User record."""
    payload = decode_token(token, expected_type="access")
    user_id_str = payload.get("sub")
    if not user_id_str:
        raise AuthenticationError("Invalid token subject.", code="INVALID_TOKEN")

    try:
        user_uuid = uuid.UUID(user_id_str)
    except ValueError:
        raise AuthenticationError("Invalid user ID format.", code="INVALID_TOKEN") from None

    user = db.scalar(select(User).where(User.id == user_uuid))
    if not user:
        raise NotFoundError(message="User account not found.", code="USER_NOT_FOUND")

    if user.status == "suspended":
        raise AuthorizationError("Account is suspended. Please contact the administrator.", code="ACCOUNT_SUSPENDED")
    if user.status == "rejected":
        raise AuthorizationError("Account registration was rejected.", code="ACCOUNT_REJECTED")

    return user


def get_optional_user(
    token: Annotated[str | None, Depends(get_optional_token)],
    db: Annotated[Session, Depends(get_db)],
) -> User | None:
    """Optional user resolver for public or semi-private endpoints."""
    if not token:
        return None
    try:
        payload = decode_token(token, expected_type="access")
        user_id_str = payload.get("sub")
        if not user_id_str:
            return None
        user_uuid = uuid.UUID(user_id_str)
        return db.scalar(select(User).where(User.id == user_uuid))
    except Exception:
        return None


def require_role(*roles: str):
    """Dependency factory enforcing RBAC allowed roles."""
    def role_checker(
        current_user: Annotated[User, Depends(get_current_user)],
    ) -> User:
        if current_user.role not in roles:
            raise AuthorizationError(
                message=f"Forbidden. Required role: {', '.join(roles)}.",
                code="FORBIDDEN_ROLE",
            )
        return current_user
    return role_checker
