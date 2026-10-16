import { getSql } from './_lib/db.mjs';
import { json, method } from './_lib/http.mjs';
import { requireUser, dropSession } from './_lib/auth.mjs';

// DELETE /api/account — permanently deletes the authenticated user's auth
// account, profile, workout data, splits, preferences and sessions.
// Cascading foreign keys remove all user-owned rows; the client then wipes
// local caches and redirects to login.
export default async function handler(req, res) {
  if (!method(req, res, ['DELETE'])) return;
  try {
    const user = await requireUser(req);
    if (!user) return json(res, 401, { error: 'Session expired. Please log in again.' });
    const sql = await getSql();
    await sql`delete from users where id = ${user.id}`;
    dropSession(res);
    return json(res, 200, { deleted: true });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Account deletion failed.' });
  }
}
