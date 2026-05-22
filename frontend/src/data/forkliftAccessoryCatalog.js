/** Catalogue exclusif — https://www.forkliftplus.com/product-category/accessoires-chariots-elevateurs/ */

import {
  formatCapacity,
  parseCapacityFromTitle,
  parseDimensionsFromTitle,
  parsePrice,
} from './catalogShared.js'

export const FORKLIFT_ACCESSORY_CATEGORY_KEY = 'accesoire'

function decodeTitle(title) {
  return title
    .replace(/&#8243;/g, '"')
    .replace(/&#215;/g, '×')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function parseForkDimensions(title) {
  const decoded = decodeTitle(title)
  const match = decoded.match(/(\d+)\s*["″]?\s*x\s*(\d+)\s*["″]?/i)
  if (match) return `${match[1]}" × ${match[2]}"`
  return parseDimensionsFromTitle(decoded)
}

const TIRE_IMG = 'https://www.forkliftplus.com/wp-content/uploads/2020/05/forklift-tire-base.jpg'
const TIRE_CATEGORY =
  'https://www.forkliftplus.com/product-category/accessoires-chariots-elevateurs/pneus-chariot-elevateur/'

const TIRE_PRODUCTS = [
  {
    title: 'Pneu solide chariot élévateur 16 x 5 x 10.50',
    price: '189.00',
    img: TIRE_IMG,
    link: `${TIRE_CATEGORY}#16x5x10-5`,
    type: 'tire',
    dimensions: '16 × 5 × 10.50',
    tireType: 'Standard',
    featureFr: 'Pneu solide',
    featureEn: 'Solid tire',
  },
  {
    title: 'Pneu solide chariot élévateur 16 x 6 x 10.50',
    price: '229.00',
    img: TIRE_IMG,
    link: `${TIRE_CATEGORY}#16x6x10-5`,
    type: 'tire',
    dimensions: '16 × 6 × 10.50',
    tireType: 'Standard',
    featureFr: 'Pneu solide',
    featureEn: 'Solid tire',
  },
  {
    title: 'Pneu solide chariot élévateur 21 x 7 x 15',
    price: '275.00',
    img: TIRE_IMG,
    link: `${TIRE_CATEGORY}#21x7x15`,
    type: 'tire',
    dimensions: '21 × 7 × 15',
    tireType: 'Standard',
    featureFr: 'Pneu solide',
    featureEn: 'Solid tire',
  },
  {
    title: 'Pneu solide chariot élévateur 18 x 6 x 12.125 Lisse',
    price: '269.00',
    img: TIRE_IMG,
    link: `${TIRE_CATEGORY}#18x6x12-125-lisse`,
    type: 'tire',
    dimensions: '18 × 6 × 12.125',
    tireType: 'Lisse',
    featureFr: 'Pneu solide lisse',
    featureEn: 'Smooth solid tire',
  },
  {
    title: 'Pneu solide chariot élévateur 18 x 6 x 12.125 Traction',
    price: '349.00',
    img: TIRE_IMG,
    link: `${TIRE_CATEGORY}#18x6x12-125-traction`,
    type: 'tire',
    dimensions: '18 × 6 × 12.125',
    tireType: 'Traction',
    featureFr: 'Pneu solide traction',
    featureEn: 'Traction solid tire',
  },
  {
    title: 'Pneu solide chariot élévateur 21 x 8 x 15',
    price: '329.00',
    img: TIRE_IMG,
    link: `${TIRE_CATEGORY}#21x8x15`,
    type: 'tire',
    dimensions: '21 × 8 × 15',
    tireType: 'Standard',
    featureFr: 'Pneu solide',
    featureEn: 'Solid tire',
  },
  {
    title: 'Pneu solide chariot élévateur 22 x 9 x 16',
    price: '369.00',
    img: TIRE_IMG,
    link: `${TIRE_CATEGORY}#22x9x16`,
    type: 'tire',
    dimensions: '22 × 9 × 16',
    tireType: 'Standard',
    featureFr: 'Pneu solide',
    featureEn: 'Solid tire',
  },
]

const RAW_ITEMS = [
  {
    title: 'Patins pour Machines – Capacité 40,000 lb Ultra-Robustes',
    price: '850.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/04/Steerable-Machine-Skates1.jpg',
    link: 'https://www.forkliftplus.com/product/patins-pour-machines/',
    type: 'skates',
    capacityLb: 40000,
    featureFr: 'Patins de déplacement',
    featureEn: 'Machine skates',
  },
  {
    title: 'Patins industriels 40,000 lb – Déménageur 3 points robuste',
    price: '3650.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/04/steerable-machinery-skates-1-1.jpg',
    link: 'https://www.forkliftplus.com/product/demenageur-3-points-robuste/',
    type: 'skates',
    capacityLb: 40000,
    featureFr: 'Déménageur 3 points',
    featureEn: '3-point industrial mover',
  },
  {
    title: 'Rallonge de fourche 6" x 96"',
    price: '479.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2017/12/fork-extensions-assemble.jpg',
    link: 'https://www.forkliftplus.com/product/rallonge-de-fourche-6-x-96/',
    type: 'fork-extension',
    dimensions: '6" × 96"',
    featureFr: 'Rallonge de fourche',
    featureEn: 'Fork extension',
  },
  {
    title: 'Siège de chariot élévateur universel FS 35870',
    price: '399.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/12/Seat-35870-web-site-1.jpg',
    link: 'https://www.forkliftplus.com/product/siege-fs-35870/',
    type: 'seat',
    sale: true,
    featureFr: 'Siège universel',
    featureEn: 'Universal seat',
  },
  {
    title: 'Grue Télescopique à Flèche pour Chariot Élévateur 4000 lb.',
    price: '1299.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/09/Telescoping-Forklift-Jib-Boom-02-1.jpg',
    link: 'https://www.forkliftplus.com/product/grue-telescopique-a-fleche/',
    type: 'jib',
    capacityLb: 4000,
    featureFr: 'Grue télescopique',
    featureEn: 'Telescopic jib boom',
  },
  {
    title: 'Tireuse de Palette Capacité de 5000 lb',
    price: '99.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/09/Pallet-Puller-close.jpg',
    link: 'https://www.forkliftplus.com/product/tireuse-de-palette/',
    type: 'puller',
    capacityLb: 5000,
    featureFr: 'Tireuse de palette',
    featureEn: 'Pallet puller',
  },
  {
    title: 'Chariots à plateforme en métal',
    price: '299.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/09/Metal-Platform-truck-01.jpg',
    link: 'https://www.forkliftplus.com/product/chariots-a-plateforme-en-metal/',
    type: 'platform',
    priceRange: '299 $ – 399 $',
    featureFr: 'Chariot plateforme',
    featureEn: 'Metal platform truck',
  },
  {
    title: 'Diable monte-escalier en acier par à 6 roues 300 lb',
    price: '99.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/09/Stair-Climber-Dolly.jpg',
    link: 'https://www.forkliftplus.com/product/diable-monte-escalier/',
    type: 'dolly',
    capacityLb: 300,
    featureFr: 'Diable monte-escalier',
    featureEn: 'Stair-climber dolly',
  },
  {
    title: 'Rallonge de fourche 4" x 72"',
    price: '249.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2017/12/fork-extensions.jpg',
    link: 'https://www.forkliftplus.com/product/rallonge-de-fourche-4-x-72/',
    type: 'fork-extension',
    dimensions: '4" × 72"',
    featureFr: 'Rallonge de fourche',
    featureEn: 'Fork extension',
  },
  {
    title: 'Diable – chariots de déménagement',
    price: '49.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/09/Dolly-back.jpg',
    link: 'https://www.forkliftplus.com/product/diable-chariots-de-demenagement/',
    type: 'dolly',
    featureFr: 'Diable',
    featureEn: 'Moving dolly',
  },
  {
    title: 'Rampes de chargement en acier',
    price: '799.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/08/Rampes-de-chargement-Al-500x625-1.jpg',
    link: 'https://www.forkliftplus.com/product/rampes-de-chargement-en-acier/',
    type: 'ramp',
    priceRange: '799 $ – 1 499 $',
    featureFr: 'Rampe de chargement',
    featureEn: 'Steel loading ramp',
  },
  {
    title: 'Rampes de chargement en aluminium',
    price: '899.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/08/Rampes-de-chargement-Al-500x625-1.jpg',
    link: 'https://www.forkliftplus.com/product/rampes-de-chargement-en-aluminium/',
    type: 'ramp',
    priceRange: '899 $ – 1 499 $',
    featureFr: 'Rampe aluminium',
    featureEn: 'Aluminum loading ramp',
  },
  {
    title: 'Plaques de quai en aluminium',
    price: '329.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/08/Aluminium-Dock-Plate-500x625-1.jpg',
    link: 'https://www.forkliftplus.com/product/plaques-de-quai-en-aluminium/',
    type: 'dock',
    priceRange: '329 $ – 599 $',
    featureFr: 'Plaque de quai',
    featureEn: 'Aluminum dock plate',
  },
  {
    title: 'Rallonge de fourche 6" x 72"',
    price: '369.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2017/12/fork-extensions-assemble.jpg',
    link: 'https://www.forkliftplus.com/product/rallonge-de-fourche-6-x-72/',
    type: 'fork-extension',
    dimensions: '6" × 72"',
    featureFr: 'Rallonge de fourche',
    featureEn: 'Fork extension',
  },
  {
    title: 'Cale de transpalette (Butoirs pour transpalette)',
    price: '25.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2020/09/paletbl-1.jpg',
    link: 'https://www.forkliftplus.com/product/cale-de-transpalette/',
    type: 'chock',
    featureFr: 'Cale / butoir',
    featureEn: 'Pallet jack chock',
  },
  {
    title: 'Siège de chariot élévateur universel FS 1960',
    price: '149.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2020/05/forklift-seat-1960.jpg',
    link: 'https://www.forkliftplus.com/product/siege-fs-1960/',
    type: 'seat',
    sale: true,
    featureFr: 'Siège universel',
    featureEn: 'Universal seat',
  },
  {
    title: 'Siège de chariot élévateur universel FS 35869',
    price: '299.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2020/05/forklift-seat-35869.jpg',
    link: 'https://www.forkliftplus.com/product/siege-fs-35869/',
    type: 'seat',
    sale: true,
    featureFr: 'Siège universel',
    featureEn: 'Universal seat',
  },
  {
    title: 'lumière de chariot élévateur à LED',
    price: '29.99',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2018/08/LED-light.jpg',
    link: 'https://www.forkliftplus.com/product/lumiere-chariot-elevateur-led/',
    type: 'light',
    featureFr: 'Éclairage LED',
    featureEn: 'LED forklift light',
  },
  {
    title: 'Projecteur bleu de chariot élévateur',
    price: '69.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2018/08/forklift-blue-spot-light-01.jpg',
    link: 'https://www.forkliftplus.com/product/projecteur-bleu-de-chariot-elevateur/',
    type: 'light',
    featureFr: 'Projecteur de sécurité',
    featureEn: 'Blue spot safety light',
  },
  {
    title: 'Sièges de chariots élévateurs Modèle fs 1845',
    price: '110.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2018/01/Seat-forklift-1.jpg',
    link: 'https://www.forkliftplus.com/product/siege-de-chariot-elevateur/',
    type: 'seat',
    featureFr: 'Siège FS 1845',
    featureEn: 'Seat FS 1845',
  },
  {
    title: 'Connecteur de batterie de chariot élévateur',
    price: '12.50',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2017/12/Connectore-175.jpg',
    link: 'https://www.forkliftplus.com/product/connecteur/',
    type: 'connector',
    priceRange: '12,50 $ – 24,50 $',
    featureFr: 'Connecteur batterie',
    featureEn: 'Battery connector',
  },
  {
    title: 'Chargeur de batterie pour chariot élévateur',
    price: '275.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/06/Battery2-1.jpg',
    link: 'https://www.forkliftplus.com/product-category/accessoires-chariots-elevateurs/chargeur-batterie-chariot-elevateur/',
    type: 'charger',
    priceRange: 'À partir de 275 $',
    featureFr: 'Chargeur batterie',
    featureEn: 'Battery charger',
    specsFr: 'Entrée 110V–600V, sortie 12V–48V, 10A–200A',
    specsEn: 'Input 110V–600V, output 12V–48V, 10A–200A',
  },
  {
    title: 'Rallonge de fourche 5" x 84"',
    price: '379.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2017/12/fork-extensions-forklift.jpg',
    link: 'https://www.forkliftplus.com/product/rallonge-de-fourche-5-x-84/',
    type: 'fork-extension',
    dimensions: '5" × 84"',
    featureFr: 'Rallonge de fourche',
    featureEn: 'Fork extension',
  },
  {
    title: 'Rallonge de fourche 5" x 72"',
    price: '319.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2017/12/fork-extensions01.jpg',
    link: 'https://www.forkliftplus.com/product/rallonge-de-fourche-5-x-72/',
    type: 'fork-extension',
    dimensions: '5" × 72"',
    featureFr: 'Rallonge de fourche',
    featureEn: 'Fork extension',
  },
  {
    title: 'Rallonge de fourche 5" x 60"',
    price: '299.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2017/12/fork-extensions-assemble.jpg',
    link: 'https://www.forkliftplus.com/product/rallonge-de-fourche-5-x-60/',
    type: 'fork-extension',
    dimensions: '5" × 60"',
    featureFr: 'Rallonge de fourche',
    featureEn: 'Fork extension',
  },
  {
    title: 'Rallonge de fourche 4" x 60"',
    price: '229.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2017/12/fork-extensions.jpg',
    link: 'https://www.forkliftplus.com/product/rallonge-de-fourche-4-x-60/',
    type: 'fork-extension',
    dimensions: '4" × 60"',
    featureFr: 'Rallonge de fourche',
    featureEn: 'Fork extension',
  },
  {
    title: 'Rallonge de fourche 4" x 84"',
    price: '329.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2017/12/fork-extensions-forklift.jpg',
    link: 'https://www.forkliftplus.com/product/rallonge-de-fourche-4-x-84/',
    type: 'fork-extension',
    dimensions: '4" × 84"',
    featureFr: 'Rallonge de fourche',
    featureEn: 'Fork extension',
  },
  {
    title: 'Rallonge de fourche 4" x 96"',
    price: '369.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2017/12/fork-extensions-assemble.jpg',
    link: 'https://www.forkliftplus.com/product/rallonge-de-fourche-4-x-96/',
    type: 'fork-extension',
    dimensions: '4" × 96"',
    featureFr: 'Rallonge de fourche',
    featureEn: 'Fork extension',
  },
  {
    title: 'Rallonge de fourche 5" x 96"',
    price: '429.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2017/12/fork-extensions-forklift-1.jpg',
    link: 'https://www.forkliftplus.com/product/rallonge-de-fourche-5-x-96/',
    type: 'fork-extension',
    dimensions: '5" × 96"',
    featureFr: 'Rallonge de fourche',
    featureEn: 'Fork extension',
  },
  {
    title: 'Rallonge de fourche 6" x 84"',
    price: '429.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2017/12/fork-extensions01.jpg',
    link: 'https://www.forkliftplus.com/product/rallonge-de-fourche-6-x-84/',
    type: 'fork-extension',
    dimensions: '6" × 84"',
    featureFr: 'Rallonge de fourche',
    featureEn: 'Fork extension',
  },
  {
    title: 'Siège de chariot élévateur universel FS 91816',
    price: '165.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2018/01/seat-91816.jpg',
    link: 'https://www.forkliftplus.com/product-category/accessoires-chariots-elevateurs/siege-chariot-elevateur/#fs-91816',
    type: 'seat',
    dimensions: '16.53" × 24.01" × 18.89"',
    featureFr: 'Siège universel',
    featureEn: 'Universal seat',
  },
  {
    title: 'Siège de chariot élévateur universel FS 91812',
    price: '348.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2020/02/seat-91812.jpg',
    link: 'https://www.forkliftplus.com/product-category/accessoires-chariots-elevateurs/siege-chariot-elevateur/#fs-91812',
    type: 'seat',
    dimensions: '22.63" × 19.68" × 20.47"',
    featureFr: 'Siège universel',
    featureEn: 'Universal seat',
  },
  {
    title: 'Siège de chariot élévateur universel FS 35868',
    price: '229.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2020/02/seat-35868.jpg',
    link: 'https://www.forkliftplus.com/product-category/accessoires-chariots-elevateurs/siege-chariot-elevateur/#fs-35868',
    type: 'seat',
    dimensions: '21.70" × 22.80" × 25.60"',
    featureFr: 'Siège universel',
    featureEn: 'Universal seat',
  },
  {
    title: 'Siège de chariot élévateur universel FS 1632',
    price: '185.50',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2020/02/seat-1865.jpg',
    link: 'https://www.forkliftplus.com/product-category/accessoires-chariots-elevateurs/siege-chariot-elevateur/#fs-1632',
    type: 'seat',
    dimensions: '20.00" × 21.00" × 19.00"',
    featureFr: 'Siège universel',
    featureEn: 'Universal seat',
  },
  {
    title: 'Siège de chariot élévateur universel FS 1790',
    price: '195.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2020/02/seat-1790.jpg',
    link: 'https://www.forkliftplus.com/product-category/accessoires-chariots-elevateurs/siege-chariot-elevateur/#fs-1790',
    type: 'seat',
    dimensions: '23.25" × 22.00" × 21.00"',
    featureFr: 'Siège universel',
    featureEn: 'Universal seat',
  },
  {
    title: 'Siège de chariot élévateur universel FS 1867',
    price: '175.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2020/02/seat-1867.jpg',
    link: 'https://www.forkliftplus.com/product-category/accessoires-chariots-elevateurs/siege-chariot-elevateur/#fs-1867',
    type: 'seat',
    dimensions: '19.50" × 19.00" × 21.25"',
    featureFr: 'Siège universel',
    featureEn: 'Universal seat',
  },
  ...TIRE_PRODUCTS,
]

const EN_TITLES = {
  'Patins pour Machines – Capacité 40,000 lb Ultra-Robustes': 'Machine skates 40,000 lb capacity',
  'Patins industriels 40,000 lb – Déménageur 3 points robuste': 'Industrial skates 40,000 lb – 3-point mover',
  'Rallonge de fourche 6" x 96"': 'Fork extension 6" × 96"',
  'Siège de chariot élévateur universel FS 35870': 'Universal forklift seat FS 35870',
  'Grue Télescopique à Flèche pour Chariot Élévateur 4000 lb.': 'Telescopic jib boom 4,000 lb',
  'Tireuse de Palette Capacité de 5000 lb': 'Pallet puller 5,000 lb capacity',
  'Chariots à plateforme en métal': 'Metal platform trucks',
  'Diable monte-escalier en acier par à 6 roues 300 lb': 'Stair-climber dolly 300 lb',
  'Rallonge de fourche 4" x 72"': 'Fork extension 4" × 72"',
  'Diable – chariots de déménagement': 'Moving dolly cart',
  'Rampes de chargement en acier': 'Steel loading ramps',
  'Rampes de chargement en aluminium': 'Aluminum loading ramps',
  'Plaques de quai en aluminium': 'Aluminum dock plates',
  'Rallonge de fourche 6" x 72"': 'Fork extension 6" × 72"',
  'Cale de transpalette (Butoirs pour transpalette)': 'Pallet jack wheel chock',
  'Siège de chariot élévateur universel FS 1960': 'Universal forklift seat FS 1960',
  'Siège de chariot élévateur universel FS 35869': 'Universal forklift seat FS 35869',
  'lumière de chariot élévateur à LED': 'LED forklift light',
  'Projecteur bleu de chariot élévateur': 'Blue spot forklift projector',
  'Sièges de chariots élévateurs Modèle fs 1845': 'Forklift seat FS 1845',
  'Connecteur de batterie de chariot élévateur': 'Forklift battery connector',
  'Rallonge de fourche 5" x 84"': 'Fork extension 5" × 84"',
  'Rallonge de fourche 5" x 72"': 'Fork extension 5" × 72"',
  'Rallonge de fourche 5" x 60"': 'Fork extension 5" × 60"',
  'Rallonge de fourche 4" x 60"': 'Fork extension 4" × 60"',
  'Rallonge de fourche 4" x 84"': 'Fork extension 4" × 84"',
  'Rallonge de fourche 4" x 96"': 'Fork extension 4" × 96"',
  'Rallonge de fourche 5" x 96"': 'Fork extension 5" × 96"',
  'Rallonge de fourche 6" x 84"': 'Fork extension 6" × 84"',
  'Chargeur de batterie pour chariot élévateur': 'Forklift battery charger',
  'Siège de chariot élévateur universel FS 91816': 'Universal forklift seat FS 91816',
  'Siège de chariot élévateur universel FS 91812': 'Universal forklift seat FS 91812',
  'Siège de chariot élévateur universel FS 35868': 'Universal forklift seat FS 35868',
  'Siège de chariot élévateur universel FS 1632': 'Universal forklift seat FS 1632',
  'Siège de chariot élévateur universel FS 1790': 'Universal forklift seat FS 1790',
  'Siège de chariot élévateur universel FS 1867': 'Universal forklift seat FS 1867',
  'Pneu solide chariot élévateur 16 x 5 x 10.50': 'Solid forklift tire 16×5×10.5',
  'Pneu solide chariot élévateur 16 x 6 x 10.50': 'Solid forklift tire 16×6×10.5',
  'Pneu solide chariot élévateur 21 x 7 x 15': 'Solid forklift tire 21×7×15',
  'Pneu solide chariot élévateur 18 x 6 x 12.125 Lisse': 'Smooth solid tire 18×6×12.125',
  'Pneu solide chariot élévateur 18 x 6 x 12.125 Traction': 'Traction solid tire 18×6×12.125',
  'Pneu solide chariot élévateur 21 x 8 x 15': 'Solid forklift tire 21×8×15',
  'Pneu solide chariot élévateur 22 x 9 x 16': 'Solid forklift tire 22×9×16',
}

function buildDescription(item, locale) {
  const base =
    locale === 'fr-CA'
      ? 'Accessoire chariot élévateur Forklift Plus — meilleur prix dans votre région, garantie.'
      : 'Forklift Plus forklift accessory — best regional pricing with warranty.'

  const extras = {
    skates:
      locale === 'fr-CA' ? 'Déplacement sécuritaire de charges lourdes.' : 'Safe heavy load relocation.',
    'fork-extension':
      locale === 'fr-CA' ? 'Prolonge les fourches pour charges longues.' : 'Extends forks for long loads.',
    seat: locale === 'fr-CA' ? 'Confort et ergonomie pour opérateurs.' : 'Comfort and ergonomics for operators.',
    jib:
      locale === 'fr-CA' ? 'Manutention suspendue sur chariot.' : 'Suspended load handling on forklift.',
    puller: locale === 'fr-CA' ? 'Traction de palettes au sol.' : 'Ground-level pallet pulling.',
    platform: locale === 'fr-CA' ? 'Transport de charges sur plateforme.' : 'Platform load transport.',
    dolly: locale === 'fr-CA' ? 'Manutention légère et déménagement.' : 'Light handling and moving.',
    ramp:
      locale === 'fr-CA' ? 'Accès camion/quai sécurisé.' : 'Safe truck-to-dock access.',
    dock: locale === 'fr-CA' ? 'Transition quai-camion en aluminium.' : 'Aluminum dock transition.',
    chock: locale === 'fr-CA' ? 'Immobilisation du transpalette.' : 'Pallet jack immobilization.',
    light: locale === 'fr-CA' ? 'Visibilité et sécurité en entrepôt.' : 'Warehouse visibility and safety.',
    connector: locale === 'fr-CA' ? 'Connexion batterie fiable.' : 'Reliable battery connection.',
    charger:
      locale === 'fr-CA'
        ? 'Chargeurs neufs et usagés (Energic Plus, Ferro, Xtrapower, etc.).'
        : 'New and used chargers (Energic Plus, Ferro, Xtrapower, etc.).',
    tire:
      locale === 'fr-CA'
        ? 'Pneu solide importateur direct, garantie Montréal.'
        : 'Direct-import solid tire with Montreal warranty.',
  }

  const range = item.priceRange
    ? locale === 'fr-CA'
      ? ` Fourchette : ${item.priceRange}.`
      : ` Price range: ${item.priceRange}.`
    : ''

  const promo = item.sale ? (locale === 'fr-CA' ? ' En promotion.' : ' On sale.') : ''
  const specs = item.specsFr
    ? locale === 'fr-CA'
      ? ` ${item.specsFr}.`
      : ` ${item.specsEn ?? item.specsFr}.`
    : ''
  const tireNote = item.tireType
    ? locale === 'fr-CA'
      ? ` Type : ${item.tireType}.`
      : ` Type: ${item.tireType}.`
    : ''

  return `${base} ${extras[item.type] ?? ''}${specs}${tireNote}${range}${promo}`
}

function toProduct(item, locale) {
  const isFr = locale === 'fr-CA'
  const title = decodeTitle(item.title)
  const name = isFr ? title : EN_TITLES[title] ?? title
  const capacity = item.capacityLb ?? parseCapacityFromTitle(title)
  const dimensions =
    item.dimensions ?? parseForkDimensions(title) ?? (isFr ? '—' : '—')
  const hasCapacity = capacity >= 500

  return {
    id: item.link,
    categoryKey: FORKLIFT_ACCESSORY_CATEGORY_KEY,
    categoryLabel: isFr ? 'Accesoire' : 'Accessory',
    name,
    status: isFr ? 'Disponible' : 'Available',
    brand: 'Forklift Plus',
    condition: isFr ? 'Neuf' : 'New',
    location: 'Montreal, QC',
    price: parsePrice(item.price),
    capacity: hasCapacity ? capacity : 0,
    capacityLabel: hasCapacity ? formatCapacity(capacity, locale) : isFr ? 'Accessoire' : 'Accessory',
    dimensions,
    powerLabel: isFr ? item.featureFr : item.featureEn,
    terrain: 'mixed',
    terrainLabel: isFr ? 'Mixte' : 'Mixed',
    workType: 'handling',
    workTypeLabel: isFr ? 'Manutention' : 'Handling',
    description: buildDescription(item, locale),
    image: item.img,
    productUrl: item.link,
    onSale: Boolean(item.sale),
  }
}

export function getForkliftAccessoryProducts(locale = 'fr-CA') {
  const seen = new Set()
  return RAW_ITEMS.filter((item) => {
    if (seen.has(item.link)) return false
    seen.add(item.link)
    return true
  }).map((item) => toProduct(item, locale))
}
