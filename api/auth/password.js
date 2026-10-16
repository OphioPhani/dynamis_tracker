import { getSql } from '../_lib/db.mjs';
import { json, method, readBody } from '../_lib/http.mjs';
import { requireUser, checkPassword, hashPassword } from '../_lib/auth.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['POST'])) return;
  try {
    const user = await requireUser(req);
    if (!user) return json(res, 401, { error: 'Session expired. Please log in again.' });
    const { currentPassword, newPassword } = await readBody(req);
    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return json(res, 400, { error: 'New password must be at least 6 characters.' });
    }
    const sql = await getSql();
    const rows = await sql`select password_hash from users where id = ${user.id} limit 1`;
    if (!rows.length || !(await checkPassword(currentPassword || '', rows[0].password_hash))) {
      return json(res, 401, { error: 'Current password is incorrect.' });
    }
    await sql`update users set password_hash = ${await hashPassword(newPassword)} where id = ${user.id}`;
    return json(res, 200, { ok: true });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Update failed. Try again.' });
  }
}
