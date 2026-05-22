function CTA({ copy }) {
  return (
    <section className="cta" id="pricing">
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p className="section-subtitle">{copy.subtitle}</p>
      </div>
      <div className="cta-actions">
        <button className="btn primary" type="button">
          {copy.primaryCta}
        </button>
        <button className="btn ghost" type="button">
          {copy.secondaryCta}
        </button>
      </div>
    </section>
  )
}

export default CTA
