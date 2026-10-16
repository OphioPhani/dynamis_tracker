import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { ProgressBar } from '../components/ui.jsx'
import { ProgressLine } from '../components/Charts.jsx'
import { calculateMuscleCoverage } from '../utils/coverage.js'
import { getIndiaDateString } from '../utils/dateUtils.js'
import { scheduleForDay } from '../utils/splitEngine.js'
import { REQUIRED_MUSCLES, WORKOUT_PLAN } from '../data/workoutPlan.js'
import { useYearLogs } from '../hooks/useYearLogs.js'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

// IST weekday for an IST calendar key (noon-UTC trick keeps the IST date stable).
function weekdayOf(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'long' }).format(new Date(Date.UTC(y, m - 1, d, 12)))
}
function daysInMonth(year, mi) {
  return new Date(Date.UTC(year, mi + 1, 0, 12)).getUTCDate()
}
const keyOf = (y, mi, d) => `${y}-${String(mi + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

export default function Yearly() {
  const { activeSplit, availableEquipment } = useStore()
  const currentYear = Number(getIndiaDateString().slice(0, 4))
  const [year, setYear] = useState(currentYear)
  const { loading, rows, error, retry } = useYearLogs(year)
  const isFuture = year > currentYear

  const stats = useMemo(() => {
    if (!rows.length) return null
    const bySession = new Map()
    for (const l of rows) {
      const date = (l.workoutDate || '').slice(0, 10)
      if (!date) continue
      const k = `${date}|${l.splitId || ''}|${l.workoutDay || l.day || ''}`
      if (!bySession.has(k)) bySession.set(k, { date, splitId: l.splitId, splitName: l.splitName, workoutDay: l.workoutDay || l.day || '', muscles: new Set(), exercises: new Set(), sets: 0 })
      const s = bySession.get(k)
      s.muscles.add(l.muscle); s.exercises.add(`${l.exerciseName}|||${l.muscle}`); s.sets++
    }
    const plannedFor = (workoutDay) => {
      const sched = scheduleForDay(activeSplit, workoutDay, availableEquipment)
      return sched && !sched.isRestDay ? sched.items.length : 0
    }
    const plannedMusclesFor = (workoutDay) => {
      const sched = scheduleForDay(activeSplit, workoutDay, availableEquipment)
      return sched && !sched.isRestDay ? sched.items.map((i) => i.muscle) : []
    }
    const sessions = [...bySession.values()].map((s) => {
      const planned = plannedFor(s.workoutDay)
      const complete = planned > 0
        ? plannedMusclesFor(s.workoutDay).every((m) => s.muscles.has(m))
        : s.sets > 0
      return { ...s, planned, complete }
    })
    const completed = sessions.filter((s) => s.complete)
    const byDate = new Map()
    for (const s of sessions) {
      if (!byDate.has(s.date)) byDate.set(s.date, { sessions: 0, completed: 0 })
      byDate.get(s.date).sessions++
      if (s.complete) byDate.get(s.date).completed++
    }
    const monthOf = (k) => Number(k.slice(5, 7)) - 1
    const byMonth = [...Array(12)].map(() => ({ sessions: 0, completed: 0, sets: 0, logs: [] }))
    for (const s of sessions) {
      const m = byMonth[monthOf(s.date)]
      m.sessions++
      if (s.complete) m.completed++
    }
    for (const l of rows) {
      const d = (l.workoutDate || '').slice(0, 10)
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
        byMonth[monthOf(d)].sets++
        byMonth[monthOf(d)].logs.push(l)
      }
    }
    const cov = calculateMuscleCoverage(rows.map((l) => ({ muscle: l.muscle, rank: l.rank, exerciseName: l.exerciseName })))
    const secondary = cov.muscles.filter((m) => m.covered && m.type !== 'primary').length
    // Frequency: distinct sessions per exercise / muscle
    const exSess = new Map(), muSess = new Map()
    for (const s of sessions) {
      for (const e of s.exercises) exSess.set(e, (exSess.get(e) || new Set()).add(`${s.date}|${s.workoutDay}`).size)
      for (const m of s.muscles) muSess.set(m, (muSess.get(m) || new Set()).add(`${s.date}|${s.workoutDay}`).size)
    }
    return { sessions, completed, byDate, byMonth, cov, secondary, exSess, muSess }
  }, [rows, activeSplit, availableEquipment])

  // Planned training days elapsed in the year (exact, from the active split).
  const trainingWeekdays = useMemo(() => {
    const set = new Set()
    for (const d of activeSplit?.days || []) if (!d.isRestDay) set.add(d.dayOfWeek)
    return set
  }, [activeSplit])

  const elapsed = useMemo(() => {
    const endKey = isFuture ? null : (year === currentYear ? getIndiaDateString() : `${year}-12-31`)
    if (!endKey) return { plannedDays: 0, doneDates: new Set() }
    let plannedDays = 0
    const d = new Date(Date.UTC(year, 0, 1, 12))
    const end = new Date(Date.UTC(Number(endKey.slice(0, 4)), Number(endKey.slice(5, 7)) - 1, Number(endKey.slice(8, 10)), 12))
    while (d <= end) {
      const wd = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'long' }).format(d)
      if (trainingWeekdays.has(wd)) plannedDays++
      d.setUTCDate(d.getUTCDate() + 1)
    }
    const doneDates = new Set((stats?.completed || []).map((s) => s.date))
    return { plannedDays, doneDates }
  }, [year, currentYear, isFuture, trainingWeekdays, stats])

  const consistency = elapsed.plannedDays ? Math.round((elapsed.doneDates.size / elapsed.plannedDays) * 100) : 0

  return (
    <div className="p-3 space-y-3 max-w-md mx-auto pb-24">
      <div className="card p-3">
        <div className="mono text-[11px] text-mut">YEARLY PROGRESS</div>
        <div className="flex items-center justify-between mt-1">
          <button className="btn" style={{ width: 52 }} onClick={() => setYear((y) => y - 1)} aria-label="Previous year"><ChevronLeft size={18} /></button>
          <div className="text-3xl font-black">{year}</div>
          <button className="btn" style={{ width: 52 }} onClick={() => setYear((y) => y + 1)} aria-label="Next year"><ChevronRight size={18} /></button>
        </div>
      </div>

      {loading && <div className="card p-4 mono text-sm text-center">LOADING...</div>}
      {!loading && error && (
        <div className="card p-4 text-center">
          <div className="mono text-sm">⚠ FAILED TO LOAD YEAR DATA</div>
          <button className="btn mt-2" onClick={retry}>RETRY</button>
        </div>
      )}
      {!loading && !error && (isFuture || !stats) && (
        <div className="card p-6 text-center">
          <div className="font-black text-lg">NO WORKOUT DATA YET</div>
          <div className="text-xs text-mut mt-1">{isFuture ? `The year ${year} hasn't happened yet.` : `You haven't logged any workouts for ${year} yet. Start your first workout to begin building your yearly progress.`}</div>
          {!isFuture && <Link to="/workout" className="btn btn-primary mt-3">START WORKOUT</Link>}
        </div>
      )}

      {!loading && !error && stats && (
        <>
          <SummaryCards year={year} stats={stats} consistency={consistency} plannedDays={elapsed.plannedDays} doneCount={elapsed.doneDates.size} />
          <WorkoutsByMonth byMonth={stats.byMonth} />
          <ActivityHeatmap year={year} byDate={stats.byDate} />
          <CoverageByMonth year={year} rows={rows} />
          <CumulativeCoverage year={year} rows={rows} />
          <SplitConsistency year={year} currentYear={currentYear} stats={stats} trainingWeekdays={trainingWeekdays} />
          <CoverageGrid muSess={stats.muSess} />
          <Leaderboards stats={stats} year={year} />
          <YearCalendar year={year} byDate={stats.byDate} />
        </>
      )}
    </div>
  )
}

function SummaryCards({ year, stats, consistency, plannedDays, doneCount }) {
  const exCount = new Set([...stats.sessions.flatMap((s) => [...s.exercises])]).size
  // exercise completions = distinct session×muscle pairs
  const completions = stats.sessions.reduce((a, s) => a + s.muscles.size, 0)
  const sets = rows_sets(stats)
  return (
    <div className="card p-3">
      <div className="mono text-[11px] text-mut">{year} SUMMARY (ACTUAL LOGGED DATA)</div>
      <div className="grid grid-cols-3 gap-2 mt-2 text-center">
        <div className="card2 p-2"><div className="mono text-[10px] text-mut">WORKOUTS</div><div className="font-black text-lg">{stats.completed.length}</div></div>
        <div className="card2 p-2"><div className="mono text-[10px] text-mut">EXERCISES</div><div className="font-black text-lg">{completions}</div></div>
        <div className="card2 p-2"><div className="mono text-[10px] text-mut">SETS</div><div className="font-black text-lg">{sets.toLocaleString()}</div></div>
        <div className="card2 p-2"><div className="mono text-[10px] text-mut">MUSCLES</div><div className="font-black text-lg">{stats.cov.uniqueMusclesCovered} / 45</div></div>
        <div className="card2 p-2"><div className="mono text-[10px] text-mut">DIRECT</div><div className="font-black text-lg">{stats.cov.directMusclesCovered}</div></div>
        <div className="card2 p-2"><div className="mono text-[10px] text-mut">INDIRECT</div><div className="font-black text-lg">{stats.secondary}</div></div>
      </div>
      <div className="mt-2">
        <div className="flex justify-between mono text-[11px]"><span>COMPLETION</span><span>{consistency}% · {doneCount}/{plannedDays} PLANNED DAYS</span></div>
        <div className="progress mt-1"><div style={{ width: `${consistency}%`, background: '#22c55e' }} /></div>
      </div>
      <div className="mono text-[10px] text-mut mt-1">{exCount} DISTINCT EXERCISES LOGGED THIS YEAR</div>
    </div>
  )
}
function rows_sets(stats) {
  return stats.sessions.reduce((a, s) => a + s.sets, 0)
}

function WorkoutsByMonth({ byMonth }) {
  const max = Math.max(1, ...byMonth.map((m) => m.completed))
  return (
    <div className="card p-3">
      <div className="mono text-[11px] text-mut mb-2">WORKOUTS BY MONTH</div>
      {byMonth.map((m, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span className="mono text-[11px] w-8">{MONTHS[i]}</span>
          <div className="flex-1" style={{ background: '#1e2126', height: 18, border: '1px solid #2a2e34' }}>
            <div style={{ width: `${(m.completed / max) * 100}%`, height: '100%', background: '#22c55e' }} />
          </div>
          <span className="mono text-[11px] w-8 text-right">{m.completed}</span>
        </div>
      ))}
    </div>
  )
}

function ActivityHeatmap({ year, byDate }) {
  // GitHub-style: columns = weeks, rows = Mon..Sun. Intensity = sessions that day.
  const jan1 = new Date(Date.UTC(year, 0, 1, 12))
  const startOffset = (new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short' }).format(jan1) === 'Sun')
    ? 6 : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short' }).format(jan1))
  const totalDays = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365
  const weeks = Math.ceil((startOffset + totalDays) / 7)
  const color = (n) => n >= 3 ? '#4ade80' : n === 2 ? '#22c55e' : n === 1 ? '#166534' : '#1e2126'
  const cells = []
  for (let w = 0; w < weeks; w++) {
    for (let r = 0; r < 7; r++) {
      const doy = w * 7 + r - startOffset + 1
      if (doy < 1 || doy > totalDays) { cells.push(null); continue }
      const d = new Date(Date.UTC(year, 0, doy, 12))
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
      cells.push({ key, n: byDate.get(key)?.sessions || 0 })
    }
  }
  const rows = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  return (
    <div className="card p-3">
      <div className="mono text-[11px] text-mut mb-2">{year} WORKOUT ACTIVITY</div>
      <div className="hscroll">
        <div style={{ display: 'grid', gridTemplateRows: 'repeat(7, 16px)', gridAutoFlow: 'column', gridAutoColumns: 16, gap: 3, width: 'max-content' }}>
          {cells.map((c, i) =>
            c ? <span key={i} title={`${c.key}: ${c.n} workout${c.n === 1 ? '' : 's'}`} style={{ width: 16, height: 16, background: color(c.n), border: '1px solid #2a2e34' }} />
              : <span key={i} style={{ width: 16, height: 16 }} />
          )}
        </div>
      </div>
      <div className="mono text-[10px] text-mut mt-2">ROWS: {rows.join(' · ')}</div>
      <div className="mono text-[10px] text-mut">0 empty · 1 low · 2 medium · 3+ high (actual logged sessions only)</div>
    </div>
  )
}

function CoverageByMonth({ year, rows }) {
  const data = MONTHS.map((label, mi) => {
    const ml = rows.filter((l) => (l.workoutDate || '').slice(0, 7) === `${year}-${String(mi + 1).padStart(2, '0')}`)
    const c = calculateMuscleCoverage(ml.map((l) => ({ muscle: l.muscle, rank: l.rank, exerciseName: l.exerciseName })))
    return { label, n: c.uniqueMusclesCovered }
  })
  return (
    <div className="card p-3">
      <div className="mono text-[11px] text-mut mb-2">MUSCLE COVERAGE BY MONTH</div>
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-2 py-0.5">
          <span className="mono text-[11px] w-8">{d.label}</span>
          <div className="progress flex-1"><div style={{ width: `${(d.n / 45) * 100}%`, background: '#3b82f6' }} /></div>
          <span className="mono text-[11px] w-16 text-right">{d.n} / 45</span>
        </div>
      ))}
    </div>
  )
}

function CumulativeCoverage({ year, rows }) {
  const data = []
  const seen = new Set()
  MONTHS.forEach((_, mi) => {
    const prefix = `${year}-${String(mi + 1).padStart(2, '0')}`
    for (const l of rows) if ((l.workoutDate || '').startsWith(prefix)) seen.add(l.muscle)
    // count unique required muscles only
    data.push({ label: MONTHS[mi], weight: seen.size })
  })
  const active = data.some((d) => d.weight > 0)
  return (
    <div className="card p-3">
      <div className="mono text-[11px] text-mut mb-1">MUSCLE COVERAGE — {year} (UNIQUE MUSCLES UP TO EACH MONTH)</div>
      {active ? <ProgressLine data={data} /> : <div className="text-xs text-mut">No coverage yet.</div>}
    </div>
  )
}

function SplitConsistency({ year, currentYear, stats, trainingWeekdays }) {
  const order = ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday']
  const endKey = year === currentYear ? getIndiaDateString() : `${year}-12-31`
  const rows = order.filter((d) => trainingWeekdays.has(d)).map((d) => {
    // occurrences of this weekday elapsed in the year
    let total = 0
    const dt = new Date(Date.UTC(year, 0, 1, 12))
    const end = new Date(Date.UTC(Number(endKey.slice(0, 4)), Number(endKey.slice(5, 7)) - 1, Number(endKey.slice(8, 10)), 12))
    while (dt <= end) {
      if (new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'long' }).format(dt) === d) total++
      dt.setUTCDate(dt.getUTCDate() + 1)
    }
    const doneDates = new Set(stats.completed.filter((s) => s.workoutDay === d).map((s) => s.date))
    const pct = total ? Math.round((doneDates.size / total) * 100) : 0
    return { d, done: doneDates.size, total, pct }
  })
  return (
    <div className="card p-3">
      <div className="mono text-[11px] text-mut">SNAKE'S SPLIT YEARLY PERFORMANCE</div>
      <div className="text-xs text-mut mb-2">Completed training days per split day (actual sessions).</div>
      {rows.map((r) => (
        <div key={r.d} className="mb-2">
          <div className="flex justify-between text-xs"><b>{r.d.slice(0, 3).toUpperCase()}</b><span className="mono">{r.done} / {r.total} · {r.pct}%</span></div>
          <div className="mt-1"><ProgressBar pct={r.pct} color={r.pct >= 80 ? '#22c55e' : r.pct >= 50 ? '#eab308' : '#ef4444'} /></div>
        </div>
      ))}
      <div className="mono text-[11px] text-mut mt-1">TRAINING CONSISTENCY</div>
      {rows.map((r) => (
        <div key={r.d} className="flex items-center gap-2 py-0.5">
          <span className="mono text-[11px] w-8">{r.d.slice(0, 3).toUpperCase()}</span>
          <div className="flex-1" style={{ background: '#1e2126', height: 16, border: '1px solid #2a2e34' }}>
            <div style={{ width: `${r.pct}%`, height: '100%', background: '#22c55e' }} />
          </div>
          <span className="mono text-[11px] w-10 text-right">{r.pct}%</span>
        </div>
      ))}
    </div>
  )
}

function CoverageGrid({ muSess }) {
  const groups = new Map()
  for (const m of WORKOUT_PLAN) {
    if (!groups.has(m.group)) groups.set(m.group, [])
    if (!groups.get(m.group).includes(m.muscle)) groups.get(m.group).push(m.muscle)
  }
  const dot = (n) => n === 0 ? '#ef4444' : n < 5 ? '#eab308' : '#22c55e'
  return (
    <div className="card p-3">
      <div className="mono text-[11px] text-mut">{new Date().getFullYear()} MUSCLE COVERAGE</div>
      <div className="mono text-[10px] text-mut mb-2">GREEN trained · YELLOW low frequency (&lt;5) · RED never trained</div>
      {[...groups.entries()].map(([g, ms]) => (
        <div key={g} className="mb-2">
          <div className="mono text-[10px] text-mut">{g.toUpperCase()}</div>
          {ms.map((m) => {
            const n = muSess.get(m) || 0
            return (
              <div key={m} className="flex items-center gap-2 py-0.5 text-sm">
                <span style={{ width: 10, height: 10, background: dot(n), flexShrink: 0 }} />
                <span>{(n > 0 ? '✓ ' : '')}{m}</span>
                <span className="mono text-[10px] text-mut ml-auto">{n}×</span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function Leaderboards({ stats, year }) {
  const exTop = [...stats.exSess.entries()].map(([k, n]) => ({ name: k.split('|||')[0], n })).sort((a, b) => b.n - a.n).slice(0, 5)
  const muTop = [...stats.muSess.entries()].map(([name, n]) => ({ name, n })).sort((a, b) => b.n - a.n).slice(0, 5)
  const muAll = REQUIRED_MUSCLES.map((m) => ({ name: m, n: stats.muSess.get(m) || 0 })).sort((a, b) => a.n - b.n).slice(0, 5)
  return (
    <>
      <div className="card p-3">
        <div className="mono text-[11px] text-mut mb-2">MOST PERFORMED EXERCISES — {year}</div>
        {exTop.map((e, i) => (
          <div key={e.name} className="flex justify-between text-sm py-1" style={{ borderTop: '1px solid #1e2126' }}>
            <span><b className="mono">{i + 1}</b> · {e.name.toUpperCase()}</span>
            <span className="mono text-[11px] text-mut">{e.n} SESSIONS</span>
          </div>
        ))}
        {!exTop.length && <div className="text-xs text-mut">No data.</div>}
      </div>
      <div className="card p-3">
        <div className="mono text-[11px] text-mut">MOST TRAINED MUSCLES — {year}</div>
        <div className="mono text-[10px] text-mut mb-2">TRAINING FREQUENCY (sessions, not coverage)</div>
        {muTop.map((e, i) => (
          <div key={e.name} className="flex justify-between text-sm py-1" style={{ borderTop: '1px solid #1e2126' }}>
            <span><b className="mono">{i + 1}</b> · {e.name}</span>
            <span className="mono text-[11px] text-mut">{e.n} SESSIONS</span>
          </div>
        ))}
      </div>
      <div className="card p-3" style={{ borderColor: '#eab308' }}>
        <div className="mono text-[11px]" style={{ color: '#eab308' }}>LEAST TRAINED MUSCLES — NEEDS ATTENTION</div>
        <div className="text-xs text-mut mb-1">Times trained this year. Low frequency is just a training-balance signal.</div>
        {muAll.map((e) => (
          <div key={e.name} className="flex justify-between text-sm py-1" style={{ borderTop: '1px solid #1e2126' }}>
            <span>{e.name}</span>
            <span className="mono text-[11px] text-mut">{e.n}× TRAINED</span>
          </div>
        ))}
      </div>
    </>
  )
}

function YearCalendar({ year, byDate }) {
  return (
    <div className="card p-3">
      <div className="mono text-[11px] text-mut mb-2">{year} CALENDAR — WORKOUT DAYS MARKED</div>
      <div className="grid grid-cols-2 gap-2">
        {MONTHS.map((label, mi) => {
          const dim = daysInMonth(year, mi)
          const first = new Date(Date.UTC(year, mi, 1, 12))
          const wd = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short' }).format(first)
          const off = wd === 'Sun' ? 6 : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(wd)
          const cells = []
          for (let i = 0; i < off; i++) cells.push(null)
          for (let d = 1; d <= dim; d++) cells.push(keyOf(year, mi, d))
          return (
            <div key={label} style={{ border: '1px solid #2a2e34', padding: 6 }}>
              <div className="mono text-[10px] text-mut mb-1">{label} {year}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((w, i) => <span key={i} className="mono text-center" style={{ fontSize: 8, color: '#9aa0a8' }}>{w}</span>)}
                {cells.map((k, i) =>
                  k && byDate.get(k)?.sessions
                    ? <span key={i} title={`${k}: workout logged`} style={{ aspectRatio: '1', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#04120a' }}>✓</span>
                    : <span key={i} style={{ aspectRatio: '1', background: k ? '#1e2126' : 'transparent' }} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
