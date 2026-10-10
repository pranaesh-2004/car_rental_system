
from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Car(Base):
    __tablename__ = "cars"
    __table_args__ = (
        CheckConstraint("daily_rate > 0", name="check_daily_rate_positive"),
        CheckConstraint("year > 1885", name="check_car_year"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    make: Mapped[str] = mapped_column(String, nullable=False)
    model: Mapped[str] = mapped_column(String, nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    daily_rate: Mapped[float] = mapped_column(Float, nullable=False)
    available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    rentals: Mapped[list["Rental"]] = relationship(
    back_populates="car",
)


class Rental(Base):
    __tablename__ = "rentals"
    __table_args__ = (
        CheckConstraint("end_date > start_date", name="check_rental_dates"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    car_id: Mapped[int] = mapped_column(
        ForeignKey("cars.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_name: Mapped[str] = mapped_column(String, nullable=False)
    start_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    rental_date: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    cancelled_at: Mapped[datetime | None] = mapped_column(
        DateTime, nullable=True, default=None
    )

    car: Mapped["Car"] = relationship(back_populates="rentals")
