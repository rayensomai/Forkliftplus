from fastapi import APIRouter, HTTPException, Query
import httpx

router = APIRouter()

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
HEADERS = {"User-Agent": "ForkliftPlus/1.0 (contact@forkliftplus.com)"}


def _normalize_street(address: str) -> str:
  cleaned = " ".join(address.replace(",", " ").split())
  return cleaned.strip()


def _build_queries(address: str, city: str | None, region: str | None, postal_code: str | None, country: str):
  street = _normalize_street(address)
  city_val = (city or "").strip()
  region_val = (region or "").strip()
  postal_val = (postal_code or "").strip().upper()
  country_val = (country or "Canada").strip()

  queries = []
  if street and city_val and postal_val:
    queries.append(f"{street}, {city_val}, {region_val} {postal_val}, {country_val}")
  if street and postal_val:
    queries.append(f"{street}, {postal_val}, {country_val}")
  if street and city_val and region_val:
    queries.append(f"{street}, {city_val}, {region_val}, {country_val}")
  if street and city_val:
    queries.append(f"{street}, {city_val}, {country_val}")
  if postal_val and city_val:
    queries.append(f"{postal_val}, {city_val}, {region_val}, {country_val}")
  queries.append(f"{street}, {country_val}")
  queries.append(street)

  seen = set()
  unique = []
  for query in queries:
    if query and query not in seen:
      seen.add(query)
      unique.append(query)
  return unique


async def _search_nominatim(params: dict) -> list:
  async with httpx.AsyncClient(timeout=12) as client:
    response = await client.get(NOMINATIM_URL, params=params, headers=HEADERS)

  if response.status_code != 200:
    raise HTTPException(status_code=502, detail="Geocoding failed")

  return response.json()


async def _try_structured(street: str, city: str | None, region: str | None, postal_code: str | None, country: str):
  params = {
    "street": street,
    "format": "json",
    "limit": 1,
    "country": country or "Canada",
  }
  if city:
    params["city"] = city.strip()
  if region:
    params["state"] = region.strip()
  if postal_code:
    params["postalcode"] = postal_code.strip().upper()

  data = await _search_nominatim(params)
  return data[0] if data else None


async def _try_freeform(query: str):
  data = await _search_nominatim(
    {
      "q": query,
      "format": "json",
      "limit": 1,
      "countrycodes": "ca",
    }
  )
  return data[0] if data else None


@router.get("/")
async def geocode_address(
  address: str = Query(..., min_length=3),
  city: str | None = Query(default=None),
  region: str | None = Query(default=None),
  postal_code: str | None = Query(default=None),
  country: str = Query(default="Canada"),
):
  street = _normalize_street(address)
  if len(street) < 3:
    raise HTTPException(status_code=400, detail="Address too short")

  result = await _try_structured(street, city, region, postal_code, country)
  if not result:
    for query in _build_queries(street, city, region, postal_code, country):
      result = await _try_freeform(query)
      if result:
        break

  if not result:
    raise HTTPException(status_code=404, detail="Address not found")

  return {
    "lat": float(result["lat"]),
    "lng": float(result["lon"]),
    "display": result.get("display_name", ""),
  }
