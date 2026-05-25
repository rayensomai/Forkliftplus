from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.api.router import api_router
from app.core.config import settings
from app.db import models  # noqa: F401 — register ORM models
from app.db.base import Base
from app.db.session import engine
from app.services.dev_mail import start_dev_mail_server, stop_dev_mail_server

app = FastAPI(title=settings.app_name, version=settings.app_version)

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173", "http://localhost:5174"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(api_router)


def _ensure_company_email_column() -> None:
  inspector = inspect(engine)
  if "companies" not in inspector.get_table_names():
    return

  columns = {column["name"] for column in inspector.get_columns("companies")}

  with engine.begin() as connection:
    if "email" not in columns:
      connection.execute(text("ALTER TABLE companies ADD COLUMN email VARCHAR(255)"))

    if "address" not in columns:
      connection.execute(text("ALTER TABLE companies ADD COLUMN address VARCHAR(255)"))

    connection.execute(
      text(
        """
        UPDATE companies
        SET email = lower(replace(replace(name, ' ', '-'), '/', '-')) || '@forkliftplus.com'
        WHERE email IS NULL OR email = ''
        """
      )
    )

    connection.execute(
      text(
        """
        UPDATE companies
        SET address = COALESCE(NULLIF(address, ''), city || ', ' || region)
        WHERE address IS NULL OR address = ''
        """
      )
    )


@app.on_event("startup")
def ensure_schema() -> None:
  Base.metadata.create_all(bind=engine)
  _ensure_company_email_column()
  _ensure_rental_machine_columns()
  _seed_demo_companies_if_empty()
  _seed_rental_machines()
  if settings.dev_mail_enabled and settings.app_env == "development":
    stop_dev_mail_server()
    start_dev_mail_server(port=settings.dev_mail_port)


@app.on_event("shutdown")
def shutdown_dev_mail() -> None:
  stop_dev_mail_server()


def _seed_demo_companies_if_empty() -> None:
  from sqlalchemy.orm import Session

  from app.db.session import SessionLocal

  seed = [
    {
      "name": "NordLift Logistics",
      "email": "contact@nordliftlogistics.com",
      "address": "2150 Boulevard Hymus, Dorval, QC H9P 1J7",
      "city": "Montreal",
      "region": "QC",
      "focus": "Forklifts",
      "lat": 45.5017,
      "lng": -73.5673,
    },
    {
      "name": "Atlas Yard Network",
      "email": "hello@atlasyardnetwork.com",
      "address": "200 King St W, Toronto, ON M5H 3T4",
      "city": "Toronto",
      "region": "ON",
      "focus": "Heavy rental",
      "lat": 43.6532,
      "lng": -79.3832,
    },
    {
      "name": "Pacific Freight Hub",
      "email": "sales@pacificfreighthub.com",
      "address": "401 Burrard St, Vancouver, BC V6C 3S5",
      "city": "Vancouver",
      "region": "BC",
      "focus": "Port handling",
      "lat": 49.2827,
      "lng": -123.1207,
    },
    {
      "name": "Prairie Lift Co",
      "email": "contact@prairieliftco.com",
      "address": "300 Portage Ave, Winnipeg, MB R3C 0B4",
      "city": "Winnipeg",
      "region": "MB",
      "focus": "Warehouse ops",
      "lat": 49.8951,
      "lng": -97.1384,
    },
    {
      "name": "Atlantic Fleet",
      "email": "partnerships@atlanticfleet.com",
      "address": "1801 Hollis St, Halifax, NS B3J 3N4",
      "city": "Halifax",
      "region": "NS",
      "focus": "Maritime",
      "lat": 44.6488,
      "lng": -63.5752,
    },
    {
      "name": "Northern Axis",
      "email": "info@northernaxis.com",
      "address": "101 Rue Saint-Jean, Quebec, QC G1R 1N8",
      "city": "Quebec",
      "region": "QC",
      "focus": "Cross-dock",
      "lat": 46.8139,
      "lng": -71.2080,
    },
  ]

  db: Session = SessionLocal()
  try:
    if db.query(models.Company).first():
      return
    db.add_all([models.Company(**item) for item in seed])
    db.commit()
  finally:
    db.close()


def _ensure_rental_machine_columns() -> None:
  inspector = inspect(engine)
  if "rental_machines" not in inspector.get_table_names():
    return

  columns = {column["name"] for column in inspector.get_columns("rental_machines")}

  with engine.begin() as connection:
    if "weekend_rate" not in columns:
      connection.execute(text("ALTER TABLE rental_machines ADD COLUMN weekend_rate FLOAT DEFAULT 0"))
    if "fuel_type" not in columns:
      connection.execute(text("ALTER TABLE rental_machines ADD COLUMN fuel_type VARCHAR(40) DEFAULT 'Electrique'"))


def _seed_rental_machines() -> None:
  from sqlalchemy.orm import Session

  from app.data.rental_seed import build_rental_machine_seed
  from app.db.session import SessionLocal

  seed = build_rental_machine_seed()
  seed_slugs = {item["slug"] for item in seed}

  db: Session = SessionLocal()
  try:
    for item in seed:
      existing = db.query(models.RentalMachine).filter(models.RentalMachine.slug == item["slug"]).first()
      if existing:
        for key, value in item.items():
          setattr(existing, key, value)
      else:
        db.add(models.RentalMachine(**item))

    stale = db.query(models.RentalMachine).filter(models.RentalMachine.slug.notin_(seed_slugs)).all()
    for machine in stale:
      machine.is_rentable = False
      machine.status = "unavailable"

    db.commit()
  finally:
    db.close()


@app.get("/")
def read_root():
  return {"status": "ok", "service": settings.app_name}
