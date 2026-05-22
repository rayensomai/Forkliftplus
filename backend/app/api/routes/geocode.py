from fastapi import APIRouter, HTTPException, Query
import httpx

router = APIRouter()


@router.get("/")
async def geocode_address(address: str = Query(..., min_length=3)):
  url = "https://nominatim.openstreetmap.org/search"
  params = {
    "q": address,
    "format": "json",
    "limit": 1,
  }
  headers = {
    "User-Agent": "ForkliftPlus/1.0"
  }

  async with httpx.AsyncClient(timeout=10) as client:
    response = await client.get(url, params=params, headers=headers)

  if response.status_code != 200:
    raise HTTPException(status_code=502, detail="Geocoding failed")

  data = response.json()
  if not data:
    raise HTTPException(status_code=404, detail="Address not found")

  result = data[0]
  return {
    "lat": float(result["lat"]),
    "lng": float(result["lon"]),
    "display": result.get("display_name", "")
  }
