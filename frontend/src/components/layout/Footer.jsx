function Footer({ copy }) {
  const brands = [
    {
      name: 'CAT',
      logo: 'https://magshield.com/wp-content/uploads/2023/04/CAT-logo.png',
    },
    {
      name: 'Toyota Material Handling',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9WNcvG6m3JUNajkPZlBhhGo_nh5Y-fP-jQg&s',
    },
    {
      name: 'Skyjack',
      logo: 'https://www.rigolift.com/wp-content/uploads/2018/07/skyjack-logo.png',
    },
    {
      name: 'Genie',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzIjzi4nTX_6wWWfv2bV6fpUxbgNkzd1W0UQ&s',
    },
    {
      name: 'JLG',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2zVNZMJLctN21_RWk-OHMVpOqI0ax_HuMlQ&s',
    },
    {
      name: 'TotalSource',
      logo: 'https://rodavigo.net/datos/logos-marcas-png/total-source.png',
    },
    {
      name: 'Partner Brand',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjMRf2DWz4FqaWZanhJwNHiRUiO7wAdcpP6Q&s',
    },
  ]

  const handleBrandLogoError = (event) => {
    const target = event.currentTarget

    if (target?.dataset?.fallbackApplied === '1') {
      return
    }

    const src = target.getAttribute('src') || ''

    if (!src) {
      return
    }

    target.dataset.fallbackApplied = '1'

    if (src.endsWith('.png')) {
      target.src = src.replace(/\.png(\?.*)?$/i, '.svg$1')
    }
  }

  return (
    <footer className="footer" id="contact">
      <section className="footer-billboard" aria-label={copy.brandsTitle}>
        <p className="footer-block-title">{copy.brandsTitle}</p>

        <div className="brand-billboard-stage">
          {brands.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="brand-billboard-item"
              style={{ animationDelay: `${index * 2.2}s` }}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                loading="lazy"
                onError={handleBrandLogoError}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="footer-contact-grid">
        <article className="footer-contact-card">
          <p className="footer-block-title">{copy.showroomTitle}</p>
          <h4>{copy.montrealTitle}</h4>
          <p className="footer-address-line">{copy.montrealLines?.[0]}</p>
          <p>{copy.montrealLines?.[1]}</p>
        </article>

        <article className="footer-contact-card">
          <p className="footer-block-title">{copy.hqTitle}</p>
          <h4>{copy.hqLines?.[0]}</h4>
          <p className="footer-address-line">{copy.hqLines?.[1]}</p>
          <p>{copy.hqLines?.[2]}</p>
        </article>

        <article className="footer-contact-card accent">
          <p className="footer-block-title">
            {copy.contactTitle ?? 'ForkliftPlus'}
          </p>

          <p className="footer-note">{copy.note}</p>

          <a
            className="footer-contact-link"
            href={`tel:${copy.phone?.replace(/\s+/g, '')}`}
          >
            <strong>{copy.phoneLabel}:</strong> {copy.phone}
          </a>

          <a className="footer-contact-link" href={`mailto:${copy.email}`}>
            <strong>{copy.emailLabel}:</strong> {copy.email}
          </a>
        </article>
      </section>

      <div className="footer-legal">
        <p className="footer-copy">{copy.copy}</p>
      </div>
    </footer>
  )
}

export default Footer