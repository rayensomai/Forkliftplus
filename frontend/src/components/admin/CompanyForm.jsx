import { useState } from 'react'

function CompanyForm({ copy, apiBase, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: '',
    region: '',
    focus: '',
    address: '',
    postalCode: '',
  })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [geoStatus, setGeoStatus] = useState('idle')
  const [coords, setCoords] = useState(null)

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setError('')

    if (!coords) {
      setError(copy.errorCoords)
      setStatus('idle')
      return
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      address: coords.display || `${form.address.trim()} ${form.postalCode.trim()}`.trim(),
      city: form.city.trim(),
      region: form.region.trim(),
      focus: form.focus.trim(),
      lat: coords.lat,
      lng: coords.lng,
    }

    if (
      !payload.name ||
      !payload.email ||
      !payload.city ||
      !payload.region ||
      !payload.focus
    ) {
      setError(copy.errorRequired)
      setStatus('idle')
      return
    }

    try {
      const response = await fetch(`${apiBase}/companies/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        if (response.status === 409) {
          setError(copy.errorDuplicate)
        } else {
          setError(copy.errorGeneric)
        }
        setStatus('idle')
        return
      }

      setForm({
        name: '',
        email: '',
        city: '',
        region: '',
        focus: '',
        address: '',
        postalCode: '',
      })
      setCoords(null)
      setStatus('success')
      onCreated()
    } catch (err) {
      setError(copy.errorGeneric)
      setStatus('idle')
    }
  }

  const handleGeocode = async () => {
    setGeoStatus('loading')
    setError('')
    const address = `${form.address} ${form.postalCode}`.trim()
    if (address.length < 3) {
      setError(copy.errorAddress)
      setGeoStatus('idle')
      return
    }

    try {
      const response = await fetch(
        `${apiBase}/geocode?address=${encodeURIComponent(address)}`
      )
      if (!response.ok) {
        setError(copy.errorGeocode)
        setGeoStatus('idle')
        return
      }
      const data = await response.json()
      setCoords({ lat: data.lat, lng: data.lng, display: data.display })
      setGeoStatus('success')
    } catch (err) {
      setError(copy.errorGeocode)
      setGeoStatus('idle')
    }
  }

  return (
    <section className="company-form">
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h3>{copy.title}</h3>
        <p className="section-subtitle">{copy.subtitle}</p>
      </div>
      <form className="company-form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span>{copy.nameLabel}</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder={copy.namePlaceholder}
            required
          />
        </label>
        <label className="field">
          <span>{copy.emailLabel}</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder={copy.emailPlaceholder}
            required
          />
        </label>
        <label className="field">
          <span>{copy.cityLabel}</span>
          <input
            type="text"
            value={form.city}
            onChange={(event) => updateField('city', event.target.value)}
            placeholder={copy.cityPlaceholder}
            required
          />
        </label>
        <label className="field">
          <span>{copy.regionLabel}</span>
          <input
            type="text"
            value={form.region}
            onChange={(event) => updateField('region', event.target.value)}
            placeholder={copy.regionPlaceholder}
            required
          />
        </label>
        <label className="field">
          <span>{copy.focusLabel}</span>
          <input
            type="text"
            value={form.focus}
            onChange={(event) => updateField('focus', event.target.value)}
            placeholder={copy.focusPlaceholder}
            required
          />
        </label>
        <label className="field">
          <span>{copy.addressLabel}</span>
          <input
            type="text"
            value={form.address}
            onChange={(event) => updateField('address', event.target.value)}
            placeholder={copy.addressPlaceholder}
            required
          />
        </label>
        <label className="field">
          <span>{copy.postalLabel}</span>
          <input
            type="text"
            value={form.postalCode}
            onChange={(event) => updateField('postalCode', event.target.value)}
            placeholder={copy.postalPlaceholder}
            required
          />
        </label>
        <div className="company-form-actions">
          <button
            className="btn ghost"
            type="button"
            onClick={handleGeocode}
            disabled={geoStatus === 'loading'}
          >
            {geoStatus === 'loading' ? copy.locating : copy.locateCta}
          </button>
          {coords ? (
            <span className="form-success">
              {copy.coordsLabel} {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              {coords.display ? ` · ${coords.display}` : ''}
            </span>
          ) : null}
        </div>
        <div className="company-form-actions">
          <button className="btn primary" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? copy.submitting : copy.cta}
          </button>
          {status === 'success' ? <span className="form-success">{copy.success}</span> : null}
          {error ? <span className="form-error">{error}</span> : null}
        </div>
      </form>
    </section>
  )
}

export default CompanyForm
