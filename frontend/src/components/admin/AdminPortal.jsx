import { useMemo, useState } from 'react'
import FeatureGrid from '../common/FeatureGrid.jsx'

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function AdminPortal({ copy, features, companies }) {
  const [activePanel, setActivePanel] = useState(null)

  const kpis = useMemo(() => {
    const partnerCount = companies.length
    const qcCount = companies.filter((company) => company.region?.toUpperCase() === 'QC').length
    const readyCampaigns = companies.filter((company) => company.email).length

    return [
      { value: String(partnerCount), label: copy.admin.kpiLabels.partners },
      { value: String(qcCount), label: copy.admin.kpiLabels.quebec },
      { value: String(readyCampaigns), label: copy.admin.kpiLabels.campaigns },
    ]
  }, [companies, copy.admin.kpiLabels])

  const analytics = useMemo(() => {
    const byRegion = companies.reduce((accumulator, company) => {
      const key = company.region || 'N/A'
      accumulator[key] = (accumulator[key] || 0) + 1
      return accumulator
    }, {})

    return Object.entries(byRegion)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
  }, [companies])

  const handleFeatureAction = (feature) => {
    if (feature.action === 'map') {
      scrollToSection('map')
      return
    }
    if (feature.action === 'company-form') {
      scrollToSection('company-form')
      return
    }
    if (feature.action === 'analytics') {
      setActivePanel((current) => (current === 'analytics' ? null : 'analytics'))
      return
    }
    if (feature.action === 'rentals') {
      scrollToSection('admin-rentals')
      return
    }
    scrollToSection('map')
  }

  const handleInviteTeam = () => {
    const subject = encodeURIComponent(copy.admin.inviteSubject)
    const body = encodeURIComponent(copy.admin.inviteBody)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <section className="portal-section" id="admin">
      <div className="portal-header">
        <div>
          <p className="eyebrow">{copy.admin.eyebrow}</p>
          <h2>{copy.admin.title}</h2>
          <p className="section-subtitle">{copy.admin.subtitle}</p>
        </div>
        <div className="portal-actions">
          <button className="btn primary" type="button" onClick={() => scrollToSection('map')}>
            {copy.admin.primaryCta}
          </button>
          <button className="btn ghost" type="button" onClick={handleInviteTeam}>
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
          {kpis.map((kpi) => (
            <button
              key={kpi.label}
              type="button"
              className="kpi kpi-button"
              onClick={() => scrollToSection('map')}
            >
              <span>{kpi.value}</span>
              <p>{kpi.label}</p>
            </button>
          ))}
        </div>
      </div>

      {activePanel === 'analytics' ? (
        <div className="admin-analytics-panel reveal">
          <div>
            <h3>{copy.admin.analyticsTitle}</h3>
            <p>{copy.admin.analyticsSubtitle}</p>
          </div>
          <div className="admin-analytics-grid">
            {analytics.length ? (
              analytics.map(([region, count]) => (
                <div key={region} className="admin-analytics-card">
                  <strong>{count}</strong>
                  <span>{region}</span>
                </div>
              ))
            ) : (
              <p>{copy.admin.analyticsEmpty}</p>
            )}
          </div>
        </div>
      ) : null}

      <FeatureGrid items={features} onItemClick={handleFeatureAction} />
    </section>
  )
}

export default AdminPortal
