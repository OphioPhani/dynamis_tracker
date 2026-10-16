// Workout Split Library — template-based, database-driven shape.
// Mirrors the database tables workout_splits / split_days / split_muscle_targets (db/schema.sql)
// so new splits can be added via SQL inserts without touching components.
// Snake's Split is derived from WORKOUT_PLAN (single source of truth).
// RULE: Snake's Split is IMMUTABLE — never edit its days/muscles here.
// To change it, create a user-owned copy instead.
import { WORKOUT_PLAN, REQUIRED_MUSCLES } from './workoutPlan.js'

export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const M = (muscle, priority) => ({ muscle, priority })

// Reusable muscle blocks (exact canonical names)
const CHEST = ['Pectoralis major', 'Pectoralis minor', 'Subclavius', 'Serratus anterior']
const CUFF = ['Supraspinatus', 'Infraspinatus', 'Teres minor', 'Subscapularis']
const DELTS = ['Anterior deltoid', 'Lateral deltoid', 'Posterior deltoid']
const ARMS = ['Biceps brachii', 'Brachialis', 'Brachioradialis', 'Triceps brachii', 'Forearm flexors', 'Forearm extensors']
const BACK = ['Trapezius', 'Rhomboids', 'Rhomboid major', 'Rhomboid minor', 'Teres major', 'Levator scapulae', 'Latissimus dorsi', 'Erector spinae']
const CORE = ['Rectus abdominis', 'External obliques', 'Internal obliques', 'Transverse abdominis', 'Multifidus', 'Quadratus lumborum', 'Rotatores', 'Semispinalis', 'Diaphragm', 'Pelvic floor']
const LEGS = ['Quadriceps', 'Rectus femoris', 'Hamstrings', 'Glutes', 'Gluteus maximus', 'Adductors', 'Calves', 'Tibialis anterior', 'Iliopsoas', 'Tensor fasciae latae']
const PUSH = [...CHEST, 'Anterior deltoid', 'Lateral deltoid', 'Triceps brachii']
const PULL_UPPER = [...DELTS.filter((d) => d === 'Posterior deltoid'), ...CUFF, 'Trapezius', 'Rhomboids', 'Rhomboid major', 'Rhomboid minor', 'Teres major', 'Levator scapulae', 'Latissimus dorsi', 'Biceps brachii', 'Brachialis', 'Brachioradialis', 'Forearm flexors', 'Forearm extensors']

const withPriority = (muscles, start = 1) => muscles.map((muscle, i) => M(muscle, start + i))
const rest = (dayOfWeek) => ({ dayOfWeek, name: 'Rest', isRestDay: true, muscles: [] })
const day = (dayOfWeek, name, muscles) => ({ dayOfWeek, name, isRestDay: false, muscles: withPriority(muscles) })

function snakeDays() {
  // Group the canonical 45-muscle plan by day — Snake's Split always matches the plan.
  const focus = {
    Monday: 'Upper Body',
    Tuesday: 'Lower Body + Core',
    Thursday: 'Back + Shoulders + Arms',
    Friday: 'Chest + Upper Body + Core / Posture',
    Saturday: 'Lower Body + Posterior Chain + Core'
  }
  const byDay = new Map()
  for (const m of WORKOUT_PLAN) {
    if (!byDay.has(m.day)) byDay.set(m.day, [])
    byDay.get(m.day).push(m.muscle)
  }
  return WEEK_DAYS.map((d) => {
    if (d === 'Wednesday' || d === 'Sunday') return rest(d)
    return day(d, focus[d] || 'Training', byDay.get(d) || [])
  })
}

export const SPLIT_TEMPLATES = [
  {
    id: 'snake-split',
    name: "Snake's Split",
    badge: 'PERSONAL',
    description: "Snake's Split is a personalized 5-day training split combining upper body, lower body, core, back, shoulders, arms, chest, posture, and posterior-chain training.",
    category: 'Custom',
    level: 'Intermediate',
    goals: ['Hypertrophy', 'Full body'],
    tags: ['5 days', 'hypertrophy', 'personal', 'custom'],
    daysPerWeek: 5,
    isPreset: true,
    isPersonalPreset: true,
    days: snakeDays()
  },
  {
    id: 'bro-split',
    name: 'Bro Split',
    description: 'Classic bodybuilding split — one muscle group per day, high focus per session.',
    category: 'Hypertrophy',
    level: 'Intermediate',
    goals: ['Hypertrophy', 'Bodybuilding'],
    tags: ['5 days', 'bodybuilding', 'hypertrophy'],
    daysPerWeek: 5,
    isPreset: true,
    isPersonalPreset: false,
    days: [
      day('Monday', 'Chest', [...CHEST, 'Anterior deltoid']),
      day('Tuesday', 'Back', [...BACK, 'Posterior deltoid']),
      day('Wednesday', 'Legs', [...LEGS, ...CORE]),
      day('Thursday', 'Shoulders', [...DELTS, ...CUFF, 'Trapezius']),
      day('Friday', 'Arms', [...ARMS]),
      day('Saturday', 'Optional Core', [...CORE]),
      rest('Sunday')
    ]
  },
  {
    id: 'ppl-6',
    name: 'Push / Pull / Legs — 6 Day',
    description: 'Push, pull, legs twice per week. High frequency for steady growth.',
    category: 'Advanced',
    level: 'Advanced',
    goals: ['Hypertrophy', 'Strength'],
    tags: ['6 days', 'hypertrophy', 'strength', 'ppl'],
    daysPerWeek: 6,
    isPreset: true,
    isPersonalPreset: false,
    days: [
      day('Monday', 'Push', [...PUSH]),
      day('Tuesday', 'Pull', [...PULL_UPPER]),
      day('Wednesday', 'Legs', [...LEGS, ...CORE]),
      day('Thursday', 'Push', [...PUSH]),
      day('Friday', 'Pull', [...PULL_UPPER, 'Erector spinae']),
      day('Saturday', 'Legs', [...LEGS, ...CORE]),
      rest('Sunday')
    ]
  },
  {
    id: 'ppl-3',
    name: 'Push / Pull / Legs — 3 Day',
    description: 'One push, one pull, one legs session. Ideal when time is limited.',
    category: 'Hypertrophy',
    level: 'Beginner',
    goals: ['Hypertrophy', 'Strength'],
    tags: ['3 days', 'beginner', 'ppl'],
    daysPerWeek: 3,
    isPreset: true,
    isPersonalPreset: false,
    days: [
      day('Monday', 'Push', [...PUSH]),
      rest('Tuesday'),
      day('Wednesday', 'Pull', [...PULL_UPPER]),
      rest('Thursday'),
      day('Friday', 'Legs', [...LEGS, 'Erector spinae', ...CORE]),
      rest('Saturday'),
      rest('Sunday')
    ]
  },
  {
    id: 'upper-lower',
    name: 'Upper / Lower',
    description: '4-day upper/lower. Each half trained twice weekly with rest between.',
    category: 'Beginner',
    level: 'Beginner',
    goals: ['Hypertrophy', 'Strength', 'Full body'],
    tags: ['4 days', 'beginner', 'strength'],
    daysPerWeek: 4,
    isPreset: true,
    isPersonalPreset: false,
    days: [
      day('Monday', 'Upper', [...CHEST, ...DELTS, ...CUFF, ...ARMS, ...BACK.filter((m) => m !== 'Erector spinae')]),
      day('Tuesday', 'Lower', [...LEGS, 'Erector spinae', ...CORE]),
      rest('Wednesday'),
      day('Thursday', 'Upper', [...CHEST, ...DELTS, ...CUFF, ...ARMS, ...BACK.filter((m) => m !== 'Erector spinae')]),
      day('Friday', 'Lower', [...LEGS, 'Erector spinae', ...CORE]),
      day('Saturday', 'Optional', ['Calves', 'Rectus abdominis', 'Transverse abdominis']),
      rest('Sunday')
    ]
  },
  {
    id: 'upper-lower-6',
    name: 'Upper / Lower — 6 Day',
    description: 'Upper/lower alternated across six days for maximum frequency.',
    category: 'Advanced',
    level: 'Advanced',
    goals: ['Hypertrophy'],
    tags: ['6 days', 'advanced', 'hypertrophy'],
    daysPerWeek: 6,
    isPreset: true,
    isPersonalPreset: false,
    days: [
      day('Monday', 'Upper', [...CHEST, ...DELTS, ...CUFF, ...ARMS, ...BACK.filter((m) => m !== 'Erector spinae')]),
      day('Tuesday', 'Lower', [...LEGS, 'Erector spinae', ...CORE]),
      day('Wednesday', 'Upper', [...CHEST, ...DELTS, ...CUFF, ...ARMS, ...BACK.filter((m) => m !== 'Erector spinae')]),
      day('Thursday', 'Lower', [...LEGS, 'Erector spinae', ...CORE]),
      day('Friday', 'Upper', [...CHEST, ...DELTS, ...CUFF, ...ARMS, ...BACK.filter((m) => m !== 'Erector spinae')]),
      day('Saturday', 'Lower', [...LEGS, 'Erector spinae', ...CORE]),
      rest('Sunday')
    ]
  },
  {
    id: 'fullbody-3',
    name: 'Full Body — 3 Days',
    description: 'Three rotating full-body sessions. Muscles distributed so nothing is overloaded daily.',
    category: 'Beginner',
    level: 'Beginner',
    goals: ['Strength', 'Full body'],
    tags: ['3 days', 'beginner', 'full body', 'strength'],
    daysPerWeek: 3,
    isPreset: true,
    isPersonalPreset: false,
    days: [
      day('Monday', 'Full Body A', ['Pectoralis major', 'Anterior deltoid', 'Triceps brachii', 'Quadriceps', 'Rectus femoris', 'Glutes', 'Calves', 'Rectus abdominis', 'Transverse abdominis', 'Serratus anterior', 'Tibialis anterior', 'Tensor fasciae latae', 'Diaphragm', 'Pelvic floor', 'Subclavius']),
      rest('Tuesday'),
      day('Wednesday', 'Full Body B', ['Latissimus dorsi', 'Rhomboids', 'Rhomboid major', 'Teres major', 'Biceps brachii', 'Brachialis', 'Hamstrings', 'Gluteus maximus', 'Adductors', 'External obliques', 'Internal obliques', 'Erector spinae', 'Multifidus', 'Supraspinatus', 'Posterior deltoid']),
      rest('Thursday'),
      day('Friday', 'Full Body C', ['Pectoralis minor', 'Lateral deltoid', 'Brachioradialis', 'Forearm flexors', 'Forearm extensors', 'Infraspinatus', 'Teres minor', 'Subscapularis', 'Trapezius', 'Rhomboid minor', 'Levator scapulae', 'Iliopsoas', 'Quadratus lumborum', 'Rotatores', 'Semispinalis']),
      rest('Saturday'),
      rest('Sunday')
    ]
  },
  {
    id: 'fullbody-5',
    name: 'Full Body — 5 Days',
    description: 'Five short rotating sessions (~9 muscles each). Same muscle never heavily loaded two days in a row.',
    category: 'Beginner',
    level: 'Intermediate',
    goals: ['Full body', 'Hypertrophy'],
    tags: ['5 days', 'full body', 'hypertrophy'],
    daysPerWeek: 5,
    isPreset: true,
    isPersonalPreset: false,
    days: [
      day('Monday', 'Full Body A', ['Pectoralis major', 'Anterior deltoid', 'Triceps brachii', 'Quadriceps', 'Glutes', 'Calves', 'Rectus abdominis', 'Serratus anterior', 'Subclavius']),
      day('Tuesday', 'Full Body B', ['Latissimus dorsi', 'Biceps brachii', 'Hamstrings', 'Adductors', 'External obliques', 'Erector spinae', 'Posterior deltoid', 'Supraspinatus', 'Tibialis anterior']),
      rest('Wednesday'),
      day('Thursday', 'Full Body C', ['Pectoralis minor', 'Lateral deltoid', 'Brachialis', 'Rectus femoris', 'Gluteus maximus', 'Internal obliques', 'Multifidus', 'Infraspinatus', 'Iliopsoas']),
      day('Friday', 'Full Body D', ['Trapezius', 'Rhomboids', 'Teres major', 'Brachioradialis', 'Forearm flexors', 'Transverse abdominis', 'Quadratus lumborum', 'Teres minor', 'Tensor fasciae latae']),
      day('Saturday', 'Full Body E', ['Rhomboid major', 'Rhomboid minor', 'Levator scapulae', 'Subscapularis', 'Forearm extensors', 'Rotatores', 'Semispinalis', 'Diaphragm', 'Pelvic floor']),
      rest('Sunday')
    ]
  },
  {
    id: 'ppl-ul',
    name: 'PPL + Upper / Lower',
    description: 'Push/pull/legs then upper/lower with an arms + core finisher day.',
    category: 'Advanced',
    level: 'Advanced',
    goals: ['Hypertrophy', 'Bodybuilding'],
    tags: ['6 days', 'advanced', 'hypertrophy', 'ppl'],
    daysPerWeek: 6,
    isPreset: true,
    isPersonalPreset: false,
    days: [
      day('Monday', 'Push', [...PUSH]),
      day('Tuesday', 'Pull', [...PULL_UPPER]),
      day('Wednesday', 'Legs', [...LEGS, 'Erector spinae']),
      day('Thursday', 'Upper', [...CHEST, ...DELTS, ...ARMS]),
      day('Friday', 'Lower', [...LEGS, ...CORE]),
      day('Saturday', 'Arms + Core', [...ARMS, ...CORE]),
      rest('Sunday')
    ]
  },
  {
    id: 'arnold',
    name: 'Arnold Split',
    description: 'Classic chest+back / shoulders+arms / legs rotation, twice per week.',
    category: 'Hypertrophy',
    level: 'Advanced',
    goals: ['Hypertrophy', 'Bodybuilding'],
    tags: ['6 days', 'bodybuilding', 'hypertrophy', 'arnold'],
    daysPerWeek: 6,
    isPreset: true,
    isPersonalPreset: false,
    days: [
      day('Monday', 'Chest + Back', [...CHEST, ...BACK]),
      day('Tuesday', 'Shoulders + Arms', [...DELTS, ...CUFF, ...ARMS, 'Trapezius']),
      day('Wednesday', 'Legs + Core', [...LEGS, ...CORE]),
      day('Thursday', 'Chest + Back', [...CHEST, ...BACK]),
      day('Friday', 'Shoulders + Arms', [...DELTS, ...CUFF, ...ARMS, 'Trapezius']),
      day('Saturday', 'Legs + Core', [...LEGS, ...CORE]),
      rest('Sunday')
    ]
  },
  {
    id: 'cblsa',
    name: 'Chest / Back / Legs / Shoulders / Arms',
    description: 'Five-day bodybuilding split with an optional core day.',
    category: 'Hypertrophy',
    level: 'Intermediate',
    goals: ['Hypertrophy', 'Bodybuilding'],
    tags: ['5 days', 'bodybuilding', 'hypertrophy'],
    daysPerWeek: 5,
    isPreset: true,
    isPersonalPreset: false,
    days: [
      day('Monday', 'Chest', [...CHEST, 'Anterior deltoid']),
      day('Tuesday', 'Back', [...BACK, 'Posterior deltoid', 'Biceps brachii']),
      day('Wednesday', 'Legs', [...LEGS, 'Erector spinae']),
      day('Thursday', 'Shoulders', [...DELTS, ...CUFF, 'Trapezius', 'Levator scapulae']),
      day('Friday', 'Arms', [...ARMS]),
      day('Saturday', 'Optional Core', [...CORE]),
      rest('Sunday')
    ]
  },
  {
    id: 'phul',
    name: 'PHUL',
    description: 'Power/hypertrophy upper-lower: heavy compounds early week, volume later.',
    category: 'Hypertrophy',
    level: 'Intermediate',
    goals: ['Strength', 'Hypertrophy'],
    tags: ['4 days', 'strength', 'hypertrophy', 'power'],
    daysPerWeek: 4,
    isPreset: true,
    isPersonalPreset: false,
    days: [
      day('Monday', 'Upper Power', ['Pectoralis major', 'Anterior deltoid', 'Triceps brachii', 'Latissimus dorsi', 'Teres major', 'Biceps brachii', 'Trapezius', 'Rhomboids', 'Serratus anterior', 'Posterior deltoid', 'Brachialis', 'Forearm flexors', 'Rectus abdominis', 'Transverse abdominis']),
      day('Tuesday', 'Lower Power', [...LEGS, 'Erector spinae', 'Gluteus maximus']),
      rest('Wednesday'),
      day('Thursday', 'Upper Hypertrophy', [...CHEST, ...DELTS, ...CUFF, 'Biceps brachii', 'Brachioradialis', 'Triceps brachii', 'Forearm extensors', 'Rhomboid major', 'Rhomboid minor', 'Levator scapulae', 'Subscapularis']),
      day('Friday', 'Lower Hypertrophy', [...LEGS, ...CORE]),
      day('Saturday', 'Optional', ['Calves', 'Tibialis anterior', 'External obliques', 'Diaphragm']),
      rest('Sunday')
    ]
  },
  {
    id: 'phat',
    name: 'PHAT',
    description: 'Power upper/lower plus hypertrophy back+shoulders, lower and chest+arms days.',
    category: 'Hypertrophy',
    level: 'Advanced',
    goals: ['Strength', 'Hypertrophy', 'Bodybuilding'],
    tags: ['5 days', 'strength', 'hypertrophy', 'power'],
    daysPerWeek: 5,
    isPreset: true,
    isPersonalPreset: false,
    days: [
      day('Monday', 'Upper Body Power', ['Pectoralis major', 'Anterior deltoid', 'Triceps brachii', 'Latissimus dorsi', 'Biceps brachii', 'Trapezius', 'Serratus anterior', 'Brachialis', 'Forearm flexors', 'Posterior deltoid', 'Rhomboids', 'Rectus abdominis']),
      day('Tuesday', 'Lower Body Power', [...LEGS, 'Erector spinae']),
      rest('Wednesday'),
      day('Thursday', 'Back + Shoulders Hypertrophy', [...BACK, ...DELTS, ...CUFF, 'Levator scapulae', 'Biceps brachii']),
      day('Friday', 'Lower Body Hypertrophy', [...LEGS, ...CORE]),
      day('Saturday', 'Chest + Arms Hypertrophy', [...CHEST, ...ARMS, 'Anterior deltoid', 'Lateral deltoid']),
      rest('Sunday')
    ]
  }
]

export function getSplitById(id, customSplits = []) {
  return (
    customSplits.find((s) => s.id === id) ||
    SPLIT_TEMPLATES.find((s) => s.id === id) ||
    null
  )
}

export function splitMuscleUnion(split) {
  return [...new Set((split?.days || []).flatMap((d) => (d.muscles || []).map((m) => m.muscle)))]
}

export function splitDayFor(split, dayOfWeek) {
  return (split?.days || []).find((d) => d.dayOfWeek === dayOfWeek) || null
}

// All muscles assigned to training days (Mon/Tue/Thu/Fri/Sat for Snake's Split).
// Planned = explicitly mapped; actually-trained comes only from logged exercises.
export function validateSnakeSplitCoverage() {
  const snake = SPLIT_TEMPLATES.find((s) => s.id === 'snake-split')
  const assigned = new Set(
    (snake?.days || [])
      .filter((d) => !d.isRestDay)
      .flatMap((d) => (d.muscles || []).map((m) => m.muscle))
  )
  const missing = REQUIRED_MUSCLES.filter((m) => !assigned.has(m))
  return {
    valid: missing.length === 0,
    totalRequired: REQUIRED_MUSCLES.length,
    assignedCount: assigned.size,
    missing
  }
}

if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
  const check = validateSnakeSplitCoverage()
  if (!check.valid) {
    console.error(
      "SNAKE'S SPLIT VALIDATION FAILED\n\nMissing muscles:\n" +
      check.missing.map((m) => `- ${m}`).join('\n')
    )
  }
}
