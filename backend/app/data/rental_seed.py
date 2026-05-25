import json
from pathlib import Path

from app.data.rental_rates import (
  FUEL_BY_CATEGORY,
  TERRAIN_LABELS,
  WORK_TYPE_LABELS,
  delivery_fee_for_capacity,
  deposit_for_capacity,
  format_capacity_label,
  rates_for_machine,
)

_SOURCE_PATH = Path(__file__).with_name("rental_catalog_source.json")


def _load_catalog_source() -> list[dict]:
  return json.loads(_SOURCE_PATH.read_text(encoding="utf-8"))


def build_rental_machine_seed() -> list[dict]:
  items: list[dict] = []
  for row in _load_catalog_source():
    rates = rates_for_machine(row["category_key"], row["capacity_lb"], row["name"])
    capacity_lb = row["capacity_lb"]
    items.append(
      {
        "slug": row["slug"],
        "name": row["name"],
        "category_key": row["category_key"],
        "category_label": row["category_label"],
        "brand": row["brand"],
        "capacity_lb": capacity_lb,
        "capacity_label": format_capacity_label(capacity_lb),
        "terrain": row.get("terrain") or "mixed",
        "terrain_label": TERRAIN_LABELS.get(row.get("terrain") or "mixed", "Mixte"),
        "work_type": row.get("work_type") or "loading",
        "work_type_label": WORK_TYPE_LABELS.get(row.get("work_type") or "loading", "Chargement"),
        "image_url": row["image_url"],
        "description": row.get("description") or "",
        "daily_rate": rates.daily,
        "weekly_rate": rates.weekly,
        "monthly_rate": rates.four_weeks,
        "weekend_rate": rates.weekend,
        "fuel_type": FUEL_BY_CATEGORY.get(row["category_key"], "Electrique"),
        "deposit": deposit_for_capacity(capacity_lb),
        "delivery_fee": delivery_fee_for_capacity(capacity_lb),
        "min_days": 1,
        "max_days": 365,
        "status": "available",
        "is_rentable": True,
      }
    )
  return items


RENTAL_MACHINE_SEED = build_rental_machine_seed()
RENTAL_MACHINE_SLUGS = {item["slug"] for item in RENTAL_MACHINE_SEED}
