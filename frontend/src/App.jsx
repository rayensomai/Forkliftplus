import { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import ProtectedClientRoute from './components/auth/ProtectedClientRoute.jsx'
import Footer from './components/layout/Footer.jsx'
import TopNav from './components/layout/TopNav.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ClientAuthProvider } from './context/ClientAuthContext.jsx'
import { copy } from './data/copy.js'
import AdminApp from './pages/AdminApp.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import ClientAccount from './pages/ClientAccount.jsx'
import ClientApp from './pages/ClientApp.jsx'
import CollaborationPage from './pages/Collaboration.jsx'
import Home from './pages/Home.jsx'
import Rental from './pages/Rental.jsx'

function App() {
  const [lang, setLang] = useState('fr')
  const [isAdminAuthed, setIsAdminAuthed] = useState(() => {
    return Boolean(localStorage.getItem('admin_session'))
  })

  const selected = useMemo(() => copy[lang], [lang])

  const handleAdminLogin = (payload) => {
    localStorage.setItem('admin_session', JSON.stringify(payload))
    setIsAdminAuthed(true)
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_session')
    setIsAdminAuthed(false)
  }

  return (
    <ClientAuthProvider>
      <CartProvider>
        <div className="app">
          <TopNav
            copy={selected}
            lang={lang}
            onLangChange={setLang}
            isAdminAuthed={isAdminAuthed}
            onAdminLogout={handleAdminLogout}
          />
          <main>
            <Routes>
              <Route path="/" element={<Home copy={selected} />} />
              <Route path="/location" element={<Rental copy={selected.rental} />} />
              <Route path="/client/compte" element={<ClientAccount copy={selected.clientAccount} />} />
              <Route
                path="/cart"
                element={
                  <ProtectedClientRoute>
                    <Cart copy={selected.cart} />
                  </ProtectedClientRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedClientRoute>
                    <Checkout copy={selected.checkout} />
                  </ProtectedClientRoute>
                }
              />
              <Route path="/client" element={<ClientApp copy={selected} />} />
              <Route
                path="/collaboration/:companyId"
                element={<CollaborationPage copy={selected} />}
              />
              <Route
                path="/admin/login"
                element={<AdminLogin copy={selected.adminLogin} onLogin={handleAdminLogin} />}
              />
              <Route
                path="/admin"
                element={
                  isAdminAuthed ? (
                    <AdminApp copy={selected} />
                  ) : (
                    <Navigate to="/admin/login" replace />
                  )
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer copy={selected.footer} />
        </div>
      </CartProvider>
    </ClientAuthProvider>
  )
}

export default App
