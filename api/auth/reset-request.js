import { getSql } from '../_lib/db.mjs';
import { json, method, readBody } from '../_lib/http.mjs';
import { newResetToken, sha256hex } from '../_lib/auth.mjs';
import { isValidEmail } from '../_lib/data.mjs';

// Issues a single-use 1-hour reset token. Without an SMTP service the token
// cannot be emailed; in development (ALLOW_DEV_RESET=true) it is returned so
// the flow stays testable. Production without SMTP gets a clear 501.
export default async function handler(req, res) {
  if (!method(req, res, ['POST'])) return;
  try {
    const { email } = await readBody(req);
    // Always respond generically to avoid email enumeration.
    const done = (extra = {}) => json(res, 200, { ok: true, ...extra });
    if (!isValidEmail(email)) return done();
    const sql = await getSql();
    const rows = await sql`select id from users where lower(email) = ${email.trim().toLowerCase()} limit 1`;
    if (!rows.length) return done();
    const token = newResetToken();
    const token_hash = await sha256hex(token);
    const expires = new Date(Date.now() + 3600000).toISOString();
    await sql`insert into password_resets (user_id, token_hash, expires_at) values (${rows[0].id}, ${token_hash}, ${expires})`;
    if (process.env.ALLOW_DEV_RESET === 'true') return done({ resetToken: token });
    return done();
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Request failed. Try again.' });
  }
}
