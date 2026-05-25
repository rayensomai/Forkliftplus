import { useState } from 'react'
import AdminPortal from '../components/admin/AdminPortal.jsx'
import CompanyForm from '../components/admin/CompanyForm.jsx'
import AdminRentals from '../components/admin/AdminRentals.jsx'
import LogisticsMap from '../components/admin/LogisticsMap.jsx'

function AdminApp({ copy }) {
  const [refreshToken, setRefreshToken] = useState(0)
  const [companies, setCompanies] = useState([])
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  const handleCreated = () => {
    setRefreshToken((value) => value + 1)
  }

  return (
    <div className="page">
      <AdminPortal
        copy={copy}
        features={copy.adminFeatures}
        companies={companies}
      />
      <AdminRentals copy={copy.adminRentals} apiBase={apiBase} />
      <CompanyForm
        copy={copy.companyForm}
        apiBase={apiBase}
        onCreated={handleCreated}
      />
      <LogisticsMap
        copy={copy.map}
        refreshToken={refreshToken}
        onCompaniesChange={setCompanies}
      />
    </div>
  )
}

export default AdminApp
