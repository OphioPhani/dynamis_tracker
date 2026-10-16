import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { Header, EmptyState } from '../components/ui.jsx'
import { ProgressLine } from '../components/Charts.jsx'

export default function ExerciseProgress() {
  const { muscle, name } = useParams()
  const exName = decodeURIComponent(name || '')
  const { logs, settings } = useStore()
  const [range, setRange] = useState('ALL')
  const sets = useMemo(() => {
    const days = range === '1M' ? 30 : range === '3M' ? 90 : range === '6M' ? 180 : 3650
    const since = Date.now() - days * 864e5
    return logs.filter((l) => l.exerciseName === exName && new Date(l.performedAt).getTime() >= since)
      .sort((a, b) => (a.performedAt < b.performedAt ? -1 : 1))
  }, [logs, exName, range])

  const bestW = sets.length ? Math.max(...sets.map((s) => s.weight)) : 0
  const bestR = sets.length ? Math.max(...sets.map((s) => s.reps)) : 0
  const bestV = sets.length ? Math.max(...sets.map((s) => s.weight * s.reps)) : 0
  const data = sets.map((s) => ({ label: new Date(s.performedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), weight: Number(s.weight) }))

  return (
    <div className="no-hscroll">
      <Header title={exName.toUpperCase()} sub={decodeURIComponent(muscle || '').toUpperCase()} />
      <div className="p-3 space-y-3 max-w-md mx-auto pb-24">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="card p-2"><div className="mono text-[10px] text-mut">BEST WT</div><div className="font-black">{bestW} {settings.unit}</div></div>
          <div className="card p-2"><div className="mono text-[10px] text-mut">BEST REPS</div><div className="font-black">{bestR}</div></div>
          <div className="card p-2"><div className="mono text-[10px] text-mut">BEST VOL</div><div className="font-black">{bestV}</div></div>
        </div>
        <div className="flex gap-1.5">
          {['1M', '3M', '6M', 'ALL'].map((r) => (
            <button key={r} onClick={() => setRange(r)} className="btn" style={range === r ? { background: '#fff', color: '#000' } : {}}>{r}</button>
          ))}
        </div>
        <div className="card p-3">
          <div className="mono text-[11px] text-mut mb-1">WEIGHT OVER TIME ({sets.length} SETS)</div>
          {data.length > 1 ? <ProgressLine data={data} /> : <div className="text-xs text-mut">Need 2+ logged sets to draw a graph. Log from WORKOUT tab.</div>}
        </div>
        {bestW > 0 && sets[sets.length - 1]?.weight >= bestW && <div className="card p-3 text-center font-black text-good">★ NEW PR — {bestW} {settings.unit}</div>}
        {!sets.length && <EmptyState title="No logs for this exercise yet" />}
        <Link to="/progress" className="btn">BACK TO PROGRESS</Link>
      </div>
    </div>
  )
}
