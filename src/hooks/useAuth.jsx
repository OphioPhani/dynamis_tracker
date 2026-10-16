import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api.js'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // Local demo mode (no backend configured): fully usable offline via localStorage.
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    let live = true
    ;(async () => {
      try {
        const { user: u } = await api.me()
        if (live) { setUser(u); setLoading(false); }
      } catch (e) {
        if (!live) return
        if (e.status === 503) {
          setDemoMode(true)
          try {
            const demo = localStorage.getItem('gmt_demo_user')
            if (demo) setUser(JSON.parse(demo))
          } catch { /* corrupted cache: start signed out */ }
        }
        setLoading(false)
      }
    })()
    return () => { live = false }
  }, [])

  const value = {
    user, loading, demoMode,
    signUp: async (email, password) => {
      if (demoMode) {
        const u = { id: 'demo-' + Date.now(), email }
        localStorage.setItem('gmt_demo_user', JSON.stringify(u))
        setUser(u)
        return { error: null }
      }
      try {
        const { user: u } = await api.signup(email, password)
        setUser(u)
        return { error: null }
      } catch (e) { return { error: e } }
    },
    signIn: async (email, password) => {
      if (demoMode) {
        const u = { id: 'demo-' + Date.now(), email }
        localStorage.setItem('gmt_demo_user', JSON.stringify(u))
        setUser(u)
        return { error: null }
      }
      try {
        const { user: u } = await api.login(email, password)
        setUser(u)
        return { error: null }
      } catch (e) { return { error: e } }
    },
    signOut: async () => {
      if (demoMode) {
        localStorage.removeItem('gmt_demo_user')
        setUser(null)
        return { error: null }
      }
      try { await api.logout() } catch { /* already signed out server-side */ }
      setUser(null)
      return { error: null }
    },
    resetPassword: async (email) => {
      if (demoMode) return { error: { message: 'Password reset needs the backend. Configure DATABASE_URL first.' } }
      try {
        const r = await api.resetRequest(email)
        return { error: null, resetToken: r.resetToken }
      } catch (e) { return { error: e } }
    },
    resetConfirm: async (token, password) => {
      try {
        await api.resetConfirm(token, password)
        return { error: null }
      } catch (e) { return { error: e } }
    }
  }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() { return useContext(AuthCtx) }
