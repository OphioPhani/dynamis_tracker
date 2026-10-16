import { useEffect, useRef, useState } from 'react'

// Persistent rest timer that survives in-app navigation (module-level singleton)
let globalEndAt = 0
let globalSecs = 90
const listeners = new Set()
function emit() { listeners.forEach((fn) => fn({ endAt: globalEndAt, secs: globalSecs })) }

export function startRest(seconds = 90) {
  globalSecs = seconds
  globalEndAt = Date.now() + seconds * 1000
  emit()
}
export function adjustRest(delta) {
  if (!globalEndAt) return startRest(Math.max(15, globalSecs + delta))
  globalEndAt += delta * 1000
  globalSecs = Math.max(0, Math.round((globalEndAt - Date.now()) / 1000))
  emit()
}
export function skipRest() { globalEndAt = 0; emit() }

export function useRestTimer() {
  const [state, setState] = useState({ endAt: globalEndAt, secs: globalSecs })
  const [left, setLeft] = useState(0)
  useEffect(() => {
    const fn = (s) => setState({ ...s })
    listeners.add(fn)
    return () => { listeners.delete(fn) }
  }, [])
  useEffect(() => {
    const t = setInterval(() => {
      setLeft(state.endAt ? Math.max(0, Math.round((state.endAt - Date.now()) / 1000)) : 0)
      if (state.endAt && Date.now() >= state.endAt && navigator.vibrate) {
        try { navigator.vibrate(200) } catch {}
      }
    }, 500)
    return () => clearInterval(t)
  }, [state.endAt])
  const active = state.endAt > Date.now()
  return { active, left, total: state.secs }
}
