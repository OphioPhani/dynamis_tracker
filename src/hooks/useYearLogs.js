import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from '../hooks/useAuth.jsx'
import { useStore } from '../hooks/useWorkoutStore.jsx'
import { logDayKey } from '../utils/dateUtils.js'

// Per-year cache (keyed by user + year). Server returns exercise-joined rows.
const yearCache = new Map() // `${userId}:${year}` -> mapped rows

function mapRow(l) {
  return {
    localId: l.id, id: l.id, synced: true,
    muscle: l.ex_muscle || 'Unknown', rank: l.ex_rank || 'good',
    exerciseName: l.ex_name || 'Exercise',
    equipment: l.ex_equipment || '', day: l.workout_day || l.ex_day || '',
    weight: Number(l.weight), reps: l.reps_completed,
    performedAt: l.performed_at, completed: l.completed,
    splitId: l.split_id || null, splitName: l.split_name || '',
    sessionId: l.session_id || null, setNumber: l.set_number ?? null,
    workoutDay: l.workout_day || l.ex_day || '', workoutDate: l.workout_date || null,
    sessionSeq: l.session_no || 1
  }
}

// Fetch ONLY the selected year's rows (IST calendar via workout_date).
async function fetchYear(userId, year) {
  const { logs } = await api.logs({ from: `${year}-01-01`, to: `${year}-12-31`, limit: 5000 })
  return (logs || []).map(mapRow).filter((l) => logDayKey(l).startsWith(`${year}-`))
}

// Hook: yearly rows for the selected IST year.
export function useYearLogs(year) {
  const { user, demoMode } = useAuth()
  const { logs } = useStore()
  const [state, setState] = useState({ loading: true, rows: [], error: '' })
  const [nonce, setNonce] = useState(0)
  const reqId = useRef(0)

  useEffect(() => {
    const id = ++reqId.current
    setState({ loading: true, rows: [], error: '' })
    ;(async () => {
      try {
        let rows
        if (user && !demoMode) {
          const key = `${user.id}:${year}`
          if (!yearCache.has(key)) yearCache.set(key, await fetchYear(user.id, year))
          rows = yearCache.get(key)
        } else {
          // Local/demo mode: filter the on-device mirror.
          rows = (logs || []).filter((l) => logDayKey(l).startsWith(`${year}-`))
        }
        if (id === reqId.current) setState({ loading: false, rows, error: '' })
      } catch (e) {
        if (id === reqId.current) setState({ loading: false, rows: [], error: e.message || 'Failed to load' })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, user?.id, nonce])

  return { ...state, retry: () => { if (user) yearCache.delete(`${user.id}:${year}`); setNonce((n) => n + 1) } }
}

export function clearYearCache() { yearCache.clear() }
