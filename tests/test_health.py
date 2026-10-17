"""
Tests for health endpoints.

These tests use FastAPI's TestClient, so they do NOT require a running server.
The /health/ready endpoint is expected to fail without a real DB, which is fine
for unit-level testing — we verify it returns 503 instead of crashing.
"""

from fastapi.testclient import TestClient

from apps.api.main import app

client = TestClient(app)


def test_health_live_returns_200():
    response = client.get("/health/live")
    assert response.status_code == 200
    assert response.json() == {"status": "live"}


def test_health_ready_returns_503_without_db():
    """Without a real PostgreSQL, readiness should report 503."""
    response = client.get("/health/ready")
    assert response.status_code == 503
