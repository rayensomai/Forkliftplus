import { Link, NavLink } from 'react-router-dom'
import LanguageToggle from './LanguageToggle.jsx'

function TopNav({ copy, lang, onLangChange, isAuthed, onLogout }) {
  return (
    <header className="top-nav">
      <Link className="brand" to="/">
        <img
          className="brand-logo"
          src="https://www.forkliftplus.com/wp-content/uploads/2020/06/forklift-250.png"
          alt="Forklift Plus Logo"
        />
        <div>
          <p className="brand-title">ForkliftPlus</p>
          <p className="brand-subtitle">Ops Marketplace</p>
        </div>
      </Link>
      <nav className="nav-links" aria-label="Primary">
        <NavLink to="/admin">{copy.nav.admin}</NavLink>
        <Link to="/admin#map">{copy.nav.map}</Link>
        <Link to="/admin#pricing">{copy.nav.pricing}</Link>
        <Link to="/admin#contact">{copy.nav.contact}</Link>
      </nav>
      <div className="nav-actions">
        <Link className="admin-badge" to={isAuthed ? '/admin' : '/admin/login'}>
          <span className="admin-badge-icon" aria-hidden="true">
            A
          </span>
          <span>{copy.nav.adminShort}</span>
        </Link>
        {isAuthed ? (
          <button className="btn ghost" type="button" onClick={onLogout}>
            {copy.nav.logout}
          </button>
        ) : null}
        <LanguageToggle lang={lang} onLangChange={onLangChange} />
      </div>
    </header>
  )
}

export default TopNav
