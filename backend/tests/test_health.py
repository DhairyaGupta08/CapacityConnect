"""Tests for health check endpoint and error envelope."""
from fastapi.testclient import TestClient


def test_health_check_returns_valid_payload(client: TestClient):
    """Verify GET /api/health returns 200 with required fields."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "Capacity Connect"
    assert "status" in data
    assert "version" in data
    assert "database" in data
    assert "environment" in data


def test_request_id_header_present(client: TestClient):
    """Verify X-Request-ID is attached in responses."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert "x-request-id" in response.headers or "X-Request-ID" in response.headers


def test_404_uniform_error_envelope(client: TestClient):
    """Verify 404 responses conform to uniform JSON error format."""
    response = client.get("/api/non-existent-path")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "NOT_FOUND"
    assert "message" in data["error"]
