import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Database, FileText, LayoutDashboard, LogOut, RefreshCw, Shield, Users, Dumbbell } from 'lucide-react'
import { api } from '../lib/api.js'
import { Header, EmptyState } from '../components/ui.jsx'

const tabs = [
  ['dashboard', 'Dashboard', LayoutDashboard],
  ['users', 'Users', Users],
  ['workouts', 'Workouts', Dumbbell],
  ['muscles', 'Muscle Analytics', Activity],
  ['database', 'Database Health', Database],
  ['audit', 'Audit Logs', FileText],
  ['settings', 'Admin Settings', Shield]
]
const fmt = (v) => v == null ? '—' : new Intl.NumberFormat().format(Number(v))
const when = (v) => v ? new Date(v).toLocaleString() : '—'

export default function Admin() {
  const [user, setUser] = useState({ username: 'admin' })
  const [tab, setTab] = useState('dashboard')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [userPage, setUserPage] = useState(1)

  async function load(next = tab) {
    setLoading(true); setError(''); setMessage('')
    try {
      const result = next === 'dashboard' ? await api.adminDashboard()
        : next === 'users' ? await api.adminUsers({ limit: 25, page: userPage, search: userSearch })
          : next === 'workouts' ? await api.adminWorkouts({ limit: 25 })
            : next === 'muscles' ? await api.adminMuscles({})
              : next === 'database' ? await api.adminDatabase()
                : next === 'audit' ? await api.adminAuditLogs({ limit: 25 }) : null
      setData(result)
    } catch (e) { setError(e.message || 'Admin request failed.') }
    finally { setLoading(false) }
  }
  useEffect(() => { load(tab) }, [tab, userPage, userSearch])

  async function changeStatus(id, status) {
    if (!window.confirm(`${status === 'suspended' ? 'Suspend' : 'Reactivate'} this account?`)) return
    try { await api.adminSetStatus(id, status); setMessage('Account status updated.'); load('users') }
    catch (e) { setError(e.message) }
  }
  async function changeRole(id, role) {
    if (!window.confirm(`Change this user's role to ${role}?`)) return
    try { await api.adminChangeRole(id, role); setMessage('Role updated.'); load('users') }
    catch (e) { setError(e.message) }
  }
  async function inspect(id) {
    try { setSelected((await api.adminUser(id)).user) }
    catch (e) { setError(e.message) }
  }

  return (
    <div className="no-hscroll">
      <Header title="ADMIN CONTROL" sub={`${user.username.toUpperCase()} · SERVER-ENFORCED`} right={<button className="btn" style={{ width: 'auto' }} onClick={() => load()} aria-label="Refresh"><RefreshCw size={16} /></button>} />
      <div className="admin-shell">
        <aside className="admin-nav" aria-label="Admin sections">
          <div className="mono text-[10px] text-mut px-2 mb-2">OPERATIONS</div>
          {tabs.map(([id, label, Icon]) => <button key={id} className={tab === id ? 'admin-nav-active' : ''} onClick={() => { setTab(id); setSelected(null) }}><Icon size={16} /> <span>{label}</span></button>)}
          <Link to="/" className="admin-nav-link"><LogOut size={16} /> Exit admin</Link>
          <button className="admin-nav-link" onClick={async () => { await api.adminLogout(); window.location.href = '/admin/login' }}><LogOut size={16} /> Sign out</button>
        </aside>
        <main className="admin-content">
          {error && <div className="admin-alert admin-alert-error" role="alert">{error}</div>}
          {message && <div className="admin-alert admin-alert-success" role="status">{message}</div>}
          {loading ? <div className="card p-6 text-center mono">LOADING ADMIN DATA…</div> : tab === 'dashboard' ? <Dashboard data={data} />
            : tab === 'users' ? <UsersView data={data} onInspect={inspect} onStatus={changeStatus} onRole={changeRole} selected={selected} canManageRoles search={userSearch} onSearch={v => { setUserSearch(v); setUserPage(1) }} page={userPage} onPage={setUserPage} />
              : tab === 'workouts' ? <WorkoutsView data={data} />
                : tab === 'muscles' ? <MusclesView data={data} />
                  : tab === 'database' ? <DatabaseView data={data} />
                    : tab === 'audit' ? <AuditView data={data} />
                      : <SettingsView user={user} />}
        </main>
      </div>
    </div>
  )
}

function Metric({ label, value, sub }) { return <div className="admin-metric"><div className="mono text-[10px] text-mut">{label}</div><strong>{value}</strong>{sub && <span className="text-xs text-mut">{sub}</span>}</div> }
function Dashboard({ data }) {
  const s = data?.stats || {}
  return <div className="space-y-3">
    <div className="admin-grid">{[['REGISTERED USERS', s.total_users], ['ACTIVE · 7D', s.active_users_7d], ['ACTIVE · 30D', s.active_users_30d], ['TOTAL SET LOGS', s.total_logs], ['LOGS · TODAY', s.logs_today], ['LOGS · 7D', s.logs_7d]].map(([a, b]) => <Metric key={a} label={a} value={fmt(b)} />)}</div>
    <section className="card p-3"><h2 className="font-black">14-DAY ACTIVITY</h2><div className="admin-trend">{(data?.trend || []).map((x) => <div key={x.date} title={`${x.date}: ${x.logs}`}><i style={{ height: `${Math.max(6, Math.min(100, Number(x.logs) * 8))}%` }} /><span>{x.date.slice(5)}</span></div>)}</div></section>
    <div className="grid md:grid-cols-2 gap-3"><section className="card p-3"><h2 className="font-black mb-2">RECENT REGISTRATIONS</h2><Rows rows={data?.recentUsers} render={(x) => <div><b>{x.display_name || 'Unnamed'}</b><span className="text-xs text-mut block">{x.email} · {when(x.created_at)}</span></div>} /></section><section className="card p-3"><h2 className="font-black mb-2">RECENT WORKOUT ACTIVITY</h2><Rows rows={data?.recentWorkouts} render={(x) => <div><b>{x.display_name}</b><span className="text-xs text-mut block">{x.exercise_name} · {x.workout_date}</span></div>} /></section></div>
  </div>
}
function Rows({ rows = [], render }) { return rows.length ? <div className="space-y-2">{rows.map((x, i) => <div className="admin-row" key={x.id || i}>{render(x)}</div>)}</div> : <div className="text-xs text-mut">No records.</div> }
function UsersView({ data, onInspect, onStatus, onRole, selected, canManageRoles, search, onSearch, page, onPage }) {
  const pages = Math.max(1, Math.ceil((data?.total || 0) / (data?.limit || 25)))
  return <div className="space-y-3"><div className="card p-3"><h2 className="font-black">USER DIRECTORY</h2><input className="mt-2" value={search} onChange={e => onSearch(e.target.value)} placeholder="Search name, email, or ID…" aria-label="Search users" /><div className="text-xs text-mut mt-1">Page {page} of {pages} · showing {fmt(data?.users?.length)} of {fmt(data?.total)} · password and token data is never returned.</div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>USER</th><th>ROLE</th><th>STATUS</th><th>ACTIVITY</th><th>ACTIONS</th></tr></thead><tbody>{(data?.users || []).map(x => <tr key={x.id}><td><b>{x.display_name || 'Unnamed'}</b><small>{x.email}<br />{x.id}</small></td><td>{x.role}</td><td><span className={x.status === 'active' ? 'text-good' : 'text-red-400'}>{x.status}</span></td><td>{fmt(x.workout_count)} logs<br /><small>{when(x.last_activity)}</small></td><td><button className="admin-small-btn" onClick={() => onInspect(x.id)}>VIEW</button>{x.status === 'active' ? <button className="admin-small-btn" onClick={() => onStatus(x.id, 'suspended')}>SUSPEND</button> : <button className="admin-small-btn" onClick={() => onStatus(x.id, 'active')}>RESTORE</button>}{canManageRoles && selected?.id === x.id && <select value={x.role} onChange={e => onRole(x.id, e.target.value)} aria-label="Change role"><option value="user">user</option><option value="admin">admin</option><option value="super_admin">super_admin</option></select>}</td></tr>)}</tbody></table></div><div className="flex gap-2"><button className="btn" disabled={page <= 1} onClick={() => onPage(page - 1)}>PREVIOUS</button><button className="btn" disabled={page >= pages} onClick={() => onPage(page + 1)}>NEXT</button></div>{selected && <section className="card p-3"><h2 className="font-black">USER DETAIL</h2><div className="text-sm mt-2">{selected.display_name || 'Unnamed'} · {selected.email}</div><div className="text-xs text-mut mt-1">{fmt(selected.workout_count)} logs · last activity {when(selected.last_activity)}</div></section>}</div>
}
function WorkoutsView({ data }) { return <div className="space-y-3"><div className="card p-3"><h2 className="font-black">WORKOUT LOGS</h2><div className="text-xs text-mut">Bounded server-side result set · {fmt(data?.total)} total records.</div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>DATE</th><th>USER</th><th>EXERCISE</th><th>SET</th><th>SPLIT</th></tr></thead><tbody>{(data?.workouts || []).map(x => <tr key={x.id}><td>{x.workout_date}</td><td>{x.display_name}</td><td>{x.exercise_name}<small>{x.muscle}</small></td><td>{x.weight} · {x.reps_completed} reps</td><td>{x.split_name || '—'}</td></tr>)}</tbody></table></div></div> }
function MusclesView({ data }) { return <div className="space-y-3"><div className="card p-3"><h2 className="font-black">MUSCLE COVERAGE</h2><div className="text-xs text-mut">Aggregated coverage only; no user identifiers are exposed here.</div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>MUSCLE</th><th>COVERAGE EVENTS</th><th>USERS</th></tr></thead><tbody>{(data?.muscles || []).map(x => <tr key={x.muscle_name}><td>{x.muscle_name}</td><td>{fmt(x.coverage_count)}</td><td>{fmt(x.users_covered)}</td></tr>)}</tbody></table></div></div> }
function DatabaseView({ data }) { return <div className="space-y-3"><div className="admin-grid"><Metric label="STATUS" value={data?.ok ? 'ONLINE' : 'ERROR'} /><Metric label="LATENCY" value={`${data?.latencyMs ?? '—'} ms`} /><Metric label="DATABASE" value={data?.identity?.database || '—'} /><Metric label="ROLE" value={data?.identity?.user || '—'} /></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>SCHEMA</th><th>TABLE</th><th>APPROX. ROWS</th></tr></thead><tbody>{(data?.tables || []).map(x => <tr key={x.table_name}><td>{x.schemaname}</td><td>{x.table_name}</td><td>{fmt(x.approximate_rows)}</td></tr>)}</tbody></table></div></div> }
function AuditView({ data }) { return <div className="space-y-3"><div className="card p-3"><h2 className="font-black">APPEND-ONLY AUDIT LOG</h2><div className="text-xs text-mut">Super-admin access · records cannot be edited or deleted through this portal.</div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>TIME</th><th>ADMIN</th><th>ACTION</th><th>TARGET</th><th>RESULT</th></tr></thead><tbody>{(data?.logs || []).map(x => <tr key={x.id}><td>{when(x.created_at)}</td><td>{x.admin_name}</td><td>{x.action}</td><td>{x.target_type} {x.target_id || ''}</td><td>{x.success ? 'SUCCESS' : 'FAILED'}</td></tr>)}</tbody></table></div></div> }
function SettingsView({ user }) { return <div className="card p-4 space-y-2"><h2 className="font-black">ADMIN SETTINGS</h2><p className="text-sm text-mut">Signed in as {user.username}. This is a private owner session; role changes and suspension actions are server-authorized and audited.</p><p className="text-xs text-mut">Configure the admin username, bcrypt password hash, and session secret only on the server.</p></div> }
