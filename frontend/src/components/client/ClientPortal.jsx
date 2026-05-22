import FeatureGrid from '../common/FeatureGrid.jsx'
import LogisticsMap from '../admin/LogisticsMap.jsx'

function ClientPortal({ copy, features, mapCopy }) {
  return (
    <section className="portal-section" id="client">
      <div className="portal-header">
        <div>
          <p className="eyebrow">{copy.client.eyebrow}</p>
          <h2>{copy.client.title}</h2>
          <p className="section-subtitle">{copy.client.subtitle}</p>
        </div>
        <div className="portal-actions">
          <button className="btn primary" type="button">
            {copy.client.primaryCta}
          </button>
          <button className="btn ghost" type="button">
            {copy.client.secondaryCta}
          </button>
        </div>
      </div>
      <FeatureGrid items={features} />
      <LogisticsMap copy={mapCopy} />
    </section>
  )
}

export default ClientPortal
