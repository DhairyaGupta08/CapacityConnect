"""Health check router."""
from fastapi import APIRouter
from pydantic import BaseModel

from app import __version__
from app.core.config import settings
from app.db.session import check_db_health

router = APIRouter(tags=["Health"])


class HealthResponse(BaseModel):
    status: str
    app: str
    version: str
    database: str
    environment: str


@router.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    """Returns application health status and database connectivity."""
    db_ok = check_db_health()
    return HealthResponse(
        status="ok" if db_ok else "degraded",
        app=settings.APP_NAME,
        version=__version__,
        database="ok" if db_ok else "disconnected",
        environment=settings.ENVIRONMENT,
    )
