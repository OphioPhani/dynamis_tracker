import { getSql } from '../_lib/db.mjs';
import { json, method, readBody } from '../_lib/http.mjs';
import { hashPassword, issueSession } from '../_lib/auth.mjs';
import { isValidEmail } from '../_lib/data.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['POST'])) return;
  try {
    const { email, password, displayName } = await readBody(req);
    if (!isValidEmail(email)) return json(res, 400, { error: 'Enter a valid email address.' });
    if (typeof password !== 'string' || password.length < 6) {
      return json(res, 400, { error: 'Password must be at least 6 characters.' });
    }
    const sql = await getSql();
    const clean = email.trim().toLowerCase();
    const existing = await sql`select id from users where lower(email) = ${clean} limit 1`;
    if (existing.length) return json(res, 409, { error: 'An account with this email already exists.' });
    const password_hash = await hashPassword(password);
    const [user] = await sql`insert into users (email, password_hash) values (${email.trim()}, ${password_hash}) returning id, email`;
    const name = typeof displayName === 'string' && displayName.trim()
      ? displayName.trim().slice(0, 60)
      : clean.split('@')[0];
    await sql`insert into profiles (id, email, display_name) values (${user.id}, ${user.email}, ${name})
      on conflict (id) do update set email = excluded.email`;
    issueSession(res, req, user.id);
    return json(res, 201, { user: { id: user.id, email: user.email } });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Sign up failed. Try again.' });
  }
}
