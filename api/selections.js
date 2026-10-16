import { getSql } from './_lib/db.mjs';
import { json, method, readBody } from './_lib/http.mjs';
import { requireUser } from './_lib/auth.mjs';

// GET -> [{ muscle, rank }] (user's per-muscle exercise choices)
// POST { muscle, rank } -> toggles/sets the choice (mirrors client behavior)
export default async function handler(req, res) {
  try {
    const user = await requireUser(req);
    if (!user) return json(res, 401, { error: 'Session expired. Please log in again.' });
    const sql = await getSql();
    if (req.method === 'GET') {
      const rows = await sql`select e.muscle, e.rank from workout_exercises w
        join exercises e on e.id = w.exercise_id where w.user_id = ${user.id}`;
      return json(res, 200, { selections: rows });
    }
    if (!method(req, res, ['POST'])) return;
    const { muscle, rank } = await readBody(req);
    if (typeof muscle !== 'string' || !['good', 'better', 'best'].includes(rank)) {
      return json(res, 400, { error: 'Muscle and valid rank are required.' });
    }
    const current = await sql`select e.muscle, e.rank, w.id from workout_exercises w
      join exercises e on e.id = w.exercise_id
      where w.user_id = ${user.id} and e.muscle = ${muscle}`;
    if (current.length && current[0].rank === rank) {
      await sql`delete from workout_exercises where user_id = ${user.id} and id = ${current[0].id}`;
      return json(res, 200, { selections: (await sql`select e.muscle, e.rank from workout_exercises w join exercises e on e.id = w.exercise_id where w.user_id = ${user.id}`) });
    }
    const ids = await sql`select id from exercises where muscle = ${muscle}`;
    if (ids.length) {
      await sql`delete from workout_exercises where user_id = ${user.id} and exercise_id in ${sql(ids.map((r) => r.id))}`;
    }
    const target = await sql`select id, rank from exercises where muscle = ${muscle} and rank = ${rank} limit 1`;
    if (!target.length) return json(res, 404, { error: 'Exercise not found.' });
    const dayRow = await sql`select day from exercises where id = ${target[0].id} limit 1`;
    const dayId = await sql`select id from workout_days where user_id = ${user.id} and day_of_week = ${dayRow[0]?.day || 'Monday'} limit 1`;
    if (!dayId.length) return json(res, 400, { error: 'Workout day not found.' });
    await sql`insert into workout_exercises (user_id, workout_day_id, exercise_id)
      values (${user.id}, ${dayId[0].id}, ${target[0].id})
      on conflict (user_id, exercise_id) do nothing`;
    const rows = await sql`select e.muscle, e.rank from workout_exercises w
      join exercises e on e.id = w.exercise_id where w.user_id = ${user.id}`;
    return json(res, 200, { selections: rows });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Selection request failed.' });
  }
}
