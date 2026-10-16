import { useState } from 'react'
import { logIndiaDate } from '../utils/dateUtils.js'
import { Link } from 'react-router-dom'
import { Check, Github, Linkedin, Instagram } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { Header } from '../components/ui.jsx'
import { LogoMark } from '../components/Brand.jsx'
import { toCSV, download } from '../utils/export.js'
import { EQUIPMENT_LIST } from '../data/equipment.js'
import { getQueue } from '../lib/offlineQueue.js'
import { api } from '../lib/api.js'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const { user, signOut, demoMode } = useAuth()
  const { settings, setSettings, logs, selections, syncMsg, online, clearAllLocal, wipeLocalData, activeSplit, availableEquipment, setEquipment } = useStore()
  const [msg, setMsg] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [deleteText, setDeleteText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const nav = useNavigate()
  const unsynced = getQueue().length

  async function logout() {
    await signOut()
    nav('/login')
  }

  async function confirmDelete() {
    if (deleteText.trim() !== 'DELETE' || deleting) return
    setDeleting(true)
    setMsg('DELETING ACCOUNT...')
    try {
      if (!demoMode) {
        await api.deleteAccount()
      }
      wipeLocalData()
      await signOut()
      nav('/login?deleted=1')
    } catch (e) {
      setMsg('⚠ ' + (e.message || 'Could not delete account.'))
      setDeleting(false)
    }
  }

  function exportJSON() {
    download('gym-tracker-export.json', JSON.stringify({ exported: new Date().toISOString(), settings, selections, logs }, null, 2), 'application/json')
    setMsg('✓ Exported JSON')
  }
  function exportCSV() {
    const rows = logs.map((l) => ({ date: logIndiaDate(l), time: l.performedAt, day: l.day, muscle: l.muscle, rank: l.rank, exercise: l.exerciseName, weight: l.weight, reps: l.reps, unit: settings.unit }))
    download('gym-tracker-export.csv', toCSV(rows), 'text/csv')
    setMsg('✓ Exported CSV')
  }

  return (
    <div className="no-hscroll">
      <Header title="SETTINGS" sub={user?.email || 'Profile'} />
      <div className="p-3 space-y-3 max-w-md mx-auto pb-24">
        <section className="card p-3 space-y-2">
          <div className="mono text-[11px] text-mut">PROFILE</div>
          <label className="block"><span className="mono text-[10px] text-mut">DISPLAY NAME</span>
            <input value={settings.displayName || ''} onChange={(e) => setSettings({ displayName: e.target.value })} placeholder="Your name" /></label>
          <div className="mono text-xs">EMAIL: {user?.email} {demoMode && '(LOCAL DEMO MODE)'}</div>
        </section>

        <section className="card p-3 space-y-2">
          <div className="mono text-[11px] text-mut">UNITS (DEFAULT KG — INDIA)</div>
          <div className="grid grid-cols-2 gap-2">
            {['kg', 'lb'].map((u) => (
              <button key={u} className="btn" style={settings.unit === u ? { background: '#fff', color: '#000' } : {}} onClick={() => setSettings({ unit: u })}>{u.toUpperCase()}</button>
            ))}
          </div>
        </section>

        <section className="card p-3 space-y-2">
          <div className="mono text-[11px] text-mut">WORKOUT SPLIT</div>
          <div className="text-sm"><b>{activeSplit?.name?.toUpperCase()}</b> · {activeSplit?.daysPerWeek} DAYS/WK</div>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/splits" className="btn text-center">CHANGE SPLIT</Link>
            <Link to="/splits/new" className="btn text-center">CUSTOM SPLIT</Link>
          </div>
        </section>

        <section className="card p-3 space-y-2">
          <div className="mono text-[11px] text-mut">MY GYM EQUIPMENT ({availableEquipment.length}/{EQUIPMENT_LIST.length})</div>
          <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto">
            {EQUIPMENT_LIST.map((e) => {
              const on = availableEquipment.includes(e)
              return (
                <button key={e} onClick={() => setEquipment(on ? availableEquipment.filter((x) => x !== e) : [...availableEquipment, e])} className="flex items-center gap-2 text-left p-2 text-sm" style={{ border: '1px solid #2a2e34', background: on ? '#1b1e22' : 'transparent', minHeight: 48 }} aria-pressed={on}>
                  <span style={{ border: '1px solid #2a2e34', width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: on ? '#22c55e' : 'transparent' }}>
                    {on && <Check size={14} color="#04120a" />}
                  </span>
                  {e}
                </button>
              )
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn" onClick={() => setEquipment(EQUIPMENT_LIST)}>SELECT ALL</button>
            <button className="btn" onClick={() => setEquipment(['Dumbbells', 'Mat (bodyweight area)'])}>MINIMAL</button>
          </div>
        </section>

        <section className="card p-3 space-y-2">
          <div className="mono text-[11px] text-mut">DATA SYNC</div>
          <div className="mono text-xs">STATUS: {syncMsg} · {online ? 'ONLINE' : 'OFFLINE'} · {logs.length} SETS STORED</div>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn" onClick={exportJSON}>EXPORT JSON</button>
            <button className="btn" onClick={exportCSV}>EXPORT CSV</button>
          </div>
          {msg && <div className="mono text-xs" role="status">{msg}</div>}
        </section>

        <section className="card p-3 space-y-2">
          <div className="mono text-[11px] text-mut">ACCOUNT</div>
          <div className="mono text-xs">SIGNED IN AS: {user?.email}</div>
          {!showDelete ? (
            <button className="btn btn-danger" onClick={() => { setShowDelete(true); setDeleteText('') }}>DELETE ACCOUNT</button>
          ) : (
            <div className="p-3" style={{ border: '1px solid #ef4444' }}>
              <b>DELETE YOUR ACCOUNT?</b>
              <div className="text-xs mt-1">This permanently deletes:</div>
              <ul className="text-xs mt-1 ml-4 list-disc">
                <li>Your profile</li>
                <li>Workout history</li>
                <li>Exercise logs</li>
                <li>Muscle coverage</li>
                <li>Progress data</li>
                <li>Custom splits</li>
                <li>Personal settings</li>
              </ul>
              <div className="text-xs mt-1 font-bold">This action cannot be undone.</div>
              {unsynced > 0 && (
                <div className="text-xs mt-2 p-2" style={{ border: '1px solid #eab308', color: '#eab308' }}>
                  You currently have {unsynced} unsynchronized workout {unsynced === 1 ? 'log' : 'logs'}. Deleting your account will permanently remove {unsynced === 1 ? 'it' : 'them'}. Continue?
                </div>
              )}
              <label className="block mt-2"><span className="mono text-[10px] text-mut">TYPE DELETE TO CONFIRM</span>
                <input value={deleteText} onChange={(e) => setDeleteText(e.target.value)} placeholder="DELETE" autoComplete="off" /></label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button className="btn" onClick={() => setShowDelete(false)}>CANCEL</button>
                <button className="btn btn-danger" disabled={deleteText.trim() !== 'DELETE' || deleting} style={{ opacity: deleteText.trim() !== 'DELETE' ? 0.5 : 1 }} onClick={confirmDelete}>
                  {deleting ? 'DELETING...' : 'DELETE MY ACCOUNT'}
                </button>
              </div>
            </div>
          )}
        </section>
        <section className="card p-4 text-center space-y-2">
          <div className="flex justify-center"><LogoMark size={56} /></div>
          <div className="font-black tracking-widest">DYNAMIS TRACKER</div>
          <div className="text-xs text-mut">A mobile-first workout and muscle coverage tracking application.</div>
          <div className="mono text-[11px] text-mut pt-1">WEBSITE MADE AND DESIGNED BY</div>
          <div className="font-black tracking-widest text-lg">G. PHANI CHANDRA</div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <a className="btn social-btn flex flex-col items-center gap-1" style={{ minHeight: 60 }} href="https://github.com/OphioPhani" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"><Github size={18} />GitHub</a>
            <a className="btn social-btn flex flex-col items-center gap-1" style={{ minHeight: 60 }} href="https://www.linkedin.com/in/ganji-phani-chandra-730809380/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"><Linkedin size={18} />LinkedIn</a>
            <a className="btn social-btn flex flex-col items-center gap-1" style={{ minHeight: 60 }} href="https://www.instagram.com/2h4ni_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram profile"><Instagram size={18} />Instagram</a>
          </div>
        </section>

        <section className="card p-3 space-y-2">
          <div className="mono text-[11px] text-mut">DANGER ZONE</div>
          <button className="btn btn-danger" onClick={() => { if (confirm('Delete all local logs + selections?')) { clearAllLocal(); setMsg('✓ Local data cleared') } }}>CLEAR LOCAL DATA</button>
          <button className="btn btn-danger" onClick={logout}>LOGOUT</button>
        </section>
      </div>
    </div>
  )
}
