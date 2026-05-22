function PromoRibbons({ copy }) {
  const items = copy.categories ?? []
  if (!items.length) return null

  const loopItems = [...items, ...items]

  return (
    <section className="promo-ribbons promo-ribbons-vivid" aria-label="Promotions produits">
      <div className="promo-ribbon promo-ribbon-forward">
        <div className="promo-ribbon-track">
          {loopItems.map((item, index) => (
            <article key={`${item.key}-forward-${index}`} className="promo-card">
              <img src={item.image} alt={item.label} />
              <div className="promo-card-content">
                <span className="promo-chip">Promo</span>
                <strong>{item.label}</strong>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="promo-ribbon promo-ribbon-backward">
        <div className="promo-ribbon-track">
          {loopItems.map((item, index) => (
            <article key={`${item.key}-backward-${index}`} className="promo-card compact">
              <img src={item.image} alt={item.label} />
              <div className="promo-card-content">
                <span className="promo-chip alt">Top Deal</span>
                <strong>{item.label}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PromoRibbons