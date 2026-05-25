import { useState } from 'react'

function buildGeocodeUrl(apiBase, form) {
  const params = new URLSearchParams({
    address: form.address.trim(),
    city: form.city.trim(),
    region: form.region.trim(),
    postal_code: form.postalCode.trim(),
    country: 'Canada',
  })
  return `${apiBase}/geocode/?${params.toString()}`
}

function isNetworkError(error) {
  return (
    error instanceof TypeError ||
    error?.message === 'Failed to fetch' ||
    error?.message?.includes('NetworkError')
  )
}

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
    if (coords) {
      setCoords(null)
    }
  }

  const resolveCoordinates = async () => {
    const address = form.address.trim()
    const city = form.city.trim()
    const region = form.region.trim()
    const postalCode = form.postalCode.trim()

    if (address.length < 3) {
      throw new Error(copy.errorAddress)
    }

    const response = await fetch(buildGeocodeUrl(apiBase, form))
    if (!response.ok) {
      throw new Error(copy.errorGeocode)
    }

    const data = await response.json()
    const resolved = {
      lat: data.lat,
      lng: data.lng,
      display:
        data.display ||
        [address, city, region, postalCode, 'Canada'].filter(Boolean).join(', '),
    }

    setCoords(resolved)

    if (!city && data.display) {
      const parts = data.display.split(',').map((part) => part.trim())
      if (parts.length >= 2) {
        setForm((current) => ({
          ...current,
          city: current.city || parts[parts.length - 3] || current.city,
          region: current.region || parts[parts.length - 2]?.slice(0, 2) || current.region,
        }))
      }
    }

    return resolved
  }

  const handleGeocode = async () => {
    setGeoStatus('loading')
    setError('')

    try {
      await resolveCoordinates()
      setGeoStatus('success')
    } catch (err) {
      setError(isNetworkError(err) ? copy.errorBackendOffline : copy.errorGeocode)
      setGeoStatus('idle')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setError('')

    const payloadBase = {
      name: form.name.trim(),
      email: form.email.trim(),
      city: form.city.trim(),
      region: form.region.trim(),
      focus: form.focus.trim(),
    }

    if (
      !payloadBase.name ||
      !payloadBase.email ||
      !payloadBase.city ||
      !payloadBase.region ||
      !payloadBase.focus ||
      !form.address.trim() ||
      !form.postalCode.trim()
    ) {
      setError(copy.errorRequired)
      setStatus('idle')
      return
    }

    let resolvedCoords = coords
    if (!resolvedCoords) {
      try {
        resolvedCoords = await resolveCoordinates()
      } catch (err) {
        setError(err.message || copy.errorCoords)
        setStatus('idle')
        return
      }
    }

    const payload = {
      ...payloadBase,
      address: resolvedCoords.display || `${form.address.trim()} ${form.postalCode.trim()}`.trim(),
      lat: resolvedCoords.lat,
      lng: resolvedCoords.lng,
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
      setGeoStatus('idle')
      setStatus('success')
      onCreated()
    } catch (err) {
      setError(isNetworkError(err) ? copy.errorBackendOffline : copy.errorGeneric)
      setStatus('idle')
    }
  }

  return (
    <section className="company-form" id="company-form">
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
          ) : (
            <span className="form-hint">{copy.autoLocateHint}</span>
          )}
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
