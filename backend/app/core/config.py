"""Application settings and configuration."""
from typing import Literal

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- App ---
    ENVIRONMENT: Literal["development", "test", "staging", "production"] = "development"
    APP_NAME: str = "Capacity Connect"
    API_PREFIX: str = "/api"
    LOG_LEVEL: str = "INFO"
    ENABLE_DOCS: bool = True

    # --- Database ---
    DATABASE_URL: str = "postgresql+psycopg://capacity:capacity_dev_password@localhost:5432/capacity_connect"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_url(cls, v: str | None) -> str:
        if not v:
            return "postgresql+psycopg://capacity:capacity_dev_password@localhost:5432/capacity_connect"
        # Fix Render/Heroku postgres:// URI schema to postgresql+psycopg://
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql+psycopg://", 1)
        if v.startswith("postgresql://") and not v.startswith("postgresql+psycopg://"):
            return v.replace("postgresql://", "postgresql+psycopg://", 1)
        return v

    # --- Security ---
    JWT_SECRET: str = "super-secret-capacity-connect-jwt-token-key-32-chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_TTL_MINUTES: int = 15
    REFRESH_TOKEN_TTL_DAYS: int = 7
    COOKIE_SECURE: bool = False
    COOKIE_SAMESITE: Literal["lax", "strict", "none"] = "lax"
    CORS_ORIGINS: list[str] | str = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["http://localhost:3000"]

    # --- Storage ---
    STORAGE_BACKEND: Literal["local", "s3"] = "local"
    LOCAL_STORAGE_DIR: str = "./.uploads"
    S3_ENDPOINT_URL: str | None = None
    S3_REGION: str = "auto"
    S3_BUCKET: str = "capacity-connect"
    S3_ACCESS_KEY_ID: str | None = None
    S3_SECRET_ACCESS_KEY: str | None = None
    SIGNED_URL_TTL_SECONDS: int = 600
    MAX_UPLOAD_MB: int = 50

    # --- Frontend & Communication ---
    FRONTEND_BASE_URL: str = "http://localhost:3000"
    RATE_LIMIT_ENABLED: bool = True

    # --- Seed / Admin Bootstrap ---
    FIRST_ADMIN_EMAIL: str = "admin@capacity-connect.example"
    FIRST_ADMIN_PASSWORD: str = "AdminPassword123!"
    SEED_DEFAULT_PASSWORD: str = "DemoPassword123!"


settings = Settings()
