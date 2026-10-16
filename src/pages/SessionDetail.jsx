import { Link, useParams } from 'react-router-dom'
import { logDayKey } from '../utils/dateUtils.js'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { Header, EmptyState } from '../components/ui.jsx'
import { calculateMuscleCoverage } from '../utils/coverage.js'

export default function SessionDetail() {
  const { date } = useParams()
  const { logs, settings } = useStore()
  const dl = logs.filter((l) => logDayKey(l) === date)
  if (!dl.length) return <div className="p-4 max-w-md mx-auto"><EmptyState title="Session not found" /><Link to="/history" className="btn mt-2">BACK</Link></div>
  const cov = calculateMuscleCoverage(dl.map((l) => ({ muscle: l.muscle, rank: l.rank, exerciseName: l.exerciseName })))
  const prim = cov.muscles.filter((m) => m.type === 'primary').map((m) => m.name)
  const sec = cov.muscles.filter((m) => m.type === 'secondary').map((m) => m.name)
  const stab = cov.muscles.filter((m) => m.type === 'stabilizer').map((m) => m.name)
  const vol = dl.reduce((a, l) => a + l.weight * l.reps, 0)
  const splitName = dl.find((l) => l.splitName)?.splitName
  // Group into session blocks: workout_day + sessionSeq (repeats stay separate).
  const blocks = new Map()
  for (const l of dl) {
    const k = `${l.workoutDay || l.day || '?'}|${l.sessionSeq || 1}`
    if (!blocks.has(k)) blocks.set(k, [])
    blocks.get(k).push(l)
  }

  return (
    <div className="no-hscroll">
      <Header title={`SESSION ${date}`} sub={`${dl.length} sets · ${vol.toFixed(0)} ${settings.unit} volume${splitName ? ` · ${splitName.toUpperCase()}` : ''}`} />
      <div className="p-3 space-y-2 max-w-md mx-auto pb-24">
        <div className="card p-3 mono text-xs">
          MUSCLES {cov.uniqueMusclesCovered} · DIRECT {cov.directMusclesCovered} · WEIGHTED {cov.weightedCoverage}%<br />
          PRIMARY: {prim.join(', ') || '—'}<br />
          SECONDARY: {sec.join(', ') || '—'}<br />
          STABILIZERS: {stab.slice(0, 8).join(', ')}{stab.length > 8 ? '…' : ''}
        </div>
        {[...blocks.entries()].map(([k, sets]) => {
          const [wday, seq] = k.split('|')
          const first = sets[0]
          return (
            <div key={k} className="card p-3">
              <div className="flex items-center gap-2">
                <b className="text-sm">{wday.toUpperCase()} WORKOUT</b>
                {Number(seq) > 1 && <span className="badge badge-better">SESSION {seq}</span>}
                <span className="mono text-[10px] text-mut ml-auto">{first.splitName?.toUpperCase() || ''}</span>
              </div>
              {[...new Map(sets.map((s) => [s.muscle, s])).values()].map((s) => {
                const ms = sets.filter((x) => x.muscle === s.muscle)
                return (
                  <div key={s.muscle} className="py-1" style={{ borderTop: '1px solid #1e2126' }}>
                    <div className="text-sm"><span className="text-good">✓</span> <b>{s.exerciseName}</b> <span className="mono text-[10px] text-mut">({s.muscle} · {ms.length} SETS)</span></div>
                    {ms.map((x) => (
                      <div key={x.localId} className="mono text-xs text-mut ml-5">
                        {x.weight} {settings.unit} × {x.reps} · {new Date(x.performedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    ))}
                  </div>
                )
              })}
              <Link to={`/workout?day=${encodeURIComponent(wday)}&date=${date}${Number(seq) > 1 ? `&seq=${seq}` : ''}`} className="btn mt-2 text-center">EDIT SESSION</Link>
            </div>
          )
        })}
        <Link to="/history" className="btn">BACK TO HISTORY</Link>
      </div>
    </div>
  )
}
