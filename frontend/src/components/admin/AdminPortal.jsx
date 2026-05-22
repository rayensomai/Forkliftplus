import FeatureGrid from '../common/FeatureGrid.jsx'

function AdminPortal({ copy, features }) {
  return (
    <section className="portal-section" id="admin">
      <div className="portal-header">
        <div>
          <p className="eyebrow">{copy.admin.eyebrow}</p>
          <h2>{copy.admin.title}</h2>
          <p className="section-subtitle">{copy.admin.subtitle}</p>
        </div>
        <div className="portal-actions">
          <button className="btn primary" type="button">
            {copy.admin.primaryCta}
          </button>
          <button className="btn ghost" type="button">
            {copy.admin.secondaryCta}
          </button>
        </div>
      </div>
      <div className="admin-board reveal">
        <div>
          <h3>{copy.admin.boardTitle}</h3>
          <p>{copy.admin.boardSubtitle}</p>
        </div>
        <div className="admin-kpis">
          {copy.admin.kpis.map((kpi) => (
            <div key={kpi.label} className="kpi">
              <span>{kpi.value}</span>
              <p>{kpi.label}</p>
            </div>
          ))}
        </div>
      </div>
      <FeatureGrid items={features} />
    </section>
  )
}

export default AdminPortal
