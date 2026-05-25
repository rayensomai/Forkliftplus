/** Catalogue exclusif — https://www.forkliftplus.com/product-category/chariot-elevateur/chariot-elevateur-propane/ */

import { formatCapacity, parseCapacityFromTitle, parsePrice } from './catalogShared.js'

export const PROPANE_LIFT_CATEGORY_KEY = 'forklift-propane'

const RAW_ITEMS = [
  {
    title: 'Chariot élévateur Hyster S60FT 6000 Lbs Propane',
    price: '15900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2022/11/Hyster-S60FT-7.jpg',
    link: 'https://www.forkliftplus.com/product/hyster-s60ft/',
    brand: 'Hyster',
    model: 'S60FT',
    capacityLb: 6000,
    power: 'Propane',
    condition: 'rebuilt',
    options: 'Pneus pneumatiques, déplacement latéral, fourches 42 ou 48 po',
  },
  {
    title: 'Chariot élévateur Toyota 8FGCU30 Propane 6000 lbs',
    price: '23900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2026/04/Toyota-8FGCU30.jpg',
    link: 'https://www.forkliftplus.com/product/toyota-8fgcu30/',
    brand: 'Toyota',
    model: '8FGCU30',
    capacityLb: 6000,
    power: 'Propane',
    condition: 'rebuilt',
    options: 'Pneus pneumatiques extérieurs, déplacement latéral, fourches 42 ou 48 po',
  },
  {
    title: 'Chariot élévateur ELF FL30T avec cabine 6600 Lbs',
    price: '34900.00',
    regularPrice: '42500.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/11/ELF-FL30T-NJX2-03.jpg',
    link: 'https://www.forkliftplus.com/product/elf-fl30t-avec-cabine/',
    brand: 'ELF',
    model: 'FL30T-NJX2',
    capacityLb: 6600,
    year: 2024,
    power: 'Propane',
    condition: 'new',
    sale: true,
    options: 'Pneus pneumatiques extérieurs, cabine, déplacement latéral, chauffage de cabine',
  },
  {
    title: 'Chariot élévateur ELF FL25T-NJX2 propane 5500 lbs',
    price: '31579.00',
    regularPrice: '34900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/10/ELF-50-01-1.jpg',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-elf-fl25t-njx2/',
    brand: 'ELF',
    model: 'FL25T-NJX2',
    capacityLb: 5500,
    year: 2024,
    power: 'Propane',
    condition: 'new',
    sale: true,
    options: 'Pneus pneumatiques extérieurs, déplacement latéral, fourches 42 ou 48 po',
  },
  {
    title: 'Chariot élévateur ELF FL35T avec cabine 7700 Lbs',
    price: '35849.00',
    regularPrice: '39800.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/10/ELF-70-00.jpg',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-elf-70/',
    brand: 'ELF',
    model: 'FL35T-NJX2',
    capacityLb: 7700,
    year: 2024,
    power: 'Propane',
    condition: 'new',
    sale: true,
    options: 'Pneus pneumatiques extérieurs, cabine, déplacement latéral avec positionneur de fourches',
  },
  {
    title: 'Chariot élévateur Propane Clark C50SL avec cabine 10000 Lbs',
    price: '44900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/10/Clark-C50SL.jpg',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-clark-c50sl/',
    brand: 'Clark',
    model: 'C50SL',
    capacityLb: 10000,
    power: 'Propane',
    condition: 'rebuilt',
    options: 'Pneus pneumatiques extérieurs, cabine, déplacement latéral, climatisation/chauffage',
  },
  {
    title: 'Chariot élévateur Propane Mitsubishi FG20CN',
    price: '18900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/06/Mitsubishi-FG20CN.jpg',
    link: 'https://www.forkliftplus.com/product/mitsubishi-fg20cn/',
    brand: 'Mitsubishi',
    model: 'FG20CN',
    capacityLb: 4000,
    power: 'Propane',
    condition: 'rebuilt',
    options: 'Pneus cushion intérieur/extérieur, déplacement latéral',
  },
  {
    title: 'Chariot élévateur Caterpillar 2c5000 Mât court Propane',
    price: '8900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/04/2C5000-02.jpg',
    link: 'https://www.forkliftplus.com/product/2c5000-propane-tout-neuf/',
    brand: 'Caterpillar',
    model: '2C5000',
    capacityLb: 5000,
    power: 'Propane',
    condition: 'rebuilt',
    options: 'Mât court, pneus pneumatiques, idéal cour et entrepôt',
  },
  {
    title: 'Chariot élévateur Toyota Propane 8FGCU18 | 3500 lb',
    price: '14900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/10/TOYOTA-8FGCU18-01.jpg',
    link: 'https://www.forkliftplus.com/product/toyota-propane-8fgcu18/',
    brand: 'Toyota',
    model: '8FGCU18',
    capacityLb: 3500,
    power: 'Propane',
    condition: 'rebuilt',
    options: 'Compact, pneus cushion, déplacement latéral',
  },
  {
    title: 'Chariot Élévateur LiuGong CLG2025G Extérieur – 5000 lb',
    price: '34950.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/09/CLG2025G-01.jpg',
    link: 'https://www.forkliftplus.com/product/liugong-clg2025g/',
    brand: 'LiuGong',
    model: 'CLG2025G',
    capacityLb: 5000,
    year: 2024,
    power: 'Propane',
    condition: 'new',
    options: 'Classe V extérieur, pneus pneumatiques, cabine disponible',
  },
  {
    title: 'Chariot élévateur LiuGong CLG2025-C – Propane 5000 lbs',
    price: '33950.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/09/CLG2025-C.jpg',
    link: 'https://www.forkliftplus.com/product/liugong-clg2025-c/',
    brand: 'LiuGong',
    model: 'CLG2025-C',
    capacityLb: 5000,
    year: 2024,
    power: 'Propane',
    condition: 'new',
    options: 'Classe IV propane, pneus cushion, usage intérieur/extérieur',
  },
  {
    title: 'Chariot élévateur Propane LiuGong CLG2030G : 6000 lb',
    price: '35850.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/09/CLG2030G-2.jpg',
    link: 'https://www.forkliftplus.com/product/liugong-clg2030g/',
    brand: 'LiuGong',
    model: 'CLG2030G',
    capacityLb: 6000,
    year: 2024,
    power: 'Propane',
    condition: 'new',
    options: 'Classe V extérieur, pneus pneumatiques, haute capacité',
  },
  {
    title: 'Chariot élévateur S40FT propane 4000 Lbs Hyster',
    price: '14900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/05/Hyster-S40FT-01.jpg',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-s40ft/',
    brand: 'Hyster',
    model: 'S40FT',
    capacityLb: 4000,
    power: 'Propane',
    condition: 'rebuilt',
    options: 'Pneus pneumatiques, déplacement latéral, fourches 42 po',
  },
  {
    title: 'Chariot élévateur Caterpillar GC55K 12000 Lbs avec cabine',
    price: '49400.00',
    regularPrice: '59500.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2022/09/Cat-GC55K-new-1.jpg',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-caterpillar-gc55k/',
    brand: 'Caterpillar',
    model: 'GC55K',
    capacityLb: 12000,
    power: 'Propane',
    condition: 'rebuilt',
    sale: true,
    options: 'Pneus pneumatiques extérieurs, cabine, déplacement latéral, haute capacité',
  },
  {
    title: 'Chariot élévateur Yale GLP050V pneumatique 5000 lb',
    price: '22900.00',
    regularPrice: '26500.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/03/Yale-GPL060-1.jpg',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-yale-glp060v/',
    brand: 'Yale',
    model: 'GLP050V',
    capacityLb: 5000,
    power: 'Propane',
    condition: 'rebuilt',
    sale: true,
    options: 'Pneus pneumatiques extérieurs, déplacement latéral, remis à neuf',
  },
  {
    title: 'Chariot élévateur Caterpillar GP30N propane 6000 lbs',
    price: '28900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/09/Cat-GP30N-1.jpg',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-cat-gp30n/',
    brand: 'Caterpillar',
    model: 'GP30N',
    capacityLb: 6000,
    power: 'Propane',
    condition: 'rebuilt',
    options: 'Pneus pneumatiques, déplacement latéral, usage extérieur',
  },
  {
    title: 'Chariot élévateur Caterpillar 2P5000 propane 5000 lbs',
    price: '24900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/05/Cat-2P5000-2.jpg',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-cat-2p5000/',
    brand: 'Caterpillar',
    model: '2P5000',
    capacityLb: 5000,
    power: 'Propane',
    condition: 'rebuilt',
    options: 'Pneus pneumatiques, mât duplex, déplacement latéral',
  },
  {
    title: 'Chariot élévateur Hyster H100XM 10000 Lbs avec cabine',
    price: '64900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/08/Hyster-H100XM-01.jpg',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-hyster-h100xm/',
    brand: 'Hyster',
    model: 'H100XM',
    capacityLb: 10000,
    power: 'Propane',
    condition: 'rebuilt',
    options: 'Pneus pneumatiques extérieurs, cabine, déplacement latéral, climatisation',
  },
  {
    title: 'Chariot élévateur Propane 8000 lbs Unicarriers MCUG1F2F36LV',
    price: '27500.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2021/08/NissanUnicarriers-MCUG1F2F36LV-01.jpg',
    link: 'https://www.forkliftplus.com/product/unicarriers-mcug1f2f36lv/',
    brand: 'Unicarriers',
    model: 'MCUG1F2F36LV',
    capacityLb: 8000,
    power: 'Propane',
    condition: 'rebuilt',
    options: 'Pneus pneumatiques extérieurs, déplacement latéral, fourches 48 po',
  },
]

const EN_TITLES = {
  'Chariot élévateur Hyster S60FT 6000 Lbs Propane': 'Hyster S60FT propane forklift 6,000 lb',
  'Chariot élévateur Toyota 8FGCU30 Propane 6000 lbs': 'Toyota 8FGCU30 propane forklift 6,000 lb',
  'Chariot élévateur ELF FL30T avec cabine 6600 Lbs': 'ELF FL30T propane forklift with cabin 6,600 lb',
  'Chariot élévateur ELF FL25T-NJX2 propane 5500 lbs': 'ELF FL25T-NJX2 propane forklift 5,500 lb',
  'Chariot élévateur ELF FL35T avec cabine 7700 Lbs': 'ELF FL35T propane forklift with cabin 7,700 lb',
  'Chariot élévateur Propane Clark C50SL avec cabine 10000 Lbs':
    'Clark C50SL propane forklift with cabin 10,000 lb',
  'Chariot élévateur Propane Mitsubishi FG20CN': 'Mitsubishi FG20CN propane forklift',
  'Chariot élévateur Caterpillar 2c5000 Mât court Propane':
    'Caterpillar 2C5000 short-mast propane forklift',
  'Chariot élévateur Toyota Propane 8FGCU18 | 3500 lb': 'Toyota 8FGCU18 propane forklift 3,500 lb',
  'Chariot Élévateur LiuGong CLG2025G Extérieur – 5000 lb':
    'LiuGong CLG2025G outdoor propane forklift 5,000 lb',
  'Chariot élévateur LiuGong CLG2025-C – Propane 5000 lbs':
    'LiuGong CLG2025-C propane forklift 5,000 lb',
  'Chariot élévateur Propane LiuGong CLG2030G : 6000 lb':
    'LiuGong CLG2030G propane forklift 6,000 lb',
  'Chariot élévateur S40FT propane 4000 Lbs Hyster': 'Hyster S40FT propane forklift 4,000 lb',
  'Chariot élévateur Caterpillar GC55K 12000 Lbs avec cabine':
    'Caterpillar GC55K propane forklift with cabin 12,000 lb',
  'Chariot élévateur Yale GLP050V pneumatique 5000 lb': 'Yale GLP050V pneumatic propane forklift 5,000 lb',
  'Chariot élévateur Caterpillar GP30N propane 6000 lbs': 'Caterpillar GP30N propane forklift 6,000 lb',
  'Chariot élévateur Caterpillar 2P5000 propane 5000 lbs': 'Caterpillar 2P5000 propane forklift 5,000 lb',
  'Chariot élévateur Hyster H100XM 10000 Lbs avec cabine':
    'Hyster H100XM propane forklift with cabin 10,000 lb',
  'Chariot élévateur Propane 8000 lbs Unicarriers MCUG1F2F36LV':
    'Unicarriers MCUG1F2F36LV propane forklift 8,000 lb',
}

const EN_OPTIONS = {
  'Pneus pneumatiques, déplacement latéral, fourches 42 ou 48 po':
    'Pneumatic tires, sideshift, 42 or 48 in forks',
  'Pneus pneumatiques extérieurs, déplacement latéral, fourches 42 ou 48 po':
    'Outdoor pneumatic tires, sideshift, 42 or 48 in forks',
  'Pneus pneumatiques extérieurs, cabine, déplacement latéral, chauffage de cabine':
    'Outdoor pneumatic tires, cabin, sideshift, cabin heater',
  'Pneus pneumatiques extérieurs, déplacement latéral avec positionneur de fourches':
    'Outdoor pneumatic tires, sideshift with fork positioner',
  'Pneus pneumatiques extérieurs, cabine, déplacement latéral, climatisation/chauffage':
    'Outdoor pneumatic tires, cabin, sideshift, heating/cooling system',
  'Pneus cushion intérieur/extérieur, déplacement latéral': 'Cushion tires indoor/outdoor, sideshift',
  'Mât court, pneus pneumatiques, idéal cour et entrepôt':
    'Short mast, pneumatic tires, ideal for yard and warehouse',
  'Compact, pneus cushion, déplacement latéral': 'Compact, cushion tires, sideshift',
  'Classe V extérieur, pneus pneumatiques, cabine disponible':
    'Class V outdoor, pneumatic tires, cabin available',
  'Classe IV propane, pneus cushion, usage intérieur/extérieur':
    'Class IV propane, cushion tires, indoor/outdoor use',
  'Classe V extérieur, pneus pneumatiques, haute capacité':
    'Class V outdoor, pneumatic tires, high capacity',
  'Pneus pneumatiques, déplacement latéral, fourches 42 po':
    'Pneumatic tires, sideshift, 42 in forks',
  'Pneus pneumatiques extérieurs, cabine, déplacement latéral, haute capacité':
    'Outdoor pneumatic tires, cabin, sideshift, high capacity',
  'Pneus pneumatiques extérieurs, déplacement latéral, remis à neuf':
    'Outdoor pneumatic tires, sideshift, refurbished',
  'Pneus pneumatiques, déplacement latéral, usage extérieur':
    'Pneumatic tires, sideshift, outdoor use',
  'Pneus pneumatiques, mât duplex, déplacement latéral':
    'Pneumatic tires, duplex mast, sideshift',
  'Pneus pneumatiques extérieurs, cabine, déplacement latéral, climatisation':
    'Outdoor pneumatic tires, cabin, sideshift, air conditioning',
  'Pneus pneumatiques extérieurs, déplacement latéral, fourches 48 po':
    'Outdoor pneumatic tires, sideshift, 48 in forks',
}

function buildDescription(item, locale) {
  const isFr = locale === 'fr-CA'
  const options = isFr ? item.options : EN_OPTIONS[item.options] ?? item.options
  const capacity = formatCapacity(item.capacityLb ?? parseCapacityFromTitle(item.title), locale)

  const conditionLabel =
    item.condition === 'rebuilt'
      ? isFr
        ? 'Reconditionné en excellent état'
        : 'Refurbished in excellent condition'
      : isFr
        ? `Neuf ${item.year ?? ''}`.trim()
        : `New ${item.year ?? ''}`.trim()

  return isFr
    ? `Chariot élévateur propane ${item.brand} ${item.model} — ${capacity}, ${conditionLabel}. ${options}.`
    : `${item.brand} ${item.model} propane forklift — ${capacity}, ${conditionLabel}. ${options}.`
}

function toProduct(item, locale) {
  const isFr = locale === 'fr-CA'
  const name = isFr ? item.title : EN_TITLES[item.title] ?? item.title
  const capacity = item.capacityLb ?? parseCapacityFromTitle(item.title)

  return {
    id: item.link,
    categoryKey: PROPANE_LIFT_CATEGORY_KEY,
    categoryLabel: isFr ? 'Chariot propane' : 'Propane forklift',
    name,
    status: isFr ? 'Disponible' : 'Available',
    brand: item.brand,
    condition:
      item.condition === 'rebuilt'
        ? isFr
          ? 'Reconditionné'
          : 'Refurbished'
        : isFr
          ? 'Neuf'
          : 'New',
    location: 'Montreal, QC',
    price: parsePrice(item.price),
    capacity,
    capacityLabel: formatCapacity(capacity, locale),
    terrain: 'mixed',
    terrainLabel: isFr ? 'Mixte' : 'Mixed',
    workType: 'loading',
    workTypeLabel: isFr ? 'Chargement' : 'Loading',
    description: buildDescription(item, locale),
    image: item.img,
    productUrl: item.link,
    onSale: Boolean(item.sale),
    regularPrice: item.regularPrice ? parsePrice(item.regularPrice) : undefined,
    model: item.model,
    powerLabel: item.power,
  }
}

export function getPropaneLiftProducts(locale = 'fr-CA') {
  return RAW_ITEMS.map((item) => toProduct(item, locale))
}
