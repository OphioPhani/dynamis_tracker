import { getSql } from './_lib/db.mjs';
import { json, method } from './_lib/http.mjs';
import { requireUser } from './_lib/auth.mjs';

// GET -> ensures + lists the 7 workout-day rows for the user.
export default async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  try {
    const user = await requireUser(req);
    if (!user) return json(res, 401, { error: 'Session expired. Please log in again.' });
    const sql = await getSql();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const existing = await sql`select * from workout_days where user_id = ${user.id}`;
    const have = new Set(existing.map((d) => d.day_of_week));
    for (const d of days) {
      if (have.has(d)) continue;
      await sql`insert into workout_days (user_id, day_of_week, name, description)
        values (${user.id}, ${d}, ${d === 'Wednesday' || d === 'Sunday' ? d + ' — REST' : d}, ${''})
        on conflict (user_id, day_of_week) do nothing`;
    }
    const rows = await sql`select * from workout_days where user_id = ${user.id} order by
      case day_of_week when 'Monday' then 1 when 'Tuesday' then 2 when 'Wednesday' then 3
      when 'Thursday' then 4 when 'Friday' then 5 when 'Saturday' then 6 else 7 end`;
    return json(res, 200, { days: rows });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Could not load workout days.' });
  }
}
