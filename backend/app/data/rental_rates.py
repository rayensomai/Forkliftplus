"""Official Forklift Plus Montreal rental rates (CAD, before tax).

Source: https://www.forkliftplus.com/location-de-chariots-elevateurs-montreal/
4 weeks = 28 days. Delivery/pickup extra.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class RentalRates:
  daily: float
  weekly: float
  four_weeks: float
  weekend: float


FORKLIFT_CAPACITY_TIERS: list[tuple[int, RentalRates]] = [
  (3000, RentalRates(199, 449, 1379, 275)),
  (4000, RentalRates(199, 449, 1379, 275)),
  (4500, RentalRates(199, 449, 1379, 275)),
  (5000, RentalRates(245, 499, 1495, 325)),
  (6000, RentalRates(245, 499, 1495, 325)),
  (7000, RentalRates(285, 599, 1895, 325)),
  (8000, RentalRates(375, 845, 2535, 525)),
  (10000, RentalRates(375, 845, 2535, 525)),
  (12000, RentalRates(425, 985, 2955, 675)),
  (13000, RentalRates(425, 985, 2955, 675)),
  (15000, RentalRates(425, 1385, 3955, 675)),
  (20000, RentalRates(685, 1585, 4755, 895)),
  (25000, RentalRates(685, 1585, 4755, 895)),
  (30000, RentalRates(950, 3350, 9875, 1385)),
  (33000, RentalRates(950, 3350, 9875, 1385)),
]

SCISSOR_RATES = RentalRates(99, 399, 695, 135)
BOOM_RATES = RentalRates(329, 985, 2685, 485)

TERRAIN_LABELS = {
  "indoor": "Interieur",
  "outdoor": "Exterieur",
  "rough": "Terrain accidente",
  "mixed": "Mixte",
}

WORK_TYPE_LABELS = {
  "loading": "Chargement",
  "stacking": "Empilage",
  "height": "Hauteur",
  "handling": "Manutention",
}

FUEL_BY_CATEGORY = {
  "forklift-propane": "Propane",
  "lift-diesel": "Diesel",
  "forklift-electric-3": "Electrique",
  "forklift-electric-4": "Electrique",
  "sciso-lift": "Electrique",
}


def _rate_type(category_key: str, capacity_lb: int, name: str) -> str:
  lowered = name.lower()
  if category_key == "sciso-lift":
    return "scissor"
  if "telescopique" in lowered or "télescopique" in lowered or "boom" in lowered or "za45j" in lowered:
    return "boom"
  if capacity_lb < 500:
    return "scissor"
  return "forklift"


def rates_for_machine(category_key: str, capacity_lb: int, name: str = "") -> RentalRates:
  kind = _rate_type(category_key, capacity_lb, name)
  if kind == "scissor":
    return SCISSOR_RATES
  if kind == "boom":
    return BOOM_RATES
  for tier, rates in FORKLIFT_CAPACITY_TIERS:
    if capacity_lb <= tier:
      return rates
  return FORKLIFT_CAPACITY_TIERS[-1][1]


def deposit_for_capacity(capacity_lb: int) -> float:
  if capacity_lb >= 15000:
    return 8000
  if capacity_lb >= 10000:
    return 6000
  if capacity_lb >= 8000:
    return 5000
  if capacity_lb >= 5000:
    return 3500
  if capacity_lb >= 3000:
    return 2500
  return 1500


def delivery_fee_for_capacity(capacity_lb: int) -> float:
  if capacity_lb >= 10000:
    return 350
  if capacity_lb >= 5000:
    return 250
  if capacity_lb < 500:
    return 150
  return 200


def format_capacity_label(capacity_lb: int) -> str:
  if capacity_lb < 500:
    return f"{capacity_lb} lb plateforme"
  formatted = f"{capacity_lb:,}".replace(",", " ")
  return f"{formatted} lb"
