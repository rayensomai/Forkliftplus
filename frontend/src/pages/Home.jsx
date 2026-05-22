import Hero from '../components/home/Hero.jsx'
import PromoRibbons from '../components/home/PromoRibbons.jsx'
import ProductCatalog from '../components/home/ProductCatalog.jsx'

function Home({ copy }) {
  return (
    <div className="page home-page">
      <Hero copy={copy} />
      <PromoRibbons copy={copy.catalog} />
      <ProductCatalog copy={copy.catalog} />
    </div>
  )
}

export default Home
