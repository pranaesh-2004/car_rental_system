
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import models
from routers import cars, rentals,analytics


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Temporary database bootstrap for local development.
    # Alembic will manage migrations.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Car Rental System API",
    description="API for managing cars, date-based rentals, and cancellations.",
    version="1.0.0",
    lifespan=lifespan,
)


# Enable communication between React and FastAPI.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes.
app.include_router(cars.router)
app.include_router(rentals.router)
app.include_router(analytics.router)

@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "message": "Car Rental API is running",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

