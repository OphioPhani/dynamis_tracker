import { getSql } from '../_lib/db.mjs';
import { json, method, readBody } from '../_lib/http.mjs';
import { requireUser } from '../_lib/auth.mjs';

// PUT /api/splits/:id — update own CUSTOM splits only.
// Global presets (incl. immutable Snake's Split) can never be modified here.
export default async function handler(req, res) {
  if (!method(req, res, ['PUT'])) return;
  try {
    const user = await requireUser(req);
    if (!user) return json(res, 401, { error: 'Session expired. Please log in again.' });
    const id = decodeURIComponent((req.url || '').split('?')[0].split('/').pop());
    const sql = await getSql();
    const own = await sql`select id from workout_splits
      where id = ${id} and user_id = ${user.id} and is_preset = false and is_immutable = false limit 1`;
    if (!own.length) return json(res, 404, { error: 'Custom split not found.' });
    const { name, days } = await readBody(req);
    if (typeof name === 'string' && name.trim() && name.trim().length <= 80) {
      await sql`update workout_splits set name = ${name.trim()} where id = ${id}`;
    }
    if (Array.isArray(days) && days.length && days.length <= 7) {
      await sql`delete from split_days where split_id = ${id}`;
      let i = 0;
      for (const d of days) {
        const dd = await sql`insert into split_days (split_id, day_of_week, name, is_rest_day, order_index)
          values (${id}, ${d.dayOfWeek}, ${String(d.name || '').slice(0, 80)}, ${!!d.isRestDay}, ${i++})
          returning id`;
        if (!d.isRestDay && Array.isArray(d.muscles)) {
          for (const t of d.muscles.slice(0, 45)) {
            if (typeof t.muscle !== 'string') continue;
            await sql`insert into split_muscle_targets (split_day_id, muscle_name, priority)
              values (${dd[0].id}, ${t.muscle.slice(0, 80)}, ${Number(t.priority) || 1})
              on conflict (split_day_id, muscle_name) do update set priority = excluded.priority`;
          }
        }
      }
    }
    return json(res, 200, { ok: true });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Update failed.' });
  }
}
