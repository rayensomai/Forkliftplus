import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useClientAuth } from '../context/ClientAuthContext.jsx'

function ClientAccount({ copy }) {
  const { register, login, isClientAuthed } = useClientAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const [mode, setMode] = useState('register')
  const [errorKey, setErrorKey] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
  })

  if (isClientAuthed) {
    return (
      <section className="auth">
        <div className="auth-card">
          <p className="eyebrow">{copy.alreadySignedInEyebrow}</p>
          <h2>{copy.alreadySignedInTitle}</h2>
          <p className="section-subtitle">{copy.alreadySignedInSubtitle}</p>
          <div className="auth-card-actions">
            <Link className="btn primary" to={redirectTo}>
              {copy.continueShopping}
            </Link>
            <Link className="btn ghost" to="/location">
              {copy.rentalCta}
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrorKey('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (mode === 'register') {
      if (form.password !== form.confirmPassword) {
        setErrorKey('password_mismatch')
        return
      }

      const result = register({
        name: form.name,
        email: form.email,
        password: form.password,
        company: form.company,
        phone: form.phone,
      })

      if (!result.ok) {
        setErrorKey(result.error)
        return
      }
    } else {
      const result = login({ email: form.email, password: form.password })
      if (!result.ok) {
        setErrorKey(result.error)
        return
      }
    }

    navigate(redirectTo)
  }

  return (
    <section className="auth client-account">
      <div className="auth-card client-account-card">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{mode === 'register' ? copy.registerTitle : copy.loginTitle}</h2>
        <p className="section-subtitle">
          {mode === 'register' ? copy.registerSubtitle : copy.loginSubtitle}
        </p>

        <div className="client-account-tabs">
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => {
              setMode('register')
              setErrorKey('')
            }}
          >
            {copy.registerTab}
          </button>
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => {
              setMode('login')
              setErrorKey('')
            }}
          >
            {copy.loginTab}
          </button>
        </div>

        {errorKey ? (
          <p className="auth-error" role="alert">
            {copy.errors[errorKey]}
          </p>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <>
              <label className="field">
                <span>{copy.nameLabel}</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder={copy.namePlaceholder}
                  required
                />
              </label>
              <label className="field">
                <span>{copy.companyLabel}</span>
                <input
                  type="text"
                  value={form.company}
                  onChange={handleChange('company')}
                  placeholder={copy.companyPlaceholder}
                />
              </label>
              <label className="field">
                <span>{copy.phoneLabel}</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  placeholder={copy.phonePlaceholder}
                />
              </label>
            </>
          ) : null}

          <label className="field">
            <span>{copy.emailLabel}</span>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder={copy.emailPlaceholder}
              required
            />
          </label>

          <label className="field">
            <span>{copy.passwordLabel}</span>
            <input
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              placeholder={copy.passwordPlaceholder}
              required
            />
          </label>

          {mode === 'register' ? (
            <label className="field">
              <span>{copy.confirmPasswordLabel}</span>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder={copy.confirmPasswordPlaceholder}
                required
              />
            </label>
          ) : null}

          <button className="btn primary" type="submit">
            {mode === 'register' ? copy.registerCta : copy.loginCta}
          </button>
        </form>

        <p className="client-account-note">{copy.requiredNote}</p>
      </div>
    </section>
  )
}

export default ClientAccount
