"""Security utilities: Argon2id password hashing and JWT token handling."""
import uuid
from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from app.core.config import settings
from app.core.errors import AuthenticationError

ph = PasswordHasher(
    time_cost=3,
    memory_cost=65536,
    parallelism=4,
    hash_len=32,
    salt_len=16,
)


def hash_password(password: str) -> str:
    """Hash plaintext password using Argon2id."""
    return ph.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plaintext password against stored Argon2id hash."""
    try:
        return ph.verify(hashed_password, plain_password)
    except (VerifyMismatchError, Exception):
        return False


def create_access_token(
    user_id: uuid.UUID | str,
    email: str,
    role: str,
    expires_delta: timedelta | None = None,
) -> str:
    """Create signed short-lived JWT access token."""
    expire = datetime.now(UTC) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_TTL_MINUTES)
    )
    payload: dict[str, Any] = {
        "sub": str(user_id),
        "email": email,
        "role": role,
        "type": "access",
        "exp": expire,
        "iat": datetime.now(UTC),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(
    user_id: uuid.UUID | str,
    expires_delta: timedelta | None = None,
) -> str:
    """Create signed long-lived JWT refresh token."""
    expire = datetime.now(UTC) + (
        expires_delta or timedelta(days=settings.REFRESH_TOKEN_TTL_DAYS)
    )
    payload: dict[str, Any] = {
        "sub": str(user_id),
        "type": "refresh",
        "exp": expire,
        "iat": datetime.now(UTC),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str, expected_type: str = "access") -> dict[str, Any]:
    """Decode and validate JWT token claims."""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
        if payload.get("type") != expected_type:
            raise AuthenticationError(
                message=f"Invalid token type. Expected '{expected_type}' token.",
                code="INVALID_TOKEN_TYPE",
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthenticationError(
            message="Token has expired. Please authenticate again.",
            code="TOKEN_EXPIRED",
        ) from None
    except jwt.PyJWTError as e:
        raise AuthenticationError(
            message=f"Could not validate token: {str(e)}",
            code="INVALID_TOKEN",
        ) from e
