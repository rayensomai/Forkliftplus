import L from 'leaflet'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

const seedCompanies = [
  {
    id: 1,
    name: 'NordLift Logistics',
    email: 'contact@nordliftlogistics.com',
    address: '2150 Boulevard Hymus, Dorval, QC H9P 1J7',
    city: 'Montreal',
    region: 'QC',
    focus: 'Forklifts',
    lat: 45.5017,
    lng: -73.5673,
  },
  {
    id: 2,
    name: 'Atlas Yard Network',
    email: 'hello@atlasyardnetwork.com',
    address: '200 King St W, Toronto, ON M5H 3T4',
    city: 'Toronto',
    region: 'ON',
    focus: 'Heavy rental',
    lat: 43.6532,
    lng: -79.3832,
  },
  {
    id: 3,
    name: 'Pacific Freight Hub',
    email: 'sales@pacificfreighthub.com',
    address: '401 Burrard St, Vancouver, BC V6C 3S5',
    city: 'Vancouver',
    region: 'BC',
    focus: 'Port handling',
    lat: 49.2827,
    lng: -123.1207,
  },
  {
    id: 4,
    name: 'Prairie Lift Co',
    email: 'contact@prairieliftco.com',
    address: '300 Portage Ave, Winnipeg, MB R3C 0B4',
    city: 'Winnipeg',
    region: 'MB',
    focus: 'Warehouse ops',
    lat: 49.8951,
    lng: -97.1384,
  },
  {
    id: 5,
    name: 'Atlantic Fleet',
    email: 'partnerships@atlanticfleet.com',
    address: '1801 Hollis St, Halifax, NS B3J 3N4',
    city: 'Halifax',
    region: 'NS',
    focus: 'Maritime',
    lat: 44.6488,
    lng: -63.5752,
  },
  {
    id: 6,
    name: 'Northern Axis',
    email: 'info@northernaxis.com',
    address: '101 Rue Saint-Jean, Quebec, QC G1R 1N8',
    city: 'Quebec',
    region: 'QC',
    focus: 'Cross-dock',
    lat: 46.8139,
    lng: -71.2080,
  },
]

const defaultCenter = [52.0, -85.0]

function getInitials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function getHue(name) {
  let hash = 0
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) % 360
  }
  return hash
}

function mergeCompanies(apiCompanies) {
  if (apiCompanies.length) {
    return [...apiCompanies].sort((a, b) => a.name.localeCompare(b.name))
  }
  return seedCompanies
}

function buildPinIcon(kind) {
  return L.divIcon({
    className: `map-pin ${kind}`,
    html: '<span></span>',
    iconSize: kind === 'active' ? [22, 22] : [14, 14],
    iconAnchor: kind === 'active' ? [11, 11] : [7, 7],
  })
}

function MapFocus({ target }) {
  const map = useMap()

  useEffect(() => {
    if (!target) return
    map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 9), { duration: 0.8 })
  }, [map, target])

  return null
}

function LogisticsMap({ copy, refreshToken, onCompaniesChange, focusCompanyId }) {
  const [query, setQuery] = useState('')
  const [companies, setCompanies] = useState(seedCompanies)
  const [selectedCompanyId, setSelectedCompanyId] = useState(focusCompanyId ?? null)
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  const navigate = useNavigate()

  const pinDefault = useMemo(() => buildPinIcon('default'), [])
  const pinActive = useMemo(() => buildPinIcon('active'), [])
  const pinMuted = useMemo(() => buildPinIcon('muted'), [])

  useEffect(() => {
    if (focusCompanyId) setSelectedCompanyId(focusCompanyId)
  }, [focusCompanyId])

  useEffect(() => {
    let isActive = true
    const controller = new AbortController()

    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${apiBase}/companies/`, { signal: controller.signal })
        if (!response.ok) return
        const data = await response.json()
        if (!isActive || !Array.isArray(data)) return
        const merged = mergeCompanies(data)
        setCompanies(merged)
        onCompaniesChange?.(merged)
      } catch {
        if (!controller.signal.aborted && isActive) {
          setCompanies(seedCompanies)
          onCompaniesChange?.(seedCompanies)
        }
      }
    }

    fetchCompanies()
    return () => {
      isActive = false
      controller.abort()
    }
  }, [apiBase, refreshToken, onCompaniesChange])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return companies
    return companies.filter((company) => {
      const content = `${company.name} ${company.city} ${company.region} ${company.focus} ${company.address} ${company.email}`
      return content.toLowerCase().includes(needle)
    })
  }, [companies, query])

  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === selectedCompanyId) ?? null,
    [companies, selectedCompanyId]
  )

  const matchingIds = useMemo(() => new Set(filtered.map((company) => company.id)), [filtered])
  const hasQuery = Boolean(query.trim())

  const center = useMemo(() => {
    if (selectedCompany) return [selectedCompany.lat, selectedCompany.lng]
    if (companies.length) {
      const avgLat = companies.reduce((sum, item) => sum + item.lat, 0) / companies.length
      const avgLng = companies.reduce((sum, item) => sum + item.lng, 0) / companies.length
      return [avgLat, avgLng]
    }
    return defaultCenter
  }, [companies, selectedCompany])

  const handleGoToCompany = (company) => {
    setSelectedCompanyId(company.id)
    setQuery(company.name)
    navigate(`/collaboration/${company.id}`, { state: { company } })
  }

  const handleSelectCompany = (company) => {
    setSelectedCompanyId(company.id)
    setQuery(company.name)
  }

  return (
    <section className="map-section" id="map">
      <div className="map-header">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h3>{copy.title}</h3>
          <p className="section-subtitle">{copy.subtitle}</p>
        </div>
        <div className="map-stats-pill">
          <strong>{companies.length}</strong>
          <span>{copy.totalPartners}</span>
        </div>
      </div>

      <div className="map-workspace">
        <div className="map-board" aria-label="Logistics map">
          <MapContainer
            center={center}
            zoom={selectedCompany ? 10 : 4}
            scrollWheelZoom
            className="map-leaflet"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapFocus target={selectedCompany} />
            {companies.map((company) => {
              const isActive = company.id === selectedCompanyId
              const isMatch = !hasQuery || matchingIds.has(company.id)
              const icon = isActive ? pinActive : isMatch ? pinDefault : pinMuted

              return (
                <Marker
                  key={company.id}
                  position={[company.lat, company.lng]}
                  icon={icon}
                  eventHandlers={{ click: () => handleSelectCompany(company) }}
                >
                  <Popup>
                    <strong>{company.name}</strong>
                    <br />
                    {company.city}, {company.region}
                    <br />
                    {company.focus}
                    <br />
                    {company.address || copy.addressFallback}
                    {company.email ? (
                      <>
                        <br />
                        {company.email}
                      </>
                    ) : null}
                    <br />
                    <button
                      className="btn primary btn-small map-popup-cta"
                      type="button"
                      onClick={() => handleGoToCompany(company)}
                    >
                      {copy.emailCta}
                    </button>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>

        <aside className="map-sidebar">
          <div className="map-sidebar-search">
            <input
              type="search"
              placeholder={copy.searchPlaceholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setSelectedCompanyId(null)
              }}
            />
            <span className="map-sidebar-count">
              {filtered.length} / {companies.length}
            </span>
          </div>

          <div className="map-partner-list" role="list">
            {filtered.length ? (
              filtered.map((company) => (
                <article
                  key={company.id}
                  className={`map-partner-card${company.id === selectedCompanyId ? ' active' : ''}`}
                  role="listitem"
                >
                  <button
                    type="button"
                    className="map-partner-card-main"
                    onClick={() => handleSelectCompany(company)}
                  >
                    <span
                      className="company-logo-badge"
                      aria-hidden="true"
                      style={{
                        background: `linear-gradient(135deg, hsl(${getHue(company.name)} 76% 45%), hsl(${(getHue(company.name) + 32) % 360} 76% 34%))`,
                      }}
                    >
                      {getInitials(company.name)}
                    </span>
                    <div className="map-partner-card-copy">
                      <strong>{company.name}</strong>
                      <span>
                        {company.city}, {company.region} · {company.focus}
                      </span>
                      <span>{company.address || copy.addressFallback}</span>
                    </div>
                  </button>
                  <button
                    className="btn primary btn-small map-partner-email"
                    type="button"
                    onClick={() => handleGoToCompany(company)}
                  >
                    {copy.emailCta}
                  </button>
                </article>
              ))
            ) : (
              <p className="map-partner-empty">{copy.noResults}</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default LogisticsMap
