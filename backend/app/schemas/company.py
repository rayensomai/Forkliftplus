from pydantic import BaseModel, ConfigDict


class CompanyIn(BaseModel):
  name: str
  email: str
  address: str
  city: str
  region: str
  focus: str
  lat: float
  lng: float


class CompanyOut(BaseModel):
  id: int
  name: str
  email: str
  address: str
  city: str
  region: str
  focus: str
  lat: float
  lng: float

  model_config = ConfigDict(from_attributes=True)


class CollaborationEmailIn(BaseModel):
  subject: str
  message: str
  recipient_email: str | None = None
  reply_to_email: str | None = None
