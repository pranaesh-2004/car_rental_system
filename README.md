# Car Rental System

A full-stack car rental application built with **FastAPI, SQLite, SQLAlchemy, React, and Axios**. Users can browse cars, check availability for specific dates, book rentals, and cancel existing bookings.

## Features

- Create and list cars.
- Retrieve car details by ID.
- Search for available cars using rental dates.
- Book cars for a specified date range.
- Prevent overlapping active bookings.
- Cancel rentals and make the dates available again.
- SQLite database with SQLAlchemy models and Alembic migrations.
- React frontend integrated with the FastAPI backend.
- Automatically generated Python SDK using OpenAPI Generator.
- Automated backend tests using pytest.

## Technology Stack

| Component | Technology |
|---|---|
| Backend | Python, FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| Database migrations | Alembic |
| Frontend | React, Vite, Axios |
| API documentation | OpenAPI / Swagger UI |
| SDK generation | OpenAPI Generator CLI |
| Testing | pytest, FastAPI TestClient |

## Project Structure

```text
car_rental_system/
├── backend/
│   ├── alembic/
│   ├── routers/
│   ├── tests/
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── seed_data.sql
│   └── requirements.txt
├── frontend/
├── car_rental_sdk/
├── env/
├── setupdev.bat
├── runapplication.bat
└── README.md
```

## Prerequisites

- Python 3.11 or compatible version
- Node.js and npm
- Java and OpenAPI Generator CLI if regenerating the Python SDK

## Setup

Open PowerShell in the project root:

```powershell
cd D:\car_rental_system
.\setupdev.bat
```

The setup script creates the Python virtual environment if necessary and installs backend and frontend dependencies.

## Run the Application

Run:

```powershell
.\runapplication.bat
```

The script starts the backend and frontend in separate terminal windows.

- Frontend: http://localhost:5173
- Backend: http://127.0.0.1:8000
- Swagger API documentation: http://127.0.0.1:8000/docs
- OpenAPI schema: http://127.0.0.1:8000/openapi.json

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API health check |
| POST | `/cars/` | Add a new car to the fleet |
| GET | `/cars/` | List all cars with availability status |
| GET | `/cars/?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` | Check availability for dates (booked cars marked with date range) |
| GET | `/cars/{car_id}` | Retrieve car details |
| POST | `/cars/{car_id}/rent` | Rent a car for a specified date range |
| GET | `/rentals/` | List all user rentals with car details |
| GET | `/rentals/{rental_id}` | Retrieve a specific rental record |
| DELETE | `/rentals/{rental_id}` | Cancel an active rental |
| GET | `/analytics/summary` | Fleet and rental summary statistics |

### Example: Create a Car

```json
{
  "make": "Toyota",
  "model": "Corolla",
  "year": 2023,
  "daily_rate": 2000,
  "available": true
}
```

Send this JSON in a `POST /cars/` request.

### Example: Book a Car

Send a `POST /cars/{car_id}/rent` request:

```json
{
  "user_name": "Test User",
  "start_date": "2026-10-12",
  "end_date": "2026-10-15"
}
```

The end date is exclusive. This booking covers October 12, 13, and 14.

### Trick Logic & Business Rules

- **Independent Multi-Car Bookings**: Renting Car 1 and Car 2 on the **same dates** or **overlapping dates** succeeds independently.
- **Prevent Overlapping Rentals for Same Car**: Any overlap for the *same* vehicle (in-between dates, partial start overlap, partial end overlap, or encompassing range) is rejected with `409 Conflict`.
- **Fleet Catalog Visibility**: Booked vehicles remain visible in the fleet catalog with a `Booked` badge and reserved date range instead of disappearing.
- **Adjacent Bookings Allowed**: Bookings are allowed when one rental begins on the same date another ends (`end_date` is exclusive).
- **Cancellations Free Dates**: Cancelling a rental immediately frees the car for new bookings for those dates.
- **Unavailable Fleet Vehicle**: Cars marked `available: false` cannot be booked (`409 Conflict`).
- **All Cars Rented Check**: When all fleet vehicles are rented for a requested range, attempts are rejected with `409 Conflict`.

## Database and Seed Data

The SQLite database is located at `backend/car_rental.db`.

The SQL seed script is `backend/seed_data.sql`. It checks for an existing car with the same make, model, and year before inserting it.

Do not execute seed SQL blindly against a production database. Back up important data before making database changes.

Alembic migration files are located under `backend/alembic/versions/`.

## Run Tests

Open PowerShell:

```powershell
cd D:\car_rental_system\backend
pytest -v
```

The backend test suite contains **18 passing automated tests** covering:
- Car listing, retrieval, creation, and invalid input validation.
- Overlapping rental prevention (in-between, partial, enclosing).
- Concurrent independent multi-car rentals on same dates.
- Fleet visibility when booked.
- Adjacent date rental support.
- Cancellation and re-booking verification.
- Duplicate cancellation prevention.
- Rental retrieval by ID and listing with vehicle details.
- Unavailable car rental rejection.

## Python SDK

The generated Python SDK is located in `car_rental_sdk/`.

The OpenAPI schema can be used to regenerate it when the API changes. Run the generator from the project root while the backend is running:

```powershell
openapi-generator-cli generate `
  -i http://127.0.0.1:8000/openapi.json `
  -g python `
  -o .\car_rental_sdk `
  --package-name car_rental_sdk
```

Consult the generated SDK README for installation and usage instructions.

## Development Scripts

- `setupdev.bat` — prepares the Python environment and installs dependencies.
- `runapplication.bat` — launches the backend and frontend.

## Current Verification

- Backend and frontend start successfully.
- Car listing, booking, cancellation, and live analytics verified end-to-end.
- All 18 backend tests pass.
- Frontend builds cleanly with zero errors via `npm run build`.

