from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.api.router import api_router
from app.core.config import settings
from app.db.session import engine

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
  _ensure_company_email_column()


@app.get("/")
def read_root():
  return {"status": "ok", "service": settings.app_name}
