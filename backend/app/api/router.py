from fastapi import APIRouter

from app.api.routes import companies, geocode, health

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
api_router.include_router(geocode.router, prefix="/geocode", tags=["geocode"])
