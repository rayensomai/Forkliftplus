import { getElectricPalletProducts, ELECTRIC_PALLET_CATEGORY_KEY } from './electricPalletCatalog.js'
import {
  getForkliftAccessoryProducts,
  FORKLIFT_ACCESSORY_CATEGORY_KEY,
} from './forkliftAccessoryCatalog.js'
import { getManualPalletProducts, MANUAL_PALLET_CATEGORY_KEY } from './manualPalletCatalog.js'

export const EXCLUSIVE_CATEGORY_KEYS = [
  MANUAL_PALLET_CATEGORY_KEY,
  ELECTRIC_PALLET_CATEGORY_KEY,
  FORKLIFT_ACCESSORY_CATEGORY_KEY,
]

export function isExclusiveCategory(categoryKey) {
  return EXCLUSIVE_CATEGORY_KEYS.includes(categoryKey)
}

export function getExclusiveCatalogProducts(locale) {
  return [
    ...getManualPalletProducts(locale),
    ...getElectricPalletProducts(locale),
    ...getForkliftAccessoryProducts(locale),
  ]
}
