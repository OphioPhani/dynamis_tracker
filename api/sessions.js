import { getSql } from './_lib/db.mjs';
import { json, method, readBody } from './_lib/http.mjs';
import { requireUser } from './_lib/auth.mjs';

// PATCH { workoutDate, workoutDay, sessionSeq, splitId?, status } — upserts the
// session row for the key and sets its status (planned/in_progress/completed).
// History is never rewritten: a new session_no creates a new row instead.
export default async function handler(req, res) {
  if (!method(req, res, ['PATCH'])) return;
  try {
    const user = await requireUser(req);
    if (!user) return json(res, 401, { error: 'Session expired. Please log in again.' });
    const { workoutDate, workoutDay, sessionSeq, splitId, status } = await readBody(req);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(workoutDate || '') || typeof workoutDay !== 'string') {
      return json(res, 400, { error: 'Workout date and day are required.' });
    }
    if (!['planned', 'in_progress', 'completed'].includes(status)) {
      return json(res, 400, { error: 'Invalid status.' });
    }
    const seq = Math.max(1, Number(sessionSeq) || 1);
    const sql = await getSql();
    let name = '';
    if (splitId) {
      const s = await sql`select name from workout_splits where id = ${splitId} and (is_preset = true or user_id = ${user.id}) limit 1`;
      name = s[0]?.name || '';
    }
    const existing = await sql`select id from workout_sessions where user_id = ${user.id}
      and date = ${workoutDate} and coalesce(split_id, '') = coalesce(${splitId || null}, '')
      and workout_day = ${workoutDay} and session_no = ${seq} limit 1`;
    if (existing.length) {
      if (status === 'completed') {
        await sql`update workout_sessions set status = ${status}, completed_at = now(), updated_at = now() where id = ${existing[0].id}`;
      } else {
        await sql`update workout_sessions set status = ${status}, updated_at = now() where id = ${existing[0].id}`;
      }
      const row = await sql`select id, status from workout_sessions where id = ${existing[0].id} limit 1`;
      return json(res, 200, { session: row[0] });
    }
    const ins = await sql`insert into workout_sessions (user_id, date, split_id, split_name, workout_day, session_no, status, started_at)
      values (${user.id}, ${workoutDate}, ${splitId || null}, ${name}, ${workoutDay}, ${seq}, ${status}, now())
      returning id, status`;
    return json(res, 200, { session: ins[0] });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Session update failed.' });
  }
}
