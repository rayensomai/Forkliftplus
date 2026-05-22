import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogin({ copy, onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [specialId, setSpecialId] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email || !password || !specialId) return
    onLogin({ email, specialId })
    navigate('/admin')
  }

  return (
    <section className="auth">
      <div className="auth-card">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p className="section-subtitle">{copy.subtitle}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>{copy.emailLabel}</span>
            <input
              type="email"
              placeholder={copy.emailPlaceholder}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>{copy.passwordLabel}</span>
            <input
              type="password"
              placeholder={copy.passwordPlaceholder}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>{copy.specialIdLabel}</span>
            <input
              type="text"
              placeholder={copy.specialIdPlaceholder}
              value={specialId}
              onChange={(event) => setSpecialId(event.target.value)}
              required
            />
          </label>
          <button className="btn primary" type="submit">
            {copy.cta}
          </button>
        </form>
      </div>
    </section>
  )
}

export default AdminLogin
