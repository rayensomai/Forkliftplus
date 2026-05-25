import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useClientAuth } from '../context/ClientAuthContext.jsx'

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function Checkout({ copy }) {
  const { items, subtotal, clearCart } = useCart()
  const { client } = useClientAuth()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    address: '',
    city: '',
    postal: '',
    cardName: client?.name ?? '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(copy.locale || 'fr-CA', {
        style: 'currency',
        currency: 'CAD',
        maximumFractionDigits: 0,
      }),
    [copy.locale]
  )

  const taxEstimate = Math.round(subtotal * 0.14975)
  const total = subtotal + taxEstimate

  const handleChange = (field) => (event) => {
    let value = event.target.value
    if (field === 'cardNumber') value = formatCardNumber(value)
    if (field === 'expiry') value = formatExpiry(value)
    if (field === 'cvv') value = value.replace(/\D/g, '').slice(0, 4)
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    clearCart()
  }

  if (!items.length && !submitted) {
    return (
      <section className="checkout-page">
        <div className="checkout-empty">
          <h1>{copy.emptyTitle}</h1>
          <p>{copy.emptySubtitle}</p>
          <Link className="btn primary" to="/#catalog">
            {copy.backToShop}
          </Link>
        </div>
      </section>
    )
  }

  if (submitted) {
    return (
      <section className="checkout-page">
        <div className="checkout-success">
          <div className="checkout-success-icon" aria-hidden="true">
            ✓
          </div>
          <h1>{copy.successTitle}</h1>
          <p>{copy.successSubtitle}</p>
          <Link className="btn primary" to="/">
            {copy.backHome}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="checkout-page">
      <div className="checkout-header">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className="section-subtitle">{copy.subtitle}</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <fieldset className="checkout-fieldset">
            <legend>{copy.billingTitle}</legend>
            <label className="field">
              <span>{copy.email}</span>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder={copy.emailPlaceholder}
                required
              />
            </label>
            <label className="field">
              <span>{copy.phone}</span>
              <input
                type="tel"
                value={form.phone}
                onChange={handleChange('phone')}
                placeholder={copy.phonePlaceholder}
                required
              />
            </label>
            <label className="field">
              <span>{copy.address}</span>
              <input
                type="text"
                value={form.address}
                onChange={handleChange('address')}
                placeholder={copy.addressPlaceholder}
                required
              />
            </label>
            <div className="checkout-row">
              <label className="field">
                <span>{copy.city}</span>
                <input
                  type="text"
                  value={form.city}
                  onChange={handleChange('city')}
                  placeholder={copy.cityPlaceholder}
                  required
                />
              </label>
              <label className="field">
                <span>{copy.postal}</span>
                <input
                  type="text"
                  value={form.postal}
                  onChange={handleChange('postal')}
                  placeholder={copy.postalPlaceholder}
                  required
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="checkout-fieldset checkout-payment">
            <legend>{copy.paymentTitle}</legend>
            <label className="field">
              <span>{copy.cardName}</span>
              <input
                type="text"
                value={form.cardName}
                onChange={handleChange('cardName')}
                placeholder={copy.cardNamePlaceholder}
                autoComplete="cc-name"
                required
              />
            </label>
            <label className="field">
              <span>{copy.cardNumber}</span>
              <input
                type="text"
                inputMode="numeric"
                value={form.cardNumber}
                onChange={handleChange('cardNumber')}
                placeholder="4242 4242 4242 4242"
                autoComplete="cc-number"
                required
              />
            </label>
            <div className="checkout-row">
              <label className="field">
                <span>{copy.expiry}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.expiry}
                  onChange={handleChange('expiry')}
                  placeholder="MM/AA"
                  autoComplete="cc-exp"
                  required
                />
              </label>
              <label className="field">
                <span>{copy.cvv}</span>
                <input
                  type="password"
                  inputMode="numeric"
                  value={form.cvv}
                  onChange={handleChange('cvv')}
                  placeholder="123"
                  autoComplete="cc-csc"
                  required
                />
              </label>
            </div>
            <div className="checkout-secure">
              <span aria-hidden="true">🔒</span>
              <p>{copy.secureNote}</p>
            </div>
          </fieldset>

          <button className="btn primary checkout-submit" type="submit">
            {copy.payNow} — {currencyFormatter.format(total)}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>{copy.orderSummary}</h2>
          <ul className="checkout-items">
            {items.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    × {item.quantity} — {currencyFormatter.format(item.price)}
                  </span>
                </div>
                <strong>{currencyFormatter.format(item.price * item.quantity)}</strong>
              </li>
            ))}
          </ul>
          <div className="checkout-summary-row">
            <span>{copy.subtotal}</span>
            <strong>{currencyFormatter.format(subtotal)}</strong>
          </div>
          <div className="checkout-summary-row">
            <span>{copy.taxes}</span>
            <strong>{currencyFormatter.format(taxEstimate)}</strong>
          </div>
          <div className="checkout-summary-row checkout-summary-total">
            <span>{copy.total}</span>
            <strong>{currencyFormatter.format(total)}</strong>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Checkout
