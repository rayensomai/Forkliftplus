/** Catalogue exclusif — nacelles à ciseaux (scissor lifts) */

import { formatCapacity, parsePrice } from './catalogShared.js'

export const SCISO_LIFT_CATEGORY_KEY = 'sciso-lift'

const RAW_ITEMS = [
  {
    title: 'Zoomlion ZS1930AC – Nacelle à ciseaux électrique 19 pi',
    price: '14900.00',
    link: 'https://www.forkliftplus.com/product/zoomlion-zs1930ac-nacelle-ciseaux-electrique/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2026/04/Zoomlion-ZS1930AC-0-1.jpg',
    brand: 'Zoomlion',
    model: 'ZS1930AC',
    capacityLb: 500,
    liftHeightFt: 19,
    condition: 'new',
    year: 2026,
    options: 'Nacelle à ciseaux électrique 19 pi, idéale entrepôt et maintenance',
  },
  {
    title: 'Plates-formes ciseaux électriques Skyjack SJ3226 E',
    price: '25990.00',
    link: 'https://www.forkliftplus.com/product/electriques-skyjack-sj3226e/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/10/SJ3226E-01.jpg',
    brand: 'Skyjack',
    model: 'SJ3226E',
    capacityLb: 500,
    liftHeightFt: 26,
    condition: 'rebuilt',
    options: 'Plateforme ciseaux électrique 26 pi, 500 lb',
  },
  {
    title: 'Nacelle à ciseaux électrique Skyjack SJ3219, 500 lbs',
    price: '21900.00',
    link: 'https://www.forkliftplus.com/product/skyjack-sj3219/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/11/Skyjack-3219-3-1.jpg',
    brand: 'Skyjack',
    model: 'SJ3219',
    capacityLb: 500,
    liftHeightFt: 19,
    condition: 'rebuilt',
    options: 'Nacelle ciseaux électrique 19 pi',
  },
]

const EN_TITLES = {
  'Zoomlion ZS1930AC – Nacelle à ciseaux électrique 19 pi':
    'Zoomlion ZS1930AC electric scissor lift — 19 ft',
  'Plates-formes ciseaux électriques Skyjack SJ3226 E':
    'Skyjack SJ3226E electric scissor lift — 26 ft',
  'Nacelle à ciseaux électrique Skyjack SJ3219, 500 lbs':
    'Skyjack SJ3219 electric scissor lift — 19 ft',
}

const EN_OPTIONS = {
  'Nacelle à ciseaux électrique 19 pi, idéale entrepôt et maintenance':
    'Electric scissor lift 19 ft, ideal for warehouse and maintenance',
  'Plateforme ciseaux électrique 26 pi, 500 lb':
    'Electric scissor platform 26 ft, 500 lb capacity',
  'Nacelle ciseaux électrique 19 pi': 'Electric scissor lift 19 ft',
}

function buildDescription(item, locale) {
  const isFr = locale === 'fr-CA'
  const options = isFr ? item.options : EN_OPTIONS[item.options] ?? item.options
  const height = isFr ? `${item.liftHeightFt} pi de hauteur` : `${item.liftHeightFt} ft working height`
  const conditionLabel =
    item.condition === 'new'
      ? isFr
        ? `Neuf ${item.year ?? ''}`.trim()
        : `New ${item.year ?? ''}`.trim()
      : isFr
        ? 'Reconditionné en excellent état'
        : 'Refurbished in excellent condition'

  return isFr
    ? `Nacelle à ciseaux ${item.brand} ${item.model} — ${height}, ${formatCapacity(item.capacityLb, locale)}, ${conditionLabel}. ${options}.`
    : `${item.brand} ${item.model} scissor lift — ${height}, ${formatCapacity(item.capacityLb, locale)}, ${conditionLabel}. ${options}.`
}

function toProduct(item, locale) {
  const isFr = locale === 'fr-CA'

  return {
    id: item.link,
    categoryKey: SCISO_LIFT_CATEGORY_KEY,
    categoryLabel: isFr ? 'Sciso lift' : 'Scissor lift',
    name: isFr ? item.title : EN_TITLES[item.title] ?? item.title,
    status: isFr ? 'Disponible' : 'Available',
    brand: item.brand,
    condition:
      item.condition === 'new'
        ? isFr
          ? 'Neuf'
          : 'New'
        : isFr
          ? 'Reconditionné'
          : 'Refurbished',
    location: 'Montreal, QC',
    price: parsePrice(item.price),
    capacity: item.capacityLb,
    capacityLabel: formatCapacity(item.capacityLb, locale),
    terrain: 'indoor',
    terrainLabel: isFr ? 'Intérieur' : 'Indoor',
    workType: 'height',
    workTypeLabel: isFr ? 'Hauteur' : 'Height work',
    description: buildDescription(item, locale),
    image: item.img,
    productUrl: item.link,
    model: item.model,
    liftHeightFt: item.liftHeightFt,
    powerLabel: 'Electric',
  }
}

export function getScisoLiftProducts(locale = 'fr-CA') {
  return RAW_ITEMS.map((item) => toProduct(item, locale))
}
