import ClientPortal from '../components/client/ClientPortal.jsx'
import CTA from '../components/common/CTA.jsx'
import TrustBar from '../components/common/TrustBar.jsx'

function ClientApp({ copy }) {
  return (
    <div className="page">
      <TrustBar copy={copy.trust} />
      <ClientPortal
        copy={copy}
        features={copy.clientFeatures}
        mapCopy={copy.map}
      />
      <CTA copy={copy.cta} />
    </div>
  )
}

export default ClientApp
