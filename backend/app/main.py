"""FastAPI application factory, router registration, auto-seed on startup, and static file mounting."""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app import __version__
from app.api.routers.analytics import router as analytics_router
from app.api.routers.assessments import router as assessments_router
from app.api.routers.auth import router as auth_router
from app.api.routers.certificates import router as certificates_router
from app.api.routers.competency import router as competency_router
from app.api.routers.courses import router as courses_router
from app.api.routers.health import router as health_router
from app.api.routers.notifications import router as notifications_router
from app.api.routers.users import router as users_router
from app.core.config import settings
from app.core.errors import register_error_handlers
from app.core.logging import setup_logging
from app.db.seed import seed_database
from app.db.session import SessionLocal, init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context for database init and seeding."""
    # Initialize DB tables and seed data
    try:
        init_db()
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
    except Exception as e:
        import logging
        logging.getLogger("capacity_connect.main").warning("Database startup init warning: %s", e)

    yield


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title=settings.APP_NAME,
        version=__version__,
        description="Modular Monolith API for Capacity Connect - Digital Capacity Building Portal",
        docs_url=f"{settings.API_PREFIX}/docs" if settings.ENABLE_DOCS else None,
        redoc_url=f"{settings.API_PREFIX}/redoc" if settings.ENABLE_DOCS else None,
        openapi_url=f"{settings.API_PREFIX}/openapi.json" if settings.ENABLE_DOCS else None,
        lifespan=lifespan,
    )

    # 1. Logging and Request Tracking
    setup_logging(app)

    # 2. CORS Middleware
    cors_origins = (
        settings.CORS_ORIGINS
        if isinstance(settings.CORS_ORIGINS, list)
        else [settings.CORS_ORIGINS]
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 3. Uniform Error Handlers
    register_error_handlers(app)

    # 4. Include Routers
    app.include_router(health_router, prefix=settings.API_PREFIX)
    app.include_router(auth_router, prefix=settings.API_PREFIX)
    app.include_router(users_router, prefix=settings.API_PREFIX)
    app.include_router(courses_router, prefix=settings.API_PREFIX)
    app.include_router(assessments_router, prefix=settings.API_PREFIX)
    app.include_router(certificates_router, prefix=settings.API_PREFIX)
    app.include_router(competency_router, prefix=settings.API_PREFIX)
    app.include_router(analytics_router, prefix=settings.API_PREFIX)
    app.include_router(notifications_router, prefix=settings.API_PREFIX)

    # 5. Mount Static Local Storage
    os.makedirs(settings.LOCAL_STORAGE_DIR, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=settings.LOCAL_STORAGE_DIR), name="uploads")

    return app


app = create_app()
