// Canonical muscle-analytics pipeline. Single mapping used by Workout,
// Muscles, History, Progress and Yearly: logs -> exercise-muscle mapping
// (deterministic, from the exercise database) -> aggregated muscle stats.
// Anatomy model -> canonical muscle IDs -> exercise mapping -> logs ->
// Neon API -> analytics -> body-map visualization.
import { WORKOUT_PLAN } from '../data/workoutPlan.js'
import { MUSCLE_REGISTRY, MUSCLE_BY_NAME } from '../data/muscles.js'
import { getIndiaDateString, logDayKey } from './dateUtils.js'

export const SCORE_LEVELS = [
  { id: 'HIGH', min: 90, color: '#22c55e' },
  { id: 'GOOD', min: 70, color: '#4ade80' },
  { id: 'MODERATE', min: 40, color: '#eab308' },
  { id: 'LOW', min: 1, color: '#f97316' },
  { id: 'NOT COVERED', min: 0, color: '#ef4444' }
]
export const SELECTED_COLOR = '#3b82f6'
export const UNTRACKED_COLOR = '#3a3f46'

export function levelFor(score) {
  if (score >= 90) return SCORE_LEVELS[0]
  if (score >= 70) return SCORE_LEVELS[1]
  if (score >= 40) return SCORE_LEVELS[2]
  if (score >= 1) return SCORE_LEVELS[3]
  return SCORE_LEVELS[4]
}

function findExercise(log) {
  const byMuscle = WORKOUT_PLAN.find((x) => x.muscle === log.muscle)
  const hit = byMuscle?.exercises.find((e) => e.rank === log.rank)
  if (hit) return hit
  for (const m of WORKOUT_PLAN) {
    const e = m.exercises.find((x) => x.name === log.exerciseName)
    if (e) return e
  }
  return null
}

function sessionOf(log) {
  return `${(log.workoutDate || '').slice(0, 10)}|${log.splitId || ''}|${log.workoutDay || log.day || ''}|${log.sessionSeq || 1}`
}

export const METHODOLOGY = `COVERAGE SCORE = frequency (40) + direct training (25) + recency (20) + set volume (15).
Frequency: distinct sessions vs a 2x/week target over the selected period.
Direct: share of sessions where the muscle is a PRIMARY target (secondary or
stabilizer involvement scores less). Recency: trained within 7 days = 20,
14 days = 14, 30 days = 8, 90 days = 4, otherwise 0. Volume: direct sets vs a
24-set reference. Levels: 90+ HIGH, 70+ GOOD, 40+ MODERATE, 1+ LOW, 0 NOT
COVERED. This is a workout-tracking metric, not a medical assessment. 100%
means consistent logged training, not optimal physiological development.`

// stats keyed by canonical muscle id for the given log window.
export function muscleStatsFor(logs, periodDays) {
  const nowKey = getIndiaDateString()
  const today = new Date(nowKey + 'T12:00:00Z').getTime()
  const weeks = Math.max(periodDays === Infinity ? 26 : periodDays / 7, 0.5)
  const out = new Map()
  for (const m of MUSCLE_REGISTRY) {
    out.set(m.id, {
      id: m.id, name: m.name, sessions: 0, directSessions: 0, indirectSessions: 0,
      sets: 0, directSets: 0, reps: 0, volume: 0, lastTrained: null, daysSince: null,
      frequency: 0, score: 0, level: SCORE_LEVELS[4], exercisesDirect: new Map(), exercisesIndirect: new Map()
    })
  }
  const touched = new Map() // id -> Set(sessionKey)
  for (const log of logs || []) {
    const ex = findExercise(log)
    if (!ex) continue
    const sKey = sessionOf(log)
    const hit = (name) => {
      const entry = MUSCLE_BY_NAME.get(name)
      return entry ? entry.id : null
    }
    const direct = new Set((ex.primary || []).map(hit).filter(Boolean))
    const indirect = new Set([...(ex.secondary || []), ...(ex.stabilizers || [])].map(hit).filter(Boolean))
    for (const id of new Set([...direct, ...indirect])) {
      const st = out.get(id)
      if (!st) continue
      const isDirect = direct.has(id)
      st.sets++
      if (isDirect) {
        st.directSets++
        st.reps += Number(log.reps) || 0
        st.volume += (Number(log.weight) || 0) * (Number(log.reps) || 0)
      }
      if (!touched.has(id)) touched.set(id, { all: new Set(), direct: new Set() })
      touched.get(id).all.add(sKey)
      if (isDirect) touched.get(id).direct.add(sKey)
      const d = (log.workoutDate || '').slice(0, 10)
      if (d && (!st.lastTrained || d > st.lastTrained)) st.lastTrained = d
      const map = isDirect ? st.exercisesDirect : st.exercisesIndirect
      const en = log.exerciseName || ex.name
      if (!map.has(en)) map.set(en, new Set())
      map.get(en).add(sKey)
    }
  }
  for (const [id, st] of out) {
    const t = touched.get(id)
    st.sessions = t ? t.all.size : 0
    st.directSessions = t ? t.direct.size : 0
    st.indirectSessions = st.sessions - st.directSessions
    st.frequency = st.sessions / Math.max(1, periodDays === Infinity ? 26 : periodDays / 7)
    if (st.lastTrained) {
      st.daysSince = Math.max(0, Math.round((today - new Date(st.lastTrained + 'T12:00:00Z').getTime()) / 86400000))
    }
    const freqPts = 40 * Math.min(1, st.sessions / Math.max(1.5, weeks * 2))
    const directShare = st.sessions ? st.directSessions / st.sessions : 0
    const directPts = 25 * (st.sessions ? Math.min(1, directShare * 1.25) : 0)
    const recPts = st.daysSince == null ? 0 : st.daysSince <= 7 ? 20 : st.daysSince <= 14 ? 14 : st.daysSince <= 30 ? 8 : st.daysSince <= 90 ? 4 : 0
    const volPts = 15 * Math.min(1, st.directSets / 24)
    st.score = Math.round(freqPts + directPts + recPts + volPts)
    if (st.sessions === 0) st.score = 0
    st.level = levelFor(st.score)
    st.exercisesDirect = [...st.exercisesDirect.entries()].map(([name, s]) => ({ name, sessions: s.size })).sort((a, b) => b.sessions - a.sessions)
    st.exercisesIndirect = [...st.exercisesIndirect.entries()].map(([name, s]) => ({ name, sessions: s.size })).sort((a, b) => b.sessions - a.sessions)
  }
  return out
}

export const PERIODS = [
  { id: 'today', label: 'TODAY', days: 1 },
  { id: '7d', label: '7 DAYS', days: 7 },
  { id: '30d', label: '30 DAYS', days: 30 },
  { id: '90d', label: '90 DAYS', days: 90 },
  { id: 'year', label: 'YEAR', days: 365 },
  { id: 'all', label: 'ALL TIME', days: Infinity }
]

export function logsInPeriod(logs, periodDays, nowKey) {
  const now = (nowKey || getIndiaDateString())
  if (periodDays === Infinity) return logs || []
  const from = new Date(new Date(now + 'T12:00:00Z').getTime() - (periodDays - 1) * 86400000)
  const fromKey = from.toISOString().slice(0, 10)
  return (logs || []).filter((l) => {
    const d = logDayKey(l)
    return d && d >= fromKey && d <= now
  })
}
