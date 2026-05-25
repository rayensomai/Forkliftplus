import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useClientAuth } from '../context/ClientAuthContext.jsx'
import {
  addDaysIsoDate,
  calculateRentalPricing,
  formatMoney,
  todayIsoDate,
} from '../utils/rentalPricing.js'

const STATUS_LABELS_FR = {
  pending: 'En attente',
  quoted: 'Devis envoye',
  approved: 'Approuvee',
  active: 'En cours',
  completed: 'Terminee',
  rejected: 'Refusee',
  cancelled: 'Annulee',
}

const STATUS_LABELS_EN = {
  pending: 'Pending',
  quoted: 'Quoted',
  approved: 'Approved',
  active: 'Active',
  completed: 'Completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
}

const FUEL_BADGE_CLASS = {
  Propane: 'rental-fuel-propane',
  Electrique: 'rental-fuel-electric',
  Diesel: 'rental-fuel-diesel',
}

function matchesFuelFilter(machine, fuelFilter) {
  if (fuelFilter === 'all') return true
  if (fuelFilter === 'scissor') return machine.category_key === 'sciso-lift'
  if (fuelFilter === 'propane') return machine.fuel_type === 'Propane'
  if (fuelFilter === 'diesel') return machine.fuel_type === 'Diesel'
  if (fuelFilter === 'electric') {
    return machine.category_key === 'forklift-electric-3' || machine.category_key === 'forklift-electric-4'
  }
  return true
}

function RentalRateTables({ copy, locale }) {
  return (
    <section className="rental-section rental-rates-section reveal" id="rental-rates">
      <div className="rental-section-head">
        <div>
          <p className="eyebrow">{copy.ratesEyebrow}</p>
          <h2>{copy.ratesTitle}</h2>
          <p className="section-subtitle">{copy.ratesSubtitle}</p>
        </div>
      </div>

      <div className="rental-rates-layout">
        <div className="rental-rates-panel">
          <h3>{copy.ratesTitle}</h3>
          <div className="rental-rates-table-wrap">
            <table className="rental-rates-table">
              <thead>
                <tr>
                  {copy.rateColumns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {copy.forkliftRates.map((row) => (
                  <tr key={row.capacity}>
                    <th scope="row">{row.capacity}</th>
                    <td>{formatMoney(row.day, locale)}</td>
                    <td>{formatMoney(row.week, locale)}</td>
                    <td>{formatMoney(row.fourWeeks, locale)}</td>
                    <td>{formatMoney(row.weekend, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rental-rates-side">
          <div className="rental-rates-panel rental-rates-panel-compact">
            <h3>{copy.liftRatesTitle}</h3>
            <div className="rental-rates-table-wrap">
              <table className="rental-rates-table">
                <thead>
                  <tr>
                    <th>{copy.rateColumns[0]}</th>
                    {copy.rateColumns.slice(1).map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {copy.liftRates.map((row) => (
                    <tr key={row.name}>
                      <th scope="row">{row.name}</th>
                      <td>{formatMoney(row.day, locale)}</td>
                      <td>{formatMoney(row.week, locale)}</td>
                      <td>{formatMoney(row.fourWeeks, locale)}</td>
                      <td>{formatMoney(row.weekend, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rental-contact-card">
            <strong>{copy.contactTitle}</strong>
            <a href={`tel:${copy.contactPhone.replace(/\D/g, '')}`}>{copy.contactPhone}</a>
            <p>{copy.contactAddress}</p>
            <p>{copy.contactHours}</p>
            <a className="btn primary btn-small" href="#rental-quote">
              {copy.contactCta}
            </a>
          </div>
        </div>
      </div>

      <p className="rental-rates-note">{copy.ratesNote}</p>
    </section>
  )
}

function RentalPage({ copy }) {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  const { client, isClientAuthed } = useClientAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const locale = copy.locale || 'fr-CA'
  const isFr = locale === 'fr-CA'
  const statusLabels = isFr ? STATUS_LABELS_FR : STATUS_LABELS_EN

  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all')
  const [fuelFilter, setFuelFilter] = useState('all')
  const [terrainFilter, setTerrainFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedSlug, setSelectedSlug] = useState(searchParams.get('machine') || '')
  const [availability, setAvailability] = useState(null)
  const [submitState, setSubmitState] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const [confirmation, setConfirmation] = useState(null)
  const [myRentals, setMyRentals] = useState([])

  const [form, setForm] = useState({
    startDate: todayIsoDate(),
    endDate: addDaysIsoDate(todayIsoDate(), 6),
    deliveryAddress: '',
    deliveryCity: 'Montreal',
    deliveryRegion: 'QC',
    deliveryPostal: '',
    siteContact: '',
    sitePhone: '',
    operatorRequired: false,
    insuranceConfirmed: false,
    deliveryRequired: true,
    notes: '',
  })

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${apiBase}/rentals/machines`)
        if (!response.ok) throw new Error('load_failed')
        const data = await response.json()
        if (active) setMachines(data)
      } catch {
        if (active) setError(copy.loadError)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [apiBase, copy.loadError])

  useEffect(() => {
    if (!searchParams.get('machine') || loading || !machines.length) return
    window.setTimeout(() => {
      document.getElementById('rental-quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }, [loading, machines.length, searchParams])

  useEffect(() => {
    if (!isClientAuthed || !client?.email) return
    fetch(`${apiBase}/rentals/requests?email=${encodeURIComponent(client.email)}`)
      .then((response) => (response.ok ? response.json() : []))
      .then(setMyRentals)
      .catch(() => setMyRentals([]))
  }, [apiBase, client?.email, isClientAuthed, confirmation])

  const selectedMachine = useMemo(
    () => machines.find((machine) => machine.slug === selectedSlug) ?? null,
    [machines, selectedSlug]
  )

  const categories = useMemo(() => {
    const map = new Map()
    machines.forEach((machine) => map.set(machine.category_key, machine.category_label))
    return Array.from(map.entries()).map(([key, label]) => ({ key, label }))
  }, [machines])

  const filteredMachines = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return machines.filter((machine) => {
      if (categoryFilter !== 'all' && machine.category_key !== categoryFilter) return false
      if (!matchesFuelFilter(machine, fuelFilter)) return false
      if (terrainFilter !== 'all' && machine.terrain !== terrainFilter) return false
      if (
        needle &&
        ![
          machine.name,
          machine.brand,
          machine.category_label,
          machine.description,
          machine.capacity_label,
        ]
          .join(' ')
          .toLowerCase()
          .includes(needle)
      ) {
        return false
      }
      return true
    })
  }, [machines, categoryFilter, fuelFilter, terrainFilter, query])

  const pricing = useMemo(() => {
    if (!selectedMachine) return null
    return calculateRentalPricing(selectedMachine, form.startDate, form.endDate, {
      deliveryRequired: form.deliveryRequired,
      region: form.deliveryRegion,
    })
  }, [selectedMachine, form.startDate, form.endDate, form.deliveryRequired, form.deliveryRegion])

  useEffect(() => {
    if (!selectedMachine || !form.startDate || !form.endDate) {
      setAvailability(null)
      return
    }

    let active = true
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`${apiBase}/rentals/availability`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            machine_slug: selectedMachine.slug,
            start_date: form.startDate,
            end_date: form.endDate,
          }),
        })
        const data = response.ok ? await response.json() : { available: false, message: copy.unavailable }
        if (active) setAvailability(data)
      } catch {
        if (active) setAvailability({ available: false, message: copy.unavailable })
      }
    }, 350)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [apiBase, copy.unavailable, form.endDate, form.startDate, selectedMachine])

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setSubmitError('')
  }

  const handleSelectMachine = (slug) => {
    setSelectedSlug(slug)
    setConfirmation(null)
    setSubmitError('')
    document.getElementById('rental-quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isClientAuthed) {
      navigate(`/client/compte?redirect=/location?machine=${selectedSlug}`)
      return
    }
    if (!selectedMachine || !pricing) return
    if (!form.insuranceConfirmed) {
      setSubmitError(copy.insuranceRequired)
      return
    }
    if (availability && !availability.available) {
      setSubmitError(availability.message || copy.unavailable)
      return
    }

    setSubmitState('loading')
    setSubmitError('')

    try {
      const response = await fetch(`${apiBase}/rentals/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machine_slug: selectedMachine.slug,
          start_date: form.startDate,
          end_date: form.endDate,
          client_name: client.name,
          client_email: client.email,
          client_phone: client.phone || form.sitePhone,
          client_company: client.company || '',
          delivery_address: form.deliveryAddress,
          delivery_city: form.deliveryCity,
          delivery_region: form.deliveryRegion,
          delivery_postal: form.deliveryPostal,
          site_contact: form.siteContact || client.name,
          site_phone: form.sitePhone || client.phone,
          operator_required: form.operatorRequired,
          insurance_confirmed: form.insuranceConfirmed,
          delivery_required: form.deliveryRequired,
          notes: form.notes,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setSubmitError(typeof data.detail === 'string' ? data.detail : copy.submitError)
        setSubmitState('idle')
        return
      }

      setConfirmation(data)
      setSubmitState('success')
    } catch {
      setSubmitError(copy.submitError)
      setSubmitState('idle')
    }
  }

  return (
    <div className="page rental-page">
      <section className="rental-hero reveal">
        <div>
          <p className="eyebrow rental-eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="section-subtitle">{copy.subtitle}</p>
          <div className="rental-hero-actions">
            <a className="btn primary" href="#rental-rates">
              {copy.ratesEyebrow}
            </a>
            <a className="btn ghost" href="#rental-fleet">
              {copy.browseCta}
            </a>
            <Link className="btn ghost" to="/">
              {copy.buyInsteadCta}
            </Link>
          </div>
        </div>
        <div className="rental-hero-panel">
          {copy.highlights.map((item) => (
            <article key={item.title} className="rental-highlight-card">
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rental-steps reveal delay-1">
        {copy.steps.map((step, index) => (
          <article key={step.title} className="rental-step-card">
            <span>{index + 1}</span>
            <strong>{step.title}</strong>
            <p>{step.text}</p>
          </article>
        ))}
      </section>

      <RentalRateTables copy={copy} locale={locale} />

      <section className="rental-section catalog-section" id="rental-fleet">
        <div className="rental-section-head">
          <div>
            <p className="eyebrow">{copy.fleetEyebrow}</p>
            <h2>{copy.fleetTitle}</h2>
            <p className="section-subtitle">{copy.fleetSubtitle}</p>
          </div>
          <div className="rental-summary-pill">
            <strong>{filteredMachines.length}</strong>
            <span>{copy.machinesLabel}</span>
          </div>
        </div>

        <div className="rental-toolbar">
          <label className="field rental-search">
            <span>{copy.searchLabel}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
            />
          </label>
          <label className="field">
            <span>{copy.fuelLabel}</span>
            <select value={fuelFilter} onChange={(event) => setFuelFilter(event.target.value)}>
              {copy.fuelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>{copy.categoryLabel}</span>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">{copy.allCategories}</option>
              {categories.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>{copy.terrainLabel}</span>
            <select value={terrainFilter} onChange={(event) => setTerrainFilter(event.target.value)}>
              {copy.terrainOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? <p className="rental-loading">{copy.loading}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <div className="rental-grid">
          {filteredMachines.map((machine, index) => (
            <article
              key={machine.slug}
              className={`rental-card reveal delay-${(index % 3) + 1}${selectedSlug === machine.slug ? ' is-selected' : ''}`}
            >
              <div className="rental-card-media">
                <img src={machine.image_url} alt={machine.name} loading="lazy" />
                <span className={`rental-fuel-badge ${FUEL_BADGE_CLASS[machine.fuel_type] || ''}`}>
                  {machine.fuel_type || machine.category_label}
                </span>
                <span className="rental-rate-badge">
                  {formatMoney(machine.daily_rate, locale)}
                  <small>{copy.perDay}</small>
                </span>
              </div>
              <div className="rental-card-body">
                <span className="product-category">{machine.category_label}</span>
                <h3>{machine.name}</h3>
                <p className="rental-card-desc">{machine.description}</p>
                <div className="rental-card-meta">
                  <span>{machine.capacity_label}</span>
                  <span>{machine.terrain_label}</span>
                  <span>{machine.brand}</span>
                </div>
                <div className="rental-card-rates">
                  <div>
                    <small>{copy.weeklyRate}</small>
                    <strong>{formatMoney(machine.weekly_rate, locale)}</strong>
                  </div>
                  <div>
                    <small>{copy.fourWeeksRate}</small>
                    <strong>{formatMoney(machine.monthly_rate, locale)}</strong>
                  </div>
                  <div>
                    <small>{copy.weekendRate}</small>
                    <strong>{formatMoney(machine.weekend_rate || 0, locale)}</strong>
                  </div>
                </div>
                <button className="btn primary btn-small" type="button" onClick={() => handleSelectMachine(machine.slug)}>
                  {copy.rentCta}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rental-section rental-quote-section" id="rental-quote">
        <div className="rental-section-head">
          <div>
            <p className="eyebrow">{copy.quoteEyebrow}</p>
            <h2>{copy.quoteTitle}</h2>
            <p className="section-subtitle">{copy.quoteSubtitle}</p>
          </div>
        </div>

        {confirmation ? (
          <div className="rental-confirmation">
            <strong>{copy.successTitle}</strong>
            <p>
              {copy.successSubtitle.replace('{reference}', confirmation.reference).replace('{email}', client?.email || '')}
            </p>
            <div className="rental-confirmation-grid">
              <span>{confirmation.machine_name}</span>
              <span>
                {confirmation.start_date} → {confirmation.end_date}
              </span>
              <span>{formatMoney(confirmation.total_due, locale)}</span>
            </div>
          </div>
        ) : null}

        <div className="rental-quote-layout">
          <form className="rental-quote-form" onSubmit={handleSubmit}>
            {!selectedMachine ? (
              <p className="rental-quote-empty">{copy.selectMachineHint}</p>
            ) : (
              <>
                <div className="rental-selected-machine">
                  <img src={selectedMachine.image_url} alt={selectedMachine.name} />
                  <div>
                    <strong>{selectedMachine.name}</strong>
                    <p>{selectedMachine.description}</p>
                  </div>
                </div>

                <div className="rental-form-grid">
                  <label className="field">
                    <span>{copy.startDateLabel}</span>
                    <input
                      type="date"
                      value={form.startDate}
                      min={todayIsoDate()}
                      onChange={(event) => updateForm('startDate', event.target.value)}
                      required
                    />
                  </label>
                  <label className="field">
                    <span>{copy.endDateLabel}</span>
                    <input
                      type="date"
                      value={form.endDate}
                      min={form.startDate}
                      onChange={(event) => updateForm('endDate', event.target.value)}
                      required
                    />
                  </label>
                  <label className="field">
                    <span>{copy.deliveryAddressLabel}</span>
                    <input
                      type="text"
                      value={form.deliveryAddress}
                      onChange={(event) => updateForm('deliveryAddress', event.target.value)}
                      placeholder={copy.deliveryAddressPlaceholder}
                      required
                    />
                  </label>
                  <label className="field">
                    <span>{copy.deliveryCityLabel}</span>
                    <input
                      type="text"
                      value={form.deliveryCity}
                      onChange={(event) => updateForm('deliveryCity', event.target.value)}
                      required
                    />
                  </label>
                  <label className="field">
                    <span>{copy.deliveryRegionLabel}</span>
                    <select
                      value={form.deliveryRegion}
                      onChange={(event) => updateForm('deliveryRegion', event.target.value)}
                    >
                      {copy.regionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>{copy.deliveryPostalLabel}</span>
                    <input
                      type="text"
                      value={form.deliveryPostal}
                      onChange={(event) => updateForm('deliveryPostal', event.target.value)}
                      placeholder={copy.deliveryPostalPlaceholder}
                    />
                  </label>
                  <label className="field">
                    <span>{copy.siteContactLabel}</span>
                    <input
                      type="text"
                      value={form.siteContact}
                      onChange={(event) => updateForm('siteContact', event.target.value)}
                      placeholder={copy.siteContactPlaceholder}
                    />
                  </label>
                  <label className="field">
                    <span>{copy.sitePhoneLabel}</span>
                    <input
                      type="tel"
                      value={form.sitePhone}
                      onChange={(event) => updateForm('sitePhone', event.target.value)}
                      placeholder={copy.sitePhonePlaceholder}
                    />
                  </label>
                </div>

                <label className="rental-checkbox">
                  <input
                    type="checkbox"
                    checked={form.deliveryRequired}
                    onChange={(event) => updateForm('deliveryRequired', event.target.checked)}
                  />
                  <span>{copy.deliveryRequiredLabel}</span>
                </label>
                <label className="rental-checkbox">
                  <input
                    type="checkbox"
                    checked={form.operatorRequired}
                    onChange={(event) => updateForm('operatorRequired', event.target.checked)}
                  />
                  <span>{copy.operatorRequiredLabel}</span>
                </label>
                <label className="rental-checkbox rental-checkbox-required">
                  <input
                    type="checkbox"
                    checked={form.insuranceConfirmed}
                    onChange={(event) => updateForm('insuranceConfirmed', event.target.checked)}
                  />
                  <span>{copy.insuranceLabel}</span>
                </label>

                <label className="field">
                  <span>{copy.notesLabel}</span>
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={(event) => updateForm('notes', event.target.value)}
                    placeholder={copy.notesPlaceholder}
                  />
                </label>

                {!isClientAuthed ? (
                  <p className="rental-auth-hint">
                    {copy.loginRequired}{' '}
                    <Link to={`/client/compte?redirect=/location?machine=${selectedSlug}`}>{copy.loginCta}</Link>
                  </p>
                ) : null}

                {submitError ? <p className="form-error">{submitError}</p> : null}

                <button className="btn primary rental-submit" type="submit" disabled={submitState === 'loading'}>
                  {submitState === 'loading' ? copy.submittingCta : copy.submitCta}
                </button>
              </>
            )}
          </form>

          <aside className="rental-quote-summary">
            <h3>{copy.summaryTitle}</h3>
            {selectedMachine && pricing ? (
              <>
                {availability ? (
                  <p className={`rental-availability${availability.available ? ' is-available' : ' is-unavailable'}`}>
                    {availability.available ? copy.available : availability.message || copy.unavailable}
                  </p>
                ) : null}
                <ul className="rental-summary-list">
                  <li>
                    <span>{copy.summaryDays}</span>
                    <strong>{pricing.days}</strong>
                  </li>
                  <li>
                    <span>{copy.summaryRental}</span>
                    <strong>{formatMoney(pricing.rentalCost, locale)}</strong>
                  </li>
                  <li>
                    <span>{copy.summaryDelivery}</span>
                    <strong>{formatMoney(pricing.deliveryFee, locale)}</strong>
                  </li>
                  <li>
                    <span>{copy.summaryTaxes}</span>
                    <strong>{formatMoney(pricing.taxes, locale)}</strong>
                  </li>
                  <li>
                    <span>{copy.summaryDeposit}</span>
                    <strong>{formatMoney(pricing.deposit, locale)}</strong>
                  </li>
                </ul>
                <div className="rental-summary-total">
                  <span>{copy.summaryTotal}</span>
                  <strong>{formatMoney(pricing.totalDue, locale)}</strong>
                </div>
                <p className="rental-summary-note">{copy.depositNote}</p>
              </>
            ) : (
              <p>{copy.summaryEmpty}</p>
            )}
          </aside>
        </div>
      </section>

      {isClientAuthed && myRentals.length ? (
        <section className="rental-section rental-history-section">
          <div className="rental-section-head">
            <div>
              <p className="eyebrow">{copy.historyEyebrow}</p>
              <h2>{copy.historyTitle}</h2>
            </div>
          </div>
          <div className="rental-history-grid">
            {myRentals.map((rental) => (
              <article key={rental.id} className="rental-history-card">
                <div className="rental-history-top">
                  <strong>{rental.reference}</strong>
                  <span className={`rental-status rental-status-${rental.status}`}>
                    {statusLabels[rental.status] || rental.status}
                  </span>
                </div>
                <p>{rental.machine_name}</p>
                <p>
                  {rental.start_date} → {rental.end_date} ({rental.rental_days} {copy.daysShort})
                </p>
                <strong>{formatMoney(rental.total_due, locale)}</strong>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rental-faq reveal">
        <h2>{copy.faqTitle}</h2>
        <div className="rental-faq-grid">
          {copy.faq.map((item) => (
            <article key={item.q} className="rental-faq-card">
              <strong>{item.q}</strong>
              <p>{item.a}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default RentalPage
