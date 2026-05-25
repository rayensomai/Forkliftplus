from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Company(Base):
  __tablename__ = "companies"

  id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
  name: Mapped[str] = mapped_column(String(255), unique=True, index=True)
  email: Mapped[str] = mapped_column(String(255), nullable=False)
  address: Mapped[str] = mapped_column(String(255), nullable=False, default="")
  city: Mapped[str] = mapped_column(String(120))
  region: Mapped[str] = mapped_column(String(80))
  focus: Mapped[str] = mapped_column(String(120))
  lat: Mapped[float] = mapped_column(Float)
  lng: Mapped[float] = mapped_column(Float)

  users: Mapped[list["User"]] = relationship(back_populates="company")


class User(Base):
  __tablename__ = "users"

  id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
  email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
  full_name: Mapped[str] = mapped_column(String(255))
  is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
  company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))

  company: Mapped["Company"] = relationship(back_populates="users")


class Machine(Base):
  __tablename__ = "machines"

  id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
  name: Mapped[str] = mapped_column(String(255))
  status: Mapped[str] = mapped_column(String(50))
  serial_number: Mapped[str] = mapped_column(String(120), unique=True)


class RentalMachine(Base):
  __tablename__ = "rental_machines"

  slug: Mapped[str] = mapped_column(String(120), primary_key=True)
  name: Mapped[str] = mapped_column(String(255))
  category_key: Mapped[str] = mapped_column(String(80))
  category_label: Mapped[str] = mapped_column(String(120))
  brand: Mapped[str] = mapped_column(String(120))
  capacity_lb: Mapped[int] = mapped_column(Integer)
  capacity_label: Mapped[str] = mapped_column(String(80))
  terrain: Mapped[str] = mapped_column(String(40))
  terrain_label: Mapped[str] = mapped_column(String(80))
  work_type: Mapped[str] = mapped_column(String(40))
  work_type_label: Mapped[str] = mapped_column(String(80))
  image_url: Mapped[str] = mapped_column(String(500))
  description: Mapped[str] = mapped_column(Text, default="")
  daily_rate: Mapped[float] = mapped_column(Float)
  weekly_rate: Mapped[float] = mapped_column(Float)
  monthly_rate: Mapped[float] = mapped_column(Float)
  weekend_rate: Mapped[float] = mapped_column(Float, default=0)
  fuel_type: Mapped[str] = mapped_column(String(40), default="Electrique")
  deposit: Mapped[float] = mapped_column(Float)
  delivery_fee: Mapped[float] = mapped_column(Float, default=0)
  min_days: Mapped[int] = mapped_column(Integer, default=1)
  max_days: Mapped[int] = mapped_column(Integer, default=365)
  status: Mapped[str] = mapped_column(String(40), default="available")
  is_rentable: Mapped[bool] = mapped_column(Boolean, default=True)

  requests: Mapped[list["RentalRequest"]] = relationship(back_populates="machine")


class RentalRequest(Base):
  __tablename__ = "rental_requests"

  id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
  reference: Mapped[str] = mapped_column(String(40), unique=True, index=True)
  machine_slug: Mapped[str] = mapped_column(ForeignKey("rental_machines.slug"))
  machine_name: Mapped[str] = mapped_column(String(255))
  start_date: Mapped[date] = mapped_column(Date)
  end_date: Mapped[date] = mapped_column(Date)
  rental_days: Mapped[int] = mapped_column(Integer)
  client_name: Mapped[str] = mapped_column(String(255))
  client_email: Mapped[str] = mapped_column(String(255), index=True)
  client_phone: Mapped[str] = mapped_column(String(80))
  client_company: Mapped[str] = mapped_column(String(255), default="")
  delivery_address: Mapped[str] = mapped_column(String(255))
  delivery_city: Mapped[str] = mapped_column(String(120))
  delivery_region: Mapped[str] = mapped_column(String(40))
  delivery_postal: Mapped[str] = mapped_column(String(20), default="")
  site_contact: Mapped[str] = mapped_column(String(255), default="")
  site_phone: Mapped[str] = mapped_column(String(80), default="")
  operator_required: Mapped[bool] = mapped_column(Boolean, default=False)
  insurance_confirmed: Mapped[bool] = mapped_column(Boolean, default=False)
  delivery_required: Mapped[bool] = mapped_column(Boolean, default=True)
  notes: Mapped[str] = mapped_column(Text, default="")
  rental_cost: Mapped[float] = mapped_column(Float)
  delivery_fee: Mapped[float] = mapped_column(Float)
  deposit: Mapped[float] = mapped_column(Float)
  taxes: Mapped[float] = mapped_column(Float)
  total_due: Mapped[float] = mapped_column(Float)
  status: Mapped[str] = mapped_column(String(40), default="pending")
  admin_notes: Mapped[str] = mapped_column(Text, default="")
  created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

  machine: Mapped["RentalMachine"] = relationship(back_populates="requests")
