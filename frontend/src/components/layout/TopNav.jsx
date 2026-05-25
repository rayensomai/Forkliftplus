import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import { useClientAuth } from '../../context/ClientAuthContext.jsx'
import LanguageToggle from './LanguageToggle.jsx'

function TopNav({ copy, lang, onLangChange, isAdminAuthed, onAdminLogout }) {
  const { itemCount } = useCart()
  const { client, isClientAuthed, logout: clientLogout } = useClientAuth()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className={`top-nav${isHome ? ' top-nav-home' : ''}`}>
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

      <div className="nav-actions">
        <Link className="btn ghost btn-small rental-nav-link" to="/location">
          {copy.nav.rental}
        </Link>

        {isClientAuthed ? (
          <div className="client-chip">
            <span>{client.name}</span>
            <button className="btn ghost btn-small" type="button" onClick={clientLogout}>
              {copy.nav.clientLogout}
            </button>
          </div>
        ) : (
          <Link className="btn ghost btn-small client-account-link" to="/client/compte">
            {copy.nav.clientAccount}
          </Link>
        )}

        <Link className="cart-button" to="/cart" aria-label={copy.nav.cart}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="20" r="1.5" fill="currentColor" />
            <circle cx="18" cy="20" r="1.5" fill="currentColor" />
          </svg>
          {itemCount > 0 ? <span className="cart-badge">{itemCount}</span> : null}
        </Link>

        {isAdminAuthed ? (
          <button className="btn ghost btn-small nav-logout" type="button" onClick={onAdminLogout}>
            {copy.nav.logout}
          </button>
        ) : null}

        <LanguageToggle lang={lang} onLangChange={onLangChange} />

        <Link
          className="admin-gate"
          to={isAdminAuthed ? '/admin' : '/admin/login'}
          title={copy.nav.adminAccess}
          aria-label={copy.nav.adminAccess}
        >
          <img
            src="https://www.forkliftplus.com/wp-content/uploads/2020/06/forklift-250.png"
            alt=""
          />
        </Link>
      </div>
    </header>
  )
}

export default TopNav
