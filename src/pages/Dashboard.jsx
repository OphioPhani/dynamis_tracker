import { Link } from 'react-router-dom'
import { logDayKey } from '../utils/dateUtils.js'
import { logsForSession, plannedSetsFor, getExerciseStatus } from '../utils/sessionState.js'
import { Play, Layers, History, TrendingUp, Wifi, WifiOff, LayoutGrid } from 'lucide-react'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { getIndiaDateString } from '../utils/dateUtils.js'
import { Header, ProgressBar } from '../components/ui.jsx'
import RestTimer from '../components/RestTimer.jsx'
import { todayName, dayKey, greeting, weekDays } from '../utils/dates.js'
import { WORKOUT_PLAN, DAY_META, REQUIRED_MUSCLES } from '../data/workoutPlan.js'
import { calculateMuscleCoverage } from '../utils/coverage.js'

export default function Dashboard() {
  const { selections, logs, syncMsg, online, todayItems, activeSplit } = useStore()
  const { user } = useAuth()
  const today = todayName()
  const meta = DAY_META[today]
  const sched = todayItems(today)
  const plan = WORKOUT_PLAN.filter((x) => x.day === today)
  const tkey = dayKey()
  // Today's persistent session (latest seq for today+split+day) — journal, not a resetting checklist.
  const splitId = activeSplit?.id || null
  const todaySeqs = logs.filter((l) => logDayKey(l) === tkey && (l.splitId || null) === (splitId || null) && (l.workoutDay || l.day || '') === today).map((l) => l.sessionSeq || 1)
  const todaySeq = todaySeqs.length ? Math.max(...todaySeqs) : 0
  const todayLogs = todaySeq > 0
    ? logsForSession(logs, { workoutDate: tkey, splitId, workoutDay: today, sessionSeq: todaySeq })
    : []
  const sessItems = (sched.isRestDay ? [] : sched.items).map((it) => {
    const sel = selections[it.muscle] || it.selectedRank || 'good'
    const entry = WORKOUT_PLAN.find((x) => x.muscle === it.muscle)
    const ex = entry?.exercises.find((e) => e.rank === sel) || it.exercise
    const sets = todayLogs.filter((l) => l.muscle === it.muscle)
    return { it, ex, sets, done: getExerciseStatus(sets, plannedSetsFor(ex)) === 'COMPLETED' }
  })
  const plannedTotal = sessItems.length
  const exDone = sessItems.filter((s) => s.done).length
  const setsDone = todayLogs.length
  const setsPlanned = sessItems.reduce((a, s) => a + plannedSetsFor(s.ex), 0)
  const dayComplete = plannedTotal > 0 && exDone >= plannedTotal
  const cov = calculateMuscleCoverage(todayLogs.map((l) => ({ muscle: l.muscle, rank: l.rank, exerciseName: l.exerciseName })))

  const week = weekDays()
  const weekCov = week.map((d) => {
    const k = getIndiaDateString(d)
    const dl = logs.filter((l) => logDayKey(l) === k)
    return { label: d.toLocaleDateString('en-US', { weekday: 'short' }), n: new Set(dl.map((x) => x.muscle)).size, full: d.toLocaleDateString('en-US', { weekday: 'long' }) }
  })

  return (
    <div className="no-hscroll">
      <Header
        title={`${greeting()}, ${user?.email?.split('@')[0]?.toUpperCase() || 'LIFTER'}`}
        sub={`TODAY · ${today.toUpperCase()} · ${meta?.focus?.toUpperCase() || ''}`}
        right={<span className="mono text-[10px] px-2 py-1 flex items-center gap-1" style={{ border: '1px solid #2a2e34' }}>{online ? <Wifi size={12} /> : <WifiOff size={12} />}{syncMsg}</span>}
      />
      <div className="p-3 space-y-3 max-w-md mx-auto pb-24">
        {/* CURRENT SPLIT */}
        <section className="card p-3">
          <div className="mono text-[11px] text-mut">CURRENT SPLIT</div>
          <div className="flex items-center gap-2">
            <b>{activeSplit?.name?.toUpperCase() || "SNAKE'S SPLIT"}</b>
            {activeSplit?.badge && <span className="badge" style={{ background: '#fff', color: '#000' }}>{activeSplit.badge}</span>}
            {!activeSplit?.isPreset && <span className="badge badge-best">CUSTOM</span>}
          </div>
          <div className="mono text-[11px] text-mut mt-0.5">{activeSplit?.daysPerWeek || 5} DAYS / WEEK</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Link to="/splits" className="btn text-center">CHANGE SPLIT</Link>
            <Link to="/setup" className="btn text-center">SETUP WIZARD</Link>
          </div>
        </section>
        {/* TODAY */}
        <section className="card p-3" style={{ borderTop: `4px solid ${meta?.color || '#fff'}` }}>
          <div className="mono text-[11px] text-mut">TODAY'S WORKOUT</div>
          <div className="text-lg font-black">{sched.isRestDay ? `${today.toUpperCase()} — REST` : `${today.toUpperCase()} — ${sched.name.toUpperCase()}`}</div>
          <div className="text-xs text-mut">{sched.isRestDay ? 'REST DAY — recover, walk, sleep' : `${sched.items.length} MUSCLES · ${sched.items.filter((i) => i.exercise).length} AUTO-MATCHED TO YOUR GYM`}</div>
          {sched.isRestDay ? (
            <div className="mono text-sm mt-2 text-center py-2">REST DAY — RECOVER · WALK · SLEEP</div>
          ) : dayComplete ? (
            <>
              <div className="text-center font-black text-good mt-2">✓ TODAY'S WORKOUT COMPLETE</div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                <div className="card2 p-2"><div className="mono text-[10px] text-mut">EXERCISES</div><div className="font-black">{exDone}/{plannedTotal}</div></div>
                <div className="card2 p-2"><div className="mono text-[10px] text-mut">SETS</div><div className="font-black">{setsDone}</div></div>
                <div className="card2 p-2"><div className="mono text-[10px] text-mut">MUSCLES</div><div className="font-black">{cov.uniqueMusclesCovered}</div></div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Link to={`/history/${tkey}`} className="btn btn-primary text-center">VIEW SESSION</Link>
                <Link to="/workout" className="btn text-center">EDIT SESSION</Link>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                <div className="card2 p-2"><div className="mono text-[10px] text-mut">EXERCISES</div><div className="font-black">{exDone}/{plannedTotal}</div></div>
                <div className="card2 p-2"><div className="mono text-[10px] text-mut">SETS</div><div className="font-black">{setsDone}/{setsPlanned}</div></div>
                <div className="card2 p-2"><div className="mono text-[10px] text-mut">MUSCLES</div><div className="font-black">{cov.uniqueMusclesCovered}/{REQUIRED_MUSCLES.length}</div></div>
              </div>
              <div className="mt-2"><ProgressBar pct={setsPlanned ? (setsDone / setsPlanned) * 100 : 0} /></div>
              <Link to="/workout" className="btn btn-primary mt-3 flex items-center justify-center gap-2" style={{ minHeight: 54 }}><Play size={18} /> {exDone > 0 ? 'CONTINUE WORKOUT' : "START TODAY'S WORKOUT"}</Link>
            </>
          )}
        </section>

        <RestTimer />

        {/* coverage */}
        <section className="card p-3">
          <div className="mono text-[11px] text-mut">MUSCLE COVERAGE (TODAY)</div>
          <div className="font-black text-lg">{cov.uniqueMusclesCovered} / {REQUIRED_MUSCLES.length} <span className="text-xs text-mut">· DIRECT {cov.directMusclesCovered} · WEIGHTED {cov.weightedCoverage}%</span></div>
          <div className="mt-1"><ProgressBar pct={(cov.uniqueMusclesCovered / REQUIRED_MUSCLES.length) * 100} /></div>
          <div className="text-xs mt-1 text-mut">Covered: {cov.muscles.filter((m) => m.covered).slice(0, 6).map((m) => m.name).join(', ')}{cov.uniqueMusclesCovered > 6 ? '…' : ''}</div>
        </section>

        {/* week */}
        <section className="card p-3">
          <div className="mono text-[11px] text-mut mb-2">THIS WEEK (MUSCLES / SESSION)</div>
          {weekCov.map((w) => (
            <div key={w.label} className="flex items-center gap-2 py-1 text-xs">
              <span className="mono w-8">{w.label.toUpperCase()}</span>
              <div className="progress flex-1"><div style={{ width: `${Math.min(100, (w.n / 26) * 100)}%`, background: w.full === today ? '#fff' : '#22c55e' }} /></div>
              <span className="mono w-8 text-right">{w.full === 'Wednesday' || w.full === 'Sunday' ? '—' : w.n}</span>
            </div>
          ))}
        </section>

        {/* quick actions */}
        <section className="grid grid-cols-2 gap-2">
          <Link to="/splits" className="btn flex flex-col items-center gap-1"><LayoutGrid size={18} />SPLITS</Link>
          <Link to="/muscles" className="btn flex flex-col items-center gap-1"><Layers size={18} />MUSCLES</Link>
          <Link to="/history" className="btn flex flex-col items-center gap-1"><History size={18} />HISTORY</Link>
          <Link to="/progress" className="btn flex flex-col items-center gap-1"><TrendingUp size={18} />PROGRESS</Link>
        </section>
      </div>
    </div>
  )
}
