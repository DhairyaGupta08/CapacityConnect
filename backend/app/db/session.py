"""Database engine, session management, and auto-init."""
import logging
from collections.abc import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.db.base import Base

logger = logging.getLogger("capacity_connect.db")

connect_args = {}
db_url = settings.DATABASE_URL

if "sqlite" in db_url:
    connect_args["check_same_thread"] = False
elif "postgresql" in db_url:
    connect_args["connect_timeout"] = 3

try:
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        connect_args=connect_args,
        echo=False,
    )
    # Test connection
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
except Exception as exc:
    logger.warning("Primary database connection failed (%s). Falling back to SQLite for local development.", exc)
    db_url = "sqlite:///./capacity_connect.db"
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        connect_args={"check_same_thread": False},
        echo=False,
    )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for obtaining a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_health() -> bool:
    """Check whether database connection can be established."""
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


def init_db() -> None:
    """Create all database tables if they do not exist."""
    # Import all models to ensure they are registered with Base metadata
    import app.db.models  # noqa: F401
    Base.metadata.create_all(bind=engine)
