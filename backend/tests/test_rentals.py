
def create_car(client):
    response = client.post(
        "/cars/",
        json={
            "make": "Toyota",
            "model": "Corolla",
            "year": 2023,
            "daily_rate": 2000,
            "available": True,
        },
    )
    assert response.status_code == 201
    return response.json()["id"]


def create_rental(client, car_id, start, end, user="Test User"):
    return client.post(
        f"/cars/{car_id}/rent",
        json={
            "user_name": user,
            "start_date": start,
            "end_date": end,
        },
    )


def test_rent_available_car(client):
    car_id = create_car(client)

    response = create_rental(
        client, car_id, "2026-10-12", "2026-10-15"
    )

    assert response.status_code == 201
    assert response.json()["car_id"] == car_id


def test_reject_overlapping_rental(client):
    car_id = create_car(client)

    first = create_rental(
        client, car_id, "2026-10-12", "2026-10-15"
    )
    assert first.status_code == 201

    second = create_rental(
        client, car_id, "2026-10-14", "2026-10-16", "Second User"
    )
    assert second.status_code == 409


def test_allow_adjacent_rental(client):
    car_id = create_car(client)

    first = create_rental(
        client, car_id, "2026-10-12", "2026-10-15"
    )
    second = create_rental(
        client, car_id, "2026-10-15", "2026-10-17", "Second User"
    )

    assert first.status_code == 201
    assert second.status_code == 201


def test_cancel_and_rebook(client):
    car_id = create_car(client)

    first = create_rental(
        client, car_id, "2026-10-12", "2026-10-15"
    )
    rental_id = first.json()["id"]

    cancellation = client.delete(f"/rentals/{rental_id}")
    assert cancellation.status_code == 200
    assert cancellation.json()["cancelled_at"] is not None

    # The car itself must still exist.
    assert client.get(f"/cars/{car_id}").status_code == 200

    second = create_rental(
        client, car_id, "2026-10-12", "2026-10-15", "Second User"
    )
    assert second.status_code == 201


def test_reject_invalid_date_range(client):
    car_id = create_car(client)

    response = create_rental(
        client, car_id, "2026-10-15", "2026-10-12"
    )

    assert response.status_code == 422


def test_cannot_cancel_twice(client):
    car_id = create_car(client)
    rental = create_rental(
        client, car_id, "2026-10-12", "2026-10-15"
    )
    rental_id = rental.json()["id"]

    assert client.delete(f"/rentals/{rental_id}").status_code == 200
    assert client.delete(f"/rentals/{rental_id}").status_code == 409


def test_list_rentals(client):
    car_id = create_car(client)
    rental = create_rental(
        client, car_id, "2026-10-12", "2026-10-15", "Jane Doe"
    )
    assert rental.status_code == 201

    response = client.get("/rentals/")
    assert response.status_code == 200
    rentals = response.json()
    assert len(rentals) >= 1
    matched = next((r for r in rentals if r["id"] == rental.json()["id"]), None)
    assert matched is not None
    assert matched["user_name"] == "Jane Doe"
    assert matched["car"]["id"] == car_id


def test_get_rental_by_id(client):
    car_id = create_car(client)
    rental = create_rental(
        client, car_id, "2026-10-12", "2026-10-15", "Jane Doe"
    )
    rental_id = rental.json()["id"]

    response = client.get(f"/rentals/{rental_id}")
    assert response.status_code == 200
    assert response.json()["id"] == rental_id
    assert response.json()["user_name"] == "Jane Doe"


def test_get_nonexistent_rental(client):
    response = client.get("/rentals/999999")
    assert response.status_code == 404


def test_different_cars_can_be_rented_on_same_dates(client):
    # Car 1
    car1_id = create_car(client)
    # Car 2
    car2_res = client.post(
        "/cars/",
        json={
            "make": "Hyundai",
            "model": "Creta",
            "year": 2024,
            "daily_rate": 2500,
            "available": True,
        },
    )
    car2_id = car2_res.json()["id"]

    # Rent Car 1 from Oct 10 to Oct 15
    res1 = create_rental(client, car1_id, "2026-10-10", "2026-10-15", "Alice")
    assert res1.status_code == 201

    # Rent Car 2 on the EXACT SAME DATES (Oct 10 to Oct 15) -> MUST SUCCEED
    res2 = create_rental(client, car2_id, "2026-10-10", "2026-10-15", "Bob")
    assert res2.status_code == 201
    assert res2.json()["car_id"] == car2_id

    # Rent Car 3 on an IN-BETWEEN OVERLAPPING DATE (Oct 12 to Oct 14) -> MUST SUCCEED
    car3_res = client.post(
        "/cars/",
        json={
            "make": "Honda",
            "model": "City",
            "year": 2023,
            "daily_rate": 1900,
            "available": True,
        },
    )
    car3_id = car3_res.json()["id"]
    res3 = create_rental(client, car3_id, "2026-10-12", "2026-10-14", "Charlie")
    assert res3.status_code == 201
    assert res3.json()["car_id"] == car3_id


def test_same_car_in_between_overlapping_dates_rejected(client):
    car_id = create_car(client)
    # Base rental: Oct 10 to Oct 20
    base_res = create_rental(client, car_id, "2026-10-10", "2026-10-20", "Original")
    assert base_res.status_code == 201

    # 1. In-between dates: Oct 12 to Oct 15 -> REJECTED
    in_between = create_rental(client, car_id, "2026-10-12", "2026-10-15", "Tester 1")
    assert in_between.status_code == 409

    # 2. Overlap start: Oct 08 to Oct 12 -> REJECTED
    overlap_start = create_rental(client, car_id, "2026-10-08", "2026-10-12", "Tester 2")
    assert overlap_start.status_code == 409

    # 3. Overlap end: Oct 18 to Oct 22 -> REJECTED
    overlap_end = create_rental(client, car_id, "2026-10-18", "2026-10-22", "Tester 3")
    assert overlap_end.status_code == 409

    # 4. Encompassing range: Oct 05 to Oct 25 -> REJECTED
    encompassing = create_rental(client, car_id, "2026-10-05", "2026-10-25", "Tester 4")
    assert encompassing.status_code == 409


def test_cannot_rent_unavailable_car(client):
    res = client.post(
        "/cars/",
        json={
            "make": "Ford",
            "model": "Mustang",
            "year": 2022,
            "daily_rate": 5000,
            "available": False,
        },
    )
    assert res.status_code == 201
    car_id = res.json()["id"]

    rent_res = create_rental(client, car_id, "2026-10-10", "2026-10-15", "Dan")
    assert rent_res.status_code == 409
    assert "not available" in rent_res.json()["detail"].lower()


