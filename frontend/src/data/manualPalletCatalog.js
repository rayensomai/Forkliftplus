/** Catalogue exclusif — https://www.forkliftplus.com/product-category/transpalette-jigger-manuel/ */

const CATEGORY_KEY = 'manual-transpallette'

const RAW_ITEMS = [
  {
    title: 'Transpalette Jigger 27×48',
    price: '289.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2019/11/438320078_28763.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-jigger-27x48/',
    sale: true,
    dimensions: '27" × 48"',
    capacityLb: 3300,
    type: 'jigger',
  },
  {
    title: 'Transpalette Jigger 21×48',
    price: '339.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2019/11/435502232_138902.jpg',
    link: 'https://www.forkliftplus.com/product/jigger-21x48/',
    sale: true,
    dimensions: '21" × 48"',
    capacityLb: 3300,
    type: 'jigger',
  },
  {
    title: 'Transpalette avec Balance 27×48',
    price: '1250.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2017/12/IMG_6322.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-avec-balance/',
    dimensions: '27" × 48"',
    capacityLb: 3300,
    type: 'balance',
  },
  {
    title: 'Patins pour Machines – Capacité 40,000 lb Ultra-Robustes',
    price: '850.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/04/Steerable-Machine-Skates1.jpg',
    link: 'https://www.forkliftplus.com/product/patins-pour-machines/',
    capacityLb: 40000,
    type: 'skates',
  },
  {
    title: 'Patins industriels 40,000 lb – Déménageur 3 points robuste',
    price: '3650.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/04/steerable-machinery-skates-1-1.jpg',
    link: 'https://www.forkliftplus.com/product/demenageur-3-points-robuste/',
    capacityLb: 40000,
    type: 'skates',
  },
  {
    title: 'Transpalette 27×96 (Jigger) 3300 Lbs',
    price: '949.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2018/01/Hand-pallet-truck-21-x-72-3.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-27x96/',
    dimensions: '27" × 96"',
    capacityLb: 3300,
    type: 'jigger',
  },
  {
    title: 'Transpalettes à ciseaux de la série ELF-HP',
    price: '699.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/05/Manual-High-Lift-Pallet-Truck-2.jpg',
    link: 'https://www.forkliftplus.com/product/palette-ascenseur-de-ciseaux/',
    capacityLb: 3300,
    type: 'scissor',
    priceRange: '699 $ – 799 $',
  },
  {
    title: 'Transpalette semi-électrique à ciseaux ELF série EHP',
    price: '1399.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/04/Semi-Electric-High-Lift-Pallet-Truck-01.jpg',
    link: 'https://www.forkliftplus.com/product/semi-electrique-a-ciseaux-elf/',
    capacityLb: 3300,
    type: 'scissor-electric',
    priceRange: '1 399 $ – 1 599 $',
  },
  {
    title: 'Transpalette Jigger 21×36',
    price: '399.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/03/Hand-Pallet-Truck1.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-jigger-21x36/',
    dimensions: '21" × 36"',
    capacityLb: 3300,
    type: 'jigger',
  },
  {
    title: 'Diable monte-escalier en acier par à 6 roues 300 lb',
    price: '99.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/09/Stair-Climber-Dolly.jpg',
    link: 'https://www.forkliftplus.com/product/diable-monte-escalier/',
    capacityLb: 300,
    type: 'dolly',
  },
  {
    title: 'Diable – chariots de déménagement',
    price: '49.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/09/Dolly-back.jpg',
    link: 'https://www.forkliftplus.com/product/diable-chariots-de-demenagement/',
    capacityLb: 300,
    type: 'dolly',
  },
  {
    title: 'Transpalette manuel galvanisé 5500 lbs 27×48',
    price: '599.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2019/08/galvanized-hand-pallet-truck.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-manuel-galvanise/',
    dimensions: '27" × 48"',
    capacityLb: 5500,
    type: 'jigger',
  },
  {
    title: "Transpalette manuel avec Dosseret d'appui de charge",
    price: '499.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2019/08/Hand-palet-truck-with-backrest.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-dosseret-appui-charge/',
    dimensions: '27" × 48"',
    capacityLb: 3300,
    type: 'jigger',
  },
  {
    title: 'Transpalette manuel 27×48 double roue (jigger)',
    price: '339.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2019/11/435803286_181241-1.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-jigger-27x48-double-roue/',
    sale: true,
    dimensions: '27" × 48"',
    capacityLb: 3300,
    type: 'jigger',
  },
  {
    title: 'Transpalette manuel 21×48 double roue (jigger)',
    price: '389.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2019/11/434323336_241510.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-manuel-21x48-double-roue-jigger/',
    sale: true,
    dimensions: '21" × 48"',
    capacityLb: 3300,
    type: 'jigger',
  },
  {
    title: 'Transpalette 27×72 Double roue (Jigger) 3300 Lbs',
    price: '799.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2018/01/Hand-pallet-truck-21-x-72-3.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-27x72/',
    dimensions: '27" × 72"',
    capacityLb: 3300,
    type: 'jigger',
  },
  {
    title: 'Transpalette 21×72 Double roue (Jigger) 3300 Lbs',
    price: '799.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2018/01/Hand-pallet-truck-21-x-72-1.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-21x72/',
    dimensions: '21" × 72"',
    capacityLb: 3300,
    type: 'jigger',
  },
  {
    title: 'Transpalette manuel le profil bas 27×48 (Jigger)',
    price: '665.00',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2017/12/Hand-Pallet-truck-27-x-48-low-profile.jpg',
    link: 'https://www.forkliftplus.com/product/transpalette-manuel-le-profil-bas-27x48/',
    dimensions: '27" × 48"',
    capacityLb: 3300,
    type: 'jigger',
  },
]

const EN_TITLES = {
  'Transpalette Jigger 27×48': 'Manual pallet jack 27×48',
  'Transpalette Jigger 21×48': 'Manual pallet jack 21×48',
  'Transpalette avec Balance 27×48': 'Pallet jack with scale 27×48',
  'Patins pour Machines – Capacité 40,000 lb Ultra-Robustes': 'Machine skates 40,000 lb capacity',
  'Patins industriels 40,000 lb – Déménageur 3 points robuste': 'Industrial skates 40,000 lb – 3-point mover',
  'Transpalette 27×96 (Jigger) 3300 Lbs': 'Pallet jack 27×96 (jigger) 3,300 lb',
  'Transpalettes à ciseaux de la série ELF-HP': 'ELF-HP manual scissor pallet trucks',
  'Transpalette semi-électrique à ciseaux ELF série EHP': 'ELF EHP semi-electric scissor pallet truck',
  'Transpalette Jigger 21×36': 'Manual pallet jack 21×36',
  'Diable monte-escalier en acier par à 6 roues 300 lb': 'Stair-climber dolly steel 300 lb',
  'Diable – chariots de déménagement': 'Moving dolly cart',
  'Transpalette manuel galvanisé 5500 lbs 27×48': 'Galvanized manual pallet jack 5,500 lb 27×48',
  "Transpalette manuel avec Dosseret d'appui de charge": 'Manual pallet jack with load backrest',
  'Transpalette manuel 27×48 double roue (jigger)': 'Manual pallet jack 27×48 double wheel',
  'Transpalette manuel 21×48 double roue (jigger)': 'Manual pallet jack 21×48 double wheel',
  'Transpalette 27×72 Double roue (Jigger) 3300 Lbs': 'Pallet jack 27×72 double wheel 3,300 lb',
  'Transpalette 21×72 Double roue (Jigger) 3300 Lbs': 'Pallet jack 21×72 double wheel 3,300 lb',
  'Transpalette manuel le profil bas 27×48 (Jigger)': 'Low-profile manual pallet jack 27×48',
}

function formatCapacity(lb, locale) {
  if (!lb || lb < 500) {
    return locale === 'fr-CA' ? 'Accessoire' : 'Accessory'
  }
  const formatted = new Intl.NumberFormat(locale === 'fr-CA' ? 'fr-CA' : 'en-CA').format(lb)
  return locale === 'fr-CA' ? `${formatted} lb` : `${formatted} lb`
}

function buildDescription(item, locale) {
  const base =
    locale === 'fr-CA'
      ? 'Transpalette manuel (jigger) Forklift Plus — cadre acier, levage hydraulique, garantie complète.'
      : 'Forklift Plus manual pallet jack — steel frame, hydraulic lift, full warranty.'

  const extras = {
    jigger:
      locale === 'fr-CA'
        ? 'Roues durables, idéal entrepôt et allées étroites.'
        : 'Durable wheels, ideal for warehouses and narrow aisles.',
    balance:
      locale === 'fr-CA' ? 'Balance intégrée pour pesée des palettes.' : 'Built-in scale for pallet weighing.',
    skates:
      locale === 'fr-CA' ? 'Déplacement de machines lourdes en sécurité.' : 'Safe heavy machinery relocation.',
    scissor:
      locale === 'fr-CA' ? 'Levage à ciseaux manuel série ELF-HP.' : 'ELF-HP manual scissor-lift pallet series.',
    'scissor-electric':
      locale === 'fr-CA'
        ? 'Assistance semi-électrique pour le levage.'
        : 'Semi-electric assist for lifting.',
    dolly: locale === 'fr-CA' ? 'Manutention légère et déménagement.' : 'Light handling and moving.',
    dock: locale === 'fr-CA' ? 'Plaque de quai aluminium robuste.' : 'Robust aluminum dock plate.',
    accessory:
      locale === 'fr-CA' ? 'Sécurité et immobilisation du transpalette.' : 'Pallet jack safety and immobilization.',
  }

  const range = item.priceRange
    ? locale === 'fr-CA'
      ? ` Fourchette de prix : ${item.priceRange}.`
      : ` Price range: ${item.priceRange}.`
    : ''

  const promo = item.sale
    ? locale === 'fr-CA'
      ? ' En promotion.'
      : ' On sale.'
    : ''

  return `${base} ${extras[item.type] ?? extras.jigger}${range}${promo}`
}

function toProduct(item, locale) {
  const isFr = locale === 'fr-CA'
  const name = isFr ? item.title : EN_TITLES[item.title] ?? item.title
  const capacity = item.capacityLb ?? 3300
  const capacityLabel = formatCapacity(capacity, locale)

  return {
    id: item.link,
    categoryKey: CATEGORY_KEY,
    categoryLabel: isFr ? 'Manuelle transpallette' : 'Manual pallet jack',
    name,
    status: isFr ? 'Disponible' : 'Available',
    brand: 'Forklift Plus',
    condition: isFr ? 'Neuf' : 'New',
    location: 'Montreal, QC',
    price: Math.round(parseFloat(String(item.price).replace(/,/g, ''))),
    capacity,
    capacityLabel,
    dimensions: item.dimensions ?? (isFr ? 'Sur mesure' : 'Custom'),
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

export function getManualPalletProducts(locale = 'fr-CA') {
  return RAW_ITEMS.map((item) => toProduct(item, locale))
}

export const MANUAL_PALLET_CATEGORY_KEY = CATEGORY_KEY
