import { Link } from 'react-router-dom'

function PortalChooser({ copy }) {
  return (
    <section className="portal-chooser">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2>{copy.title}</h2>
      <p className="section-subtitle">{copy.subtitle}</p>
      <div className="chooser-grid">
        <Link className="chooser-card" to="/client">
          <h3>{copy.clientLabel}</h3>
          <p>{copy.clientNote}</p>
          <span className="chooser-link">&rarr;</span>
        </Link>
        <Link className="chooser-card" to="/admin">
          <h3>{copy.adminLabel}</h3>
          <p>{copy.adminNote}</p>
          <span className="chooser-link">&rarr;</span>
        </Link>
      </div>
    </section>
  )
}

export default PortalChooser
