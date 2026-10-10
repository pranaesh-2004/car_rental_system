from fastapi.testclient import TestClient


def test_list_cars(client: TestClient):
    response = client.get("/cars/")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_car(client: TestClient):
    payload = {
        "make": "Test",
        "model": "Car",
        "year": 2025,
        "daily_rate": 1800,
        "available": True,
    }

    response = client.post("/cars/", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["make"] == "Test"
    assert data["model"] == "Car"
    assert data["daily_rate"] == 1800


def test_get_existing_car(client: TestClient):
    create_response = client.post(
        "/cars/",
        json={
            "make": "Honda",
            "model": "Test Civic",
            "year": 2024,
            "daily_rate": 2000,
            "available": True,
        },
    )

    assert create_response.status_code == 201
    car_id = create_response.json()["id"]

    response = client.get(f"/cars/{car_id}")

    assert response.status_code == 200
    assert response.json()["id"] == car_id


def test_get_nonexistent_car(client: TestClient):
    response = client.get("/cars/999999")

    assert response.status_code == 404


def test_reject_invalid_car_data(client: TestClient):
    response = client.post(
        "/cars/",
        json={
            "make": "Test",
            "model": "Invalid",
            "year": 2025,
            "daily_rate": -100,
            "available": True,
        },
    )

    assert response.status_code == 422


def test_cars_visibility_when_booked(client: TestClient):
    create_res = client.post(
        "/cars/",
        json={
            "make": "Tata",
            "model": "Nexon",
            "year": 2024,
            "daily_rate": 2200,
            "available": True,
        },
    )
    assert create_res.status_code == 201
    car_id = create_res.json()["id"]

    rent_res = client.post(
        f"/cars/{car_id}/rent",
        json={
            "user_name": "Test User",
            "start_date": "2026-10-23",
            "end_date": "2026-10-25",
        },
    )
    assert rent_res.status_code == 201

    # Overlapping search: Oct 24 to Oct 26
    overlap_res = client.get(
        "/cars/",
        params={"start_date": "2026-10-24", "end_date": "2026-10-26"},
    )
    assert overlap_res.status_code == 200
    cars = overlap_res.json()
    nexon = next((c for c in cars if c["id"] == car_id), None)
    assert nexon is not None, "Booked car should still show in fleet catalog"
    assert nexon["is_booked"] is True
    assert nexon["available"] is False
    assert nexon["booked_range"] is not None

    # Non-overlapping search: Oct 26 to Oct 28
    free_res = client.get(
        "/cars/",
        params={"start_date": "2026-10-26", "end_date": "2026-10-28"},
    )
    assert free_res.status_code == 200
    free_cars = free_res.json()
    free_nexon = next((c for c in free_cars if c["id"] == car_id), None)
    assert free_nexon is not None
    assert free_nexon["is_booked"] is False
    assert free_nexon["available"] is True

