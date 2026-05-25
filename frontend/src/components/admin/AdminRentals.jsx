import { useEffect, useMemo, useState } from 'react'

const STATUS_OPTIONS = [
  'pending',
  'quoted',
  'approved',
  'active',
  'completed',
  'rejected',
  'cancelled',
]

function AdminRentals({ copy, apiBase }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)

  const loadRequests = async () => {
    setLoading(true)
    try {
      const url =
        statusFilter === 'all'
          ? `${apiBase}/rentals/requests`
          : `${apiBase}/rentals/requests?status=${statusFilter}`
      const response = await fetch(url)
      const data = response.ok ? await response.json() : []
      setRequests(data)
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [apiBase, statusFilter])

  const stats = useMemo(() => {
    return {
      pending: requests.filter((item) => item.status === 'pending').length,
      active: requests.filter((item) => item.status === 'active' || item.status === 'approved').length,
      total: requests.length,
    }
  }, [requests])

  const handleStatusChange = async (requestId, status) => {
    setUpdatingId(requestId)
    try {
      const response = await fetch(`${apiBase}/rentals/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (response.ok) await loadRequests()
    } finally {
      setUpdatingId(null)
    }
  }

  const currency = new Intl.NumberFormat(copy.locale || 'fr-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  })

  return (
    <section className="admin-rentals-section" id="admin-rentals">
      <div className="portal-header">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p className="section-subtitle">{copy.subtitle}</p>
        </div>
        <button className="btn ghost" type="button" onClick={loadRequests}>
          {copy.refreshCta}
        </button>
      </div>

      <div className="admin-rentals-kpis">
        <article>
          <strong>{stats.pending}</strong>
          <span>{copy.kpiPending}</span>
        </article>
        <article>
          <strong>{stats.active}</strong>
          <span>{copy.kpiActive}</span>
        </article>
        <article>
          <strong>{stats.total}</strong>
          <span>{copy.kpiTotal}</span>
        </article>
      </div>

      <div className="admin-rentals-toolbar">
        <label className="field">
          <span>{copy.statusFilterLabel}</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">{copy.allStatuses}</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {copy.statusLabels[status] || status}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? <p>{copy.loading}</p> : null}

      <div className="admin-rentals-list">
        {requests.length ? (
          requests.map((request) => (
            <article key={request.id} className="admin-rental-card">
              <div className="admin-rental-card-head">
                <div>
                  <strong>{request.reference}</strong>
                  <p>{request.machine_name}</p>
                </div>
                <span className={`rental-status rental-status-${request.status}`}>
                  {copy.statusLabels[request.status] || request.status}
                </span>
              </div>

              <div className="admin-rental-card-grid">
                <span>
                  {copy.clientLabel}: {request.client_name} ({request.client_email})
                </span>
                <span>
                  {copy.periodLabel}: {request.start_date} → {request.end_date} ({request.rental_days} {copy.daysShort})
                </span>
                <span>
                  {copy.deliveryLabel}: {request.delivery_address}, {request.delivery_city}, {request.delivery_region}
                </span>
                <span>
                  {copy.totalLabel}: {currency.format(request.total_due)}
                </span>
                {request.notes ? <span>{copy.notesLabel}: {request.notes}</span> : null}
              </div>

              <div className="admin-rental-actions">
                {STATUS_OPTIONS.filter((status) => status !== request.status).map((status) => (
                  <button
                    key={status}
                    className="btn btn-small ghost"
                    type="button"
                    disabled={updatingId === request.id}
                    onClick={() => handleStatusChange(request.id, status)}
                  >
                    {copy.setStatus.replace('{status}', copy.statusLabels[status] || status)}
                  </button>
                ))}
              </div>
            </article>
          ))
        ) : (
          <p>{copy.empty}</p>
        )}
      </div>
    </section>
  )
}

export default AdminRentals
