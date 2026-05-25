import { Link, useNavigate } from 'react-router-dom'
import FeatureGrid from '../common/FeatureGrid.jsx'
import LogisticsMap from '../admin/LogisticsMap.jsx'

function ClientPortal({ copy, features, mapCopy }) {
  const navigate = useNavigate()

  const handleFeatureAction = (feature) => {
    if (feature.action === 'rental') {
      navigate('/location')
    }
  }

  return (
    <section className="portal-section" id="client">
      <div className="portal-header">
        <div>
          <p className="eyebrow">{copy.client.eyebrow}</p>
          <h2>{copy.client.title}</h2>
          <p className="section-subtitle">{copy.client.subtitle}</p>
        </div>
        <div className="portal-actions">
          <Link className="btn primary" to="/">
            {copy.client.primaryCta}
          </Link>
          <Link className="btn ghost" to="/location">
            {copy.client.secondaryCta}
          </Link>
        </div>
      </div>
      <FeatureGrid items={features} onItemClick={handleFeatureAction} />
      <LogisticsMap copy={mapCopy} />
    </section>
  )
}

export default ClientPortal
