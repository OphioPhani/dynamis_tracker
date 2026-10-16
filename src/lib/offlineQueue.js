// Offline queue: cache workout + queue unsynced set-logs in localStorage, sync when online.
const QUEUE_KEY = 'gmt_offline_queue_v1'
const CACHE_KEY = 'gmt_cached_plan_v1'

export function getQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]') } catch { return [] }
}
export function enqueueLog(entry) {
  const q = getQueue()
  q.push({ ...entry, _queuedAt: new Date().toISOString() })
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q))
  return q.length
}
export function clearQueue() { localStorage.setItem(QUEUE_KEY, JSON.stringify([])) }
export function removeQueued(ids) {
  const q = getQueue().filter((x) => !ids.includes(x.localId))
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q))
}
export function cachePlan(plan) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), plan })) } catch {}
}
export function getCachedPlan() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null') } catch { return null }
}

export function replaceQueued(entry) {
  const q = getQueue().filter((x) => x.localId !== entry.localId)
  q.push(entry)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q))
}
export function dropQueued(localId) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(getQueue().filter((x) => x.localId !== localId)))
}
