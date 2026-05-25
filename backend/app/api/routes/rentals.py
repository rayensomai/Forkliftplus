from datetime import date, datetime, timedelta

from email.message import EmailMessage
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db import models
from app.db.deps import get_db
from app.schemas.rental import (
  AvailabilityCheckIn,
  AvailabilityCheckOut,
  RentalMachineOut,
  RentalQuoteIn,
  RentalRequestOut,
  RentalStatusUpdateIn,
)
from app.services.email_sender import send_email_message

router = APIRouter()

ACTIVE_STATUSES = {"approved", "active", "quoted"}


def _rental_days(start_date: date, end_date: date) -> int:
  return (end_date - start_date).days + 1


def _tax_rate(region: str) -> float:
  if region.upper() in {"QC", "PQ", "QUEBEC"}:
    return 0.14975
  return 0.13


def calculate_pricing(machine: models.RentalMachine, start_date: date, end_date: date, delivery_required: bool, region: str):
  days = _rental_days(start_date, end_date)
  if days < machine.min_days:
    raise HTTPException(status_code=400, detail=f"Minimum rental period is {machine.min_days} day(s)")
  if days > machine.max_days:
    raise HTTPException(status_code=400, detail=f"Maximum rental period is {machine.max_days} days")

  if days >= 28:
    periods = (days + 27) // 28
    rental_cost = periods * machine.monthly_rate
    rate_label = "monthly"
  elif days >= 7:
    periods = (days + 6) // 7
    rental_cost = periods * machine.weekly_rate
    rate_label = "weekly"
  else:
    rental_cost = days * machine.daily_rate
    rate_label = "daily"

  delivery_fee = machine.delivery_fee if delivery_required else 0
  subtotal = rental_cost + delivery_fee
  taxes = round(subtotal * _tax_rate(region), 2)
  total_due = round(subtotal + taxes + machine.deposit, 2)

  return {
    "days": days,
    "rental_cost": round(rental_cost, 2),
    "delivery_fee": round(delivery_fee, 2),
    "deposit": machine.deposit,
    "taxes": taxes,
    "total_due": total_due,
    "rate_label": rate_label,
  }


def _generate_reference(db: Session) -> str:
  today = datetime.utcnow().strftime("%Y%m%d")
  prefix = f"RNT-{today}-"
  count = db.query(models.RentalRequest).filter(models.RentalRequest.reference.like(f"{prefix}%")).count()
  return f"{prefix}{count + 1:03d}"


def _has_overlap(db: Session, machine_slug: str, start_date: date, end_date: date, exclude_id: int | None = None) -> bool:
  query = db.query(models.RentalRequest).filter(
    models.RentalRequest.machine_slug == machine_slug,
    models.RentalRequest.status.in_(ACTIVE_STATUSES),
    models.RentalRequest.start_date <= end_date,
    models.RentalRequest.end_date >= start_date,
  )
  if exclude_id:
    query = query.filter(models.RentalRequest.id != exclude_id)
  return query.first() is not None


def _send_rental_emails(request: models.RentalRequest) -> None:
  client_body = f"""
Bonjour {request.client_name},

Votre demande de location ForkliftPlus a ete recue.

Reference: {request.reference}
Machine: {request.machine_name}
Periode: {request.start_date} au {request.end_date} ({request.rental_days} jours)
Total estime: {request.total_due:.2f} $ CAD (incluant depot remboursable)

Notre equipe vous contactera sous 24h pour confirmer la disponibilite et finaliser la livraison.

ForkliftPlus — +1 514 379 3414 — info@forkliftplus.com
"""

  ops_body = f"""
Nouvelle demande de location {request.reference}

Machine: {request.machine_name}
Client: {request.client_name} ({request.client_email}, {request.client_phone})
Entreprise: {request.client_company or 'N/A'}
Periode: {request.start_date} au {request.end_date}
Livraison: {request.delivery_address}, {request.delivery_city}, {request.delivery_region}
Total estime: {request.total_due:.2f} $ CAD
Operateur requis: {'Oui' if request.operator_required else 'Non'}
Assurance confirmee: {'Oui' if request.insurance_confirmed else 'Non'}
Notes: {request.notes or 'Aucune'}
"""

  for recipient, subject, body in [
    (request.client_email, f"ForkliftPlus — Demande de location {request.reference}", client_body),
    ("info@forkliftplus.com", f"[Location] {request.reference} — {request.machine_name}", ops_body),
  ]:
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = settings.smtp_from_email
    message["To"] = recipient
    message.set_content(body.strip())
    try:
      send_email_message(message)
    except HTTPException:
      pass


@router.get("/machines", response_model=list[RentalMachineOut])
def list_rental_machines(db: Session = Depends(get_db)):
  return (
    db.query(models.RentalMachine)
    .filter(models.RentalMachine.is_rentable.is_(True))
    .order_by(models.RentalMachine.category_key, models.RentalMachine.name)
    .all()
  )


@router.get("/machines/{machine_slug}", response_model=RentalMachineOut)
def get_rental_machine(machine_slug: str, db: Session = Depends(get_db)):
  machine = db.query(models.RentalMachine).filter(models.RentalMachine.slug == machine_slug).first()
  if not machine:
    raise HTTPException(status_code=404, detail="Rental machine not found")
  return machine


@router.post("/availability", response_model=AvailabilityCheckOut)
def check_availability(payload: AvailabilityCheckIn, db: Session = Depends(get_db)):
  if payload.end_date < payload.start_date:
    raise HTTPException(status_code=400, detail="End date must be on or after start date")
  if payload.start_date < date.today():
    raise HTTPException(status_code=400, detail="Start date cannot be in the past")

  machine = db.query(models.RentalMachine).filter(models.RentalMachine.slug == payload.machine_slug).first()
  if not machine:
    raise HTTPException(status_code=404, detail="Rental machine not found")
  if machine.status != "available":
    return AvailabilityCheckOut(available=False, message="Machine en maintenance")

  if _has_overlap(db, payload.machine_slug, payload.start_date, payload.end_date):
    return AvailabilityCheckOut(available=False, message="Machine deja reservee sur cette periode")

  return AvailabilityCheckOut(available=True, message="Disponible pour cette periode")


@router.post("/quote-preview")
def preview_quote(payload: RentalQuoteIn, db: Session = Depends(get_db)):
  machine = db.query(models.RentalMachine).filter(models.RentalMachine.slug == payload.machine_slug).first()
  if not machine:
    raise HTTPException(status_code=404, detail="Rental machine not found")

  pricing = calculate_pricing(
    machine,
    payload.start_date,
    payload.end_date,
    payload.delivery_required,
    payload.delivery_region,
  )
  available = not _has_overlap(db, payload.machine_slug, payload.start_date, payload.end_date)
  return {**pricing, "available": available, "machine_name": machine.name}


@router.post("/requests", response_model=RentalRequestOut, status_code=201)
def create_rental_request(payload: RentalQuoteIn, db: Session = Depends(get_db)):
  if not payload.insurance_confirmed:
    raise HTTPException(status_code=400, detail="Insurance confirmation is required")
  if payload.end_date < payload.start_date:
    raise HTTPException(status_code=400, detail="End date must be on or after start date")
  if payload.start_date < date.today():
    raise HTTPException(status_code=400, detail="Start date cannot be in the past")

  machine = db.query(models.RentalMachine).filter(models.RentalMachine.slug == payload.machine_slug).first()
  if not machine or not machine.is_rentable:
    raise HTTPException(status_code=404, detail="Rental machine not found")

  if _has_overlap(db, payload.machine_slug, payload.start_date, payload.end_date):
    raise HTTPException(status_code=409, detail="Machine unavailable for selected dates")

  pricing = calculate_pricing(
    machine,
    payload.start_date,
    payload.end_date,
    payload.delivery_required,
    payload.delivery_region,
  )

  request = models.RentalRequest(
    reference=_generate_reference(db),
    machine_slug=machine.slug,
    machine_name=machine.name,
    start_date=payload.start_date,
    end_date=payload.end_date,
    rental_days=pricing["days"],
    client_name=payload.client_name.strip(),
    client_email=payload.client_email.strip().lower(),
    client_phone=payload.client_phone.strip(),
    client_company=payload.client_company.strip(),
    delivery_address=payload.delivery_address.strip(),
    delivery_city=payload.delivery_city.strip(),
    delivery_region=payload.delivery_region.strip().upper(),
    delivery_postal=payload.delivery_postal.strip(),
    site_contact=payload.site_contact.strip(),
    site_phone=payload.site_phone.strip(),
    operator_required=payload.operator_required,
    insurance_confirmed=payload.insurance_confirmed,
    delivery_required=payload.delivery_required,
    notes=payload.notes.strip(),
    rental_cost=pricing["rental_cost"],
    delivery_fee=pricing["delivery_fee"],
    deposit=pricing["deposit"],
    taxes=pricing["taxes"],
    total_due=pricing["total_due"],
    status="pending",
  )

  db.add(request)
  db.commit()
  db.refresh(request)
  _send_rental_emails(request)
  return request


@router.get("/requests", response_model=list[RentalRequestOut])
def list_rental_requests(
  email: str | None = Query(default=None),
  status: str | None = Query(default=None),
  db: Session = Depends(get_db),
):
  query = db.query(models.RentalRequest).order_by(models.RentalRequest.created_at.desc())
  if email:
    query = query.filter(models.RentalRequest.client_email == email.strip().lower())
  if status:
    query = query.filter(models.RentalRequest.status == status)
  return query.limit(200).all()


@router.patch("/requests/{request_id}", response_model=RentalRequestOut)
def update_rental_request_status(
  request_id: int,
  payload: RentalStatusUpdateIn,
  db: Session = Depends(get_db),
):
  request = db.query(models.RentalRequest).filter(models.RentalRequest.id == request_id).first()
  if not request:
    raise HTTPException(status_code=404, detail="Rental request not found")

  if payload.status in {"approved", "active"} and _has_overlap(
    db, request.machine_slug, request.start_date, request.end_date, exclude_id=request.id
  ):
    raise HTTPException(status_code=409, detail="Cannot approve — dates conflict with another rental")

  request.status = payload.status
  if payload.admin_notes:
    request.admin_notes = payload.admin_notes.strip()
  db.commit()
  db.refresh(request)
  return request
