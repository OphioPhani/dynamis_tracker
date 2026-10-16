import { getSql } from './_lib/db.mjs';
import { json, method } from './_lib/http.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  if (!process.env.DATABASE_URL) {
    return json(res, 503, { error: 'Backend not configured.' });
  }
  try {
    const sql = await getSql();
    // Live connectivity probe. Returns only a safe status — never credentials.
    if (typeof sql.query === 'function') await sql.query('SELECT current_database(), current_user');
    else await sql`SELECT current_database(), current_user`;
    return json(res, 200, { ok: true });
  } catch (e) {
    return json(res, e.status || 503, { error: e.status ? e.message : 'Database unavailable.' });
  }
}
