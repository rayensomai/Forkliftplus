/** Catalogue exclusif — https://www.forkliftplus.com/product-category/chariot-elevateur/chariot-elevateur-electrique/ */

import { formatCapacity, parseCapacityFromTitle, parsePrice } from './catalogShared.js'

export const ELECTRIC_LIFT_3_CATEGORY_KEY = 'forklift-electric-3'
export const ELECTRIC_LIFT_4_CATEGORY_KEY = 'forklift-electric-4'

const RAW_ITEMS = [
  {
    title: 'Chariot élévateur Reach Raymond EZ-R40TT',
    price: '19800.00',
    link: 'https://www.forkliftplus.com/product/raymond-ez-r40tt/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2026/04/Raymond-EZ-R40TT-01.jpg',
    brand: 'Raymond', model: 'EZ-R40TT', capacityLb: 4000, wheelCount: 3,
    type: 'reach', condition: 'rebuilt',
    terrain: 'indoor', workType: 'stacking',
    options: 'Reach électrique, mât télescopique, allées étroites',
  },
  {
    title: 'Chariot élévateur Électrique TOYOTA 8FBCU25 COMP | 5000 lb',
    price: '18900.00',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-toyota-8fbcu25/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2026/04/Toyota-8FBCU20-COMP-01.jpg',
    brand: 'Toyota', model: '8FBCU25', capacityLb: 5000, wheelCount: 4,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'loading',
    options: 'Contrepoids électrique 4 roues, pneus cushion, déplacement latéral',
  },
  {
    title: 'Chariot élévateur Electrique Linde E50PHL avec cabine 10000 Lbs',
    price: '37500.00', regularPrice: '44500.00', sale: true,
    link: 'https://www.forkliftplus.com/product/linde-e50-avec-cabine/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/01/Linde-E50PHL-1.jpg',
    brand: 'Linde', model: 'E50PHL', capacityLb: 10000, wheelCount: 4,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'mixed', workType: 'loading',
    options: 'Cabine, pneus pneumatiques, déplacement latéral, haute capacité',
  },
  {
    title: 'Chariot élévateur à contrepoids et à conducteur debout Toyota 8BNCU20',
    price: '12900.00',
    link: 'https://www.forkliftplus.com/product/toyota-8bncu20/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2026/04/Toyota-8BNCU20-01.jpg',
    brand: 'Toyota', model: '8BNCU20', capacityLb: 4000, wheelCount: 3,
    type: 'stand-up', condition: 'rebuilt',
    terrain: 'indoor', workType: 'loading',
    options: 'Conducteur debout, 3 roues, rayon de braquage court',
  },
  {
    title: 'Chariot élévateur electrique Toyota 8FBCU20 COMP',
    price: '17900.00',
    link: 'https://www.forkliftplus.com/product/toyota-8fbcu20-comp/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2026/04/Toyota-8FBCU20-COMP.jpg',
    brand: 'Toyota', model: '8FBCU20', capacityLb: 4000, wheelCount: 4,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'loading',
    options: 'Contrepoids électrique 4 roues, pneus cushion',
  },
  {
    title: 'Chariot élévateur electrique Nissan OT50 4150 LB',
    price: '12900.00',
    link: 'https://www.forkliftplus.com/product/nissan-ot50/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/12/Nissan-OT50.jpg',
    brand: 'Nissan', model: 'OT50', capacityLb: 4150, wheelCount: 4,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'loading',
    options: 'Contrepoids électrique 4 roues, compact',
  },
  {
    title: 'Aisle-Master 44WE | Chariot élévateur électrique articulé 4400 lb',
    price: '36900.00',
    link: 'https://www.forkliftplus.com/product/articule-electrique-aisle-master-44we/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/12/Aisle-Master-44WE-01.jpg',
    brand: 'Aisle-Master', model: '44WE', capacityLb: 4400, wheelCount: 4,
    type: 'articulated', condition: 'rebuilt',
    terrain: 'indoor', workType: 'handling',
    options: 'Articulé électrique, allées très étroites, empilage en hauteur',
  },
  {
    title: 'Chariot élévateur electrique Yale ERP035VT 3500 lbs',
    price: '12900.00',
    link: 'https://www.forkliftplus.com/product/electrique-yale-erp040/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2021/05/Yale-ERP035VT-01-1.jpg',
    brand: 'Yale', model: 'ERP035VT', capacityLb: 3500, wheelCount: 3,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'stacking',
    options: '3 roues, pneus cushion, rayon de braquage court',
  },
  {
    title: 'Chariot élévateur Electrique Caterpillar EC30N2 6000 Lbs',
    price: '24900.00',
    link: 'https://www.forkliftplus.com/product/caterpillar-ec30n2-6000/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2020/10/Cat-EC30N2-2016-01.jpg',
    brand: 'Caterpillar', model: 'EC30N2', capacityLb: 6000, wheelCount: 4,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'loading',
    options: 'Contrepoids électrique 4 roues, pneus cushion, déplacement latéral',
  },
  {
    title: 'Chariot élévateur Crown SC 5200 3 roues 3000 lbs',
    price: '19800.00',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-crown-sc-5200/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/09/Crown-S200-01.jpg',
    brand: 'Crown', model: 'SC 5200', capacityLb: 3000, wheelCount: 3,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'stacking',
    options: '3 roues, compact, idéal entrepôt et rayonnage',
  },
  {
    title: 'Chariot élévateur Reach Raymond 740 DR32TT',
    price: '26900.00',
    link: 'https://www.forkliftplus.com/product/deep-reach-raymond-750-dr32-tt/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2019/08/Raymond-750-DR32-TT-07.jpg',
    brand: 'Raymond', model: '740 DR32TT', capacityLb: 3200, wheelCount: 3,
    type: 'deep-reach', condition: 'rebuilt',
    terrain: 'indoor', workType: 'stacking',
    options: 'Deep-reach électrique, double profondeur de rack',
  },
  {
    title: 'Chariot élévateur électrique 7000 lbs Yale ERP070VLE',
    price: '28900.00',
    link: 'https://www.forkliftplus.com/product/yale-erp070vle/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/09/Yale-ERP070VLE-01.jpg',
    brand: 'Yale', model: 'ERP070VLE', capacityLb: 7000, wheelCount: 4,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'mixed', workType: 'loading',
    options: '4 roues, haute capacité, pneus cushion',
  },
  {
    title: 'Chariot élévateur électrique 5000 lbs Clark TMX 25',
    price: '16900.00',
    link: 'https://www.forkliftplus.com/product/clark-tmx-25/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/08/Clark-TMX25-01.jpg',
    brand: 'Clark', model: 'TMX 25', capacityLb: 5000, wheelCount: 4,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'loading',
    options: 'Contrepoids électrique 4 roues, déplacement latéral',
  },
  {
    title: 'Chariot élévateur electrique CAT 2ETC3000',
    price: '15900.00', regularPrice: '17900.00', sale: true,
    link: 'https://www.forkliftplus.com/product/electrique-cat-2etc3000/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/06/Cat-2ETC3000.jpg',
    brand: 'Caterpillar', model: '2ETC3000', capacityLb: 3000, wheelCount: 3,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'stacking',
    options: '3 roues Cat cushion, compact entrepôt',
  },
  {
    title: 'Chariot élévateur Electrique Caterpillar EP20KT 3950 Lbs usagé',
    price: '12900.00',
    link: 'https://www.forkliftplus.com/product/electrique-caterpillar-ep20kt/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2018/06/Cat-EP20KT-01.jpg',
    brand: 'Caterpillar', model: 'EP20KT', capacityLb: 3950, wheelCount: 4,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'loading',
    options: 'Contrepoids électrique 4 roues usagé, entrepôt',
  },
  {
    title: 'Chariot élévateur à contrepoids et à conducteur debout Crown RC5525-30',
    price: '16900.00',
    link: 'https://www.forkliftplus.com/product/crown-rc5525-30/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/07/CROWN-RC5525-30-01.jpg',
    brand: 'Crown', model: 'RC5525-30', capacityLb: 3000, wheelCount: 3,
    type: 'stand-up', condition: 'rebuilt',
    terrain: 'indoor', workType: 'loading',
    options: 'Conducteur debout 3 roues, manœuvres rapides',
  },
  {
    title: 'Chariot élévateur électrique 6000 lbs, Crown FC5225-60',
    price: '16900.00',
    link: 'https://www.forkliftplus.com/product/crown-fc5225-60/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/07/Crown-FC5225-60-1.jpg',
    brand: 'Crown', model: 'FC5225-60', capacityLb: 6000, wheelCount: 4,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'loading',
    options: 'Assis 4 roues, pneus cushion, déplacement latéral',
  },
  {
    title: 'Chariot élévateur Deep-Reach Raymond EASI DR30TT',
    price: '26900.00',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-raymond-dr25tt/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/05/Raymond-Easi-DR30TT-01.jpg',
    brand: 'Raymond', model: 'EASI DR30TT', capacityLb: 3000, wheelCount: 3,
    type: 'deep-reach', condition: 'rebuilt',
    terrain: 'indoor', workType: 'stacking',
    options: 'Deep-reach Raymond, stockage double profondeur',
  },
  {
    title: 'Chariot élévateur électrique extérieur Caterpillar 2EPC5000 5000 Lbs',
    price: '24900.00',
    link: 'https://www.forkliftplus.com/product/exterieur-caterpillar-2ep5000/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2021/02/Cat-2EP5000-1.jpg',
    brand: 'Caterpillar', model: '2EPC5000', capacityLb: 5000, wheelCount: 4,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'outdoor', workType: 'loading',
    options: 'Pneus pneumatiques extérieurs, 4 roues',
  },
  {
    title: 'Chariot élévateur electrique Hyster J35XN 3500 lbs',
    price: '12900.00',
    link: 'https://www.forkliftplus.com/product/hyster-j35xn/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/03/2.jpg',
    brand: 'Hyster', model: 'J35XN', capacityLb: 3500, wheelCount: 3,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'stacking',
    options: '3 roues, compact, entrepôt',
  },
  {
    title: 'Chariot elevateur electrique Raymond R30-C30TT',
    price: '13850.00', regularPrice: '15900.00', sale: true,
    link: 'https://www.forkliftplus.com/product/electrique-raymond-r50-c50tt/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2019/09/Raymond-R35-C35TT-new-04.jpg',
    brand: 'Raymond', model: 'R30-C30TT', capacityLb: 3000, wheelCount: 3,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'stacking',
    options: '3 roues Raymond, rayon de braquage court',
  },
  {
    title: 'Chariot élévateur électrique Toyota 8FBCU30 6000 lbs',
    price: '10800.00',
    link: 'https://www.forkliftplus.com/product/toyota-8fbcu30/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2025/02/Toyota-8FBCU30-01.jpg',
    brand: 'Toyota', model: '8FBCU30', capacityLb: 6000, wheelCount: 4,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'loading',
    options: '4 roues, 6000 lb, pneus cushion',
  },
  {
    title: 'Chariot élévateur électrique Toyota 7FBCU25',
    price: '16900.00',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-toyota-7fbcu25-usage/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2018/07/Toyota-7fbcu25-01-1.jpg',
    brand: 'Toyota', model: '7FBCU25', capacityLb: 5000, wheelCount: 4,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'loading',
    options: 'Contrepoids électrique 4 roues usagé',
  },
  {
    title: 'Chariot Élévateur Électrique LiuGong CLGA18 | 3600 lb Neuf',
    price: '43890.00',
    link: 'https://www.forkliftplus.com/product/liugong-clga18/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/09/CLGA18-3.jpg',
    brand: 'LiuGong', model: 'CLGA18', capacityLb: 3600, wheelCount: 3,
    type: 'counterbalance', condition: 'new', year: 2024,
    terrain: 'indoor', workType: 'stacking',
    options: '3 roues neuf, Classe I, pneus cushion, rayon court',
  },
  {
    title: 'BRAVI LUI MINI S.K : Solution pour Travaux en Hauteur',
    price: '5950.00',
    link: 'https://www.forkliftplus.com/product/bravi/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/09/BRAVI-01-1.jpg',
    brand: 'Bravi', model: 'LUI MINI S.K.', capacityLb: 400, wheelCount: 3,
    type: 'mini-lift', condition: 'new', year: 2024,
    terrain: 'indoor', workType: 'height',
    options: 'Mini plateforme élévatrice compacte, travaux en hauteur légers',
  },
  {
    title: 'Chariot élévateur électrique Yale ERC050 5000 Lbs usagé',
    price: '19800.00',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-electrique-yale-erc050/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2024/05/Yale-ERC50V-01.jpg',
    brand: 'Yale', model: 'ERC050', capacityLb: 5000, wheelCount: 4,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'loading',
    options: '4 roues, 5000 lb, pneus cushion',
  },
  {
    title: 'Raymond 445-C40TT chariot élévateur 3 roues 4000 lbs',
    price: '17900.00',
    link: 'https://www.forkliftplus.com/product/raymond-445-chariot-elevateur-electrique/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2022/09/Raymond-445-C40TT.jpg',
    brand: 'Raymond', model: '445-C40TT', capacityLb: 4000, wheelCount: 3,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'stacking',
    options: '3 roues, 4000 lb, entrepôt',
  },
  {
    title: 'Chariot élévateur électrique Yale ERC060VG 6000 lbs',
    price: '18900.00',
    link: 'https://www.forkliftplus.com/product/electrique-yale-erc/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2021/07/Yale-ERC060VG-01.jpg',
    brand: 'Yale', model: 'ERC060VG', capacityLb: 6000, wheelCount: 4,
    type: 'counterbalance', condition: 'rebuilt',
    terrain: 'indoor', workType: 'loading',
    options: '4 roues, 6000 lb, déplacement latéral',
  },
  {
    title: 'Chariot élévateur Deep-Reach Caterpillar ND3000',
    price: '22900.00',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-deep-reach-cat/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2023/08/Cat-ND3000-1.jpg',
    brand: 'Caterpillar', model: 'ND3000', capacityLb: 3000, wheelCount: 3,
    type: 'deep-reach', condition: 'rebuilt',
    terrain: 'indoor', workType: 'stacking',
    options: 'Deep-reach Caterpillar, double profondeur',
  },
  {
    title: 'Chariot élévateur électrique Raymond EASI 3000 lb',
    price: '16900.00',
    link: 'https://www.forkliftplus.com/product/electrique-raymond-easir40tt/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2019/09/Raymond-easi-40-tt.jpg',
    brand: 'Raymond', model: 'EASI', capacityLb: 3000, wheelCount: 3,
    type: 'reach', condition: 'rebuilt',
    terrain: 'indoor', workType: 'stacking',
    options: 'Reach électrique 3000 lb, entrepôt',
  },
  {
    title: 'Raymond chariot élévateur EASI R30TT reach',
    price: '26900.00',
    link: 'https://www.forkliftplus.com/product/easi-r30tt-reach-stand-up/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2018/11/EASI-R30TT-reach.jpg',
    brand: 'Raymond', model: 'EASI R30TT', capacityLb: 3000, wheelCount: 3,
    type: 'reach', condition: 'rebuilt',
    terrain: 'indoor', workType: 'stacking',
    options: 'Reach stand-up Raymond, allées étroites',
  },
  {
    title: 'Raymond 520-OPC30TT Préparateur de commandes électrique',
    price: '10900.00',
    link: 'https://www.forkliftplus.com/product/520-opc30tt-preparateur-commandes/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2019/05/Raymond-520-opc30tt-02.jpg',
    brand: 'Raymond', model: '520-OPC30TT', capacityLb: 3000, wheelCount: 3,
    type: 'order-picker', condition: 'rebuilt',
    terrain: 'indoor', workType: 'handling',
    options: 'Préparateur de commandes électrique, niveau élevé',
  },
  {
    title: 'Raymond Chariot élévateur électrique EASI-R40TT-M reach',
    price: '14900.00',
    link: 'https://www.forkliftplus.com/product/chariot-elevateur-electrique-easi-r40tt-m/',
    img: 'https://www.forkliftplus.com/wp-content/uploads/2019/01/Raymond-EASI-R40TT-M-01.jpg',
    brand: 'Raymond', model: 'EASI-R40TT-M', capacityLb: 4000, wheelCount: 3,
    type: 'reach', condition: 'rebuilt',
    terrain: 'indoor', workType: 'stacking',
    options: 'Reach électrique mono-mât, entrepôt',
  },
]

const EN_TITLES = {
  'Chariot élévateur Reach Raymond EZ-R40TT': 'Raymond EZ-R40TT electric reach truck',
  'Chariot élévateur Électrique TOYOTA 8FBCU25 COMP | 5000 lb':
    'Toyota 8FBCU25 electric counterbalance forklift 5,000 lb',
  'Chariot élévateur Electrique Linde E50PHL avec cabine 10000 Lbs':
    'Linde E50PHL electric forklift with cabin 10,000 lb',
  'Chariot élévateur à contrepoids et à conducteur debout Toyota 8BNCU20':
    'Toyota 8BNCU20 stand-up electric counterbalance forklift',
  'Chariot élévateur electrique Toyota 8FBCU20 COMP':
    'Toyota 8FBCU20 electric counterbalance forklift 4,000 lb',
  'Chariot élévateur electrique Nissan OT50 4150 LB':
    'Nissan OT50 electric forklift 4,150 lb',
  'Aisle-Master 44WE | Chariot élévateur électrique articulé 4400 lb':
    'Aisle-Master 44WE articulated electric forklift 4,400 lb',
  'Chariot élévateur electrique Yale ERP035VT 3500 lbs':
    'Yale ERP035VT electric 3-wheel forklift 3,500 lb',
  'Chariot élévateur Electrique Caterpillar EC30N2 6000 Lbs':
    'Caterpillar EC30N2 electric forklift 6,000 lb',
  'Chariot élévateur Crown SC 5200 3 roues 3000 lbs':
    'Crown SC 5200 electric 3-wheel forklift 3,000 lb',
  'Chariot élévateur Reach Raymond 740 DR32TT': 'Raymond 740 DR32TT deep-reach truck',
  'Chariot élévateur électrique 7000 lbs Yale ERP070VLE':
    'Yale ERP070VLE electric forklift 7,000 lb',
  'Chariot élévateur électrique 5000 lbs Clark TMX 25':
    'Clark TMX 25 electric forklift 5,000 lb',
  'Chariot élévateur electrique CAT 2ETC3000': 'Caterpillar 2ETC3000 electric forklift',
  'Chariot élévateur Electrique Caterpillar EP20KT 3950 Lbs usagé':
    'Caterpillar EP20KT used electric forklift 3,950 lb',
  'Chariot élévateur à contrepoids et à conducteur debout Crown RC5525-30':
    'Crown RC5525-30 stand-up electric forklift',
  'Chariot élévateur électrique 6000 lbs, Crown FC5225-60':
    'Crown FC5225-60 electric forklift 6,000 lb',
  'Chariot élévateur Deep-Reach Raymond EASI DR30TT':
    'Raymond EASI DR30TT deep-reach truck',
  'Chariot élévateur électrique extérieur Caterpillar 2EPC5000 5000 Lbs':
    'Caterpillar 2EPC5000 outdoor electric forklift 5,000 lb',
  'Chariot élévateur electrique Hyster J35XN 3500 lbs':
    'Hyster J35XN electric 3-wheel forklift 3,500 lb',
  'Chariot elevateur electrique Raymond R30-C30TT':
    'Raymond R30-C30TT electric 3-wheel forklift',
  'Chariot élévateur électrique Toyota 8FBCU30 6000 lbs':
    'Toyota 8FBCU30 electric forklift 6,000 lb',
  'Chariot élévateur électrique Toyota 7FBCU25': 'Toyota 7FBCU25 electric forklift 5,000 lb',
  'Chariot Élévateur Électrique LiuGong CLGA18 | 3600 lb Neuf':
    'LiuGong CLGA18 new electric 3-wheel forklift 3,600 lb',
  'BRAVI LUI MINI S.K : Solution pour Travaux en Hauteur':
    'Bravi LUI MINI S.K. compact aerial platform',
  'Chariot élévateur électrique Yale ERC050 5000 Lbs usagé':
    'Yale ERC050 used electric forklift 5,000 lb',
  'Raymond 445-C40TT chariot élévateur 3 roues 4000 lbs':
    'Raymond 445-C40TT electric 3-wheel forklift 4,000 lb',
  'Chariot élévateur électrique Yale ERC060VG 6000 lbs':
    'Yale ERC060VG electric forklift 6,000 lb',
  'Chariot élévateur Deep-Reach Caterpillar ND3000':
    'Caterpillar ND3000 deep-reach truck',
  'Chariot élévateur électrique Raymond EASI 3000 lb':
    'Raymond EASI electric reach truck 3,000 lb',
  'Raymond chariot élévateur EASI R30TT reach': 'Raymond EASI R30TT electric reach truck',
  'Raymond 520-OPC30TT Préparateur de commandes électrique':
    'Raymond 520-OPC30TT electric order picker',
  'Raymond Chariot élévateur électrique EASI-R40TT-M reach':
    'Raymond EASI-R40TT-M electric reach truck',
}

const TERRAIN_LABELS = {
  indoor: { fr: 'Intérieur', en: 'Indoor' },
  outdoor: { fr: 'Extérieur', en: 'Outdoor' },
  mixed: { fr: 'Mixte', en: 'Mixed' },
}

const WORK_TYPE_LABELS = {
  loading: { fr: 'Chargement', en: 'Loading' },
  stacking: { fr: 'Empilage', en: 'Stacking' },
  height: { fr: 'Hauteur', en: 'Height work' },
  handling: { fr: 'Manutention', en: 'Handling' },
}

function categoryKeyFor(item) {
  return item.wheelCount === 3 ? ELECTRIC_LIFT_3_CATEGORY_KEY : ELECTRIC_LIFT_4_CATEGORY_KEY
}

function categoryLabelFor(item, locale) {
  const isFr = locale === 'fr-CA'
  if (item.wheelCount === 3) {
    return isFr ? 'Forklift électrique 3 roues' : 'Electric forklift (3-wheel)'
  }
  return isFr ? 'Forklift électrique 4 roues' : 'Electric forklift (4-wheel)'
}

function buildDescription(item, locale) {
  const isFr = locale === 'fr-CA'
  const capacity = formatCapacity(item.capacityLb ?? parseCapacityFromTitle(item.title), locale)
  const wheels = isFr ? `${item.wheelCount} roues` : `${item.wheelCount}-wheel`
  const conditionLabel =
    item.condition === 'new'
      ? isFr
        ? `Neuf ${item.year ?? ''}`.trim()
        : `New ${item.year ?? ''}`.trim()
      : isFr
        ? 'Reconditionné en excellent état'
        : 'Refurbished in excellent condition'

  return isFr
    ? `${item.brand} ${item.model} — électrique ${wheels}, ${capacity}, ${conditionLabel}. ${item.options}.`
    : `${item.brand} ${item.model} — electric ${wheels}, ${capacity}, ${conditionLabel}. ${item.options}.`
}

function toProduct(item, locale) {
  const isFr = locale === 'fr-CA'
  const name = isFr ? item.title : EN_TITLES[item.title] ?? item.title
  const capacity = item.capacityLb ?? parseCapacityFromTitle(item.title)
  const terrain = item.terrain ?? 'indoor'
  const workType = item.workType ?? 'loading'

  return {
    id: item.link,
    categoryKey: categoryKeyFor(item),
    categoryLabel: categoryLabelFor(item, locale),
    name,
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
    capacity,
    capacityLabel: formatCapacity(capacity, locale),
    terrain,
    terrainLabel: isFr ? TERRAIN_LABELS[terrain].fr : TERRAIN_LABELS[terrain].en,
    workType,
    workTypeLabel: isFr ? WORK_TYPE_LABELS[workType].fr : WORK_TYPE_LABELS[workType].en,
    description: buildDescription(item, locale),
    image: item.img,
    productUrl: item.link,
    onSale: Boolean(item.sale),
    regularPrice: item.regularPrice ? parsePrice(item.regularPrice) : undefined,
    model: item.model,
    wheelCount: item.wheelCount,
    powerLabel: 'Electric',
  }
}

export function getElectricLiftProducts(locale = 'fr-CA') {
  return RAW_ITEMS.map((item) => toProduct(item, locale))
}

export function getElectric3WheelProducts(locale = 'fr-CA') {
  return getElectricLiftProducts(locale).filter(
    (product) => product.categoryKey === ELECTRIC_LIFT_3_CATEGORY_KEY
  )
}

export function getElectric4WheelProducts(locale = 'fr-CA') {
  return getElectricLiftProducts(locale).filter(
    (product) => product.categoryKey === ELECTRIC_LIFT_4_CATEGORY_KEY
  )
}
