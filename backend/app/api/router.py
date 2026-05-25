from fastapi import APIRouter

from app.api.routes import companies, dev_mail, geocode, health, rentals

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
api_router.include_router(dev_mail.router, prefix="/dev", tags=["dev"])
api_router.include_router(rentals.router, prefix="/rentals", tags=["rentals"])
