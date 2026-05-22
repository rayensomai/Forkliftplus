import { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/layout/Footer.jsx'
import TopNav from './components/layout/TopNav.jsx'
import { copy } from './data/copy.js'
import AdminApp from './pages/AdminApp.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import ClientApp from './pages/ClientApp.jsx'
import CollaborationPage from './pages/Collaboration.jsx'
import Home from './pages/Home.jsx'

function App() {
  const [lang, setLang] = useState('fr')
  const [isAuthed, setIsAuthed] = useState(() => {
    return Boolean(localStorage.getItem('admin_session'))
  })

  const selected = useMemo(() => copy[lang], [lang])

  const handleLogin = (payload) => {
    localStorage.setItem('admin_session', JSON.stringify(payload))
    setIsAuthed(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    setIsAuthed(false)
  }

  return (
    <div className="app">
      <TopNav
        copy={selected}
        lang={lang}
        onLangChange={setLang}
        isAuthed={isAuthed}
        onLogout={handleLogout}
      />
      <main>
        <Routes>
          <Route path="/" element={<Home copy={selected} />} />
          <Route path="/client" element={<ClientApp copy={selected} />} />
          <Route
            path="/collaboration/:companyId"
            element={<CollaborationPage copy={selected} />}
          />
          <Route
            path="/admin/login"
            element={<AdminLogin copy={selected.adminLogin} onLogin={handleLogin} />}
          />
          <Route
            path="/admin"
            element={
              isAuthed ? (
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
  )
}

export default App
