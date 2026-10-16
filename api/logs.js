import { getSql } from './_lib/db.mjs';
import { json, method, query, readBody } from './_lib/http.mjs';
import { requireUser } from './_lib/auth.mjs';
import { coverageRowsFor } from './_lib/data.mjs';

// GET ?from=YYYY-MM-DD&to=YYYY-MM-DD&limit= -> own logs (exercise fields joined)
// POST { muscle, rank, weight, reps, workoutDay, workoutDate, sessionSeq, exerciseName } -> creates ONE set log + coverage rows
export default async function handler(req, res) {
  try {
    const user = await requireUser(req);
    if (!user) return json(res, 401, { error: 'Session expired. Please log in again.' });
    const sql = await getSql();

    if (req.method === 'GET') {
      const q = query(req);
      const from = q.get('from');
      const to = q.get('to');
      const limit = Math.min(2000, Math.max(1, Number(q.get('limit')) || 500));
      const cols = `l.*, e.muscle as ex_muscle, e.rank as ex_rank, e.exercise_name as ex_name,
        e.equipment as ex_equipment, e.day as ex_day, s.session_no as session_no`;
      let rows;
      if (from && to) {
        rows = await sql.query(
          `select ${cols} from workout_logs l
          join exercises e on e.id = l.exercise_id
          left join workout_sessions s on s.id = l.session_id
          where l.user_id = $1 and l.workout_date >= $2 and l.workout_date <= $3
          order by l.performed_at desc limit $4`,
          [user.id, from, to, limit]
        );
      } else {
        const since = new Date(Date.now() - 90 * 864e5).toISOString();
        rows = await sql.query(
          `select ${cols} from workout_logs l
          join exercises e on e.id = l.exercise_id
          left join workout_sessions s on s.id = l.session_id
          where l.user_id = $1 and l.performed_at >= $2
          order by l.performed_at desc limit $3`,
          [user.id, since, limit]
        );
      }
      return json(res, 200, { logs: rows });
    }
    if (!method(req, res, ['POST'])) return;
    const b = await readBody(req);
    const { muscle, rank, weight, reps, workoutDay, workoutDate, sessionSeq } = b;
    if (typeof muscle !== 'string' || !['good', 'better', 'best'].includes(rank)) {
      return json(res, 400, { error: 'Muscle and valid rank are required.' });
    }
    const w = Number(weight);
    const r = Number(reps);
    if (!(w >= 0) || !(r >= 1)) return json(res, 400, { error: 'Enter a valid weight and at least 1 rep.' });
    if (typeof workoutDay !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(workoutDate || '')) {
      return json(res, 400, { error: 'Workout day and date are required.' });
    }
    const seq = Math.max(1, Number(sessionSeq) || 1);
    const ex = await sql`select * from exercises where muscle = ${muscle} and rank = ${rank} limit 1`;
    if (!ex.length) return json(res, 404, { error: 'Exercise not found.' });
    const dayRow = await sql`select id from workout_days where user_id = ${user.id} and day_of_week = ${workoutDay} limit 1`;
    // ensure session row for (date, split, day, seq)
    const splitRows = await sql`select active_split_id from user_preferences where user_id = ${user.id} limit 1`;
    const splitId = splitRows[0]?.active_split_id || null;
    let splitName = '';
    if (splitId) {
      const s = await sql`select name from workout_splits where id = ${splitId} and (is_preset = true or user_id = ${user.id}) limit 1`;
      splitName = s[0]?.name || '';
    }
    let session = await sql`select id, status from workout_sessions where user_id = ${user.id}
      and date = ${workoutDate} and coalesce(split_id, '') = coalesce(${splitId}, '')
      and workout_day = ${workoutDay} and session_no = ${seq} limit 1`;
    let sessionId = session[0]?.id || null;
    if (!sessionId) {
      const ins = await sql`insert into workout_sessions (user_id, date, split_id, split_name, workout_day, session_no, status, started_at)
        values (${user.id}, ${workoutDate}, ${splitId}, ${splitName}, ${workoutDay}, ${seq}, 'in_progress', now())
        returning id`;
      sessionId = ins[0].id;
    }
    const setNo = await sql`select coalesce(max(set_number), 0) + 1 as n from workout_logs
      where user_id = ${user.id} and session_id = ${sessionId} and exercise_id = ${ex[0].id}`;
    const ins = await sql`insert into workout_logs (user_id, exercise_id, workout_day_id, performed_at,
        reps_completed, weight, completed, sets_completed, workout_date, workout_day,
        session_id, set_number, split_id, split_name)
      values (${user.id}, ${ex[0].id}, ${dayRow[0]?.id || null}, now(), ${r}, ${w}, true, 1,
        ${workoutDate}, ${workoutDay}, ${sessionId}, ${(setNo[0]?.n) || 1}, ${splitId}, ${splitName})
      returning id, performed_at`;
    const cov = coverageRowsFor(ex[0], user.id, ins[0].id, workoutDate);
    for (const row of cov) {
      await sql`insert into muscle_coverage (user_id, workout_log_id, muscle_name, coverage_type, coverage_date)
        values (${row.user_id}, ${row.workout_log_id}, ${row.muscle_name}, ${row.coverage_type}, ${row.coverage_date})`;
    }
    return json(res, 201, {
      log: {
        id: ins[0].id, muscle, rank, exerciseName: ex[0].exercise_name, equipment: ex[0].equipment,
        weight: w, reps: r, performedAt: ins[0].performed_at, day: workoutDay,
        workoutDay, workoutDate, sessionSeq: seq, sessionId, splitId, splitName, completed: true
      }
    });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Workout log request failed.' });
  }
}
