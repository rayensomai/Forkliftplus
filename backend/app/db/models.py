from sqlalchemy import Boolean, Float, ForeignKey, Integer, String
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
