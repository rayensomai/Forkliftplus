const CATEGORY_DEFAULT_HEIGHT = {
  'forklift-propane': 15,
  'forklift-electric-4': 16,
  'forklift-electric-3': 15,
  'lift-diesel': 14,
  'sciso-lift': 0,
  'electric-transpalette': 8,
  'manual-transpallette': 7,
  accesoire: 0,
}

export function parseLiftHeightFeet(name) {
  const piedMatch = name.match(/(\d+)\s*pieds?/i)
  if (piedMatch) return Number(piedMatch[1])

  const ftMatch = name.match(/(\d+)\s*ft\b/i)
  if (ftMatch) return Number(ftMatch[1])

  return null
}

export function getProductLiftHeight(product) {
  return parseLiftHeightFeet(product.name) ?? CATEGORY_DEFAULT_HEIGHT[product.categoryKey] ?? 12
}

export function dedupeRecommendationPool(products) {
  const seen = new Map()

  products.forEach((product) => {
    const baseName = product.name.replace(/\s(Serie|Series)\s+\d+$/i, '').trim()
    const existing = seen.get(baseName)

    if (!existing) {
      seen.set(baseName, { ...product, name: baseName })
      return
    }

    const preferCurrent =
      (product.status === 'Disponible' || product.status === 'Available') &&
      existing.status !== 'Disponible' &&
      existing.status !== 'Available'

    if (preferCurrent) {
      seen.set(baseName, { ...product, name: baseName })
    }
  })

  return Array.from(seen.values())
}

function terrainScore(required, productTerrain) {
  if (required === productTerrain) return 30
  if (productTerrain === 'mixed') return 22
  if (required === 'mixed') return 16
  if (
    (required === 'indoor' && productTerrain === 'outdoor') ||
    (required === 'outdoor' && productTerrain === 'indoor')
  ) {
    return -12
  }
  if (required === 'rough' && productTerrain !== 'rough') return -8
  return 8
}

function capacityScore(required, productCapacity) {
  if (!required || !productCapacity) return 0
  if (productCapacity < required) return -55

  const ratio = productCapacity / required
  if (ratio <= 1.12) return 34
  if (ratio <= 1.35) return 28
  if (ratio <= 1.8) return 18
  return 10
}

function heightScore(criteria, product) {
  const requiredHeight = criteria.liftHeightFt
  const productHeight = getProductLiftHeight(product)
  const verticalWork = criteria.accessType === 'height' || requiredHeight >= 18

  if (verticalWork) {
    if (product.categoryKey === 'sciso-lift' || product.workType === 'height') {
      if (productHeight >= requiredHeight) {
        if (productHeight <= requiredHeight * 1.3) return 36
        return 26
      }
      return -45
    }

    if (requiredHeight <= 18 && product.categoryKey.includes('forklift')) {
      if (productHeight >= requiredHeight) return 18
      return -15
    }

    return -28
  }

  if (product.categoryKey === 'sciso-lift') return -25
  if (requiredHeight <= 10 && ['electric-transpalette', 'manual-transpallette'].includes(product.categoryKey)) {
    return 22
  }
  if (productHeight >= requiredHeight) return 16
  return 4
}

function workTypeScore(required, product) {
  if (!required || required === 'all') return 0
  if (required === product.workType) return 18
  if (required === 'stacking' && product.workType === 'loading') return 10
  if (required === 'loading' && product.workType === 'handling') return 8
  return 0
}

function buildReasons(criteria, product, productHeight, locale) {
  const fr = locale === 'fr-CA'
  const reasons = []

  if (product.terrain === criteria.terrain || product.terrain === 'mixed') {
    reasons.push(fr ? `Adapté au terrain ${product.terrainLabel?.toLowerCase()}` : `Matches ${product.terrainLabel} terrain`)
  }

  if (product.capacity >= criteria.capacityLb) {
    reasons.push(
      fr
        ? `Capacité ${product.capacityLabel} pour vos ${criteria.capacityLb.toLocaleString('fr-CA')} lb`
        : `${product.capacityLabel} capacity covers your ${criteria.capacityLb.toLocaleString('en-CA')} lb load`
    )
  }

  if (criteria.liftHeightFt > 0) {
    reasons.push(
      fr
        ? `Hauteur utile ~${productHeight} pi pour votre besoin de ${criteria.liftHeightFt} pi`
        : `Useful reach ~${productHeight} ft for your ${criteria.liftHeightFt} ft requirement`
    )
  }

  if (criteria.narrowAisle && product.categoryKey === 'forklift-electric-3') {
    reasons.push(fr ? 'Rayon de braquage court pour allées étroites' : 'Tight turning radius for narrow aisles')
  }

  if (criteria.budgetMax && product.price <= criteria.budgetMax) {
    reasons.push(fr ? 'Respecte votre budget cible' : 'Fits your target budget')
  }

  if (product.status === 'Disponible' || product.status === 'Available') {
    reasons.push(fr ? 'Disponible rapidement' : 'Available now')
  }

  return reasons.slice(0, 4)
}

function scoreProduct(product, criteria, locale) {
  let score = 0

  score += terrainScore(criteria.terrain, product.terrain)
  score += capacityScore(criteria.capacityLb, product.capacity)
  score += heightScore(criteria, product)
  score += workTypeScore(criteria.workType, product)

  if (criteria.narrowAisle && product.categoryKey === 'forklift-electric-3') score += 22
  if (criteria.narrowAisle && product.categoryKey === 'forklift-electric-4') score += 6

  if (criteria.budgetMax) {
    if (product.price <= criteria.budgetMax) score += 14
    else if (product.price > criteria.budgetMax * 1.2) score -= 18
  }

  if (product.status === 'Disponible' || product.status === 'Available') score += 8

  const productHeight = getProductLiftHeight(product)
  const rawMax = 130
  const matchPercent = Math.max(0, Math.min(99, Math.round((Math.max(score, 0) / rawMax) * 100)))

  return {
    product,
    score,
    matchPercent: score < 0 ? 0 : Math.max(matchPercent, 55),
    reasons: buildReasons(criteria, product, productHeight, locale),
    productHeight,
  }
}

export function recommendForklifts(products, criteria, locale = 'fr-CA') {
  const pool = dedupeRecommendationPool(products)
  const ranked = pool
    .map((product) => scoreProduct(product, criteria, locale))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  const top = ranked.slice(0, 3)

  if (top.length) return top

  return pool
    .map((product) => scoreProduct(product, criteria, locale))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

export function buildRecommendationSummary(criteria, recommendations, copy, locale = 'fr-CA') {
  if (!recommendations.length) return copy.noMatchSummary

  const best = recommendations[0]
  const terrainLabel =
    copy.terrainOptions.find((option) => option.value === criteria.terrain)?.label ?? criteria.terrain
  const numberLocale = locale === 'fr-CA' ? 'fr-CA' : 'en-CA'

  return copy.matchSummary
    .replace('{count}', String(recommendations.length))
    .replace('{terrain}', terrainLabel)
    .replace('{capacity}', criteria.capacityLb.toLocaleString(numberLocale))
    .replace('{height}', String(criteria.liftHeightFt))
    .replace('{best}', best.product.name)
}
