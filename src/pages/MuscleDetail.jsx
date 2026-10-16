import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { Header, RankBadge, ProgressBar, EmptyState } from '../components/ui.jsx'
import { ProgressLine } from '../components/Charts.jsx'
import { WORKOUT_PLAN } from '../data/workoutPlan.js'
import { MUSCLE_BY_NAME, MUSCLE_BY_ID, resolveMuscleId } from '../data/muscles.js'
import { muscleStatsFor, logsInPeriod } from '../utils/muscleStats.js'
import { getIndiaDateString } from '../utils/dateUtils.js'
import { getSplitById } from '../data/splits.js'

const RANGES = [
  { id: '7d', label: '7D', days: 7 },
  { id: '30d', label: '30D', days: 30 },
  { id: '90d', label: '90D', days: 90 },
  { id: '1y', label: '1Y', days: 365 },
  { id: 'all', label: 'ALL', days: Infinity }
]

export default function MuscleDetail() {
  const { name } = useParams()
  const muscle = decodeURIComponent(name || '')
  const { logs, selections, setSelection, customSplits, activeSplitId } = useStore()
  const [range, setRange] = useState('90d')
  const plan = WORKOUT_PLAN.find((x) => x.muscle === muscle)
  const regId = resolveMuscleId(muscle)
  const reg = MUSCLE_BY_NAME.get(muscle) || (regId ? MUSCLE_BY_ID.get(regId) : null)

  const days = RANGES.find((r) => r.id === range)?.days ?? 90
  const plogs = useMemo(() => logsInPeriod(logs, days), [logs, days])
  const stats = useMemo(() => muscleStatsFor(plogs, days), [plogs, days])
  const st = regId ? stats.get(regId) : null
  // Fallback: stats keyed by display name for legacy-shaped entries
  const legacy = !st ? [...stats.values()].find((s) => s.name === muscle) : null
  const S = st || legacy

  // Frequency + volume over time (per IST week in range)
  const { freqData, volData, setsPerWeek, avgSets } = useMemo(() => {
    if (!S) return { freqData: [], volData: [], setsPerWeek: [], avgSets: 0 }
    const weeks = new Map()
    for (const l of plogs) {
      const ex = WORKOUT_PLAN.flatMap((m) => m.exercises).find((e) => e.name === l.exerciseName)
      const involves = ex ? [...(ex.primary || []), ...(ex.secondary || []), ...(ex.stabilizers || [])].includes(muscle) : l.muscle === muscle
      if (!involves) continue
      const wk = weekKeyOf(l)
      if (!weeks.has(wk)) weeks.set(wk, { sets: 0, vol: 0, sess: new Set() })
      const w = weeks.get(wk)
      w.sets++
      w.vol += (Number(l.weight) || 0) * (Number(l.reps) || 0)
      w.sess.add(`${(l.workoutDate || '').slice(0, 10)}|${l.workoutDay || l.day || ''}`)
    }
    const keys = [...weeks.keys()].sort().slice(-12)
    const freqData = keys.map((k) => ({ label: k.slice(5), weight: weeks.get(k).sess.size }))
    const volData = keys.map((k) => ({ label: k.slice(5), weight: Math.round(weeks.get(k).vol) }))
    const setsPerWeek = keys.map((k) => ({ w: k.slice(5), sets: weeks.get(k).sets }))
    const avgSets = setsPerWeek.length ? setsPerWeek.reduce((a, x) => a + x.sets, 0) / setsPerWeek.length : 0
    return { freqData, volData, setsPerWeek, avgSets }
  }, [plogs, muscle])

  // Snake's Split contribution: which training days include this muscle (primary ● / secondary ◐)
  const snake = getSplitById(activeSplitId === 'snake-split' ? activeSplitId : 'snake-split', customSplits)
  const contribution = useMemo(() => {
    const order = ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday']
    return order.map((d) => {
      const day = (snake?.days || []).find((x) => x.dayOfWeek === d)
      const targeted = (day?.muscles || []).some((m) => m.muscle === muscle)
      let role = '○'
      if (targeted) {
        const prim = WORKOUT_PLAN.filter((m) => (day?.muscles || []).some((t) => t.muscle === m.muscle))
          .flatMap((m) => m.exercises).some((e) => (e.primary || []).includes(muscle))
        role = prim ? '●' : '◐'
      }
      return { d, role, planned: targeted }
    })
  }, [snake, muscle])

  const plannedCount = contribution.filter((c) => c.planned).length
  const actualCount = S && S.sessions > 0 ? 1 : 0

  if (!plan && !reg) return <div className="p-4 max-w-md mx-auto"><EmptyState title="Muscle not found" /><Link to="/muscles" className="btn mt-2">BACK</Link></div>

  return (
    <div className="no-hscroll">
      <Header title={`${muscle.toUpperCase()} — MUSCLE ANALYSIS`} sub={reg ? `${reg.location} · ${reg.group}` : plan ? `${plan.group} · ${plan.day}` : ''} />
      <div className="p-3 space-y-3 max-w-md mx-auto pb-24">
        {reg && (
          <div className="card p-3 text-xs space-y-1">
            <div><b>LOCATION:</b> {reg.location}</div>
            <div><b>PRIMARY FUNCTION:</b> {reg.func}</div>
            <div><b>TRAINING ROLE:</b> {reg.role}</div>
          </div>
        )}

        <div className="flex gap-1.5 overflow-x-auto" role="tablist" aria-label="Analysis range">
          {RANGES.map((r) => (
            <button key={r.id} role="tab" aria-selected={range === r.id} onClick={() => setRange(r.id)} className="mono text-[11px] font-extrabold px-3 py-2 shrink-0" style={{ border: '1px solid #2a2e34', background: range === r.id ? '#fff' : 'transparent', color: range === r.id ? '#000' : '#e8eaed', minHeight: 44 }}>
              {r.label}
            </button>
          ))}
        </div>

        <div className="card p-3" style={{ borderTop: `4px solid ${S ? S.level.color : '#2a2e34'}` }}>
          <div className="mono text-[11px] text-mut">COVERAGE SCORE ({RANGES.find((r) => r.id === range)?.label})</div>
          <div className="font-black text-3xl">{S ? `${S.score}%` : '—'} <span className="mono text-xs" style={{ color: S?.level.color }}>· {S?.level.id || 'NOT COVERED'}</span></div>
          <div className="mt-1"><ProgressBar pct={S?.score || 0} color={S?.level.color || '#1e2126'} /></div>
          <div className="grid grid-cols-2 gap-2 mt-3 mono text-xs">
            <div className="card2 p-2">FREQUENCY<br /><b>{S ? S.frequency.toFixed(1) : '0.0'}× / week</b></div>
            <div className="card2 p-2">LAST TRAINED<br /><b>{S?.lastTrained ? `${S.lastTrained}${S.daysSince === 0 ? ' (today)' : S.daysSince === 1 ? ' (1 day ago)' : ` (${S.daysSince} days ago)`}` : 'NEVER'}</b></div>
            <div className="card2 p-2">DIRECT TRAINING<br /><b>{S?.directSessions || 0} sessions</b></div>
            <div className="card2 p-2">INDIRECT TRAINING<br /><b>{S?.indirectSessions || 0} sessions</b></div>
            <div className="card2 p-2">TOTAL SETS<br /><b>{S?.sets || 0}</b></div>
            <div className="card2 p-2">TOTAL REPS<br /><b>{S?.reps || 0}</b></div>
            <div className="card2 p-2 col-span-2">TRAINING VOLUME<br /><b>{Math.round(S?.volume || 0).toLocaleString()} kg (completed direct sets)</b></div>
          </div>
          <div className="mono text-[10px] text-mut mt-2">TRAINING RECENCY: {S?.lastTrained ? `last logged ${S.lastTrained}` : 'no logged training in range'}. Recency is a tracking signal, not a recovery assessment.</div>
        </div>

        <div className="card p-3">
          <div className="mono text-[11px] text-mut mb-1">EXERCISES TRAINING THIS MUSCLE</div>
          <div className="mono text-[10px] text-mut">DIRECT</div>
          {(S?.exercisesDirect || []).map((e) => <ExBar key={e.name} name={e.name} n={e.sessions} max={(S.exercisesDirect[0] || {}).sessions || 1} color="#22c55e" />)}
          {!(S?.exercisesDirect || []).length && <div className="text-xs text-mut">None logged in range.</div>}
          <div className="mono text-[10px] text-mut mt-2">INDIRECT</div>
          {(S?.exercisesIndirect || []).slice(0, 8).map((e) => <ExBar key={e.name} name={e.name} n={e.sessions} max={(S.exercisesIndirect[0] || {}).sessions || 1} color="#eab308" />)}
          {!(S?.exercisesIndirect || []).length && <div className="text-xs text-mut">None logged in range.</div>}
        </div>

        <div className="card p-3">
          <div className="mono text-[11px] text-mut mb-1">TRAINING FREQUENCY (SESSIONS / WEEK)</div>
          {freqData.length > 1 ? <ProgressLine data={freqData} /> : <div className="text-xs text-mut">Need 2+ active weeks for a graph.</div>}
        </div>
        <div className="card p-3">
          <div className="mono text-[11px] text-mut mb-1">VOLUME OVER TIME (KG, COMPLETED SETS)</div>
          {volData.length > 1 ? <ProgressLine data={volData} /> : <div className="text-xs text-mut">Need 2+ active weeks for a graph.</div>}
        </div>
        <div className="card p-3">
          <div className="mono text-[11px] text-mut mb-1">SETS / WEEK (AVERAGE {avgSets.toFixed(2)})</div>
          {setsPerWeek.map((w) => {
            const peak = Math.max(1, ...setsPerWeek.map((x) => x.sets))
            return (
              <div key={w.w} className="flex items-center gap-2 py-0.5">
                <span className="mono text-[11px] w-12">{w.w}</span>
                <div className="flex-1" style={{ background: '#1e2126', height: 16, border: '1px solid #2a2e34' }}>
                  <div style={{ width: `${Math.min(100, (w.sets / peak) * 100)}%`, height: '100%', background: '#3b82f6' }} />
                </div>
                <span className="mono text-[11px] w-8 text-right">{w.sets}</span>
              </div>
            )
          })}
          {!setsPerWeek.length && <div className="text-xs text-mut">No sets in range.</div>}
        </div>

        <div className="card p-3">
          <div className="mono text-[11px] text-mut mb-1">SNAKE'S SPLIT CONTRIBUTION (UNCHANGED)</div>
          {contribution.map((c) => (
            <div key={c.d} className="flex justify-between text-sm py-1" style={{ borderTop: '1px solid #1e2126' }}>
              <span className="mono text-[11px]">{c.d.slice(0, 3).toUpperCase()}</span>
              <span style={{ color: c.role === '○' ? '#9aa0a8' : '#22c55e' }}>{c.role} {c.role === '●' ? 'PRIMARY' : c.role === '◐' ? 'SECONDARY' : 'NOT PLANNED'}</span>
            </div>
          ))}
          <div className="mono text-[10px] text-mut mt-1">PLANNED {plannedCount}/5 DAYS · ACTUAL IN RANGE: {actualCount ? 'TRAINED' : 'NOT TRAINED'}</div>
          <div className="mt-1"><ProgressBar pct={(plannedCount / 5) * 100} color="#3b82f6" /></div>
          <div className="mono text-[10px] text-mut mt-0.5">Blue = planned by the split. Green coverage above = actually logged. Planned is never counted as trained.</div>
        </div>

        {plan && (
          <>
            <div className="mono text-[11px] text-mut">EXERCISE OPTIONS — TAP TO SELECT</div>
            {plan.exercises.map((ex) => (
              <div key={ex.rank} className="card p-3" style={{ borderLeft: `4px solid ${ex.rank === 'good' ? '#22c55e' : ex.rank === 'better' ? '#eab308' : '#3b82f6'}` }}>
                <div className="flex items-center justify-between"><RankBadge rank={ex.rank} /><span className="mono text-[10px] text-mut">{ex.mode.toUpperCase()}</span></div>
                <div className="font-black mt-1">{ex.name.toUpperCase()}</div>
                <div className="text-xs mt-1">Equip: {ex.equipment} · Grip: {ex.grip} ({ex.gripDetail}) · {ex.sets} × {ex.reps}</div>
                <button className={`btn mt-2 ${selections[muscle] === ex.rank ? 'btn-primary' : ''}`} onClick={() => setSelection(muscle, ex.rank)}>
                  {selections[muscle] === ex.rank ? '✓ SELECTED' : `SELECT ${ex.rank.toUpperCase()}`}
                </button>
              </div>
            ))}
          </>
        )}
        <Link to="/muscles" className="btn">BACK TO MUSCLES</Link>
      </div>
    </div>
  )
}

function weekKeyOf(l) {
  const d = (l.workoutDate || '').slice(0, 10) || getIndiaDateString()
  const dt = new Date(d + 'T12:00:00Z')
  const dow = (dt.getUTCDay() + 6) % 7
  dt.setUTCDate(dt.getUTCDate() - dow)
  return dt.toISOString().slice(0, 10)
}

function ExBar({ name, n, max, color }) {
  const denom = Math.max(1, max || n)
  return (
    <div className="py-1" style={{ borderTop: '1px solid #1e2126' }}>
      <div className="flex justify-between text-xs"><b>{name.toUpperCase()}</b><span className="mono text-[11px] text-mut">{n} SESSIONS</span></div>
      <div className="mt-0.5" style={{ background: '#1e2126', height: 10, border: '1px solid #2a2e34' }}>
        <div style={{ width: `${Math.min(100, (n / denom) * 100)}%`, height: '100%', background: color }} />
      </div>
    </div>
  )
}
