import { createContext, useContext, useMemo, useState } from 'react'

const ClientAuthContext = createContext(null)
const ACCOUNTS_KEY = 'forkliftplus_client_accounts'
const SESSION_KEY = 'client_session'

function readAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function ClientAuthProvider({ children }) {
  const [accounts, setAccounts] = useState(readAccounts)
  const [session, setSession] = useState(readSession)

  const register = ({ name, email, password, company, phone }) => {
    const normalizedEmail = email.trim().toLowerCase()
    if (accounts.some((account) => account.email === normalizedEmail)) {
      return { ok: false, error: 'email_exists' }
    }

    const account = {
      id: `client-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      company: company.trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString(),
    }

    const nextAccounts = [...accounts, account]
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(nextAccounts))
    setAccounts(nextAccounts)

    const nextSession = {
      id: account.id,
      name: account.name,
      email: account.email,
      company: account.company,
      phone: account.phone,
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    setSession(nextSession)

    return { ok: true }
  }

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase()
    const account = accounts.find(
      (item) => item.email === normalizedEmail && item.password === password
    )

    if (!account) {
      return { ok: false, error: 'invalid_credentials' }
    }

    const nextSession = {
      id: account.id,
      name: account.name,
      email: account.email,
      company: account.company,
      phone: account.phone,
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    setSession(nextSession)

    return { ok: true }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setSession(null)
  }

  const value = useMemo(
    () => ({
      client: session,
      isClientAuthed: Boolean(session),
      register,
      login,
      logout,
    }),
    [session, accounts]
  )

  return <ClientAuthContext.Provider value={value}>{children}</ClientAuthContext.Provider>
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext)
  if (!context) {
    throw new Error('useClientAuth must be used within ClientAuthProvider')
  }
  return context
}
