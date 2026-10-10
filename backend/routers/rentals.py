from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models import Rental
from schemas import RentalResponse

router = APIRouter(prefix="/rentals", tags=["Rentals"])


@router.get("/", response_model=list[RentalResponse])
def list_rentals(db: Session = Depends(get_db)):
    """Return rental records so the frontend can display My Rentals."""
    statement = (
        select(Rental)
        .options(joinedload(Rental.car))
        .order_by(Rental.id.desc())
    )
    return db.scalars(statement).unique().all()


@router.get("/{rental_id}", response_model=RentalResponse)
def get_rental(rental_id: int, db: Session = Depends(get_db)):
    rental = db.get(Rental, rental_id)
    if rental is None:
        raise HTTPException(status_code=404, detail="Rental not found")
    return rental


@router.delete("/{rental_id}", response_model=RentalResponse)
def cancel_rental(rental_id: int, db: Session = Depends(get_db)):
    rental = db.get(Rental, rental_id)
    if rental is None:
        raise HTTPException(status_code=404, detail="Rental not found")
    if rental.cancelled_at is not None:
        raise HTTPException(
            status_code=409,
            detail="Rental has already been cancelled.",
        )

    rental.cancelled_at = datetime.utcnow()
    db.commit()
    db.refresh(rental)
    return rental