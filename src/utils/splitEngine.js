// Exercise generation engine: split template + equipment -> today's workout.
// Architecture: MUSCLE DB -> EXERCISE DB -> SPLIT TEMPLATES -> ACTIVE SPLIT
// -> TODAY'S WORKOUT -> LOGS -> ACTUAL COVERAGE -> ANALYTICS
import { WORKOUT_PLAN } from '../data/workoutPlan.js'
import { EQUIPMENT_ALIASES } from '../data/equipment.js'
import { splitDayFor } from '../data/splits.js'

const RANK_ORDER = ['best', 'better', 'good']

function requiredKeys(equipmentStr) {
  const s = String(equipmentStr || '').toLowerCase()
  if (!s) return []
  if (s.includes('bodyweight') && !/dumbbell|barbell|cable|machine|bench|bar\b/.test(s)) return []
  const keys = []
  for (const [key, aliases] of Object.entries(EQUIPMENT_ALIASES)) {
    if (key === 'Mat (bodyweight area)') continue
    if (aliases.some((a) => s.includes(a))) keys.push(key)
  }
  return [...new Set(keys)]
}

export function exerciseAvailable(exercise, availableEquipment) {
  if (!availableEquipment || !availableEquipment.length) return true
  const need = requiredKeys(exercise?.equipment)
  if (!need.length) return true
  const have = new Set(availableEquipment)
  return need.every((k) => {
    if (have.has(k)) return true
    // bench-family fallback: any bench counts
    if (k === 'Adjustable bench' && (have.has('Preacher bench'))) return true
    return false
  })
}

export function planEntryFor(muscle) {
  return WORKOUT_PLAN.find((x) => x.muscle === muscle) || null
}

// generateWorkoutFromSplit(split, availableEquipment, exerciseDatabase)
// Returns schedule for every day: [{ dayOfWeek, name, isRestDay, items: [{muscle, priority, selectedRank, exercise, alternatives:[{rank, exercise, available}]}] }]
export function generateWorkoutFromSplit(split, availableEquipment, exerciseDatabase) {
  const db = exerciseDatabase || WORKOUT_PLAN
  const byMuscle = new Map(db.map((m) => [m.muscle, m]))
  return (split?.days || []).map((d) => {
    if (d.isRestDay) return { dayOfWeek: d.dayOfWeek, name: d.name, isRestDay: true, items: [] }
    const seen = new Set()
    const items = (d.muscles || [])
      .slice()
      .sort((a, b) => a.priority - b.priority)
      .map(({ muscle, priority }) => {
        if (seen.has(muscle)) return null
        seen.add(muscle)
        const entry = byMuscle.get(muscle)
        if (!entry) return { muscle, priority, selectedRank: null, exercise: null, alternatives: [] }
        const alternatives = entry.exercises.map((ex) => ({
          rank: ex.rank,
          exercise: ex,
          available: exerciseAvailable(ex, availableEquipment)
        }))
        const pick = RANK_ORDER.map((r) => alternatives.find((a) => a.rank === r && a.available)).find(Boolean)
          || alternatives.find((a) => a.rank === 'good')
        return { muscle, priority, selectedRank: pick?.rank || null, exercise: pick?.exercise || null, alternatives }
      })
      .filter(Boolean)
    return { dayOfWeek: d.dayOfWeek, name: d.name, isRestDay: false, items }
  })
}

export function scheduleForDay(split, dayOfWeek, availableEquipment, exerciseDatabase) {
  const full = generateWorkoutFromSplit(split, availableEquipment, exerciseDatabase)
  return full.find((d) => d.dayOfWeek === dayOfWeek) || null
}

// Expected coverage: muscles the split intends to train (unique + direct).
export function expectedCoverage(scheduleDay) {
  const muscles = (scheduleDay?.items || []).map((i) => i.muscle)
  return { expectedMuscles: muscles, expectedCount: new Set(muscles).size }
}

export function weekExpectedCoverage(split) {
  const all = (split?.days || []).flatMap((d) => (d.muscles || []).map((m) => m.muscle))
  return { expectedMuscles: [...new Set(all)], expectedCount: new Set(all).size }
}

// Recommend a split from days available + experience + goal (non-binding).
export function recommendSplit({ daysPerWeek, experience, goal }) {
  const wants = []
  if ((daysPerWeek || 5) <= 3) wants.push('fullbody-3', 'ppl-3', 'upper-lower')
  if ((daysPerWeek || 5) === 4) wants.push('upper-lower', 'phul', 'ppl-3')
  if ((daysPerWeek || 5) === 5) wants.push('snake-split', 'cblsa', 'phat', 'fullbody-5')
  if ((daysPerWeek || 5) >= 6) wants.push('ppl-6', 'arnold', 'upper-lower-6', 'ppl-ul')
  if (/beginner/i.test(experience || '')) return wants.find((w) => ['fullbody-3', 'upper-lower', 'ppl-3'].includes(w)) || 'fullbody-3'
  if (/strength/i.test(goal || '')) return wants.find((w) => ['upper-lower', 'phul', 'ppl-6'].includes(w)) || wants[0]
  return wants[0] || 'snake-split'
}
