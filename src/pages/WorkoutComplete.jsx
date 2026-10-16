import { Link } from 'react-router-dom'
import { logIndiaDate } from '../utils/dateUtils.js'
import { Check } from 'lucide-react'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { Header, ProgressBar } from '../components/ui.jsx'
import { dayKey } from '../utils/dates.js'
import { REQUIRED_MUSCLES } from '../data/workoutPlan.js'
import { calculateMuscleCoverage } from '../utils/coverage.js'

export default function WorkoutComplete() {
  const { logs } = useStore()
  const tkey = dayKey()
  const todayLogs = logs.filter((l) => logIndiaDate(l) === tkey)
  const cov = calculateMuscleCoverage(todayLogs.map((l) => ({ muscle: l.muscle, rank: l.rank, exerciseName: l.exerciseName })))
  const exCount = new Set(todayLogs.map((l) => l.muscle)).size
  const first = todayLogs[todayLogs.length - 1]?.performedAt
  const last = todayLogs[0]?.performedAt
  const mins = first && last ? Math.max(1, Math.round((new Date(last) - new Date(first)) / 60000)) : 0

  return (
    <div className="no-hscroll">
      <Header title="WORKOUT COMPLETE" sub="Nice work — recovery starts now" />
      <div className="p-4 max-w-md mx-auto pb-24 space-y-3">
        <div className="card p-4 text-center" style={{ borderTop: '4px solid #22c55e' }}>
          <div className="text-3xl">✓</div>
          <h2 className="text-xl font-black">WORKOUT COMPLETE</h2>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="card2 p-2"><div className="mono text-[10px] text-mut">EXERCISES</div><div className="font-black text-lg">{exCount}</div></div>
            <div className="card2 p-2"><div className="mono text-[10px] text-mut">SETS</div><div className="font-black text-lg">{todayLogs.length}</div></div>
            <div className="card2 p-2"><div className="mono text-[10px] text-mut">MUSCLES</div><div className="font-black text-lg">{cov.uniqueMusclesCovered}</div></div>
          </div>
          <div className="mono text-xs mt-2 text-mut">DURATION: {mins} MIN · DIRECT {cov.directMusclesCovered} · WEIGHTED {cov.weightedCoverage}%</div>
          <div className="mt-2"><ProgressBar pct={(cov.uniqueMusclesCovered / REQUIRED_MUSCLES.length) * 100} /></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link to={`/history/${tkey}`} className="btn btn-primary text-center">VIEW SESSION</Link>
          <Link to="/" className="btn text-center">BACK TO HOME</Link>
        </div>
      </div>
    </div>
  )
}
