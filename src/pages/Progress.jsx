import { useMemo, useState } from 'react'
import { logDayKey, getIndiaDateString } from '../utils/dateUtils.js'
import { getDayStatus } from '../utils/sessionState.js'
import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { getIndiaWeekday } from '../utils/dateUtils.js'
import { Header, ProgressBar } from '../components/ui.jsx'
import { WeekBarChart, ProgressLine } from '../components/Charts.jsx'
import { calculateMuscleCoverage } from '../utils/coverage.js'
import { startOfWeek } from '../utils/dates.js'
import { scheduleForDay } from '../utils/splitEngine.js'
import { REQUIRED_MUSCLES, WORKOUT_PLAN } from '../data/workoutPlan.js'
import Yearly from './Yearly.jsx'

const GROUPS = {
  'UPPER BODY': ['Biceps brachii','Brachialis','Brachioradialis','Triceps brachii','Forearm flexors','Forearm extensors','Anterior deltoid','Lateral deltoid','Posterior deltoid','Supraspinatus','Infraspinatus','Teres minor','Subscapularis','Trapezius','Serratus anterior','Rhomboids','Rhomboid major','Rhomboid minor','Teres major','Levator scapulae','Latissimus dorsi','Pectoralis major','Pectoralis minor','Subclavius'],
  'LOWER BODY': ['Quadriceps','Hamstrings','Glutes','Adductors','Calves','Tibialis anterior','Iliopsoas','Rectus femoris','Tensor fasciae latae','Gluteus maximus'],
  'CORE / SPINE': ['Erector spinae','Rectus abdominis','External obliques','Internal obliques','Transverse abdominis','Multifidus','Quadratus lumborum','Rotatores','Semispinalis','Diaphragm','Pelvic floor']
}

export default function Progress() {
  const [tab, setTab] = useState('weekly')
  const tabs = [['daily', 'DAILY'], ['weekly', 'WEEKLY'], ['monthly', 'MONTHLY'], ['yearly', 'YEARLY']]
  return (
    <div className="no-hscroll">
      <Header title="PROGRESS" sub={`TODAY · ${getIndiaWeekday().toUpperCase()} · Daily · Weekly · Monthly · Yearly`} />
      <div className="p-3 max-w-md mx-auto pb-24">
        <div className="flex gap-0 overflow-x-auto" role="tablist" aria-label="Analytics period" style={{ border: '1px solid #2a2e34' }}>
          {tabs.map(([id, label]) => (
            <button
              key={id} role="tab" aria-selected={tab === id}
              onClick={() => setTab(id)}
              className="mono text-xs font-extrabold tracking-widest flex-1 whitespace-nowrap"
              style={{
                padding: '12px 8px', minHeight: 48,
                background: tab === id ? '#fff' : 'transparent',
                color: tab === id ? '#000' : '#e8eaed',
                borderRight: id !== 'yearly' ? '1px solid #2a2e34' : 'none'
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-3 space-y-3">
          <Link to="/leaderboard" className="btn text-center flex items-center justify-center gap-2"><Trophy size={16} /> LEADERBOARD</Link>
          {tab === 'daily' && <DailyView />}
          {tab === 'weekly' && <WeeklyView />}
          {tab === 'monthly' && <MonthlyView />}
          {tab === 'yearly' && <Yearly />}
        </div>
      </div>
    </div>
  )
}

function DailyView() {
  const { logs } = useStore()
  const tkey = getIndiaDateString()
  const dl = logs.filter((l) => logDayKey(l) === tkey)
  const cov = calculateMuscleCoverage(dl.map((l) => ({ muscle: l.muscle, rank: l.rank, exerciseName: l.exerciseName })))
  return (
    <>
      <div className="card p-3">
        <div className="mono text-[11px] text-mut">DAILY COVERAGE — TODAY</div>
        <div className="font-black text-lg">{cov.uniqueMusclesCovered} / {REQUIRED_MUSCLES.length} <span className="text-xs text-mut">· DIRECT {cov.directMusclesCovered} · WEIGHTED {cov.weightedCoverage}%</span></div>
        <div className="mt-1"><ProgressBar pct={(cov.uniqueMusclesCovered / REQUIRED_MUSCLES.length) * 100} /></div>
        <div className="text-xs mt-2"><b className="text-good">COVERED ({cov.uniqueMusclesCovered})</b><br />{cov.muscles.filter((m) => m.covered).map((m) => m.name).join(', ') || '—'}</div>
        <div className="text-xs mt-1 text-mut"><b>NOT YET ({REQUIRED_MUSCLES.length - cov.uniqueMusclesCovered})</b><br />{cov.muscles.filter((m) => !m.covered).map((m) => m.name).join(', ')}</div>
      </div>
      <div className="card p-3">
        <div className="mono text-[11px] text-mut mb-1">TODAY'S SESSIONS ({dl.length} SETS)</div>
        {dl.length === 0 && <div className="text-xs text-mut">Nothing logged today yet.</div>}
        <Link to="/workout" className="btn btn-primary mt-2 text-center">{dl.length ? 'CONTINUE TODAY\'S WORKOUT' : 'START TODAY\'S WORKOUT'}</Link>
      </div>
    </>
  )
}

function WeeklyView() {
  const { logs } = useStore()
  const weekStart = startOfWeek()
  const weekLogs = logs.filter((l) => new Date(l.performedAt) >= weekStart)
  const wcov = calculateMuscleCoverage(weekLogs.map((l) => ({ muscle: l.muscle, rank: l.rank, exerciseName: l.exerciseName })))

  // daily muscles for this week (chronological Mon..Sun)
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  const dayMap = {}
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + i)
    const k = getIndiaDateString(d)
    const dl = logs.filter((l) => logDayKey(l) === k)
    const c = calculateMuscleCoverage(dl.map((l) => ({ muscle: l.muscle, rank: l.rank, exerciseName: l.exerciseName })))
    dayMap[days[i]] = c.uniqueMusclesCovered
  }

  // monthly trend: unique muscles per day last 30d
  const trend = useMemo(() => {
    const rows = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5)
      const k = getIndiaDateString(d)
      const dl = logs.filter((l) => logDayKey(l) === k)
      if (dl.length) {
        const c = calculateMuscleCoverage(dl.map((l) => ({ muscle: l.muscle, rank: l.rank, exerciseName: l.exerciseName })))
        rows.push({ label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), weight: c.uniqueMusclesCovered })
      }
    }
    return rows
  }, [logs])

  const balance = Object.entries(GROUPS).map(([g, ms]) => {
    const hit = wcov.muscles.filter((m) => ms.includes(m.name) && m.covered).length
    return { g, hit, total: ms.length }
  })
  const needsAttention = wcov.muscles.filter((m) => !m.covered).slice(0, 8).map((m) => m.name)

  return (
    <>
      <div className="card p-3">
        <div className="mono text-[11px] text-mut">WEEKLY COVERAGE</div>
        <div className="font-black">{wcov.uniqueMusclesCovered}/{REQUIRED_MUSCLES.length} · DIRECT {wcov.directMusclesCovered} · {wcov.weightedCoverage}% WEIGHTED</div>
        <WeekBarChart data={dayMap} />
      </div>
      <PlannedVsActual />
      <div className="card p-3">
        <div className="mono text-[11px] text-mut mb-2">MUSCLE BALANCE (THIS WEEK)</div>
        {balance.map((b) => (
          <div key={b.g} className="mb-2">
            <div className="flex justify-between text-xs"><b>{b.g}</b><span className="mono">{b.hit}/{b.total}</span></div>
            <div className="mt-1"><ProgressBar pct={(b.hit / b.total) * 100} color={b.hit / b.total > 0.6 ? '#22c55e' : '#eab308'} /></div>
          </div>
        ))}
        <div className="text-xs mt-2"><span style={{ color: '#eab308' }}>⚠ Needs attention:</span> {needsAttention.join(', ') || 'None — balanced week!'}</div>
      </div>
      <div className="card p-3">
        <div className="mono text-[11px] text-mut mb-2">PER-EXERCISE PROGRESSION</div>
        <div className="text-xs text-mut mb-2">Weight over time for each logged exercise.</div>
        <ExercisePRList />
      </div>
    </>
  )
}

function MonthlyView() {
  const { logs } = useStore()
  const monthKey = getIndiaDateString().slice(0, 7)
  const monthLogs = logs.filter((l) => logDayKey(l).startsWith(monthKey))
  const mcov = calculateMuscleCoverage(monthLogs.map((l) => ({ muscle: l.muscle, rank: l.rank, exerciseName: l.exerciseName })))
  const sessions = new Set(monthLogs.map((l) => `${logDayKey(l)}|${l.splitId || ''}|${l.workoutDay || l.day || ''}`)).size

  // monthly trend: unique muscles per day last 30d
  const trend = useMemo(() => {
    const rows = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5)
      const k = getIndiaDateString(d)
      const dl = logs.filter((l) => logDayKey(l) === k)
      if (dl.length) {
        const c = calculateMuscleCoverage(dl.map((l) => ({ muscle: l.muscle, rank: l.rank, exerciseName: l.exerciseName })))
        rows.push({ label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), weight: c.uniqueMusclesCovered })
      }
    }
    return rows
  }, [logs])

  return (
    <>
      <div className="card p-3">
        <div className="mono text-[11px] text-mut">MONTHLY SUMMARY — {monthKey.toUpperCase()} (IST)</div>
        <div className="grid grid-cols-3 gap-2 mt-2 text-center">
          <div className="card2 p-2"><div className="mono text-[10px] text-mut">SESSIONS</div><div className="font-black text-lg">{sessions}</div></div>
          <div className="card2 p-2"><div className="mono text-[10px] text-mut">SETS</div><div className="font-black text-lg">{monthLogs.length}</div></div>
          <div className="card2 p-2"><div className="mono text-[10px] text-mut">MUSCLES</div><div className="font-black text-lg">{mcov.uniqueMusclesCovered}/45</div></div>
        </div>
      </div>
      <div className="card p-3">
        <div className="mono text-[11px] text-mut">MONTHLY MUSCLE COVERAGE ({mcov.uniqueMusclesCovered} UNIQUE · {monthLogs.length} SETS)</div>
        {trend.length ? <ProgressLine data={trend} /> : <div className="text-xs text-mut mt-2">Log workouts to build your trend.</div>}
      </div>
    </>
  )
}

function PlannedVsActual() {
  const { logs, activeSplit, availableEquipment } = useStore()
  const weekStart = startOfWeek()
  const todayKey = getIndiaDateString()
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const rows = days.map((dayName, i) => {
    const sched = scheduleForDay(activeSplit, dayName, availableEquipment)
    const isRest = !sched || sched.isRestDay
    const planned = isRest ? 0 : (sched?.items.length || 0)
    const plannedMuscles = new Set(isRest ? [] : (sched?.items || []).map((x) => x.muscle))
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + i)
    const k = getIndiaDateString(d)
    const dl = logs.filter((l) => logDayKey(l) === k)
    const c = calculateMuscleCoverage(dl.map((l) => ({ muscle: l.muscle, rank: l.rank, exerciseName: l.exerciseName })))
    const completed = [...plannedMuscles].filter((m) => dl.some((l) => l.muscle === m)).length
    const status = getDayStatus(planned, completed, c.uniqueMusclesCovered)
    return { dayName, isRest, planned, actual: c.uniqueMusclesCovered, completed, status, isToday: k === todayKey }
  })
  const max = Math.max(1, ...rows.map((r) => Math.max(r.planned, r.actual)))
  return (
    <div className="card p-3">
      <div className="mono text-[11px] text-mut">PLANNED VS ACTUAL — {activeSplit?.name?.toUpperCase()}</div>
      <div className="text-xs text-mut mb-2">Planned muscles vs actually trained muscles per day. Actual comes only from logged exercises.</div>
      {rows.map((r) => (
        <div key={r.dayName} className="py-1" style={{ borderTop: '1px solid #1e2126', background: r.isToday ? '#141619' : 'transparent' }}>
          <div className="flex justify-between mono text-[11px]">
            <span>{r.dayName.slice(0, 3).toUpperCase()}{r.isToday ? ' · TODAY' : ''}</span>
            <span>{r.status === 'REST' ? 'REST DAY' : r.status === 'EXTRA' ? `EXTRA SESSION · ACTUAL ${r.actual}` : r.status === 'COMPLETE' ? `✓ COMPLETE · PLAN ${r.planned} · ACTUAL ${r.actual}` : r.status === 'IN_PROGRESS' ? `IN PROGRESS ${r.completed}/${r.planned} · ACTUAL ${r.actual}` : `NOT STARTED · PLAN ${r.planned}`}</span>
          </div>
          {r.isRest && r.actual > 0 ? (
            <div className="mono text-[10px] mt-0.5" style={{ color: '#eab308' }}>REST DAY — EXTRA SESSION · ACTUAL {r.actual}</div>
          ) : (
            <>
              <div className="progress mt-1"><div style={{ width: `${(r.planned / max) * 100}%`, background: '#3b82f6' }} /></div>
              <div className="progress mt-0.5"><div style={{ width: `${(r.actual / max) * 100}%`, background: '#22c55e' }} /></div>
            </>
          )}
        </div>
      ))}
      <div className="mono text-[10px] text-mut mt-1"><span style={{ color: '#3b82f6' }}>■ PLANNED</span> <span style={{ color: '#22c55e' }}>■ ACTUAL</span></div>
    </div>
  )
}

function ExercisePRList() {
  const { logs } = useStore()
  const byEx = new Map()
  for (const l of logs) {
    if (!byEx.has(l.exerciseName)) byEx.set(l.exerciseName, [])
    byEx.get(l.exerciseName).push(l)
  }
  const rows = [...byEx.entries()].map(([name, sets]) => {
    const bestW = Math.max(...sets.map((s) => s.weight))
    const bestR = Math.max(...sets.map((s) => s.reps))
    const bestV = Math.max(...sets.map((s) => s.weight * s.reps))
    return { name, sets: sets.length, bestW, bestR, bestV, muscle: sets[0].muscle }
  }).sort((a, b) => b.sets - a.sets).slice(0, 12)
  if (!rows.length) return <div className="text-xs text-mut">No PRs yet — log sets to set records.</div>
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <Link key={r.name} to={`/exercise/${encodeURIComponent(r.muscle)}/${encodeURIComponent(r.name)}`} className="card2 p-2.5 block">
          <b className="text-sm">{r.name.toUpperCase()}</b>
          <div className="mono text-[11px] text-mut">BEST {r.bestW}kg · {r.bestR} REPS · VOL {r.bestV} · {r.sets} SETS</div>
        </Link>
      ))}
    </div>
  )
}
