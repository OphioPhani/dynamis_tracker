import { getSql } from './_lib/db.mjs';
import { json, method, readBody } from './_lib/http.mjs';
import { requireUser } from './_lib/auth.mjs';

// GET -> { profile } | PATCH { displayName } -> { profile }
export default async function handler(req, res) {
  try {
    const user = await requireUser(req);
    if (!user) return json(res, 401, { error: 'Session expired. Please log in again.' });
    const sql = await getSql();
    if (req.method === 'GET') {
      const rows = await sql`select id, email, display_name, avatar_url from profiles where id = ${user.id} limit 1`;
      if (!rows.length) return json(res, 404, { error: 'Profile not found.' });
      return json(res, 200, { profile: rows[0] });
    }
    if (!method(req, res, ['PATCH'])) return;
    const { displayName } = await readBody(req);
    if (typeof displayName !== 'string' || !displayName.trim() || displayName.trim().length > 60) {
      return json(res, 400, { error: 'Display name must be 1–60 characters.' });
    }
    const rows = await sql`update profiles set display_name = ${displayName.trim()}, updated_at = now()
      where id = ${user.id} returning id, email, display_name, avatar_url`;
    return json(res, 200, { profile: rows[0] });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Profile request failed.' });
  }
}
