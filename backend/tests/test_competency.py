"""Competency matching algorithm tests."""
from fastapi.testclient import TestClient


def test_competency_requirement_matching(client: TestClient):
    """Test creating competency requirement and running deterministic matching."""
    # Login as admin
    login_res = client.post(
        "/api/auth/login",
        json={"email": "admin@capacity-connect.example", "password": "AdminPassword123!"},
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create requirement
    req_res = client.post(
        "/api/competency/requirements",
        json={
            "title": "Lead Instructor in Government Cyber Defense",
            "description": "Requires deep hands-on incident response and infosec auditing background.",
            "target_role": "Chief Information Security Trainer",
            "department": "Cyber Defense Wing",
            "required_skills": [
                {"name": "Cybersecurity & Incident Response", "min_level": 4, "weight": 5},
                {"name": "Threat Modeling", "min_level": 4, "weight": 4},
            ],
            "required_subjects": ["Cybersecurity in Governance"],
            "min_experience_years": 8.0,
            "min_qualification": "Master",
        },
        headers=headers,
    )
    assert req_res.status_code == 201
    req_id = req_res.json()["id"]

    # Run matching
    match_res = client.get(f"/api/competency/requirements/{req_id}/match", headers=headers)
    assert match_res.status_code == 200
    data = match_res.json()
    assert data["total_candidates_evaluated"] >= 1
    assert len(data["ranked_trainers"]) >= 1

    top_trainer = data["ranked_trainers"][0]
    assert top_trainer["total_score"] > 0
    assert "breakdown" in top_trainer
    assert top_trainer["breakdown"]["s_skill"] > 0
