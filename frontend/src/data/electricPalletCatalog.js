/** Catalogue exclusif — https://www.forkliftplus.com/product-category/manutention/transpalette-jigger-electrique/ */

import {
  formatCapacity,
  parseCapacityFromTitle,
  parseDimensionsFromTitle,
  parsePrice,
} from './catalogShared.js'

export const ELECTRIC_PALLET_CATEGORY_KEY = 'electric-transpalette'

const RAW_ITEMS = [
  {
    title: 'Transpalette électrique ELF-EPT44H-LBR avec dossier de chargement',
    price: '2250.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/09/ELF-EPT44H-LBR-01.jpg',
    link: 'https://www.forkliftplus.com/product/elf-avec-dossier-de-chargement/',
    type: 'lithium',
    capacityLb: 4400,
    power: 'Batterie lithium',
  },
  {
    title: 'Transpalette à plate-forme BT LPE200 Electric',
    price: '8900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2018/08/Bt-LPE200-2.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-plate-forme-bt-lpe200/',
    type: 'platform',
    capacityLb: 4500,
    power: 'Électrique',
  },
  {
    title: 'Transpalette électrique Batterie lithium 27 x 72',
    price: '2499.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/03/Lithium-Pallet-TruckHandel-jpg.jpg',
    link: 'https://www.forkliftplus.com/product/serie-elf-ept-72/',
    type: 'lithium',
    dimensions: '27" × 72"',
    capacityLb: 3300,
    power: 'Batterie lithium',
  },
  {
    title: 'Transpalette Raymond 8900 – 6 000 lb, Batterie Neuf',
    price: '12900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/10/Raymond-8900-01.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-ryamond-8900/',
    type: 'raymond',
    capacityLb: 6000,
    power: 'Batterie neuve',
  },
  {
    title: 'Transpalette électrique Raymond 8210',
    price: '3850.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2020/12/Raymond-8210-1-min.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-raymond-8210/',
    type: 'raymond',
    capacityLb: 4500,
    power: 'Électrique',
  },
  {
    title: 'Transpalette Électrique Rymond 8510 Rider Efficace et Ergonomique',
    price: '7900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/07/photo_2024-07-24_14-56-50.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-electrique-rymond-8510/',
    type: 'rider',
    capacityLb: 4500,
    power: 'Rider électrique',
  },
  {
    title: 'Transpalette électrique Raymond 102T-F45L 4500 lbs',
    price: '3450.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2019/04/Raymond-102T-F45L.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-raymond-102t-f45l/',
    type: 'raymond',
    capacityLb: 4500,
    power: 'Électrique',
  },
  {
    title: 'Transpalette semi-électrique à ciseaux ELF série EHP',
    price: '1399.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/04/Semi-Electric-High-Lift-Pallet-Truck-01.jpg',
    link: 'https://www.forkliftplus.com/product/semi-electrique-a-ciseaux-elf/',
    type: 'scissor',
    capacityLb: 3300,
    power: 'Semi-électrique',
    priceRange: '1 399 $ – 1 599 $',
  },
  {
    title: 'Transpalette électrique Batterie lithium série ELF-EPT',
    price: '1499.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/03/Lithium-Pallet-Truck-ELF-EPT44H-1.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-electrique-serie-elf-ept/',
    type: 'lithium',
    capacityLb: 4400,
    power: 'Batterie lithium',
    priceRange: '1 499 $ – 2 250 $',
  },
  {
    title: 'Transpalette électrique Toyota 8HBW23 4500 lb',
    price: '5450.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/01/Toyota-8hbw23-04-1.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-electrique-toyota-8hbw23/',
    type: 'toyota',
    capacityLb: 4500,
    power: 'Électrique',
  },
  {
    title: 'Plaques de quai en aluminium',
    price: '329.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/08/Aluminium-Dock-Plate-500x625-1.jpg',
    link: 'https://www.forkliftplus.com/product/plaques-de-quai-en-aluminium/',
    type: 'dock',
    priceRange: '329 $ – 599 $',
  },
  {
    title: 'Transpalette Électrique CBD20KD',
    price: '5900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/06/cbd20kd-1-1.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-electrique-cbd20kd/',
    type: 'cbd',
    capacityLb: 4500,
    power: 'Électrique',
  },
  {
    title: 'Transpalette Électrique Rider CBD20R-II',
    price: '8900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/06/cbd20r-ii-05-1.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-electrique-rider-cbd20r-ii/',
    type: 'rider',
    capacityLb: 4500,
    power: 'Rider électrique',
  },
  {
    title: 'Transpalette électrique Jungheinrich EJE series',
    price: '3850.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2022/07/jungheinrich-eje120a-02.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-jungheinrich/',
    type: 'jungheinrich',
    capacityLb: 4500,
    power: 'Électrique',
  },
  {
    title: 'Transpalette électrique Raymond 6000 Lbs usagé',
    price: '8900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2018/12/rymond-easir40tt-02-500x316.jpg',
    link: 'https://www.forkliftplus.com/product/raymond-6000-lbs-usage/',
    type: 'raymond',
    capacityLb: 6000,
    power: 'Électrique',
    condition: 'used',
  },
  {
    title: 'Transpalette électrique Raymond 8410 long john 27×96',
    price: '8900.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2018/11/Electric-pallet-truck-Raymond-8410-long-john-01.jpg',
    link: 'https://www.forkliftplus.com/product/raymond-8410-long-john/',
    type: 'raymond',
    dimensions: '27" × 96"',
    capacityLb: 6000,
    power: 'Électrique',
  },
]

const EN_TITLES = {
  'Transpalette électrique ELF-EPT44H-LBR avec dossier de chargement':
    'ELF-EPT44H-LBR electric pallet jack with load backrest',
  'Transpalette à plate-forme BT LPE200 Electric': 'BT LPE200 electric platform pallet truck',
  'Transpalette électrique Batterie lithium 27 x 72': 'Lithium electric pallet jack 27×72',
  'Transpalette Raymond 8900 – 6 000 lb, Batterie Neuf': 'Raymond 8900 electric pallet jack 6,000 lb – new battery',
  'Transpalette électrique Raymond 8210': 'Raymond 8210 electric pallet jack',
  'Transpalette Électrique Rymond 8510 Rider Efficace et Ergonomique':
    'Raymond 8510 rider electric pallet truck',
  'Transpalette électrique Raymond 102T-F45L 4500 lbs': 'Raymond 102T-F45L electric pallet jack 4,500 lb',
  'Transpalette semi-électrique à ciseaux ELF série EHP': 'ELF EHP semi-electric scissor pallet truck',
  'Transpalette électrique Batterie lithium série ELF-EPT': 'ELF-EPT lithium electric pallet truck series',
  'Transpalette électrique Toyota 8HBW23 4500 lb': 'Toyota 8HBW23 electric pallet jack 4,500 lb',
  'Plaques de quai en aluminium': 'Aluminum dock plates',
  'Transpalette Électrique CBD20KD': 'CBD20KD electric pallet truck',
  'Transpalette Électrique Rider CBD20R-II': 'CBD20R-II electric rider pallet truck',
  'Transpalette électrique Jungheinrich EJE series': 'Jungheinrich EJE series electric pallet truck',
  'Transpalette électrique Raymond 6000 Lbs usagé': 'Raymond 6,000 lb electric pallet jack (used)',
  'Transpalette électrique Raymond 8410 long john 27×96': 'Raymond 8410 long john electric pallet jack 27×96',
}

const EN_POWER = {
  'Batterie lithium': 'Lithium battery',
  Électrique: 'Electric',
  'Batterie neuve': 'New battery',
  'Rider électrique': 'Electric rider',
  'Semi-électrique': 'Semi-electric',
}

function buildDescription(item, locale) {
  const base =
    locale === 'fr-CA'
      ? 'Transpalette électrique (jigger) Forklift Plus — levage motorisé, batteries incluses ou disponibles, garantie.'
      : 'Forklift Plus electric pallet jack — motorized lift, batteries included or available, warranty.'

  const extras = {
    lithium:
      locale === 'fr-CA'
        ? 'Batterie lithium, capacité supérieure au manuel.'
        : 'Lithium battery, higher capacity than manual models.',
    raymond:
      locale === 'fr-CA' ? 'Fiabilité Raymond pour entrepôts exigeants.' : 'Raymond reliability for demanding warehouses.',
    rider:
      locale === 'fr-CA' ? 'Conduite rider ergonomique, longues distances.' : 'Ergonomic rider operation for long distances.',
    platform:
      locale === 'fr-CA' ? 'Plate-forme pour opérateur debout.' : 'Platform for stand-on operation.',
    toyota:
      locale === 'fr-CA' ? 'Qualité Toyota, entretien simplifié.' : 'Toyota quality, simplified maintenance.',
    scissor:
      locale === 'fr-CA' ? 'Levage à ciseaux semi-électrique ELF.' : 'ELF semi-electric scissor lift.',
    cbd: locale === 'fr-CA' ? 'Modèle CBD robuste pour manutention.' : 'Robust CBD model for handling.',
    jungheinrich:
      locale === 'fr-CA' ? 'Série Jungheinrich EJE éprouvée.' : 'Proven Jungheinrich EJE series.',
    dock: locale === 'fr-CA' ? 'Accessoire de quai aluminium.' : 'Aluminum dock accessory.',
  }

  const range = item.priceRange
    ? locale === 'fr-CA'
      ? ` Fourchette : ${item.priceRange}.`
      : ` Price range: ${item.priceRange}.`
    : ''

  return `${base} ${extras[item.type] ?? extras.lithium}${range}`
}

function toProduct(item, locale) {
  const isFr = locale === 'fr-CA'
  const name = isFr ? item.title : EN_TITLES[item.title] ?? item.title
  const capacity = item.capacityLb ?? parseCapacityFromTitle(item.title)
  const dimensions =
    item.dimensions ?? parseDimensionsFromTitle(item.title) ?? (isFr ? 'Standard' : 'Standard')
  const powerLabel = isFr ? item.power : EN_POWER[item.power] ?? item.power ?? 'Electric'

  const isUsed = item.condition === 'used' || /usagé|usage/i.test(item.title)

  return {
    id: item.link,
    categoryKey: ELECTRIC_PALLET_CATEGORY_KEY,
    categoryLabel: isFr ? 'Electrique transpalette' : 'Electric pallet jack',
    name,
    status: isFr ? 'Disponible' : 'Available',
    brand: 'Forklift Plus',
    condition: isUsed ? (isFr ? 'Reconditionné' : 'Refurbished') : isFr ? 'Neuf' : 'New',
    location: 'Montreal, QC',
    price: parsePrice(item.price),
    capacity,
    capacityLabel: formatCapacity(capacity, locale),
    dimensions,
    powerLabel,
    terrain: 'indoor',
    terrainLabel: isFr ? 'Intérieur' : 'Indoor',
    workType: 'handling',
    workTypeLabel: isFr ? 'Manutention' : 'Handling',
    description: buildDescription(item, locale),
    image: item.img,
    productUrl: item.link,
    onSale: Boolean(item.sale),
  }
}

export function getElectricPalletProducts(locale = 'fr-CA') {
  return RAW_ITEMS.map((item) => toProduct(item, locale))
}
