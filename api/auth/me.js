import { json, method } from '../_lib/http.mjs';
import { requireUser } from '../_lib/auth.mjs';
import { getSql } from '../_lib/db.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  try {
    const user = await requireUser(req);
    if (!user) return json(res, 401, { error: 'Session expired. Please log in again.' });
    const sql = await getSql();
    const prof = await sql`select display_name from profiles where id = ${user.id} limit 1`;
    return json(res, 200, { user: { id: user.id, email: user.email, role: user.role, displayName: prof[0]?.display_name || null } });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Could not load session.' });
  }
}
