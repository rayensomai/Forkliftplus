from datetime import date, datetime

from pydantic import BaseModel, EmailStr, Field


class RentalMachineOut(BaseModel):
  slug: str
  name: str
  category_key: str
  category_label: str
  brand: str
  capacity_lb: int
  capacity_label: str
  terrain: str
  terrain_label: str
  work_type: str
  work_type_label: str
  image_url: str
  description: str
  daily_rate: float
  weekly_rate: float
  monthly_rate: float
  weekend_rate: float = 0
  fuel_type: str = "Electrique"
  deposit: float
  delivery_fee: float
  min_days: int
  max_days: int
  status: str

  model_config = {"from_attributes": True}


class AvailabilityCheckIn(BaseModel):
  machine_slug: str
  start_date: date
  end_date: date


class AvailabilityCheckOut(BaseModel):
  available: bool
  message: str


class RentalQuoteIn(BaseModel):
  machine_slug: str
  start_date: date
  end_date: date
  client_name: str
  client_email: EmailStr
  client_phone: str
  client_company: str = ""
  delivery_address: str
  delivery_city: str
  delivery_region: str
  delivery_postal: str = ""
  site_contact: str = ""
  site_phone: str = ""
  operator_required: bool = False
  insurance_confirmed: bool = False
  delivery_required: bool = True
  notes: str = ""


class RentalRequestOut(BaseModel):
  id: int
  reference: str
  machine_slug: str
  machine_name: str
  start_date: date
  end_date: date
  rental_days: int
  client_name: str
  client_email: str
  client_phone: str
  client_company: str
  delivery_address: str
  delivery_city: str
  delivery_region: str
  delivery_postal: str
  site_contact: str
  site_phone: str
  operator_required: bool
  insurance_confirmed: bool
  delivery_required: bool
  notes: str
  rental_cost: float
  delivery_fee: float
  deposit: float
  taxes: float
  total_due: float
  status: str
  admin_notes: str
  created_at: datetime

  model_config = {"from_attributes": True}


class RentalStatusUpdateIn(BaseModel):
  status: str = Field(pattern="^(pending|quoted|approved|active|completed|rejected|cancelled)$")
  admin_notes: str = ""
