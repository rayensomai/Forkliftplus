import { Navigate, useLocation } from 'react-router-dom'
import { useClientAuth } from '../../context/ClientAuthContext.jsx'

function ProtectedClientRoute({ children }) {
  const { isClientAuthed } = useClientAuth()
  const location = useLocation()

  if (!isClientAuthed) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/client/compte?redirect=${redirect}`} replace />
  }

  return children
}

export default ProtectedClientRoute
