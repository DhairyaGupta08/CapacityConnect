"""Authentication and RBAC test suite."""
import uuid
from fastapi.testclient import TestClient


def test_admin_login(client: TestClient):
    """Test seeded admin login."""
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@capacity-connect.example", "password": "AdminPassword123!"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"
    assert data["user"]["email"] == "admin@capacity-connect.example"


def test_trainee_registration_and_login(client: TestClient):
    """Test registering a new trainee and immediately logging in."""
    unique_email = f"test.trainee.{uuid.uuid4().hex[:8]}@example.com"
    reg_res = client.post(
        "/api/auth/register",
        json={
            "email": unique_email,
            "password": "SecurePassword123!",
            "full_name": "Test Trainee",
            "role": "trainee",
            "organization": "Test Organization",
        },
    )
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert reg_data["user"]["status"] == "active"

    login_res = client.post(
        "/api/auth/login",
        json={"email": unique_email, "password": "SecurePassword123!"},
    )
    assert login_res.status_code == 200
    assert login_res.json()["user"]["full_name"] == "Test Trainee"


def test_trainer_registration_starts_as_pending(client: TestClient):
    """Test that newly registered trainers start with pending status."""
    unique_email = f"test.trainer.{uuid.uuid4().hex[:8]}@example.com"
    reg_res = client.post(
        "/api/auth/register",
        json={
            "email": unique_email,
            "password": "SecurePassword123!",
            "full_name": "Pending Trainer",
            "role": "trainer",
            "expertise_subjects": ["AI Ethics"],
        },
    )
    assert reg_res.status_code == 201
    assert reg_res.json()["user"]["status"] == "pending"


def test_invalid_login_credentials(client: TestClient):
    """Test rejection on incorrect password."""
    res = client.post(
        "/api/auth/login",
        json={"email": "admin@capacity-connect.example", "password": "WrongPassword!"},
    )
    assert res.status_code == 401
