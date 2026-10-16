import { getSql } from './_lib/db.mjs';
import { json, method, query } from './_lib/http.mjs';

// Public exercise catalog (reference data). Optional ?muscle= ?rank= filters.
export default async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  try {
    const sql = await getSql();
    const q = query(req);
    const muscle = q.get('muscle');
    const rank = q.get('rank');
    let rows;
    if (muscle && rank) {
      rows = await sql`select * from exercises where muscle = ${muscle} and rank = ${rank}`;
    } else if (muscle) {
      rows = await sql`select * from exercises where muscle = ${muscle}`;
    } else {
      rows = await sql`select * from exercises order by day, muscle, rank`;
    }
    return json(res, 200, { exercises: rows });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Could not load exercises.' });
  }
}
