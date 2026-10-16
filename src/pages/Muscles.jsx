import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, RotateCcw } from 'lucide-react'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { Header, ProgressBar, EmptyState } from '../components/ui.jsx'
import AnatomyViewer from '../components/AnatomyViewer.jsx'
import ErrorBoundary from '../components/ErrorBoundary.jsx'
import { REQUIRED_MUSCLES, WORKOUT_PLAN } from '../data/workoutPlan.js'
import { MUSCLE_REGISTRY, MUSCLE_BY_ID, FILTER_BUCKETS } from '../data/muscles.js'
import { ANATOMY_MESHES, UNMAPPED_MUSCLES } from '../data/anatomyMapping.js'
import { muscleStatsFor, logsInPeriod, PERIODS } from '../utils/muscleStats.js'
import { startOfWeek } from '../utils/dates.js'
import CoverageHeatmap from '../components/CoverageHeatmap.jsx'

export default function Muscles() {
  const { logs } = useStore()
  const [period, setPeriod] = useState('30d')
  const [mode, setMode] = useState('training') // training | anatomy
  const [basis, setBasis] = useState('total') // direct | indirect | total
  const [view, setView] = useState('front')
  const [viewNonce, setViewNonce] = useState(0)
  const [resetNonce, setResetNonce] = useState(0)
  const [focus, setFocus] = useState(null) // { canonical, nonce }
  const [bucket, setBucket] = useState('ALL')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null) // canonical muscle id (always bilateral)
  const [model, setModel] = useState({ status: 'loading', progress: 0, meshes: 0, error: '' })
  const [sort, setSort] = useState('alpha')
  const [retryN, setRetryN] = useState(0)
  const [zoomSig, setZoomSig] = useState(null)
  const [group, setGroup] = useState('All')

  const periodDays = PERIODS.find((p) => p.id === period)?.days ?? 30
  const plogs = useMemo(() => logsInPeriod(logs, periodDays), [logs, periodDays])
  const stats = useMemo(() => muscleStatsFor(plogs, periodDays), [plogs, periodDays])

  const covered = [...stats.values()].filter((s) => s.sessions > 0).length
  const direct = [...stats.values()].filter((s) => s.directSessions > 0).length
  const indirectOnly = covered - direct
  const levelCount = (id) => [...stats.values()].filter((s) => s.level.id === id).length

  // Canonical id -> { color, rank } for the REAL meshes. A mesh shared by
  // several canonicals (e.g. maximus in glutes + gluteus_maximus) takes the
  // strongest level. Rank: HIGH 0 … NOT COVERED 4, neutral 9.
  const RANK_OF = { HIGH: 0, GOOD: 1, MODERATE: 2, LOW: 3, 'NOT COVERED': 4 }
  const colors = useMemo(() => {
    const m = new Map()
    for (const mu of MUSCLE_REGISTRY) {
      if (!(ANATOMY_MESHES[mu.id] || []).length) continue
      if (mode === 'anatomy') { m.set(mu.id, { color: '#5b6470', rank: 9 }); continue }
      const st = stats.get(mu.id)
      if (!st) { m.set(mu.id, { color: '#ef4444', rank: 4 }); continue }
      const relevant = basis === 'direct' ? st.directSessions > 0 : basis === 'indirect' ? (st.sessions - st.directSessions) > 0 : st.sessions > 0
      m.set(mu.id, relevant ? { color: st.level.color, rank: RANK_OF[st.level.id] ?? 4 } : { color: '#ef4444', rank: 4 })
    }
    return m
  }, [stats, mode, basis])

  // Bilateral by design: one canonical id represents both sides. Tapping
  // either the left or the right mesh resolves to the same analysis.
  function selectMuscle(canonical) {
    const mu = MUSCLE_BY_ID.get(canonical)
    if (mu && mu.views.length) {
      const target = mu.views.includes('front') ? 'front' : mu.views[0]
      if (target !== view) {
        setView(target)
        setViewNonce((n) => n + 1)
      }
    }
    setSelected(canonical)
    setFocus({ canonical, nonce: Date.now() })
  }

  const searchHits = q.trim()
    ? MUSCLE_REGISTRY.filter((m) => m.name.toLowerCase().includes(q.trim().toLowerCase()) || m.aliases.some((a) => a.includes(q.trim().toLowerCase()))).slice(0, 8)
    : []
  const sel = selected ? MUSCLE_BY_ID.get(selected) : null
  const selStats = selected ? stats.get(selected) : null
  const selMapped = selected ? (ANATOMY_MESHES[selected.canonical] || []).length > 0 : false

  const ranked = [...stats.values()].sort((a, b) => b.score - a.score)
  const best = ranked.filter((s) => s.sessions > 0).slice(0, 5)
  const worst = [...stats.values()].sort((a, b) => a.score - b.score).slice(0, 5)

  // legacy list rows (kept: sort/group + heatmap)
  const weekStart = startOfWeek()
  const weekLogs = logs.filter((l) => new Date(l.performedAt) >= weekStart)
  const groups = useMemo(() => ['All', ...new Set(WORKOUT_PLAN.map((x) => x.group))], [])
  let rows = MUSCLE_REGISTRY.map((m) => ({ name: m.name, id: m.id, st: stats.get(m.id), bucket: m.bucket }))
  if (bucket !== 'ALL') rows = rows.filter((r) => r.bucket === bucket)
  if (group !== 'All') rows = rows.filter((r) => (WORKOUT_PLAN.find((x) => x.muscle === r.name)?.group || '') === group)
  if (sort === 'most') rows = [...rows].sort((a, b) => (b.st?.sessions || 0) - (a.st?.sessions || 0))
  else if (sort === 'least') rows = [...rows].sort((a, b) => (a.st?.sessions || 0) - (b.st?.sessions || 0))
  else rows = [...rows].sort((a, b) => a.name.localeCompare(b.name))

  const matrix = {}
  const short = { Monday: 'Mon', Tuesday: 'Tue', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat' }
  for (const m of REQUIRED_MUSCLES) matrix[m] = { Mon: 0, Tue: 0, Thu: 0, Fri: 0, Sat: 0 }
  for (const l of weekLogs) {
    const plan = WORKOUT_PLAN.find((x) => x.muscle === l.muscle)
    const ex = plan?.exercises.find((e) => e.rank === l.rank)
    const sd = short[plan?.day]
    if (!sd) continue
    const lvl = ex?.primary?.includes(l.muscle) ? (l.reps >= 8 ? 3 : 2) : 1
    matrix[l.muscle][sd] = Math.max(matrix[l.muscle][sd] || 0, lvl)
    for (const s of [...(ex?.secondary || [])]) {
      if (matrix[s]) matrix[s][sd] = Math.max(matrix[s][sd] || 0, 1)
    }
  }

  return (
    <div className="no-hscroll">
      <Header title="MUSCLE INTELLIGENCE" sub="Coverage · analysis · interactive body" />
      <div className="p-3 space-y-3 max-w-md mx-auto pb-24">
        <div className="card p-3">
          <div className="font-black text-lg">{covered} / 45 MUSCLES COVERED</div>
          <div className="mono text-xs mt-1">DIRECT {direct} · INDIRECT {indirectOnly}</div>
          <div className="grid grid-cols-4 gap-1.5 mt-2 text-center mono text-[10px]">
            <div className="card2 p-1.5"><div className="font-black" style={{ color: '#22c55e' }}>{levelCount('HIGH')}</div>HIGH</div>
            <div className="card2 p-1.5"><div className="font-black" style={{ color: '#4ade80' }}>{levelCount('GOOD')}</div>GOOD</div>
            <div className="card2 p-1.5"><div className="font-black" style={{ color: '#eab308' }}>{levelCount('LOW') + levelCount('MODERATE')}</div>LOW</div>
            <div className="card2 p-1.5"><div className="font-black" style={{ color: '#ef4444' }}>{levelCount('NOT COVERED')}</div>UNTRAINED</div>
          </div>
        </div>

        <div className="card p-3">
          <div className="mono text-[11px] text-mut mb-1">COVERAGE PERIOD</div>
          <div className="flex gap-1.5 overflow-x-auto">
            {PERIODS.map((p) => (
              <button key={p.id} onClick={() => setPeriod(p.id)} className="mono text-[11px] font-extrabold px-2.5 py-2 shrink-0" style={{ border: '1px solid #2a2e34', background: period === p.id ? '#fff' : 'transparent', color: period === p.id ? '#000' : '#e8eaed', minHeight: 44 }} aria-pressed={period === p.id}>
                {p.id === 'today' ? 'TODAY' : p.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1.5 mt-2">
            {['direct', 'indirect', 'total'].map((b) => (
              <button key={b} onClick={() => setBasis(b)} className="mono text-[11px] font-extrabold py-2" style={{ border: '1px solid #2a2e34', background: basis === b ? '#3b82f6' : 'transparent', color: basis === b ? '#fff' : '#e8eaed', minHeight: 44 }} aria-pressed={basis === b}>
                {b.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            <button onClick={() => setMode(mode === 'training' ? 'anatomy' : 'training')} className="btn" style={{ minHeight: 44 }} aria-pressed={mode === 'training'}>{mode === 'training' ? 'TRAINING MODE ✓' : 'ANATOMY MODE'}</button>
            <select value={bucket} onChange={(e) => setBucket(e.target.value)} aria-label="Muscle group filter">
              {FILTER_BUCKETS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="mono text-[10px] text-mut mt-1">{mode === 'training' ? 'Colors = Dynamis workout coverage.' : 'Colors = anatomy only (no training meaning).'}</div>
        </div>

        <div className="card p-3">
          <div className="grid grid-cols-4 gap-1.5 mb-2">
            {['front', 'back'].map((v) => (
              <button key={v} onClick={() => { setView(v); setViewNonce((n) => n + 1) }} className="btn font-black col-span-1" style={view === v ? { background: '#fff', color: '#000' } : {}} aria-pressed={view === v}>{v.toUpperCase()}</button>
            ))}
            <button className="btn font-black" onClick={() => setZoomSig({ delta: 0.75, nonce: Date.now() })} aria-label="Zoom in">+</button>
            <button className="btn font-black" onClick={() => setZoomSig({ delta: 1.33, nonce: Date.now() })} aria-label="Zoom out">−</button>
          </div>
          <div className="grid grid-cols-1 gap-1.5 mb-2">
            <button className="btn flex items-center justify-center gap-1" onClick={() => setResetNonce((n) => n + 1)} aria-label="Reset 3D view"><RotateCcw size={14} /> RESET VIEW</button>
          </div>

          {model.status === 'loading' && (
            <div className="p-4 text-center" style={{ background: '#0f1113', border: '1px solid #2a2e34' }}>
              <div className="mono text-xs">DYNAMIS ANATOMY ENGINE</div>
              <div className="mono text-xs text-mut mt-1">LOADING MODEL... {model.progress}%</div>
              <div className="progress mt-2"><div style={{ width: `${model.progress}%`, background: '#22c55e' }} /></div>
            </div>
          )}
          {model.status === 'rendering' && (
            <div className="p-4 text-center" style={{ background: '#0f1113', border: '1px solid #2a2e34' }}>
              <div className="mono text-xs">MODEL LOADED · {model.meshes} MUSCLE MESHES</div>
              <div className="mono text-xs text-mut mt-1">RENDERING...</div>
              <div className="progress mt-2"><div style={{ width: '70%', background: '#3b82f6' }} /></div>
            </div>
          )}
          {model.status === 'error' && (
            <div className="p-4 text-center" style={{ background: '#0f1113', border: '1px solid #ef4444' }}>
              <div className="font-black">ANATOMY MODEL FAILED TO LOAD</div>
              <div className="text-xs text-mut mt-1">The rest of Dynamis keeps working.</div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button className="btn" onClick={() => { setRetryN((n) => n + 1); setModel({ status: 'loading', progress: 0, meshes: 0, error: '' }) }}>RETRY</button>
                <a href="#muscle-list" className="btn text-center">OPEN MUSCLE LIST</a>
              </div>
            </div>
          )}
          {(model.status === 'loading' || model.status === 'rendering' || model.status === 'ready') && (
            <div>
              <ErrorBoundary>
              <AnatomyViewer
                key={retryN}
                colors={colors}
                selected={selected ? { canonical: selected } : null}
                viewSignal={{ view, nonce: viewNonce }}
                focusSignal={focus}
                resetSignal={resetNonce || null}
                zoomSignal={zoomSig}
                onSelect={({ canonical }) => selectMuscle(canonical)}
                onReady={({ meshes }) => setModel({ status: 'ready', progress: 100, meshes, error: '' })}
                onProgress={({ stage, loaded, total }) => {
                  if (stage === 'rendering') { setModel((s) => (s.status === 'ready' ? s : { ...s, status: 'rendering', meshes: s.meshes || 161 })); return }
                  setModel((s) => s.status === 'ready' ? s : { ...s, progress: total ? Math.round((loaded / total) * 100) : 0 })
                }}
                onError={() => setModel((s) => ({ ...s, status: 'error' }))}
                height={420}
              />
              </ErrorBoundary>
            </div>
          )}
          {model.status === 'ready' && <div className="mono text-[10px] text-mut mt-1">ANATOMY READY · {model.meshes} MUSCLE MESHES · DRAG ROTATE · PINCH ZOOM · TAP MUSCLE</div>}
          <div className="mono text-[10px] text-mut mt-2">MUSCLE COVERAGE<br />
            <span style={{ color: '#22c55e' }}>■ HIGH</span> <span style={{ color: '#4ade80' }}>■ GOOD</span> <span style={{ color: '#eab308' }}>■ MODERATE</span> <span style={{ color: '#f97316' }}>■ LOW</span> <span style={{ color: '#ef4444' }}>■ NOT TRAINED</span> <span style={{ color: '#3b82f6' }}>■ SELECTED</span>
          </div>
          <div className="mono text-[10px] text-mut">Coverage colors show training coverage — not exercise Good/Better/Best ranks.</div>
        </div>

        <div className="card p-3">
          <label className="search-field">
            <span className="search-icon" aria-hidden="true"><Search size={16} /></span>
            <input className="search-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="SEARCH MUSCLES..." aria-label="Search muscles" />
          </label>
          {searchHits.length > 0 && (
            <div className="mt-1" style={{ border: '1px solid #2a2e34' }}>
              {searchHits.map((m) => (
                <button key={m.id} onClick={() => { selectMuscle(m.id); setQ('') }} className="block w-full text-left text-sm p-2.5" style={{ borderBottom: '1px solid #1e2126', minHeight: 48 }}>
                  {m.name} <span className="mono text-[10px] text-mut">· {m.bucket}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {sel && selStats && (
          selMapped ? (
            <MuscleSheet name={sel.name} st={selStats} onClose={() => setSelected(null)} />
          ) : (
            <section className="muscle-analysis-card muscle-analysis-card--warning" role="dialog" aria-label={`${sel.name} model limitation`}>
              <div className="muscle-analysis-header">
                <b>{sel.name.toUpperCase()}</b>
                <button className="mono text-xs underline" onClick={() => setSelected(null)}>CLOSE</button>
              </div>
              <div className="muscle-analysis-content">
                <div className="mono text-[11px] mt-1" style={{ color: '#eab308' }}>ANATOMICAL MODEL LIMITATION</div>
                <div className="text-xs text-mut mt-1">This muscle is tracked by Dynamis, but the currently licensed anatomy model does not expose it as an independently selectable structure.</div>
                <div className="mono text-xs mt-1">SESSIONS: {selStats.sessions} · SCORE: {selStats.score}% ({selStats.level.id})</div>
              </div>
              <div className="muscle-analysis-actions">
                <Link to={`/muscles/${encodeURIComponent(sel.name)}`} className="btn btn-primary text-center">VIEW MUSCLE ANALYSIS</Link>
              </div>
            </section>
          )
        )}

        <div className="card p-3 deep-muscles-section">
          <div className="mono text-[11px] text-mut mb-1">MUSCLES WITHOUT AN INDIVIDUAL MESH (ANALYSIS STILL AVAILABLE)</div>
          <div className="flex flex-wrap gap-1.5">
            {UNMAPPED_MUSCLES.map((id) => {
              const m = MUSCLE_REGISTRY.find((x) => x.id === id)
              if (!m) return null
              return (
                <button key={id} onClick={() => selectMuscle(id)} className="mono text-[11px] px-2 py-1.5" style={{ border: `1px solid ${selected === id ? '#3b82f6' : '#2a2e34'}`, minHeight: 44 }}>
                  <span style={{ color: '#eab308' }}>■</span> {m.name}
                </button>
              )
            })}
          </div>
        </div>

        <div className="card p-3">
          <div className="mono text-[11px]" style={{ color: '#eab308' }}>NEEDS ATTENTION</div>
          {worst.map((s) => (
            <Link key={s.id} to={`/muscles/${encodeURIComponent(s.name)}`} className="flex justify-between text-sm py-1.5" style={{ borderBottom: '1px solid #1e2126' }}>
              <span>{s.name}</span><span className="mono text-[11px] text-mut">{s.sessions} SESSIONS · {s.score}%</span>
            </Link>
          ))}
        </div>
        <div className="card p-3">
          <div className="mono text-[11px] text-good">BEST COVERED</div>
          {best.map((s) => (
            <Link key={s.id} to={`/muscles/${encodeURIComponent(s.name)}`} className="flex justify-between text-sm py-1.5" style={{ borderBottom: '1px solid #1e2126' }}>
              <span>{s.name}</span><span className="mono text-[11px] text-mut">{s.score}%</span>
            </Link>
          ))}
          {!best.length && <div className="text-xs text-mut">Log workouts to build coverage.</div>}
        </div>

        <CoverageHeatmap matrix={matrix} />

        <div className="grid grid-cols-2 gap-2" id="muscle-list">
          <label className="block"><span className="mono text-[10px] text-mut">SORT</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="alpha">Alphabetical</option>
              <option value="most">Most trained</option>
              <option value="least">Least trained</option>
            </select></label>
          <label className="block"><span className="mono text-[10px] text-mut">GROUP</span>
            <select value={group} onChange={(e) => setGroup(e.target.value)}>
              {groups.map((g) => <option key={g}>{g}</option>)}
            </select></label>
        </div>

        <div className="space-y-2">
          {rows.map((r) => {
            const st = r.st
            const pct = st ? st.score : 0
            return (
              <Link key={r.name} to={`/muscles/${encodeURIComponent(r.name)}`} className="card p-3 block">
                <div className="flex justify-between gap-2 text-sm">
                  <b>{r.name}</b>
                  <span className="mono text-[11px]" style={{ color: st && st.sessions ? st.level.color : '#9aa0a8' }}>{st && st.sessions ? `${st.sessions} SESS · ${st.level.id}` : 'NOT TRAINED'}</span>
                </div>
                <div className="mt-1"><ProgressBar pct={pct} color={st && st.sessions ? st.level.color : '#1e2126'} /></div>
                <div className="mono text-[10px] text-mut mt-1">{r.bucket} · {st?.level.id || 'NOT COVERED'}</div>
              </Link>
            )
          })}
          {!rows.length && <EmptyState title="No muscles match filter" />}
        </div>
      </div>
    </div>
  )
}

function MuscleSheet({ name, st, onClose }) {
  return (
    <section className="muscle-analysis-card" role="dialog" aria-label={`${name} summary`}>
      <div className="muscle-analysis-header">
        <b>{name.toUpperCase()}</b>
        <button className="mono text-xs underline" onClick={onClose}>CLOSE</button>
      </div>
      <div className="mono text-[11px] text-mut mt-2">COVERAGE</div>
      <div className="progress"><div style={{ width: `${st.score}%`, background: st.level.color }} /></div>
      <div className="muscle-analysis-stats text-xs mono">
        <div>DIRECT <b>{st.directSessions} sessions</b></div>
        <div>INDIRECT <b>{st.indirectSessions} sessions</b></div>
        <div>LAST TRAINED <b>{st.lastTrained || '—'}</b></div>
        <div>FREQUENCY <b>{st.frequency.toFixed(1)}× / week</b></div>
        <div>VOLUME <b>{Math.round(st.volume).toLocaleString()} kg</b></div>
        <div>LEVEL <b style={{ color: st.level.color }}>{st.level.id}</b></div>
      </div>
      <div className="mono text-[10px] text-mut mt-1">Bilateral analysis — left and right sides combined. Bilateral exercises count for the whole muscle.</div>
      <div className="muscle-analysis-actions">
        <Link to={`/muscles/${encodeURIComponent(name)}`} className="btn btn-primary text-center">VIEW FULL ANALYSIS</Link>
      </div>
    </section>
  )
}
