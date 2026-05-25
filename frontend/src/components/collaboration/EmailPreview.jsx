import { FORKLIFTPLUS_IMAGES } from '../../data/forkliftplusImages.js'

function EmailPreview({ company, copy, promoShowcase, subject, message }) {
  const lines = message.split('\n').filter(Boolean)

  return (
    <div className="email-preview-shell">
      <div className="email-preview-device">
        <div className="email-preview-toolbar">
          <span />
          <span />
          <span />
          <p>{copy.previewDeviceLabel}</p>
        </div>

        <article className="email-preview-card">
          <header className="email-preview-hero">
            <div className="email-preview-brand">
              <img src={FORKLIFTPLUS_IMAGES.logo} alt="ForkliftPlus" />
              <div>
                <p className="email-preview-kicker">{copy.previewKicker}</p>
                <h2>
                  ForkliftPlus <span>x</span> {company.name}
                </h2>
                <p>{copy.previewHeroSubtitle}</p>
              </div>
            </div>
            <div className="email-preview-pills">
              {copy.hooks.map((hook) => (
                <span key={hook}>{hook}</span>
              ))}
            </div>
          </header>

          <div className="email-preview-hero-banner">
            <img src={FORKLIFTPLUS_IMAGES.hero} alt="" loading="lazy" />
            <div className="email-preview-hero-overlay">
              <strong>{copy.previewBannerTitle}</strong>
              <p>{copy.previewBannerSubtitle.replace('{company}', company.name)}</p>
            </div>
          </div>

          <div className="email-preview-stats">
            {copy.stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="email-preview-body">
            <div className="email-preview-subject-line">
              <span>{copy.subjectLabel}</span>
              <strong>{subject}</strong>
            </div>

            <div className="email-preview-message">
              {lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <div className="email-preview-partner-card">
              <p>{copy.partnerCardTitle}</p>
              <ul>
                <li>
                  <span>{copy.partnerCity}</span>
                  <strong>
                    {company.city}, {company.region}
                  </strong>
                </li>
                <li>
                  <span>{copy.partnerFocus}</span>
                  <strong>{company.focus}</strong>
                </li>
                <li>
                  <span>{copy.partnerEmail}</span>
                  <strong>{company.email}</strong>
                </li>
              </ul>
            </div>
          </div>

          <section className="email-preview-grid">
            <p className="email-preview-section-title">{copy.previewGridTitle}</p>
            <div className="email-preview-products">
              {promoShowcase.map((item) => (
                <figure key={item.title} className="email-preview-product">
                  <img src={item.src} alt={item.title} loading="lazy" />
                  <figcaption>
                    <strong>{item.title}</strong>
                    <span>{item.tag}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="email-preview-ribbons">
            <p className="email-preview-section-title">{copy.previewRibbonTitle}</p>
            <div className="email-preview-ribbon email-preview-ribbon-a">
              <div className="email-preview-ribbon-track">
                {[...promoShowcase, ...promoShowcase].map((item, index) => (
                  <div key={`a-${item.title}-${index}`} className="email-preview-ribbon-item">
                    <img src={item.src} alt={item.title} loading="lazy" />
                    <strong>{item.title}</strong>
                    <span>{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="email-preview-ribbon email-preview-ribbon-b">
              <div className="email-preview-ribbon-track reverse">
                {[...promoShowcase, ...promoShowcase].map((item, index) => (
                  <div key={`b-${item.title}-${index}`} className="email-preview-ribbon-item">
                    <img src={item.src} alt={item.title} loading="lazy" />
                    <strong>{item.title}</strong>
                    <span>{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <footer className="email-preview-footer">
            <div className="email-preview-cta">
              <strong>{copy.previewCtaTitle}</strong>
              <p>{copy.previewCtaText}</p>
              <span>{copy.previewCtaButton}</span>
            </div>
            <p>{copy.previewFooter}</p>
          </footer>
        </article>
      </div>
    </div>
  )
}

export default EmailPreview
