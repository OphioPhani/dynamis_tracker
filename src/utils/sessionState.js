// Session-state helpers: pure functions for exercise/day completion.
// A session is uniquely identified by user + workout_date + split + workout_day
// (+ sessionSeq for deliberate "start new session" repeats).
import { logDayKey } from './dateUtils.js'

export function sessionKey({ workoutDate, splitId, workoutDay, sessionSeq = 1 }) {
  return `${workoutDate}|${splitId || 'nosplit'}|${workoutDay}|${sessionSeq}`
}

// Logs belonging to one session. Uniqueness is scoped to the session, so the
// same exercise on different days (or dates) is never treated as a duplicate.
export function logsForSession(logs, { workoutDate, splitId, workoutDay, sessionSeq }) {
  return (logs || []).filter((l) =>
    logDayKey(l) === workoutDate &&
    (l.splitId || null) === (splitId || null) &&
    (l.workoutDay || l.day || '') === workoutDay &&
    (l.sessionSeq || 1) === (sessionSeq || 1)
  )
}

export function plannedSetsFor(exercise) {
  const n = parseInt(exercise?.sets, 10)
  return Number.isFinite(n) && n > 0 ? n : 3
}

// NOT_STARTED | IN_PROGRESS | COMPLETED — actual logged sets only, never the plan.
export function getExerciseStatus(sessionSets, plannedSets) {
  if (!sessionSets || sessionSets.length === 0) return 'NOT_STARTED'
  return sessionSets.length >= plannedSets ? 'COMPLETED' : 'IN_PROGRESS'
}

export function getDayStatus(plannedCount, completedCount, actualCount) {
  if (plannedCount === 0) return actualCount > 0 ? 'EXTRA' : 'REST'
  if (completedCount >= plannedCount) return 'COMPLETE'
  if (completedCount > 0 || actualCount > 0) return 'IN_PROGRESS'
  return 'NOT_STARTED'
}
