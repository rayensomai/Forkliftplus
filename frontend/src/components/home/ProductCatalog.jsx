import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getCategoryImageUrl,
  getProductImageUrl,
} from '../../data/forkliftplusImages.js'
import {
  getExclusiveCatalogProducts,
  isExclusiveCategory,
} from '../../data/exclusiveCatalogs.js'

const INVENTORY_TARGET = 10000

const CATEGORY_THEMES = {
  'forklift-propane': { accent: '#f97316', accent2: '#fb923c', icon: '⛽' },
  'forklift-electric-4': { accent: '#3b82f6', accent2: '#60a5fa', icon: '⚡' },
  'forklift-electric-3': { accent: '#06b6d4', accent2: '#22d3ee', icon: '🔋' },
  'lift-diesel': { accent: '#d97706', accent2: '#fbbf24', icon: '🏗️' },
  'sciso-lift': { accent: '#a855f7', accent2: '#c084fc', icon: '📐' },
  'electric-transpalette': { accent: '#10b981', accent2: '#34d399', icon: '🚚' },
  'manual-transpallette': { accent: '#14b8a6', accent2: '#2dd4bf', icon: '🛒' },
  accesoire: { accent: '#ec4899', accent2: '#f472b6', icon: '🔧' },
}

function buildPlaceholderDataUri(label) {
  const safeLabel = encodeURIComponent(label)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='960' height='620'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#0f4c81'/><stop offset='100%' stop-color='#1d9bd1'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><circle cx='810' cy='90' r='120' fill='rgba(255,255,255,0.12)'/><circle cx='160' cy='520' r='180' fill='rgba(255,255,255,0.08)'/><text x='50%' y='48%' fill='white' dominant-baseline='middle' text-anchor='middle' font-family='Segoe UI, Arial, sans-serif' font-size='46' font-weight='700'>ForkliftPlus</text><text x='50%' y='60%' fill='rgba(255,255,255,0.9)' dominant-baseline='middle' text-anchor='middle' font-family='Segoe UI, Arial, sans-serif' font-size='30'>${safeLabel}</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${svg}`
}

function buildLargeInventory(products, categories, locale) {
  if (!products?.length) return []

  const seriesLabel = locale === 'fr-CA' ? 'Serie' : 'Series'
  const availability = ['Disponible', 'Sur commande']

  return Array.from({ length: INVENTORY_TARGET }, (_, index) => {
    const base = products[index % products.length]
    const category = categories.find((item) => item.key === base.categoryKey)
    const multiplier = (index % 9) - 4

    return {
      ...base,
      name: `${base.name} ${seriesLabel} ${index + 1}`,
      price: Math.max(1200, base.price + multiplier * 450),
      status: availability[index % availability.length],
      location: `${base.location} #${(index % 80) + 1}`,
      image: getProductImageUrl(index + 1, base.categoryKey, base.image),
      categoryLabel: category?.label ?? base.categoryLabel,
    }
  })
}

function buildCatalogInventory(products, categories, locale) {
  const exclusive = getExclusiveCatalogProducts(locale)
  const generalProducts = products.filter((product) => !isExclusiveCategory(product.categoryKey))
  const expandedGeneral = buildLargeInventory(generalProducts, categories, locale)

  return [...exclusive, ...expandedGeneral]
}

function ProductCatalog({ copy }) {
  const [query, setQuery] = useState('')
  const [categoryKey, setCategoryKey] = useState('')
  const [status, setStatus] = useState('all')
  const [priceBand, setPriceBand] = useState('all')
  const [capacityBand, setCapacityBand] = useState('all')
  const [terrain, setTerrain] = useState('all')
  const [workType, setWorkType] = useState('all')

  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat(copy.locale || 'fr-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0,
    })
  }, [copy.locale])

  const selectedCategory = useMemo(() => {
    return copy.categories.find((item) => item.key === categoryKey) ?? null
  }, [categoryKey, copy.categories])

  const allProducts = useMemo(() => {
    return buildCatalogInventory(copy.products, copy.categories, copy.locale)
  }, [copy.products, copy.categories, copy.locale])

  const categoryCounts = useMemo(() => {
    return copy.categories.reduce((accumulator, category) => {
      accumulator[category.key] = allProducts.filter(
        (product) => product.categoryKey === category.key
      ).length
      return accumulator
    }, {})
  }, [allProducts, copy.categories])

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return allProducts.filter((product) => {
      if (categoryKey && product.categoryKey !== categoryKey) return false

      const matchesQuery =
        !needle ||
        [product.name, product.brand, product.category, product.description]
          .join(' ')
          .toLowerCase()
          .includes(needle)

      const matchesStatus = status === 'all' || product.status === status
      const matchesPrice =
        priceBand === 'all' ||
        (priceBand === 'under-50' && product.price < 50000) ||
        (priceBand === '50-80' && product.price >= 50000 && product.price <= 80000) ||
        (priceBand === '80-plus' && product.price > 80000)
      const matchesCapacity =
        capacityBand === 'all' ||
        (capacityBand === 'under-5k' && product.capacity <= 5000) ||
        (capacityBand === '5k-10k' && product.capacity > 5000 && product.capacity <= 10000) ||
        (capacityBand === '10k-plus' && product.capacity > 10000)
      const matchesTerrain = terrain === 'all' || product.terrain === terrain
      const matchesWorkType = workType === 'all' || product.workType === workType

      return (
        matchesQuery &&
        matchesStatus &&
        matchesPrice &&
        matchesCapacity &&
        matchesTerrain &&
        matchesWorkType
      )
    })
  }, [
    categoryKey,
    capacityBand,
    allProducts,
    priceBand,
    query,
    status,
    terrain,
    workType,
  ])

  const resetFilters = () => {
    setQuery('')
    setCategoryKey('')
    setStatus('all')
    setPriceBand('all')
    setCapacityBand('all')
    setTerrain('all')
    setWorkType('all')
  }

  const handleImageError = (event, fallbackLabel) => {
    const target = event.currentTarget
    const nextSource = target.dataset.fallbackSrc

    if (nextSource && target.src !== nextSource) {
      target.src = nextSource
      return
    }

    target.onerror = null
    target.src = buildPlaceholderDataUri(fallbackLabel)
  }

  const totalInventory = useMemo(() => {
    return Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)
  }, [categoryCounts])

  return (
    <section className="product-catalog catalog-section" id="catalog">
      <div className="product-catalog-header reveal">
        <div>
          <p className="eyebrow catalog-eyebrow">{copy.eyebrow}</p>
          <h2 className="catalog-title">{copy.title}</h2>
          <p className="section-subtitle">{copy.subtitle}</p>
        </div>
        <div className="catalog-summary catalog-summary-glow">
          <strong>{!selectedCategory ? totalInventory : filteredProducts.length}</strong>
          <span>{copy.resultsLabel}</span>
          <small>{copy.locale === 'fr-CA' ? '10 000 materiels / 10 000 photos' : '10,000 machines / 10,000 photos'}</small>
        </div>
      </div>

      {!selectedCategory ? (
        <div className="category-grid">
          {copy.categories.map((category, index) => {
            const theme = CATEGORY_THEMES[category.key] ?? CATEGORY_THEMES['forklift-propane']
            return (
              <button
                key={category.key}
                type="button"
                className={`category-card reveal delay-${(index % 6) + 1}`}
                style={{
                  '--card-accent': theme.accent,
                  '--card-accent-2': theme.accent2,
                }}
                onClick={() => setCategoryKey(category.key)}
              >
                <span className="category-card-shine" aria-hidden="true" />
                <div className="category-card-media">
                  <img
                    src={category.image ?? getCategoryImageUrl(category.key)}
                    data-fallback-src={getCategoryImageUrl(category.key)}
                    alt={category.label}
                    loading="lazy"
                    onError={(event) => handleImageError(event, category.label)}
                  />
                  <span className="category-card-icon" aria-hidden="true">
                    {theme.icon}
                  </span>
                </div>
                <div className="category-card-body">
                  <span className="category-card-count">
                    {categoryCounts[category.key] ?? 0}
                  </span>
                  <strong>{category.label}</strong>
                  <p>{category.description}</p>
                  <span className="category-card-cta">
                    {copy.exploreCta}
                    <span className="category-card-arrow" aria-hidden="true">
                      →
                    </span>
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="category-drilldown">
          <div className="category-drilldown-header">
            <div>
              <p className="eyebrow">{copy.categoryLabel}</p>
              <h3>{selectedCategory.label}</h3>
              <p className="section-subtitle">{selectedCategory.description}</p>
            </div>
            <button className="btn ghost" type="button" onClick={() => setCategoryKey('')}>
              {copy.backToCategories}
            </button>
          </div>

          <div className="catalog-toolbar">
            <label className="field catalog-search">
              <span>{copy.searchLabel}</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={copy.searchPlaceholder}
              />
            </label>

            <label className="field">
              <span>{copy.statusLabel}</span>
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                {copy.statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>{copy.priceLabel}</span>
              <select value={priceBand} onChange={(event) => setPriceBand(event.target.value)}>
                {copy.priceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>{copy.capacityLabel}</span>
              <select value={capacityBand} onChange={(event) => setCapacityBand(event.target.value)}>
                {copy.capacityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>{copy.terrainLabel}</span>
              <select value={terrain} onChange={(event) => setTerrain(event.target.value)}>
                {copy.terrainOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>{copy.workTypeLabel}</span>
              <select value={workType} onChange={(event) => setWorkType(event.target.value)}>
                {copy.workTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button className="btn ghost catalog-reset" type="button" onClick={resetFilters}>
              {copy.clearFilters}
            </button>
          </div>

          <div className="catalog-grid">
            {filteredProducts.length ? (
              filteredProducts.map((product, index) => (
                <article
                  key={product.id ?? `${product.name}-${index}`}
                  className={`product-card reveal delay-${(index % 3) + 1}`}
                >
                  <div className="product-image-wrap">
                    {product.onSale ? (
                      <span className="product-sale-badge">
                        {copy.locale === 'fr-CA' ? 'Promo' : 'Sale'}
                      </span>
                    ) : null}
                    <img
                      src={product.image}
                      data-fallback-src={getProductImageUrl(
                        index + 8000,
                        product.categoryKey,
                        product.image
                      )}
                      alt={product.name}
                      loading="lazy"
                      onError={(event) => handleImageError(event, product.name)}
                    />
                  </div>
                  <div className="product-card-body">
                    <div className="product-topline">
                      <span className="product-category">{product.categoryLabel}</span>
                      <span
                        className={`product-status${product.onSale ? ' product-status-sale' : ''}`}
                      >
                        {product.status}
                      </span>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-meta-grid">
                      <span>{product.brand}</span>
                      <span>{product.condition}</span>
                      <span>{product.location}</span>
                      {product.dimensions ? <span>{product.dimensions}</span> : null}
                      <span>{product.capacityLabel}</span>
                      {product.powerLabel ? <span>{product.powerLabel}</span> : null}
                      <span>{product.terrainLabel}</span>
                    </div>
                    <div className="product-footer">
                      <strong>{currencyFormatter.format(product.price)}</strong>
                      <Link className="btn primary btn-small" to="/client">
                        {copy.buyCta}
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="catalog-empty">
                <h3>{copy.noResultsTitle}</h3>
                <p>{copy.noResultsSubtitle}</p>
                <button className="btn ghost" type="button" onClick={resetFilters}>
                  {copy.clearFilters}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductCatalog