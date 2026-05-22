/** Images officielles — https://www.forkliftplus.com/ */
const BASE = 'https://www.forkliftplus.com/wp-content/uploads'

export const FORKLIFTPLUS_IMAGES = {
  propane: `${BASE}/2020/01/propane-png.png`,
  electric: `${BASE}/2020/01/Eelectric-Forklift.png`,
  diesel: `${BASE}/2020/01/Diesel-Forklift.png`,
  electricPalletHome: `${BASE}/2024/06/electric-pallte-truck-home-1.jpg`,
  manualPalletHome: `${BASE}/2024/06/HAND-pallte-truck-home-2-1.jpg`,
  accessories: `${BASE}/2020/12/forklift-accessories-dark_a50df82e4e1563d904bf7b2af787fbdf-min.jpg`,
  parts: `${BASE}/2020/12/PARTS_19dd22107c223e628f699144e5f016ab-min.jpg`,
  battery: `${BASE}/2024/06/Battery2-1.jpg`,
  liftTable: `${BASE}/2020/12/HYDRAULIC-LIFT-TABLE-TRUCK-1_46e694fd2eecd1e11bbe2e9f274d4073-min.jpg`,
  straddle: `${BASE}/2020/12/straddle-min.jpg`,
  skyjack: `${BASE}/2024/10/Skyjack-3219.jpg`,
  skyjackAlt: `${BASE}/2023/11/Skyjack-3219-1-1.jpg`,
  catPropane: `${BASE}/2023/05/Cat-2P5000.jpg`,
  catPropane2: `${BASE}/2023/05/Cat-2P5000-1.jpg`,
  catElectric: `${BASE}/2021/02/Cat-2EP5000.jpg`,
  catElectric3w: `${BASE}/2023/06/Cat-2ETC3000.jpg`,
  lithiumPallet: `${BASE}/2024/03/Lithium-Pallet-Truck-ELF-EPT33H.jpg`,
  raymondPallet: `${BASE}/2019/04/Raymond-102T-F45L.jpg`,
  handPallet: `${BASE}/2018/01/Hand-pallet-truck-21-x-72-1.jpg`,
  rental: `${BASE}/2018/01/Forklift-rental-Montreal.jpg`,
  hero: `${BASE}/2020/05/forkliftplus-5121.jpg`,
  logo: `${BASE}/2020/06/forklift-250.png`,
}

/** Image principale par catégorie (page d’accueil forkliftplus.com) */
export const CATEGORY_IMAGES = {
  'forklift-propane': FORKLIFTPLUS_IMAGES.propane,
  'forklift-electric-4': FORKLIFTPLUS_IMAGES.electric,
  'forklift-electric-3': FORKLIFTPLUS_IMAGES.catElectric3w,
  'lift-diesel': FORKLIFTPLUS_IMAGES.diesel,
  'sciso-lift': FORKLIFTPLUS_IMAGES.skyjack,
  'electric-transpalette': FORKLIFTPLUS_IMAGES.electricPalletHome,
  'manual-transpallette': FORKLIFTPLUS_IMAGES.manualPalletHome,
  accesoire: FORKLIFTPLUS_IMAGES.accessories,
}

/** Variantes pour le catalogue (photos produits du site) */
export const CATEGORY_IMAGE_POOLS = {
  'forklift-propane': [
    FORKLIFTPLUS_IMAGES.propane,
    FORKLIFTPLUS_IMAGES.catPropane,
    FORKLIFTPLUS_IMAGES.catPropane2,
    FORKLIFTPLUS_IMAGES.rental,
  ],
  'forklift-electric-4': [
    FORKLIFTPLUS_IMAGES.electric,
    FORKLIFTPLUS_IMAGES.catElectric,
    FORKLIFTPLUS_IMAGES.catElectric3w,
  ],
  'forklift-electric-3': [
    FORKLIFTPLUS_IMAGES.catElectric3w,
    FORKLIFTPLUS_IMAGES.electric,
    FORKLIFTPLUS_IMAGES.straddle,
  ],
  'lift-diesel': [FORKLIFTPLUS_IMAGES.diesel, FORKLIFTPLUS_IMAGES.rental],
  'sciso-lift': [
    FORKLIFTPLUS_IMAGES.skyjack,
    FORKLIFTPLUS_IMAGES.skyjackAlt,
    FORKLIFTPLUS_IMAGES.liftTable,
  ],
  'electric-transpalette': [
    FORKLIFTPLUS_IMAGES.electricPalletHome,
    FORKLIFTPLUS_IMAGES.lithiumPallet,
    FORKLIFTPLUS_IMAGES.raymondPallet,
  ],
  'manual-transpallette': [
    FORKLIFTPLUS_IMAGES.manualPalletHome,
    FORKLIFTPLUS_IMAGES.handPallet,
  ],
  accesoire: [
    FORKLIFTPLUS_IMAGES.accessories,
    FORKLIFTPLUS_IMAGES.parts,
    FORKLIFTPLUS_IMAGES.battery,
  ],
}

export function getCategoryImageUrl(categoryKey) {
  return CATEGORY_IMAGES[categoryKey] ?? FORKLIFTPLUS_IMAGES.propane
}

export function getProductImageUrl(seed, categoryKey, fallback) {
  const pool = CATEGORY_IMAGE_POOLS[categoryKey]
  if (pool?.length) return pool[seed % pool.length]
  return fallback ?? getCategoryImageUrl(categoryKey)
}
