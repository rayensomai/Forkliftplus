import { Link } from 'react-router-dom'

const METRIC_ICONS = ['🚜', '🤝', '✓']
const FLEET_STAT_TONES = ['sky', 'emerald', 'amber', 'violet']

function Hero({ copy }) {
  return (
    <section className="hero hero-prime" id="top">
      <div className="hero-content reveal">
        <p className="eyebrow hero-eyebrow">{copy.hero.eyebrow}</p>
        <h1>
          <span className="hero-title-gradient">{copy.hero.title}</span>
        </h1>
        <p className="hero-subtitle">{copy.hero.subtitle}</p>
        <div className="hero-actions">
          <Link className="btn primary" to="/client">
            {copy.hero.primaryCta}
          </Link>
          <a className="btn ghost" href="#catalog">
            {copy.hero.secondaryCta}
          </a>
        </div>
        <div className="hero-metrics">
          {copy.hero.metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`hero-stat-card reveal delay-${index + 1}`}
              style={{ '--stat-tone': index }}
            >
              <span className="hero-stat-icon" aria-hidden="true">
                {METRIC_ICONS[index] ?? '◆'}
              </span>
              <div className="hero-stat-copy">
                <span className="metric-value">{metric.value}</span>
                <span className="metric-label">{metric.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-visual">
        <div className="fleet-showcase reveal delay-1">
          <header className="fleet-showcase-head">
            <span className="fleet-live-pulse" aria-hidden="true" />
            <div>
              <p className="card-label">{copy.hero.panelTitle}</p>
              <h3 className="fleet-showcase-title">{copy.hero.panelSubtitle}</h3>
            </div>
          </header>

          <div className="fleet-stats-showcase">
            {copy.hero.panelStats.map((stat, index) => (
              <article
                key={stat.label}
                className={`fleet-stat-card tone-${FLEET_STAT_TONES[index % FLEET_STAT_TONES.length]}`}
              >
                <span className="fleet-stat-value">{stat.value}</span>
                <span className="fleet-stat-label">{stat.label}</span>
              </article>
            ))}
          </div>

          <div className="fleet-tags">
            {copy.hero.panelTags.map((tag) => (
              <span key={tag} className="chip chip-vivid">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
