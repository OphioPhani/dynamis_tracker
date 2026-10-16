// Thin backwards-compatible wrappers — all canonical logic lives in
// dateUtils.js (Asia/Kolkata). Do NOT add independent date math here.
import {
  getIndiaWeekday,
  getIndiaDateString,
  getIndiaWeekStart,
  getIndiaWeekDays,
  getIndiaHour
} from './dateUtils.js'

export function todayName() {
  return getIndiaWeekday()
}
export function dayKey(d = new Date()) {
  return getIndiaDateString(d)
}
export function startOfWeek(d = new Date()) {
  return getIndiaWeekStart(d)
}
export function weekDays() {
  return getIndiaWeekDays().map((x) => x.date)
}
export function greeting() {
  const h = getIndiaHour()
  if (h < 12) return 'GOOD MORNING'
  if (h < 17) return 'GOOD AFTERNOON'
  return 'GOOD EVENING'
}
export function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}
