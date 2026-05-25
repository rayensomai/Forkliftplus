import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function Cart({ copy }) {
  const { items, subtotal, removeItem, updateQuantity } = useCart()
  const navigate = useNavigate()

  const currencyFormatter = new Intl.NumberFormat(copy.locale || 'fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  })

  const taxEstimate = Math.round(subtotal * 0.14975)
  const total = subtotal + taxEstimate

  if (!items.length) {
    return (
      <section className="cart-page">
        <div className="cart-empty-card">
          <div className="cart-empty-icon" aria-hidden="true">
            🛒
          </div>
          <h1>{copy.emptyTitle}</h1>
          <p>{copy.emptySubtitle}</p>
          <Link className="btn primary" to="/#catalog">
            {copy.browseCta}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <div className="cart-header">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className="section-subtitle">
          {items.length} {copy.itemsLabel}
        </p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} loading="lazy" />
              </div>
              <div className="cart-item-body">
                <span className="product-category">{item.categoryLabel}</span>
                <h3>{item.name}</h3>
                <strong>{currencyFormatter.format(item.price)}</strong>
              </div>
              <div className="cart-item-actions">
                <label className="cart-qty">
                  <span>{copy.quantity}</span>
                  <div className="qty-controls">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label={`${copy.quantity} -`}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={`${copy.quantity} +`}
                    >
                      +
                    </button>
                  </div>
                </label>
                <button
                  className="btn ghost btn-small cart-remove"
                  type="button"
                  onClick={() => removeItem(item.id)}
                >
                  {copy.remove}
                </button>
              </div>
              <div className="cart-item-total">
                {currencyFormatter.format(item.price * item.quantity)}
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>{copy.summaryTitle}</h2>
          <div className="cart-summary-row">
            <span>{copy.subtotal}</span>
            <strong>{currencyFormatter.format(subtotal)}</strong>
          </div>
          <div className="cart-summary-row">
            <span>{copy.taxes}</span>
            <strong>{currencyFormatter.format(taxEstimate)}</strong>
          </div>
          <div className="cart-summary-row cart-summary-total">
            <span>{copy.total}</span>
            <strong>{currencyFormatter.format(total)}</strong>
          </div>
          <button
            className="btn primary cart-pay-btn"
            type="button"
            onClick={() => navigate('/checkout')}
          >
            {copy.payCta}
          </button>
          <Link className="cart-continue" to="/#catalog">
            {copy.continueShopping}
          </Link>
        </aside>
      </div>
    </section>
  )
}

export default Cart
