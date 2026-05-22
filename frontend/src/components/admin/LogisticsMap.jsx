import L from 'leaflet'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'

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

const defaultCenter = [47.5, -72.0]
const currentLocation = {
  name: '2150 Boulevard Hymus, Dorval',
  lat: 45.4876,
  lng: -73.7329,
}

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

function LogisticsMap({ copy, refreshToken }) {
  const [query, setQuery] = useState('')
  const [companies, setCompanies] = useState(seedCompanies)
  const [selectedCompanyId, setSelectedCompanyId] = useState(null)
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  const navigate = useNavigate()

  const markerIcon = useMemo(
    () =>
      L.divIcon({
        className: 'map-pin',
        html: '<span></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
    []
  )

  const currentIcon = useMemo(
    () =>
      L.divIcon({
        className: 'map-pin current',
        html: '<span></span>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    []
  )

  useEffect(() => {
    let isActive = true
    const controller = new AbortController()

    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${apiBase}/companies`, {
          signal: controller.signal,
        })
        if (!response.ok) return
        const data = await response.json()
        if (isActive && Array.isArray(data) && data.length) {
          setCompanies(data)
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          return
        }
      }
    }

    fetchCompanies()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [apiBase, refreshToken])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return companies
    return companies.filter((company) => {
      const content = `${company.name} ${company.city} ${company.region} ${company.focus}`
      return content.toLowerCase().includes(needle)
    })
  }, [companies, query])

  const selectedCompany = useMemo(() => {
    return companies.find((company) => company.id === selectedCompanyId) ?? null
  }, [companies, selectedCompanyId])

  const suggestions = useMemo(() => filtered.slice(0, 6), [filtered])

  const center = useMemo(() => {
    const points = filtered.length
      ? filtered
      : [{ lat: defaultCenter[0], lng: defaultCenter[1] }]
    const allPoints = [...points, currentLocation]
    const avgLat = allPoints.reduce((acc, item) => acc + item.lat, 0) / allPoints.length
    const avgLng = allPoints.reduce((acc, item) => acc + item.lng, 0) / allPoints.length
    return [avgLat, avgLng]
  }, [filtered])

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
    setSelectedCompanyId(null)
  }

  const handleSelectCompany = (company) => {
    setSelectedCompanyId(company.id)
    setQuery(company.name)
  }

  const handleGoToCompany = (company) => {
    setSelectedCompanyId(company.id)
    setQuery(company.name)
    navigate(`/collaboration/${company.id}`, {
      state: { company },
    })
  }

  const handleCollaboration = () => {
    const targetCompany = selectedCompany ?? suggestions[0]
    if (!targetCompany) return
    navigate(`/collaboration/${targetCompany.id}`, {
      state: { company: targetCompany },
    })
  }

  const canCollaborate = Boolean(selectedCompany || (query.trim() && suggestions.length))
  const partnerLogos = copy.partnerLogos ?? []

  const handlePartnerLogoError = (event) => {
    const target = event.currentTarget
    if (target?.dataset?.fallbackApplied === '1') return

    const src = target.getAttribute('src') || ''
    if (!src) return

    target.dataset.fallbackApplied = '1'
    if (src.endsWith('.png')) {
      target.src = src.replace(/\.png(\?.*)?$/i, '.svg$1')
    }
  }

  return (
    <section className="map-section" id="map">
      <div className="map-header">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h3>{copy.title}</h3>
          <p className="section-subtitle">{copy.subtitle}</p>
        </div>
        <div className="map-actions">
          <div className="search-box">
            <input
              type="search"
              placeholder={copy.searchPlaceholder}
              value={query}
              onChange={handleQueryChange}
            />
            {query.trim() ? (
              <div className="search-suggestions" role="listbox" aria-label={copy.resultsLabel}>
                {suggestions.length ? (
                  suggestions.map((company) => (
                    <button
                      key={company.id}
                      type="button"
                      className={
                        company.id === selectedCompanyId
                          ? 'suggestion-item active'
                          : 'suggestion-item'
                      }
                      onClick={() => handleGoToCompany(company)}
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
                      <strong>{company.name}</strong>
                      <span>
                        {company.city}, {company.region}
                      </span>
                      <span>{company.address || copy.addressFallback}</span>
                    </button>
                  ))
                ) : (
                  <p className="suggestion-empty">{copy.noResults}</p>
                )}
              </div>
            ) : null}
          </div>
          <button className="btn ghost" type="button" onClick={handleCollaboration} disabled={!canCollaborate}>
            {copy.cta}
          </button>
        </div>
      </div>
      {partnerLogos.length ? (
        <section className="map-brand-billboard" aria-label={copy.partnerBrandsTitle || 'Marques partenaires'}>
          <p className="footer-block-title">{copy.partnerBrandsTitle || 'Marques partenaires'}</p>
          <div className="map-brand-stage">
            {partnerLogos.map((brand, index) => (
              <div
                key={brand.name}
                className="map-brand-item"
                style={{ animationDelay: `${index * 2}s` }}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  loading="lazy"
                  onError={handlePartnerLogoError}
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {selectedCompany ? (
        <div className="selected-company-card">
          <div
            className="company-logo-badge large"
            style={{
              background: `linear-gradient(135deg, hsl(${getHue(selectedCompany.name)} 74% 48%), hsl(${(getHue(selectedCompany.name) + 34) % 360} 72% 36%))`,
            }}
          >
            {getInitials(selectedCompany.name)}
          </div>
          <div className="selected-company-copy">
            <p className="card-label">{copy.selectedLabel}</p>
            <h4>{selectedCompany.name}</h4>
            <p>{selectedCompany.email}</p>
            <p>{selectedCompany.address || copy.addressFallback}</p>
          </div>
          <span className="selected-company-pill">{selectedCompany.city}</span>
        </div>
      ) : null}
      <div className="map-layout">
        <div className="map-board" aria-label="Logistics map">
          <MapContainer center={center} zoom={5} scrollWheelZoom className="map-leaflet">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[currentLocation.lat, currentLocation.lng]}
              icon={currentIcon}
            >
              <Popup>
                <strong>Position actuelle</strong>
                <br />
                {currentLocation.name}
              </Popup>
            </Marker>
            <MarkerClusterGroup chunkedLoading>
              {filtered.map((company) => (
                <Marker
                  key={company.id}
                  position={[company.lat, company.lng]}
                  icon={markerIcon}
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
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>
    </section>
  )
}

export default LogisticsMap
