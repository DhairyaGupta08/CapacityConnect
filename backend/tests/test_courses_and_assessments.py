"""Courses, Assessments, and Certification end-to-end tests."""
from fastapi.testclient import TestClient


def test_list_courses_and_categories(client: TestClient):
    """Test public course catalog listing and category fetching."""
    cat_res = client.get("/api/courses/categories")
    assert cat_res.status_code == 200
    categories = cat_res.json()
    assert len(categories) > 0

    course_res = client.get("/api/courses")
    assert course_res.status_code == 200
    courses_data = course_res.json()
    assert courses_data["total"] >= 1


def test_course_detail_and_assessment(client: TestClient):
    """Test retrieving course curriculum modules and associated assessment."""
    # Login as trainee
    login_res = client.post(
        "/api/auth/login",
        json={"email": "arun.kumar@capacity-connect.example", "password": "TraineePassword123!"},
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get courses
    course_res = client.get("/api/courses")
    first_course_id = course_res.json()["items"][0]["id"]

    # Get course detail
    detail_res = client.get(f"/api/courses/{first_course_id}", headers=headers)
    assert detail_res.status_code == 200
    course_detail = detail_res.json()
    assert len(course_detail["modules"]) > 0

    # Get assessment
    assess_res = client.get(f"/api/assessments/course/{first_course_id}", headers=headers)
    if assess_res.status_code == 200:
        assess_data = assess_res.json()
        assert "questions" in assess_data
        assert len(assess_data["questions"]) > 0


def test_public_certificate_verification(client: TestClient):
    """Test public certificate lookup by code."""
    verify_res = client.get("/api/certificates/verify/CC-2026-N8X9L2")
    assert verify_res.status_code == 200
    cert = verify_res.json()
    assert cert["is_valid"] is True
    assert cert["certificate_code"] == "CC-2026-N8X9L2"
    assert "Arun Kumar" in cert["recipient_name"]
