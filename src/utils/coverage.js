import { REQUIRED_MUSCLES, WORKOUT_PLAN } from '../data/workoutPlan.js'

// Coverage weights: primary 1.0, secondary 0.5, stabilizer 0.25
export const WEIGHTS = { primary: 1.0, secondary: 0.5, stabilizer: 0.25 }

function planLookup() {
  const map = new Map()
  for (const m of WORKOUT_PLAN) {
    for (const ex of m.exercises) {
      map.set(`${m.muscle}|||${ex.rank}`, ex)
      map.set(`${ex.name.toLowerCase()}`, ex)
    }
  }
  return map
}
const LOOKUP = planLookup()

export function lookupExercise(muscle, rank) {
  return LOOKUP.get(`${muscle}|||${rank}`) || null
}

// logs: [{ muscle, rank, exerciseName, completed }] — one entry per logged SET or per exercise
// Returns { totalMuscles, uniqueMusclesCovered, directMusclesCovered, weightedCoverage, muscles: [...] }
export function calculateMuscleCoverage(logs) {
  const totalMuscles = REQUIRED_MUSCLES.length
  const perMuscle = new Map() // muscle -> { type: best type seen, sets: n, volume }
  for (const log of logs || []) {
    const ex = log.exercise || lookupExercise(log.muscle, log.rank) || LOOKUP.get(String(log.exerciseName || '').toLowerCase())
    if (!ex) {
      // unknown exercise: count its target muscle as primary only
      if (log.muscle) bump(log.muscle, 'primary')
      continue
    }
    for (const m of ex.primary || []) bump(m, 'primary')
    for (const m of ex.secondary || []) bump(m, 'secondary')
    for (const m of ex.stabilizers || []) bump(m, 'stabilizer')
  }
  function bump(muscle, type) {
    if (!muscle) return
    const rank = { primary: 3, secondary: 2, stabilizer: 1 }
    const prev = perMuscle.get(muscle)
    if (!prev) perMuscle.set(muscle, { type, sets: 1 })
    else {
      perMuscle.set(muscle, {
        type: rank[type] > rank[prev.type] ? type : prev.type,
        sets: prev.sets + 1
      })
    }
  }
  const muscles = REQUIRED_MUSCLES.map((name) => {
    const hit = perMuscle.get(name)
    return {
      name,
      covered: Boolean(hit),
      type: hit ? hit.type : null,
      sets: hit ? hit.sets : 0,
      weight: hit ? WEIGHTS[hit.type] : 0
    }
  })
  const uniqueMusclesCovered = muscles.filter((m) => m.covered).length
  const directMusclesCovered = muscles.filter((m) => m.type === 'primary').length
  const weightedSum = muscles.reduce((a, m) => a + m.weight, 0)
  const weightedCoverage = Math.round((weightedSum / totalMuscles) * 100)
  return { totalMuscles, uniqueMusclesCovered, directMusclesCovered, weightedCoverage, muscles }
}

export function coverageForDay(logsForDay) {
  return calculateMuscleCoverage(logsForDay)
}

// Weekly: dedupe across days
export function weeklyCoverage(allLogs) {
  return calculateMuscleCoverage(allLogs)
}

// Undertrained helpers
export function undertainedMuscles(coverage, maxSets = 0) {
  return coverage.muscles.filter((m) => !m.covered || m.sets <= maxSets).map((m) => m.name)
}
