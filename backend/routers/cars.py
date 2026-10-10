
from datetime import date, datetime, time, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_db
from models import Car, Rental
from schemas import CarCreate, CarResponse, RentalCreate, RentalResponse

router = APIRouter(prefix="/cars", tags=["Cars"])


def day_start(value: date) -> datetime:
    return datetime.combine(value, time.min)


def find_overlap(
    db: Session,
    car_id: int,
    start: datetime,
    end: datetime,
) -> Rental | None:
    statement = select(Rental).where(
        Rental.car_id == car_id,
        Rental.cancelled_at.is_(None),
        Rental.start_date < end,
        Rental.end_date > start,
    )
    return db.scalars(statement).first()


@router.post("/", response_model=CarResponse, status_code=201)
def create_car(payload: CarCreate, db: Session = Depends(get_db)):
    car = Car(**payload.model_dump())
    db.add(car)
    db.commit()
    db.refresh(car)
    return car


@router.get("/", response_model=list[CarResponse])
def get_cars(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if (start_date is None) != (end_date is None):
        raise HTTPException(
            status_code=422,
            detail="Provide both start_date and end_date, or neither.",
        )

    cars = db.scalars(
        select(Car).where(Car.available.is_(True)).order_by(Car.id)
    ).all()

    if start_date is not None and end_date is not None:
        if end_date <= start_date:
            raise HTTPException(
                status_code=422,
                detail="end_date must be after start_date.",
            )

        start = day_start(start_date)
        end = day_start(end_date)

        results = []
        for car in cars:
            overlap = find_overlap(db, car.id, start, end)
            is_booked = overlap is not None
            booked_range = None
            if overlap:
                s_str = overlap.start_date.strftime("%d %b %Y")
                e_str = overlap.end_date.strftime("%d %b %Y")
                booked_range = f"{s_str} – {e_str}"

            results.append(
                CarResponse(
                    id=car.id,
                    make=car.make,
                    model=car.model,
                    year=car.year,
                    daily_rate=car.daily_rate,
                    available=car.available and not is_booked,
                    is_booked=is_booked,
                    booked_range=booked_range,
                )
            )
        return results

    return [
        CarResponse(
            id=car.id,
            make=car.make,
            model=car.model,
            year=car.year,
            daily_rate=car.daily_rate,
            available=car.available,
            is_booked=False,
            booked_range=None,
        )
        for car in cars
    ]


@router.get("/{car_id}", response_model=CarResponse)
def get_car(
    car_id: int,
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    car = db.get(Car, car_id)
    if car is None:
        raise HTTPException(status_code=404, detail="Car not found")

    is_booked = False
    booked_range = None
    if start_date is not None and end_date is not None:
        start = day_start(start_date)
        end = day_start(end_date)
        overlap = find_overlap(db, car.id, start, end)
        if overlap:
            is_booked = True
            s_str = overlap.start_date.strftime("%d %b %Y")
            e_str = overlap.end_date.strftime("%d %b %Y")
            booked_range = f"{s_str} – {e_str}"


    return CarResponse(
        id=car.id,
        make=car.make,
        model=car.model,
        year=car.year,
        daily_rate=car.daily_rate,
        available=car.available and not is_booked,
        is_booked=is_booked,
        booked_range=booked_range,
    )




@router.post(
    "/{car_id}/rent",
    response_model=RentalResponse,
    status_code=status.HTTP_201_CREATED,
)
def rent_car(
    car_id: int,
    payload: RentalCreate,
    db: Session = Depends(get_db),
):
    rental = None

    try:
        with db.begin():
            car = db.get(Car, car_id)

            if car is None:
                raise HTTPException(
                    status_code=404, detail="Car not found"
                )

            if not car.available:
                raise HTTPException(
                    status_code=409,
                    detail="This car is not available for rental.",
                )

            start = day_start(payload.start_date)
            end = day_start(payload.end_date)

            overlap = find_overlap(db, car_id, start, end)
            if overlap is not None:
                available_fleet = db.scalars(
                    select(Car).where(Car.available.is_(True))
                ).all()
                if available_fleet and all(
                    find_overlap(db, c.id, start, end) is not None
                    for c in available_fleet
                ):
                    raise HTTPException(
                        status_code=409,
                        detail="All cars are currently rented for the requested dates.",
                    )
                raise HTTPException(
                    status_code=409,
                    detail="Car is already booked for the requested dates.",
                )


            user_name = payload.user_name.strip()
            if not user_name:
                raise HTTPException(
                    status_code=422,
                    detail="user_name cannot be blank.",
                )

            rental = Rental(
                car_id=car_id,
                user_name=user_name,
                start_date=start,
                end_date=end,
            )
            db.add(rental)
            db.flush()
            db.refresh(rental)

    except HTTPException:
        raise

    return rental
