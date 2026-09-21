from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_predict_route_returns_cluster():
    payload = {"annual_income_k": 80, "spending_score": 20}
    response = client.post("/predict", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert "cluster" in data
    assert "message" in data
    assert isinstance(data["cluster"], int)


def test_predict_route_validates_missing_fields():
    response = client.post("/predict", json={"annual_income_k": 80})

    assert response.status_code == 422
