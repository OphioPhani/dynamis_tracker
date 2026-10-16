import { getSql } from '../_lib/db.mjs';
import { json, method, readBody } from '../_lib/http.mjs';
import { requireUser } from '../_lib/auth.mjs';

// PATCH /api/logs/:id { weight?, reps? } | DELETE /api/logs/:id — own rows only.
export default async function handler(req, res) {
  try {
    const user = await requireUser(req);
    if (!user) return json(res, 401, { error: 'Session expired. Please log in again.' });
    const id = decodeURIComponent((req.url || '').split('?')[0].split('/').pop());
    const sql = await getSql();
    const own = await sql`select id from workout_logs where id = ${id} and user_id = ${user.id} limit 1`;
    if (!own.length) return json(res, 404, { error: 'Log not found.' });
    if (req.method === 'DELETE') {
      await sql`delete from workout_logs where id = ${id} and user_id = ${user.id}`;
      return json(res, 200, { ok: true });
    }
    if (!method(req, res, ['PATCH'])) return;
    const { weight, reps } = await readBody(req);
    const patch = {};
    if (weight !== undefined) {
      if (!(Number(weight) >= 0)) return json(res, 400, { error: 'Invalid weight.' });
      patch.weight = Number(weight);
    }
    if (reps !== undefined) {
      if (!(Number(reps) >= 0)) return json(res, 400, { error: 'Invalid reps.' });
      patch.reps_completed = Number(reps);
    }
    if (!Object.keys(patch).length) return json(res, 400, { error: 'Nothing to update.' });
    if (patch.weight !== undefined) await sql`update workout_logs set weight = ${patch.weight} where id = ${id} and user_id = ${user.id}`;
    if (patch.reps_completed !== undefined) await sql`update workout_logs set reps_completed = ${patch.reps_completed} where id = ${id} and user_id = ${user.id}`;
    return json(res, 200, { ok: true });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Log request failed.' });
  }
}
