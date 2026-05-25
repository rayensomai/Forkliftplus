import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import EmailPreview from '../components/collaboration/EmailPreview.jsx'
import { getPromoShowcase } from '../data/promoShowcase.js'

function getInitials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function fillTemplate(template, data) {
  return Object.entries(data).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value ?? ''),
    template
  )
}

function CollaborationPage({ copy }) {
  const { companyId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  const collab = copy.collaboration

  const [company, setCompany] = useState(location.state?.company ?? null)
  const [recipientEmail, setRecipientEmail] = useState(location.state?.company?.email ?? '')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(company ? 'ready' : 'loading')
  const [error, setError] = useState('')
  const [sendState, setSendState] = useState('idle')
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] = useState('')

  const promoShowcase = useMemo(
    () => getPromoShowcase(collab?.locale || 'fr-CA'),
    [collab?.locale]
  )

  useEffect(() => {
    let isActive = true
    const controller = new AbortController()

    const fetchCompany = async () => {
      if (location.state?.company?.id === Number(companyId)) return

      setStatus('loading')
      setError('')

      try {
        const response = await fetch(`${apiBase}/companies/${companyId}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Not found')
        const data = await response.json()
        if (isActive) {
          setCompany(data)
          setRecipientEmail(data.email || '')
          setStatus('ready')
        }
      } catch {
        if (controller.signal.aborted || !isActive) return
        if (location.state?.company) {
          setCompany(location.state.company)
          setRecipientEmail(location.state.company.email || '')
          setStatus('ready')
          return
        }
        setStatus('error')
        setError(collab.error)
      }
    }

    fetchCompany()
    return () => {
      isActive = false
      controller.abort()
    }
  }, [apiBase, companyId, collab.error, location.state?.company])

  useEffect(() => {
    if (!company) return

    const data = {
      company: company.name,
      focus: company.focus || 'materiel de manutention',
      email: company.email || '',
      city: company.city || '',
      region: company.region || '',
      address: company.address || collab.addressFallback,
    }

    setSubject(fillTemplate(collab.defaultSubject, data))
    setMessage(fillTemplate(collab.defaultMessage, data))
  }, [company, collab])

  const handleSendEmail = async (event) => {
    event.preventDefault()
    if (!company) return

    const finalSubject = subject.trim()
    const finalMessage = message.trim()
    const finalRecipientEmail = recipientEmail.trim()

    if (!finalSubject || !finalMessage || !finalRecipientEmail) {
      setSendError(collab.required)
      setSendSuccess('')
      return
    }

    setSendState('loading')
    setSendError('')
    setSendSuccess('')

    try {
      const response = await fetch(`${apiBase}/companies/send-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: finalSubject,
          message: finalMessage,
          recipient_email: finalRecipientEmail,
          reply_to_email: 'info@forkliftplus.com',
          company_id: company.id,
          company_name: company.name,
          company_email: company.email,
          company_address: company.address || '',
          company_city: company.city || '',
          company_region: company.region || '',
          company_focus: company.focus || '',
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        const detail = typeof data.detail === 'string' ? data.detail : collab.sendError
        if (detail.includes('535') || detail.includes('Username and Password')) {
          setSendError(collab.smtpHint)
        } else if (detail.includes('Email service unavailable')) {
          setSendError(collab.smtpHint)
        } else {
          setSendError(detail)
        }
        setSendState('idle')
        return
      }

      const data = await response.json()
      setSendState('success')
      if (data.delivery_mode === 'dev_inbox') {
        setSendSuccess(
          collab.sendSuccessDev
            .replace('{email}', data.recipient || finalRecipientEmail)
            .replace('{url}', data.dev_inbox_url || 'http://localhost:8000/dev/emails/view')
        )
      } else {
        setSendSuccess(collab.sendSuccess.replace('{email}', data.recipient || finalRecipientEmail))
      }
    } catch {
      setSendError(collab.sendError)
      setSendState('idle')
    }
  }

  if (status === 'loading') {
    return (
      <section className="collab-studio collab-studio-loading">
        <p>{collab.loading}</p>
      </section>
    )
  }

  if (status === 'error' || !company) {
    return (
      <section className="collab-studio collab-studio-error">
        <p>{error || collab.error}</p>
        <Link className="btn primary" to="/admin">
          {collab.backCta}
        </Link>
      </section>
    )
  }

  return (
    <section className="collab-studio">
      <div className="collab-studio-hero">
        <div className="collab-studio-hero-copy">
          <p className="eyebrow">{collab.eyebrow}</p>
          <h1>{collab.title}</h1>
          <p className="section-subtitle">{collab.subtitle}</p>
        </div>
        <div className="collab-studio-partner-chip">
          <span className="collab-studio-avatar">{getInitials(company.name)}</span>
          <div>
            <strong>{company.name}</strong>
            <span>
              {company.city}, {company.region}
            </span>
          </div>
        </div>
        <Link className="btn ghost collab-studio-back" to="/admin">
          {collab.backCta}
        </Link>
      </div>

      <div className="collab-studio-layout">
        <EmailPreview
          company={company}
          copy={collab}
          promoShowcase={promoShowcase}
          subject={subject}
          message={message}
        />

        <aside className="collab-studio-panel">
          <div className="collab-studio-panel-header">
            <h2>{collab.panelTitle}</h2>
            <p>{collab.panelSubtitle}</p>
          </div>

          <div className="collab-studio-value-grid">
            {collab.valueCards.map((card) => (
              <article key={card.title} className="collab-studio-value-card">
                <span>{card.icon}</span>
                <strong>{card.title}</strong>
                <p>{card.text}</p>
              </article>
            ))}
          </div>

          <form className="collab-studio-form" onSubmit={handleSendEmail}>
            <label className="field">
              <span>{collab.recipientLabel}</span>
              <input
                type="email"
                value={recipientEmail}
                onChange={(event) => setRecipientEmail(event.target.value)}
                placeholder={collab.recipientPlaceholder}
              />
            </label>
            <label className="field">
              <span>{collab.subjectLabel}</span>
              <input type="text" value={subject} onChange={(event) => setSubject(event.target.value)} />
            </label>
            <label className="field">
              <span>{collab.messageLabel}</span>
              <textarea rows="10" value={message} onChange={(event) => setMessage(event.target.value)} />
            </label>

            <div className="collab-studio-form-actions">
              <button className="btn primary collab-studio-send" type="submit" disabled={sendState === 'loading'}>
                {sendState === 'loading' ? collab.sending : collab.sendCta}
              </button>
              <button className="btn ghost" type="button" onClick={() => navigate(-1)}>
                {collab.returnCta}
              </button>
            </div>

            {sendSuccess ? <p className="form-success">{sendSuccess}</p> : null}
            {sendError ? <p className="form-error">{sendError}</p> : null}
          </form>

          <ul className="collab-studio-tips">
            {collab.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  )
}

export default CollaborationPage
