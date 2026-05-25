/** Catalogue exclusif — https://www.forkliftplus.com/product-category/chariot-elevateur/chariot-elevateur-diesel/ */

import { formatCapacity, parseCapacityFromTitle, parsePrice } from './catalogShared.js'

export const DIESEL_LIFT_CATEGORY_KEY = 'lift-diesel'

const RAW_ITEMS = [
  {
    title: 'Chariot élévateur Diesel ELF FD25T avec cabine 5500 Lbs',
    price: '41950.00',
    regularPrice: '42500.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/12/ELF-FD25T-NJM3-9.jpg',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-diesel-elf-fd25t/',
    type: 'elf-forklift',
    brand: 'ELF',
    model: 'FD25T-NJM3',
    capacityLb: 5500,
    liftHeightIn: 189,
    year: 2024,
    power: 'Diesel',
    condition: 'new',
    sale: true,
    options: 'Pneus pneumatiques extérieurs, cabine, déplacement latéral, chauffage de cabine, fourches 42 ou 48 po',
  },
  {
    title: 'Chariot élévateur Diesel ELF FD30T avec cabine 6600 Lbs',
    price: '46250.00',
    regularPrice: '49500.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/12/ELF-FD30T-NJM3-9.jpg',
    link: 'https://www.forkliftplus.com/product/diesel-elf-fd30t/',
    type: 'elf-forklift',
    brand: 'ELF',
    model: 'FD30T-NJM3',
    capacityLb: 6600,
    liftHeightIn: 189,
    year: 2024,
    power: 'Diesel',
    condition: 'new',
    sale: true,
    options:
      'Pneus pneumatiques extérieurs, cabine, déplacement latéral avec positionneur de fourches, chauffage de cabine, fourches 42 ou 48 po',
  },
  {
    title: 'Zoomlion ZA45J Nacelle Télescopique, Hauteur 51 pi 10 po',
    price: '82900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/10/Zoomlion-ZA45J-Boom-Lift.jpg',
    link: 'https://www.forkliftplus.com/product/za45j-nacelle-telescopique/',
    type: 'boom-lift',
    brand: 'Zoomlion',
    model: 'ZA45J',
    capacityLb: 660,
    liftHeightFt: 52,
    year: 2025,
    power: 'Diesel',
    condition: 'new',
    options: 'Nacelle télescopique diesel, 51 pi 10 po de hauteur de travail, portée horizontale 27 pi 3 po',
  },
  {
    title: 'Chariot élévateur Hyster H100FT 10000 Lbs avec cabine',
    price: '69500.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/02/Hyster-H100FT-1.jpg',
    link: 'https://www.forkliftplus.com/product/hyster-h100ft-10000-lbs/',
    type: 'hyster-forklift',
    brand: 'Hyster',
    model: 'H100FT',
    capacityLb: 10000,
    liftHeightIn: 175,
    year: 2016,
    power: 'Diesel',
    condition: 'rebuilt',
    options: 'Pneus solides extérieurs, cabine, déplacement latéral, climatisation/chauffage, fourches 42 ou 48 po',
  },
]

const EN_TITLES = {
  'Chariot élévateur Diesel ELF FD25T avec cabine 5500 Lbs':
    'ELF FD25T diesel forklift with cabin 5,500 lb',
  'Chariot élévateur Diesel ELF FD30T avec cabine 6600 Lbs':
    'ELF FD30T diesel forklift with cabin 6,600 lb',
  'Zoomlion ZA45J Nacelle Télescopique, Hauteur 51 pi 10 po':
    'Zoomlion ZA45J telescopic boom lift — 51 ft 10 in working height',
  'Chariot élévateur Hyster H100FT 10000 Lbs avec cabine':
    'Hyster H100FT diesel forklift with cabin 10,000 lb',
}

const EN_OPTIONS = {
  'Pneus pneumatiques extérieurs, cabine, déplacement latéral, chauffage de cabine, fourches 42 ou 48 po':
    'Outdoor pneumatic tires, cabin, sideshift, cabin heater, 42 or 48 in forks',
  'Pneus pneumatiques extérieurs, cabine, déplacement latéral avec positionneur de fourches, chauffage de cabine, fourches 42 ou 48 po':
    'Outdoor pneumatic tires, cabin, sideshift with fork positioner, cabin heater, 42 or 48 in forks',
  'Nacelle télescopique diesel, 51 pi 10 po de hauteur de travail, portée horizontale 27 pi 3 po':
    'Diesel telescopic boom lift, 51 ft 10 in working height, 27 ft 3 in horizontal outreach',
  'Pneus solides extérieurs, cabine, déplacement latéral, climatisation/chauffage, fourches 42 ou 48 po':
    'Solid outdoor tires, cabin, sideshift, heating/cooling system, 42 or 48 in forks',
}

function buildDescription(item, locale) {
  const isFr = locale === 'fr-CA'
  const options = isFr ? item.options : EN_OPTIONS[item.options] ?? item.options

  if (item.type === 'boom-lift') {
    return isFr
      ? `Nacelle télescopique diesel Zoomlion ${item.model} — ${options}. Capacité plateforme ${formatCapacity(item.capacityLb, locale)}.`
      : `Zoomlion ${item.model} diesel telescopic boom lift — ${options}. Platform capacity ${formatCapacity(item.capacityLb, locale)}.`
  }

  const heightLabel = isFr
    ? `${item.liftHeightIn} po de levage`
    : `${item.liftHeightIn}" lift height`

  const conditionLabel = item.condition === 'rebuilt'
    ? isFr
      ? 'Reconstruit en excellent état'
      : 'Fully rebuilt in excellent condition'
    : isFr
      ? `Neuf ${item.year}`
      : `New ${item.year}`

  return isFr
    ? `Chariot élévateur diesel ${item.brand} ${item.model} — ${formatCapacity(item.capacityLb, locale)}, ${heightLabel}, ${conditionLabel}. ${options}.`
    : `${item.brand} ${item.model} diesel forklift — ${formatCapacity(item.capacityLb, locale)}, ${heightLabel}, ${conditionLabel}. ${options}.`
}

function toProduct(item, locale) {
  const isFr = locale === 'fr-CA'
  const name = isFr ? item.title : EN_TITLES[item.title] ?? item.title
  const capacity = item.capacityLb ?? parseCapacityFromTitle(item.title)
  const isBoom = item.type === 'boom-lift'

  return {
    id: item.link,
    categoryKey: DIESEL_LIFT_CATEGORY_KEY,
    categoryLabel: isFr ? 'Lift diesel' : 'Diesel lift',
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
    terrain: isBoom ? 'rough' : 'outdoor',
    terrainLabel: isBoom ? (isFr ? 'Terrain accidenté' : 'Rough terrain') : isFr ? 'Extérieur' : 'Outdoor',
    workType: isBoom ? 'height' : 'loading',
    workTypeLabel: isBoom ? (isFr ? 'Hauteur' : 'Height work') : isFr ? 'Chargement' : 'Loading',
    description: buildDescription(item, locale),
    image: item.img,
    productUrl: item.link,
    onSale: Boolean(item.sale),
    regularPrice: item.regularPrice ? parsePrice(item.regularPrice) : undefined,
    model: item.model,
    liftHeightIn: item.liftHeightIn,
    liftHeightFt: item.liftHeightFt,
    powerLabel: item.power,
  }
}

export function getDieselLiftProducts(locale = 'fr-CA') {
  return RAW_ITEMS.map((item) => toProduct(item, locale))
}
