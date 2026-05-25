import { getDieselLiftProducts, DIESEL_LIFT_CATEGORY_KEY } from './dieselLiftCatalog.js'
import {
  getElectricLiftProducts,
  ELECTRIC_LIFT_3_CATEGORY_KEY,
  ELECTRIC_LIFT_4_CATEGORY_KEY,
} from './electricLiftCatalog.js'
import { getPropaneLiftProducts, PROPANE_LIFT_CATEGORY_KEY } from './propaneLiftCatalog.js'
import { getElectricPalletProducts, ELECTRIC_PALLET_CATEGORY_KEY } from './electricPalletCatalog.js'
import {
  getForkliftAccessoryProducts,
  FORKLIFT_ACCESSORY_CATEGORY_KEY,
} from './forkliftAccessoryCatalog.js'
import { getManualPalletProducts, MANUAL_PALLET_CATEGORY_KEY } from './manualPalletCatalog.js'
import { getScisoLiftProducts, SCISO_LIFT_CATEGORY_KEY } from './scisoLiftCatalog.js'

export const EXCLUSIVE_CATEGORY_KEYS = [
  MANUAL_PALLET_CATEGORY_KEY,
  ELECTRIC_PALLET_CATEGORY_KEY,
  FORKLIFT_ACCESSORY_CATEGORY_KEY,
  PROPANE_LIFT_CATEGORY_KEY,
  ELECTRIC_LIFT_3_CATEGORY_KEY,
  ELECTRIC_LIFT_4_CATEGORY_KEY,
  SCISO_LIFT_CATEGORY_KEY,
  DIESEL_LIFT_CATEGORY_KEY,
]

export function isExclusiveCategory(categoryKey) {
  return EXCLUSIVE_CATEGORY_KEYS.includes(categoryKey)
}

export function getExclusiveCatalogProducts(locale) {
  return [
    ...getManualPalletProducts(locale),
    ...getElectricPalletProducts(locale),
    ...getForkliftAccessoryProducts(locale),
    ...getPropaneLiftProducts(locale),
    ...getElectricLiftProducts(locale),
    ...getScisoLiftProducts(locale),
    ...getDieselLiftProducts(locale),
  ]
}
