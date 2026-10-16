// Central canonical date/time utility for Dynamis Tracker.
// ALL workout-day, session-date, history and statistics logic MUST use
// these functions. Never use getUTCDay() or toISOString().slice(0,10)
// to determine the workout day — ISO strings are UTC and will shift the
// calendar day for users in Asia/Kolkata (IST, UTC+05:30).
export const APP_TIMEZONE = 'Asia/Kolkata'
export const WEEKDAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const weekdayFmt = new Intl.DateTimeFormat('en-US', { timeZone: APP_TIMEZONE, weekday: 'long' })
// en-CA yields YYYY-MM-DD — stable, sortable, no UTC involved.
const ymdFmt = new Intl.DateTimeFormat('en-CA', { timeZone: APP_TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' })
const hourFmt = new Intl.DateTimeFormat('en-US', { timeZone: APP_TIMEZONE, hour: 'numeric', hour12: false })

// Current weekday in India, e.g. 'Tuesday'
export function getIndiaWeekday(date = new Date()) {
  return weekdayFmt.format(date)
}

// Current calendar date in India as 'YYYY-MM-DD'
export function getIndiaDateString(date = new Date()) {
  return ymdFmt.format(date)
}

// Calendar date in India for an arbitrary timestamp (log entries, history).
// Accepts Date, ISO string or epoch ms. Falls back to today on bad input.
export function indiaDateStringOfTimestamp(ts) {
  const d = ts instanceof Date ? ts : new Date(ts)
  if (Number.isNaN(d.getTime())) return getIndiaDateString()
  return ymdFmt.format(d)
}

// Canonical per-log India date used for grouping history/coverage/stats.
export function logIndiaDate(log) {
  return indiaDateStringOfTimestamp(log?.performedAt)
}

// Calendar date a log belongs to: explicit workoutDate (missed-day catch-ups,
// early logging) wins, otherwise the India date of its timestamp.
export function logDayKey(log) {
  return log?.workoutDate || logIndiaDate(log)
}

// Instant (JS Date) of Monday 00:00 IST for the week containing `date`.
export function getIndiaWeekStart(date = new Date()) {
  // Walk back using India calendar days (IST has no DST — safe).
  const cur = new Date(date.getTime())
  for (let i = 0; i < 7; i++) {
    if (getIndiaWeekday(cur) === 'Monday') break
    cur.setTime(cur.getTime() - 86400000)
  }
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: APP_TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(cur)
    .reduce((a, p) => ({ ...a, [p.type]: p.value }), {})
  // Monday 00:00 IST == Sunday 18:30 UTC
  return new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), 0, 0, 0) - 19800000)
}

// Seven India calendar days (Mon..Sun) for the current week as { date, key, weekday }.
export function getIndiaWeekDays(date = new Date()) {
  const start = getIndiaWeekStart(date)
  return WEEKDAY_NAMES.map((weekday, i) => {
    const d = new Date(start.getTime() + i * 86400000)
    return { date: d, key: getIndiaDateString(d), weekday }
  })
}

// 'YYYY-MM' key for the India calendar month.
export function getIndiaMonthKey(date = new Date()) {
  return getIndiaDateString(date).slice(0, 7)
}

// Hour of day (0-23) in India — used for greetings.
export function getIndiaHour(date = new Date()) {
  return Number(hourFmt.format(date))
}
