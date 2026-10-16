import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { Header } from '../components/ui.jsx'
import { LogoMark, APP_TAGLINE } from '../components/Brand.jsx'

function BrandHero() {
  return (
    <div className="flex flex-col items-center text-center pt-8 pb-2 px-4">
      <LogoMark size={84} />
      <div className="font-black tracking-widest text-2xl mt-3">DYNAMIS TRACKER</div>
      <div className="mono text-xs text-mut mt-1">{APP_TAGLINE}</div>
    </div>
  )
}

export function Login() {
  const { signIn } = useAuth()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const justDeleted = params.get('deleted') === '1'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  async function go(e) {
    e.preventDefault(); setBusy(true); setMsg('LOADING...')
    const { error } = await signIn(email.trim(), password)
    setBusy(false)
    if (error) setMsg('⚠ ' + error.message)
    else nav('/')
  }
  return (
    <div className="no-hscroll">
      <BrandHero />
      <Header title="LOGIN" sub="Welcome back to the gym floor" />
      <form onSubmit={go} className="p-4 space-y-3 max-w-md mx-auto">
        {justDeleted && (
          <div className="card p-3 text-center" role="status">
            <div className="font-black">ACCOUNT DELETED</div>
            <div className="text-xs text-mut mt-1">Your Dynamis Tracker account and personal data have been permanently deleted.</div>
          </div>
        )}
        <label className="block"><span className="mono text-[11px] text-mut">EMAIL</span>
          <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
        <label className="block"><span className="mono text-[11px] text-mut">PASSWORD</span>
          <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></label>
        <button className="btn btn-primary" disabled={busy}>LOGIN</button>
        {msg && <div className="mono text-xs" role="status">{msg}</div>}
        <div className="flex justify-between text-sm">
          <Link to="/forgot" className="underline">Forgot password?</Link>
          <Link to="/signup" className="underline">Create account</Link>
        </div>
        <div className="pt-2">
          <Link to="/admin/login" className="btn btn-secondary w-full text-center">
            ADMIN LOGIN
          </Link>
        </div>
      </form>
    </div>
  )
}

export function Signup() {
  const { signUp } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  async function go(e) {
    e.preventDefault()
    if (pw !== pw2) { setMsg('⚠ Passwords do not match.'); return }
    if (pw.length < 6) { setMsg('⚠ Password must be 6+ characters.'); return }
    setBusy(true); setMsg('LOADING...')
    const { error } = await signUp(email.trim(), pw)
    setBusy(false)
    if (error) setMsg('⚠ ' + error.message)
    else { setMsg('✓ Account created — choose your split...'); setTimeout(() => nav('/setup'), 600) }
  }
  return (
    <div className="no-hscroll">
      <BrandHero />
      <Header title="SIGN UP" sub="Create profile → choose your split" />
      <form onSubmit={go} className="p-4 space-y-3 max-w-md mx-auto">
        <label className="block"><span className="mono text-[11px] text-mut">EMAIL</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
        <label className="block"><span className="mono text-[11px] text-mut">PASSWORD</span>
          <input type="password" autoComplete="new-password" required value={pw} onChange={(e) => setPw(e.target.value)} placeholder="6+ characters" /></label>
        <label className="block"><span className="mono text-[11px] text-mut">CONFIRM PASSWORD</span>
          <input type="password" autoComplete="new-password" required value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Repeat password" /></label>
        <button className="btn btn-primary" disabled={busy}>CREATE ACCOUNT</button>
        {msg && <div className="mono text-xs" role="status">{msg}</div>}
        <Link to="/login" className="underline text-sm">Already have an account? Login</Link>
      </form>
    </div>
  )
}

export function ForgotPassword() {
  const { resetPassword, resetConfirm } = useAuth()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [stage, setStage] = useState('request')
  const [msg, setMsg] = useState('')
  async function go(e) {
    e.preventDefault(); setMsg('LOADING...')
    const { error, resetToken } = await resetPassword(email.trim())
    if (error) { setMsg('⚠ ' + error.message); return }
    if (resetToken) {
      // Development server returns the token directly (no SMTP configured).
      setToken(resetToken)
      setStage('confirm')
      setMsg('Enter a new password below.')
    } else {
      setMsg('✓ If an account exists for that email, a reset link was sent.')
    }
  }
  async function confirm(e) {
    e.preventDefault()
    if (pw !== pw2) { setMsg('⚠ Passwords do not match.'); return }
    setMsg('LOADING...')
    const { error } = await resetConfirm(token, pw)
    setMsg(error ? '⚠ ' + error.message : '✓ Password reset. You can log in now.')
    if (!error) setStage('done')
  }
  return (
    <div className="no-hscroll">
      <Header title="RESET PASSWORD" sub="Recover account access" />
      {stage === 'request' && (
        <form onSubmit={go} className="p-4 space-y-3 max-w-md mx-auto">
          <label className="block"><span className="mono text-[11px] text-mut">EMAIL</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
          <button className="btn btn-primary">SEND RESET LINK</button>
          {msg && <div className="mono text-xs" role="status">{msg}</div>}
          <Link to="/login" className="underline text-sm">Back to login</Link>
        </form>
      )}
      {stage === 'confirm' && (
        <form onSubmit={confirm} className="p-4 space-y-3 max-w-md mx-auto">
          <label className="block"><span className="mono text-[11px] text-mut">NEW PASSWORD</span>
            <input type="password" autoComplete="new-password" required value={pw} onChange={(e) => setPw(e.target.value)} placeholder="6+ characters" /></label>
          <label className="block"><span className="mono text-[11px] text-mut">CONFIRM PASSWORD</span>
            <input type="password" autoComplete="new-password" required value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Repeat password" /></label>
          <button className="btn btn-primary">SET NEW PASSWORD</button>
          {msg && <div className="mono text-xs" role="status">{msg}</div>}
          <Link to="/login" className="underline text-sm">Back to login</Link>
        </form>
      )}
      {stage === 'done' && (
        <div className="p-4 space-y-3 max-w-md mx-auto">
          {msg && <div className="mono text-xs" role="status">{msg}</div>}
          <Link to="/login" className="btn btn-primary text-center">GO TO LOGIN</Link>
        </div>
      )}
    </div>
  )
}
