import { getSql } from '../_lib/db.mjs';
import { json, method } from '../_lib/http.mjs';
import { adminUser, safeError } from '../_lib/admin.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  const admin = await adminUser(req, res);
  if (!admin) return;
  try {
    const sql = await getSql();
    const [stats] = await sql`
      select
        (select count(*)::int from users) as total_users,
        (select count(*)::int from users where created_at >= now() - interval '7 days') as new_users_7d,
        (select count(*)::int from users where created_at >= now() - interval '30 days') as new_users_30d,
        (select count(distinct user_id)::int from workout_logs where performed_at >= now() - interval '7 days') as active_users_7d,
        (select count(distinct user_id)::int from workout_logs where performed_at >= now() - interval '30 days') as active_users_30d,
        (select count(*)::int from workout_logs) as total_logs,
        (select count(*)::int from workout_logs where performed_at >= current_date) as logs_today,
        (select count(*)::int from workout_logs where performed_at >= now() - interval '7 days') as logs_7d`;
    const recentUsers = await sql`
      select u.id, p.display_name, u.email, u.role, u.status, u.created_at
      from users u left join profiles p on p.id = u.id
      order by u.created_at desc limit 8`;
    const recentWorkouts = await sql`
      select l.id, l.user_id, coalesce(p.display_name, u.email) as display_name,
        l.workout_date, l.workout_day, e.exercise_name, l.reps_completed, l.weight, l.performed_at
      from workout_logs l join users u on u.id = l.user_id
      left join profiles p on p.id = l.user_id join exercises e on e.id = l.exercise_id
      order by l.performed_at desc limit 8`;
    const trend = await sql`
      select to_char(day, 'YYYY-MM-DD') as date, count(l.id)::int as logs
      from generate_series(current_date - interval '13 days', current_date, interval '1 day') day
      left join workout_logs l on l.workout_date = day::date
      group by day order by day`;
    return json(res, 200, { stats, recentUsers, recentWorkouts, trend });
  } catch (e) { return safeError(res, e, 'Could not load dashboard.'); }
}
