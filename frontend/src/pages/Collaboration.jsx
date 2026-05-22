import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

const promoShowcase = [
  {
    title: 'Chariot propane',
    src: 'https://www.forkliftplus.com/wp-content/uploads/2023/05/Cat-2P5000.jpg',
  },
  {
    title: 'Chariot electrique',
    src: 'https://www.forkliftplus.com/wp-content/uploads/2024/06/electric-pallte-truck-home-1.jpg',
  },
  {
    title: 'Chariot diesel',
    src: 'https://www.forkliftplus.com/wp-content/uploads/2024/10/Skyjack-3219.jpg',
  },
]

function CollaborationPage({ copy }) {
  const { companyId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  const [company, setCompany] = useState(location.state?.company ?? null)
  const [recipientEmail, setRecipientEmail] = useState(location.state?.company?.email ?? '')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(company ? 'ready' : 'loading')
  const [error, setError] = useState('')
  const [sendState, setSendState] = useState('idle')
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] = useState('')

  useEffect(() => {
    let isActive = true
    const controller = new AbortController()

    const fetchCompany = async () => {
      if (location.state?.company?.id === Number(companyId)) {
        return
      }

      setStatus('loading')
      setError('')

      try {
        const response = await fetch(`${apiBase}/companies/${companyId}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Not found')
        }

        const data = await response.json()
        if (isActive) {
          setCompany(data)
          setRecipientEmail(data.email || '')
          setStatus('ready')
        }
      } catch (fetchError) {
        if (controller.signal.aborted) return
        if (isActive) {
          setStatus('error')
          setError(copy.collaboration.error)
        }
      }
    }

    fetchCompany()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [apiBase, companyId, copy.collaboration.error, location.state?.company])

  useEffect(() => {
    if (!company) return
    setSubject(
      copy.collaboration.defaultSubject
        .replace('{company}', company.name)
        .replace('{focus}', company.focus || 'materiel de manutention')
    )
    setMessage(
      copy.collaboration.defaultMessage
        .replace('{company}', company.name)
        .replace('{email}', company.email || '')
        .replace('{city}', company.city || '')
        .replace('{focus}', company.focus || '')
    )
  }, [company, copy.collaboration.defaultMessage, copy.collaboration.defaultSubject])

  const handleSendEmail = async (event) => {
    event.preventDefault()
    if (!company) return

    const finalSubject = subject.trim()
    const finalMessage = message.trim()
    const finalRecipientEmail = recipientEmail.trim()

    if (!finalSubject || !finalMessage || !finalRecipientEmail) {
      setSendError(copy.collaboration.required)
      setSendSuccess('')
      return
    }

    setSendState('loading')
    setSendError('')
    setSendSuccess('')

    try {
      const response = await fetch(`${apiBase}/companies/${company.id}/collaboration-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: finalSubject,
          message: finalMessage,
          recipient_email: finalRecipientEmail,
          reply_to_email: 'info@forkliftplus.com',
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setSendError(data.detail || copy.collaboration.sendError)
        setSendState('idle')
        return
      }

      setSendState('success')
      setSendSuccess(copy.collaboration.sendSuccess)
    } catch (sendError) {
      setSendError(copy.collaboration.sendError)
      setSendState('idle')
    }
  }

  return (
    <section className="collaboration-page">
      <div className="collaboration-hero">
        <div>
          <p className="eyebrow">{copy.collaboration.eyebrow}</p>
          <h1>{copy.collaboration.title}</h1>
          <p className="section-subtitle">{copy.collaboration.subtitle}</p>
        </div>
        <Link className="btn ghost" to="/admin">
          {copy.collaboration.backCta}
        </Link>
      </div>

      {status === 'loading' ? <p className="collaboration-status">{copy.collaboration.loading}</p> : null}
      {status === 'error' ? <p className="collaboration-status error">{error}</p> : null}

      {company ? (
        <div className="collaboration-card">
          <div className="collaboration-company">
            <p className="card-label">{copy.collaboration.companyLabel}</p>
            <h2>{company.name}</h2>
            <p>
              {company.city}, {company.region} · {company.focus}
            </p>
            <p className="collaboration-email">{company.email}</p>
            <p>{company.address || copy.collaboration.addressFallback}</p>
            <div className="collaboration-preview">
              <div className="collaboration-preview-header">
                <p className="card-label">{copy.collaboration.previewLabel}</p>
                <h3>{copy.collaboration.previewTitle}</h3>
                <p>{copy.collaboration.previewSubtitle}</p>
              </div>
              <div className="collaboration-ribbon" aria-hidden="true">
                <div className="collaboration-ribbon-track">
                  {[...promoShowcase, ...promoShowcase].map((item, index) => (
                    <div key={`${item.title}-${index}`} className="collaboration-ribbon-card">
                      <img src={item.src} alt={item.title} />
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ul className="collaboration-bullets">
                {copy.collaboration.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>

          <form className="collaboration-form" onSubmit={handleSendEmail}>
            <label className="field">
              <span>{copy.collaboration.recipientLabel}</span>
              <input
                type="email"
                value={recipientEmail}
                onChange={(event) => setRecipientEmail(event.target.value)}
                placeholder={copy.collaboration.recipientPlaceholder}
              />
            </label>
            <label className="field">
              <span>{copy.collaboration.subjectLabel}</span>
              <input
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </label>
            <label className="field">
              <span>{copy.collaboration.messageLabel}</span>
              <textarea
                rows="8"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>
            <div className="collaboration-actions">
              <button className="btn primary" type="submit" disabled={sendState === 'loading'}>
                {sendState === 'loading' ? copy.collaboration.sending : copy.collaboration.sendCta}
              </button>
              <button className="btn ghost" type="button" onClick={() => navigate(-1)}>
                {copy.collaboration.returnCta}
              </button>
            </div>
            {sendSuccess ? <p className="form-success">{sendSuccess}</p> : null}
            {sendError ? <p className="form-error">{sendError}</p> : null}
          </form>
        </div>
      ) : null}
    </section>
  )
}

export default CollaborationPage