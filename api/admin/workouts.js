import { getSql } from '../_lib/db.mjs';
import { json, method } from '../_lib/http.mjs';
import { adminUser, pageParams, safeError } from '../_lib/admin.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  const admin = await adminUser(req, res);
  if (!admin) return;
  try {
    const sql = await getSql();
    const { q, page, limit, offset } = pageParams(req);
    const from = q.get('from') || null; const to = q.get('to') || null; const userId = q.get('userId') || null;
    const filters = []; const params = [];
    if (from && /^\d{4}-\d{2}-\d{2}$/.test(from)) { params.push(from); filters.push(`l.workout_date >= $${params.length}`); }
    if (to && /^\d{4}-\d{2}-\d{2}$/.test(to)) { params.push(to); filters.push(`l.workout_date <= $${params.length}`); }
    if (userId) { params.push(userId); filters.push(`l.user_id = $${params.length}`); }
    const where = filters.length ? `where ${filters.join(' and ')}` : '';
    const count = await sql.query(`select count(*)::int as total from workout_logs l ${where}`, params);
    params.push(limit, offset);
    const rows = await sql.query(`
      select l.id, l.user_id, coalesce(p.display_name, u.email) as display_name,
        l.workout_date, l.workout_day, l.reps_completed, l.weight, l.duration_seconds,
        l.completed, l.performed_at, e.exercise_name, e.muscle, l.split_name
      from workout_logs l join users u on u.id = l.user_id
      left join profiles p on p.id = l.user_id join exercises e on e.id = l.exercise_id
      ${where} order by l.performed_at desc limit $${params.length - 1} offset $${params.length}`, params);
    return json(res, 200, { workouts: rows, page, limit, total: count[0]?.total || 0 });
  } catch (e) { return safeError(res, e, 'Could not load workouts.'); }
}
