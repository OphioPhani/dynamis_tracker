import { getSql } from '../_lib/db.mjs';
import { json, method, readBody } from '../_lib/http.mjs';
import { hashPassword, sha256hex } from '../_lib/auth.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['POST'])) return;
  try {
    const { token, password } = await readBody(req);
    if (typeof token !== 'string' || !token || typeof password !== 'string' || password.length < 6) {
      return json(res, 400, { error: 'A valid token and a 6+ character password are required.' });
    }
    const sql = await getSql();
    const token_hash = await sha256hex(token);
    const rows = await sql`select id, user_id, expires_at, used_at from password_resets
      where token_hash = ${token_hash} limit 1`;
    const row = rows[0];
    if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) {
      return json(res, 400, { error: 'This reset link is invalid or has expired.' });
    }
    await sql`update users set password_hash = ${await hashPassword(password)} where id = ${row.user_id}`;
    await sql`update password_resets set used_at = now() where id = ${row.id}`;
    await sql`delete from password_resets where user_id = ${row.user_id} and used_at is null`;
    return json(res, 200, { ok: true });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Reset failed. Try again.' });
  }
}
