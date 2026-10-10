
from datetime import datetime, date

from pydantic import BaseModel, ConfigDict, Field, model_validator


class CarCreate(BaseModel):
    make: str = Field(min_length=1, max_length=100)
    model: str = Field(min_length=1, max_length=100)
    year: int = Field(gt=1885, le=2100)
    daily_rate: float = Field(gt=0)
    available: bool = True


class CarResponse(BaseModel):
    id: int
    make: str
    model: str
    year: int
    daily_rate: float
    available: bool
    is_booked: bool = False
    booked_range: str | None = None

    model_config = ConfigDict(from_attributes=True)



class RentalCreate(BaseModel):
    user_name: str = Field(min_length=1, max_length=100)
    start_date: date
    end_date: date

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date <= self.start_date:
            raise ValueError("end_date must be after start_date")
        return self


class RentalResponse(BaseModel):
    id: int
    car_id: int
    user_name: str
    start_date: datetime
    end_date: datetime
    rental_date: datetime
    cancelled_at: datetime | None = None
    car: CarResponse | None = None

    model_config = ConfigDict(from_attributes=True)

