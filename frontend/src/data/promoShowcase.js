import { FORKLIFTPLUS_IMAGES } from './forkliftplusImages.js'

export const PROMO_SHOWCASE = {
  fr: [
    {
      title: 'Chariot propane CAT 5 000 lb',
      src: FORKLIFTPLUS_IMAGES.catPropane,
      tag: 'Best-seller',
    },
    {
      title: 'Chariot electrique lithium',
      src: FORKLIFTPLUS_IMAGES.lithiumPallet,
      tag: 'Zero emission',
    },
    {
      title: 'Transpalette electrique ELF',
      src: FORKLIFTPLUS_IMAGES.electricPalletHome,
      tag: 'Entrepot rapide',
    },
    {
      title: 'Scissor lift Skyjack',
      src: FORKLIFTPLUS_IMAGES.skyjack,
      tag: 'Hauteur securisee',
    },
    {
      title: 'Chariot diesel terrain exigeant',
      src: FORKLIFTPLUS_IMAGES.diesel,
      tag: 'Puissance lourde',
    },
    {
      title: 'Accessoires & pieces OEM',
      src: FORKLIFTPLUS_IMAGES.accessories,
      tag: 'Support total',
    },
  ],
  en: [
    {
      title: 'CAT propane forklift 5,000 lb',
      src: FORKLIFTPLUS_IMAGES.catPropane,
      tag: 'Best seller',
    },
    {
      title: 'Lithium electric forklift',
      src: FORKLIFTPLUS_IMAGES.lithiumPallet,
      tag: 'Zero emission',
    },
    {
      title: 'ELF electric pallet jack',
      src: FORKLIFTPLUS_IMAGES.electricPalletHome,
      tag: 'Fast warehouse',
    },
    {
      title: 'Skyjack scissor lift',
      src: FORKLIFTPLUS_IMAGES.skyjack,
      tag: 'Safe height access',
    },
    {
      title: 'Diesel rough-terrain lift',
      src: FORKLIFTPLUS_IMAGES.diesel,
      tag: 'Heavy power',
    },
    {
      title: 'OEM accessories & parts',
      src: FORKLIFTPLUS_IMAGES.accessories,
      tag: 'Full support',
    },
  ],
}

export function getPromoShowcase(locale) {
  return locale?.startsWith('en') ? PROMO_SHOWCASE.en : PROMO_SHOWCASE.fr
}
