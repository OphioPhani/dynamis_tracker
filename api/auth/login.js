import { getSql } from '../_lib/db.mjs';
import { json, method, readBody } from '../_lib/http.mjs';
import { checkPassword, issueSession } from '../_lib/auth.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['POST'])) return;
  try {
    const { email, password } = await readBody(req);
    if (typeof email !== 'string' || typeof password !== 'string') {
      return json(res, 400, { error: 'Email and password are required.' });
    }
    const sql = await getSql();
    const rows = await sql`select id, email, password_hash, role, status from users where lower(email) = ${email.trim().toLowerCase()} limit 1`;
    // Generic message: never reveal whether the email exists.
    if (!rows.length || !(await checkPassword(password, rows[0].password_hash))) {
      return json(res, 401, { error: 'Invalid email or password.' });
    }
    if (rows[0].status !== 'active') return json(res, 403, { error: 'This account is suspended. Contact an administrator.' });
    issueSession(res, req, rows[0].id);
    return json(res, 200, { user: { id: rows[0].id, email: rows[0].email, role: rows[0].role } });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Login failed. Try again.' });
  }
}
