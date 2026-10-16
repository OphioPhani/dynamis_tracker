import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Check, CalendarDays } from 'lucide-react'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { Header, ProgressBar } from '../components/ui.jsx'
import ExerciseCard from '../components/ExerciseCard.jsx'
import RestTimer from '../components/RestTimer.jsx'
import { todayName } from '../utils/dates.js'
import { getIndiaDateString, WEEKDAY_NAMES } from '../utils/dateUtils.js'
import { REQUIRED_MUSCLES, WORKOUT_PLAN } from '../data/workoutPlan.js'
import { calculateMuscleCoverage } from '../utils/coverage.js'
import { expectedCoverage } from '../utils/splitEngine.js'
import { logsForSession, plannedSetsFor, getExerciseStatus, getDayStatus, sessionKey } from '../utils/sessionState.js'

const idx = (d) => WEEKDAY_NAMES.indexOf(d)
const addDays = (key, n) => {
  const d = new Date(key + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return getIndiaDateString(d)
}

function groupOf(muscle) {
  return WORKOUT_PLAN.find((x) => x.muscle === muscle)?.group || ''
}

export default function Workout() {
  const { selections, setSelection, logs, todayItems, activeSplit, setSessionStatus, sessions, startNewSession, activeSeqFor } = useStore()
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const [tick, setTick] = useState(0)
  void tick
  const [showDayPicker, setShowDayPicker] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [extraMode, setExtraMode] = useState(false)
  const [extraMuscle, setExtraMuscle] = useState('')
  const [editAll, setEditAll] = useState(false)
  const [startingNew, setStartingNew] = useState(false)

  const today = todayName() // Asia/Kolkata
  const todayKey = getIndiaDateString()
  const selDay = params.get('day') || today
  const dateParam = params.get('date')
  // An explicit date means the user chose when to log this workout. The
  // "LOG THIS WORKOUT TODAY" action supplies today's date to leave preview
  // mode while preserving the selected weekday and its planned exercises.
  const isFutureDay = idx(selDay) > idx(today) && !dateParam
  // Default calendar date: most recent occurrence of the weekday (never the future).
  const pastDate = addDays(todayKey, -((idx(today) - idx(selDay) + 7) % 7))
  const upcomingDate = addDays(todayKey, idx(selDay) - idx(today))
  const workoutDate = isFutureDay ? todayKey : (dateParam || pastDate)
  const seqParam = Number(params.get('seq') || 0)

  const sched = todayItems(selDay)
  const splitId = activeSplit?.id || null
  const existingSeqs = useMemo(() => {
    const s = new Set()
    for (const l of logs) {
      if ((l.workoutDate || '') === workoutDate && (l.splitId || null) === (splitId || null) && (l.workoutDay || l.day || '') === selDay) s.add(l.sessionSeq || 1)
    }
    return [...s].sort((a, b) => a - b)
  }, [logs, workoutDate, splitId, selDay])
  const sessionSeq = seqParam || activeSeqFor({ workoutDate, splitId, workoutDay: selDay }) || (existingSeqs.length ? existingSeqs[existingSeqs.length - 1] : 1)
  const key = sessionKey({ workoutDate, splitId, workoutDay: selDay, sessionSeq })
  const sessionLogs = useMemo(
    () => logsForSession(logs, { workoutDate, splitId, workoutDay: selDay, sessionSeq }),
    [logs, workoutDate, splitId, selDay, sessionSeq]
  )

  const items = sched.isRestDay ? [] : sched.items
  const plannedCount = items.length
  const perExercise = items.map((it) => {
    const sel = selections[it.muscle] || it.selectedRank || 'good'
    const entry = WORKOUT_PLAN.find((x) => x.muscle === it.muscle)
    const ex = entry?.exercises.find((e) => e.rank === sel) || it.exercise
    const sets = sessionLogs.filter((l) => l.muscle === it.muscle)
    return { it, sel, ex, sets, status: getExerciseStatus(sets, plannedSetsFor(ex)) }
  })
  const completedCount = perExercise.filter((p) => p.status === 'COMPLETED').length
  const actualMuscles = new Set(sessionLogs.map((l) => l.muscle)).size
  const dayStatus = sched.isRestDay
    ? (extraMode || actualMuscles > 0 ? 'EXTRA' : 'REST')
    : getDayStatus(plannedCount, completedCount, actualMuscles)
  const storedStatus = sessions[key]?.status
  const isComplete = dayStatus === 'COMPLETE'

  // Persist completion transitions (complete once all planned done; reopen if a set is removed).
  useEffect(() => {
    if (sched.isRestDay || plannedCount === 0) return
    if (isComplete && storedStatus !== 'completed') {
      setSessionStatus({ workoutDate, workoutDay: selDay, splitId, splitName: activeSplit?.name || '', sessionSeq, status: 'completed' })
    } else if (!isComplete && storedStatus === 'completed') {
      setSessionStatus({ workoutDate, workoutDay: selDay, splitId, splitName: activeSplit?.name || '', sessionSeq, status: 'in_progress' })
    }
  }, [isComplete, key]) // eslint-disable-line react-hooks/exhaustive-deps

  const cov = calculateMuscleCoverage(sessionLogs.map((l) => ({ muscle: l.muscle, rank: l.rank, exerciseName: l.exerciseName })))
  const notCovered = cov.muscles.filter((m) => !m.covered).map((m) => m.name)
  const exp = expectedCoverage({ items })

  function pickDay(d) {
    setShowDayPicker(false); setExtraMode(false); setEditAll(false)
    setParams(idx(d) === idx(today) ? {} : { day: d })
  }
  async function doStartNew() {
    setStartingNew(true)
    const next = await startNewSession({ workoutDate, workoutDay: selDay })
    setParams({ day: selDay, date: workoutDate, seq: String(next) })
    setEditAll(false); setStartingNew(false)
  }

  const logCtx = { workoutDate, workoutDay: selDay, sessionSeq }
  const selLabel = isFutureDay ? `UPCOMING · ${upcomingDate}` : workoutDate

  return (
    <div className="no-hscroll">
      <Header title={`${selDay.toUpperCase()} WORKOUT`} sub={`TODAY · ${today.toUpperCase()} · LOGGING · ${selDay.toUpperCase()} WORKOUT`} />
      <div className="p-3 space-y-3 max-w-md mx-auto pb-24">
        {/* Day selector */}
        <div className="card p-2">
          <div className="flex items-center justify-between px-1">
            <span className="mono text-[11px] text-mut">TODAY: {today.toUpperCase()} · SELECTED: {selDay.toUpperCase()}</span>
            <button className="btn" style={{ width: 'auto', minHeight: 44 }} onClick={() => setShowDayPicker(!showDayPicker)}><CalendarDays size={14} className="inline" /> CHANGE DAY</button>
          </div>
          <div className="flex gap-1 mt-2 overflow-x-auto" role="tablist" aria-label="Workout day">
            {WEEKDAY_NAMES.map((d) => (
              <button
                key={d} role="tab" aria-selected={d === selDay}
                onClick={() => pickDay(d)}
                className="mono text-[11px] font-extrabold px-2 py-2 shrink-0"
                style={{
                  border: d === selDay ? '2px solid #fff' : '1px solid #2a2e34',
                  background: d === selDay ? '#1b1e22' : 'transparent',
                  minHeight: 48, minWidth: 52, position: 'relative'
                }}
              >
                {d.slice(0, 3).toUpperCase()}
                {d === today && <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, background: '#22c55e' }} />}
              </button>
            ))}
          </div>
          {showDayPicker && (
            <div className="grid grid-cols-1 gap-1.5 mt-2">
              {WEEKDAY_NAMES.map((d) => {
                const s = todayItems(d)
                return (
                  <button key={d} onClick={() => pickDay(d)} className="card2 p-2.5 text-left" style={d === selDay ? { borderColor: '#fff' } : undefined}>
                    <b className="text-sm">{d.toUpperCase()}</b>
                    <span className="mono text-[10px] text-mut ml-2">{d === today ? '● TODAY · ' : ''}{s.isRestDay ? 'REST DAY' : s.name.toUpperCase()}</span>
                  </button>
                )
              })}
            </div>
          )}
          <div className="mono text-[11px] text-mut mt-2 px-1">
            WORKOUT DAY: {selDay.toUpperCase()} · WORKOUT DATE: {selLabel}
            {!isFutureDay && <button className="underline ml-2" onClick={() => setShowDatePicker(!showDatePicker)}>[ CHANGE DATE ]</button>}
          </div>
          {showDatePicker && !isFutureDay && (
            <input type="date" value={workoutDate} max={todayKey} onChange={(e) => { if (e.target.value) setParams({ day: selDay, date: e.target.value }) }} aria-label="Workout date" className="mt-1" />
          )}
          {sessionSeq > 1 && <div className="mono text-[11px] px-1" style={{ color: '#eab308' }}>SESSION {sessionSeq} (extra session — previous sessions kept)</div>}
        </div>

        {/* Future day */}
        {isFutureDay && (
          <div className="card p-4 text-center" style={{ borderColor: '#3b82f6' }}>
            <div className="mono text-[11px] text-mut">UPCOMING WORKOUT</div>
            <div className="font-black text-lg">{selDay.toUpperCase()} — {sched.name.toUpperCase()}</div>
            <div className="text-xs text-mut mt-1">Scheduled for {upcomingDate}. {sched.isRestDay ? 'Rest day.' : `${plannedCount} muscles planned.`}</div>
            {!sched.isRestDay && (
              <button className="btn btn-primary mt-3" onClick={() => setParams({ day: selDay, date: todayKey })}>LOG THIS WORKOUT TODAY</button>
            )}
            <div className="mono text-[11px] text-mut mt-2">Planning preview only — logging stays on today's date unless you choose otherwise.</div>
          </div>
        )}

        {/* Rest day */}
        {!isFutureDay && sched.isRestDay && dayStatus !== 'EXTRA' && (
          <div className="card p-4 text-center">
            <div className="text-2xl font-black">REST DAY</div>
            <p className="text-sm text-mut mt-1">Planned workout: REST. Recovery, walk, sleep 7–9h.</p>
            <button className="btn mt-3" onClick={() => setExtraMode(true)}>LOG EXTRA WORKOUT</button>
          </div>
        )}

        {/* Day status banners */}
        {!isFutureDay && !sched.isRestDay && dayStatus === 'COMPLETE' && !editAll && (
          <div className="card p-4 text-center" style={{ borderColor: '#22c55e' }}>
            <div className="text-xl font-black text-good">✓ WORKOUT COMPLETE</div>
            <div className="mono text-xs mt-1">{selDay.toUpperCase()} · {sched.name.toUpperCase()}</div>
            <div className="font-black mt-1">{completedCount} / {plannedCount} EXERCISES · {sessionLogs.length} SETS · {cov.uniqueMusclesCovered} MUSCLES</div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <Link to={`/history/${workoutDate}`} className="btn text-center">VIEW SESSION</Link>
              <button className="btn" onClick={() => setEditAll(true)}>EDIT SESSION</button>
              <button className="btn" disabled={startingNew} onClick={doStartNew}>{startingNew ? '...' : 'START NEW SESSION'}</button>
            </div>
          </div>
        )}
        {!isFutureDay && !sched.isRestDay && dayStatus === 'IN_PROGRESS' && (
          <div className="card p-3" style={{ borderColor: '#eab308' }}>
            <b>{workoutDate < todayKey ? 'MISSED / INCOMPLETE' : 'IN PROGRESS'}</b>
            <span className="mono text-xs ml-2">{completedCount} / {plannedCount} EXERCISES</span>
            <div className="mt-1"><ProgressBar pct={(completedCount / plannedCount) * 100} color="#eab308" /></div>
          </div>
        )}

        {/* Exercise list */}
        {!isFutureDay && !sched.isRestDay && (dayStatus !== 'COMPLETE' || editAll) && perExercise.map(({ it, sel, ex, sets, status }) => {
          if (!ex) return null
          const setsLogged = sets
          const alts = it.alternatives?.length ? it.alternatives : []
          return (
            <section key={it.muscle} className="card2 p-2.5">
              <div className="flex items-center justify-between gap-2 px-1">
                <b className="text-sm">{status === 'COMPLETED' ? `✓ ${it.muscle}` : it.muscle}</b>
                <span className="mono text-[10px]" style={{ color: status === 'COMPLETED' ? '#22c55e' : status === 'IN_PROGRESS' ? '#eab308' : '#9aa0a8' }}>
                  {status === 'COMPLETED' ? `COMPLETED ${sets.length}/${plannedSetsFor(ex)}` : status === 'IN_PROGRESS' ? `${sets.length}/${plannedSetsFor(ex)} SETS · CONTINUE` : 'NOT STARTED'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 my-2 px-0.5">
                {alts.map((a) => (
                  <button
                    key={a.rank}
                    onClick={() => setSelection(it.muscle, a.rank)}
                    disabled={!a.available}
                    title={`${a.exercise.name} — ${a.exercise.equipment}`}
                    className="mono text-[11px] font-extrabold py-2 px-1"
                    style={{
                      border: `1px solid ${a.rank === 'good' ? '#22c55e' : a.rank === 'better' ? '#eab308' : '#3b82f6'}`,
                      background: sel === a.rank ? (a.rank === 'good' ? '#22c55e' : a.rank === 'better' ? '#eab308' : '#3b82f6') : 'transparent',
                      color: sel === a.rank ? (a.rank === 'better' ? '#1a1400' : a.rank === 'good' ? '#04120a' : '#fff') : '#e8eaed',
                      minHeight: 44, opacity: a.available ? 1 : 0.35
                    }}
                    aria-pressed={sel === a.rank}
                  >
                    {a.rank === 'good' ? '🟢' : a.rank === 'better' ? '🟡' : '🔵'} {a.rank.toUpperCase()}{a.available ? '' : ' ✕'}
                  </button>
                ))}
              </div>
              <ExerciseCard day={selDay} muscle={it.muscle} group={groupOf(it.muscle)} exercise={ex} rank={sel} setsLogged={setsLogged} plannedSets={plannedSetsFor(ex)} status={status} logCtx={logCtx} defaultExpanded={status !== 'COMPLETED' || editAll} onLogged={() => {}} />
            </section>
          )
        })}

        {/* Completed collapsed list (reopen view) */}
        {!isFutureDay && !sched.isRestDay && dayStatus === 'COMPLETE' && !editAll && perExercise.map(({ it, ex, sets }) => (
          <div key={it.muscle} className="card p-2.5 flex items-center gap-2">
            <span className="text-good">✓</span><b className="text-sm">{ex?.name}</b>
            <span className="mono text-[10px] text-mut ml-auto">{sets.length} SETS</span>
          </div>
        ))}

        {/* Extra workout on rest day */}
        {!isFutureDay && (sched.isRestDay) && (extraMode || dayStatus === 'EXTRA') && (
          <div className="card p-3" style={{ borderColor: '#eab308' }}>
            <div className="mono text-[11px]" style={{ color: '#eab308' }}>REST DAY — EXTRA SESSION · ACTUAL {actualMuscles}</div>
            {!extraMode && <button className="btn mt-2" onClick={() => setExtraMode(true)}>LOG EXTRA WORKOUT</button>}
            {extraMode && (
              <>
                <label className="block mt-2"><span className="mono text-[10px] text-mut">MUSCLE</span>
                  <select value={extraMuscle} onChange={(e) => setExtraMuscle(e.target.value)}>
                    <option value="">— pick a muscle —</option>
                    {REQUIRED_MUSCLES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select></label>
                {extraMuscle && <ExtraCard muscle={extraMuscle} logCtx={logCtx} day={selDay} />}
              </>
            )}
          </div>
        )}

        {/* Session coverage */}
        {!isFutureDay && !sched.isRestDay && (
          <div className="card p-3">
            <div className="mono text-[11px] text-mut">SESSION COVERAGE — PLANNED {exp.expectedCount} · ACTUAL {cov.uniqueMusclesCovered}</div>
            <div className="mt-1"><ProgressBar pct={exp.expectedCount ? (cov.uniqueMusclesCovered / exp.expectedCount) * 100 : 0} color="#3b82f6" /></div>
            <div className="text-xs mt-2"><b className="text-good">COVERED ({cov.uniqueMusclesCovered})</b><br />{cov.muscles.filter((m) => m.covered).map((m) => m.name).join(', ') || '—'}</div>
            <div className="text-xs mt-1 text-mut"><b>NOT YET ({notCovered.length})</b><br />{notCovered.join(', ')}</div>
          </div>
        )}

        {!isFutureDay && !sched.isRestDay && dayStatus !== 'COMPLETE' && (
          <button className="btn btn-primary flex items-center justify-center gap-2" style={{ minHeight: 56 }} onClick={() => nav('/complete')}>
            <Check size={18} /> FINISH WORKOUT ({sessionLogs.length} SETS)
          </button>
        )}
      </div>
    </div>
  )
}

function ExtraCard({ muscle, logCtx, day }) {
  const { selections } = useStore()
  const entry = WORKOUT_PLAN.find((x) => x.muscle === muscle)
  const sel = selections[muscle] || 'best'
  const ex = entry?.exercises.find((e) => e.rank === sel)
  if (!ex) return null
  return (
    <div className="mt-2">
      <ExerciseCard day={day} muscle={muscle} group={entry.group} exercise={ex} rank={sel} setsLogged={[]} plannedSets={plannedSetsFor(ex)} status="NOT_STARTED" logCtx={logCtx} defaultExpanded onLogged={() => {}} extraSession />
    </div>
  )
}
