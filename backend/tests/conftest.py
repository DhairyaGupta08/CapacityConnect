"""Pytest test fixtures and configuration."""
import os
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient

# Ensure test environment
os.environ["ENVIRONMENT"] = "test"
os.environ["RATE_LIMIT_ENABLED"] = "false"
os.environ["JWT_SECRET"] = "test-secret-key-32-chars-minimum-length-key"

from app.main import create_app


@pytest.fixture(scope="session")
def app():
    """Create test application instance."""
    return create_app()


@pytest.fixture
def client(app) -> Generator[TestClient, None, None]:
    """TestClient fixture for making API requests."""
    with TestClient(app, base_url="http://testserver") as test_client:
        yield test_client
