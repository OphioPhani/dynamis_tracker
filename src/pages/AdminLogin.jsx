import { useEffect, useState } from 'react'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { Header } from '../components/ui.jsx'

export default function AdminLogin() {
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true); setError('')
    try {
      await api.adminLogin(username.trim(), password)
      nav('/admin', { replace: true })
    } catch (e) {
      setError(e.status === 429 ? e.message : 'Invalid admin credentials.')
    } finally { setBusy(false) }
  }

  return <div className="min-h-screen" style={{ background: '#070b12' }}>
    <Header title="ADMIN LOGIN" sub="Restricted owner access · server verified" />
    <form onSubmit={submit} className="p-4 max-w-md mx-auto space-y-3">
      <div className="card p-4 text-center" style={{ borderColor: '#2563eb' }}><Shield size={34} className="mx-auto text-blue-300" /><div className="mono text-xs text-mut mt-2">AUTHORIZED PERSONNEL ONLY</div></div>
      <label className="block"><span className="mono text-[11px] text-mut">ADMIN ID</span><input autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} required /></label>
      <label className="block"><span className="mono text-[11px] text-mut">ADMIN PASSWORD</span><div className="relative"><input className="pr-12" type={show ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /><button type="button" className="absolute right-0 top-0" style={{ width: 48, minHeight: 48, background: 'transparent' }} onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
      <button className="btn btn-primary" disabled={busy}>{busy ? 'VERIFYING…' : 'SIGN IN AS ADMIN'}</button>
      {error && <div className="admin-alert admin-alert-error" role="alert">{error}</div>}
      <a href="/login" className="block text-center text-sm underline">Return to regular login</a>
    </form>
  </div>
}

export function AdminGuard({ children }) {
  const [state, setState] = useState('loading')
  useEffect(() => {
    api.adminSession().then(session => setState(session.authenticated ? 'ready' : 'denied')).catch(() => setState('denied'))
  }, [])
  if (state === 'loading') return <div className="p-6 text-center mono">VERIFYING ADMIN SESSION…</div>
  if (state === 'denied') return <Navigate to="/admin/login" replace />
  return children
}
