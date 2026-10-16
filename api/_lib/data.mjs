// Deterministic exercise -> muscle coverage mapping (server-side mirror of
// the client algorithm). Coverage rows are written when a set is logged.
export function coverageRowsFor(exercise, userId, logId, dateKey) {
  const rows = [];
  for (const m of exercise.primary_muscles || []) {
    rows.push({ user_id: userId, workout_log_id: logId, muscle_name: m, coverage_type: 'primary', coverage_date: dateKey });
  }
  for (const m of exercise.secondary_muscles || []) {
    rows.push({ user_id: userId, workout_log_id: logId, muscle_name: m, coverage_type: 'secondary', coverage_date: dateKey });
  }
  for (const m of exercise.stabilizer_muscles || []) {
    rows.push({ user_id: userId, workout_log_id: logId, muscle_name: m, coverage_type: 'stabilizer', coverage_date: dateKey });
  }
  return rows;
}

export function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.trim().length <= 254;
}
