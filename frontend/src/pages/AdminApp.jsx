import { useState } from 'react'
import AdminPortal from '../components/admin/AdminPortal.jsx'
import CompanyForm from '../components/admin/CompanyForm.jsx'
import LogisticsMap from '../components/admin/LogisticsMap.jsx'
import CTA from '../components/common/CTA.jsx'

function AdminApp({ copy }) {
  const [refreshToken, setRefreshToken] = useState(0)
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  const handleCreated = () => {
    setRefreshToken((value) => value + 1)
  }

  return (
    <div className="page">
      <AdminPortal copy={copy} features={copy.adminFeatures} />
      <CompanyForm copy={copy.companyForm} apiBase={apiBase} onCreated={handleCreated} />
      <LogisticsMap copy={copy.map} refreshToken={refreshToken} />
      <CTA copy={copy.cta} />
    </div>
  )
}

export default AdminApp
