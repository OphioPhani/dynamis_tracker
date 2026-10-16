import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { Header, EmptyState } from '../components/ui.jsx'
import { calculateMuscleCoverage } from '../utils/coverage.js'
import { logDayKey } from '../utils/dateUtils.js'

function groupByDate(logs) {
  const m = new Map()
  for (const l of logs) {
    const k = logDayKey(l)
    if (!m.has(k)) m.set(k, [])
    m.get(k).push(l)
  }
  return [...m.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1))
}

export default function History() {
  const { logs } = useStore()
  const sessions = useMemo(() => groupByDate(logs), [logs])

  return (
    <div className="no-hscroll">
      <Header title="HISTORY" sub={`${sessions.length} sessions logged`} />
      <div className="p-3 space-y-2 max-w-md mx-auto pb-24">
        {sessions.map(([date, dl]) => {
          const cov = calculateMuscleCoverage(dl.map((l) => ({ muscle: l.muscle, rank: l.rank, exerciseName: l.exerciseName })))
          const day = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' })
          const splitName = dl.find((l) => l.splitName)?.splitName
          const wdays = [...new Set(dl.map((l) => l.workoutDay || l.day).filter(Boolean))]
          const seqs = [...new Set(dl.map((l) => l.sessionSeq || 1))]
          return (
            <Link key={date} to={`/history/${date}`} className="card p-3 block">
              <div className="mono text-[11px] text-mut">{date} · {day.toUpperCase()}{splitName ? ` · ${splitName.toUpperCase()}` : ''}</div>
              <div className="font-black">{cov.uniqueMusclesCovered} MUSCLES · {new Set(dl.map((x) => x.muscle)).size} EXERCISES · {dl.length} SETS</div>
              <div className="mono text-[11px] text-mut">DAY: {wdays.join(' + ').toUpperCase() || '—'}{seqs.length > 1 ? ` · ${seqs.length} SESSIONS` : ''}</div>
              <div className="mono text-[11px] text-good">✓ COMPLETED</div>
            </Link>
          )
        })}
        {!sessions.length && <EmptyState title="No sessions yet" sub="Log your first workout from WORKOUT tab." />}
      </div>
    </div>
  )
}
