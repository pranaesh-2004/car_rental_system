from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database import get_db
from models import Car, Rental

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary")
def get_analytics_summary(db: Session = Depends(get_db)):
    # Total cars registered in the fleet
    total_cars = db.scalar(
        select(func.count()).select_from(Car)
    ) or 0

    # Cars marked as available in the database
    available_cars = db.scalar(
        select(func.count())
        .select_from(Car)
        .where(Car.available.is_(True))
    ) or 0

    # Rentals that have not been cancelled
    active_rentals = db.scalar(
        select(func.count())
        .select_from(Rental)
        .where(Rental.cancelled_at.is_(None))
    ) or 0

    # Rentals that have been cancelled
    cancelled_rentals = db.scalar(
        select(func.count())
        .select_from(Rental)
        .where(Rental.cancelled_at.is_not(None))
    ) or 0

    return {
        "total_cars": total_cars,
        "available_cars": available_cars,
        "active_rentals": active_rentals,
        "cancelled_rentals": cancelled_rentals,
    }
