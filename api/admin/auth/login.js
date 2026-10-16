import { checkPassword, issueAdminSession } from '../../_lib/auth.mjs';
import { getSql } from '../../_lib/db.mjs';
import { json, method, readBody } from '../../_lib/http.mjs';

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

function clientAddress(req) {
  if (process.env.VERCEL === '1') {
    return String(req.headers?.['x-vercel-forwarded-for'] || req.headers?.['x-forwarded-for'] || 'unknown')
      .split(',')[0].trim();
  }
  return String(req.socket?.remoteAddress || 'unknown').trim();
}

function keyFor(username, req) {
  return `${username.trim().toLowerCase()}:${clientAddress(req)}`;
}

async function consumeFailure(key) {
  const sql = await getSql();
  const rows = await sql`insert into admin_login_throttle
    (client_key, failure_count, window_started_at, locked_until, updated_at)
    values (${key}, 1, now(), null, now())
    on conflict (client_key) do update set
      failure_count = case
        when admin_login_throttle.window_started_at < now() - interval '15 minutes' then 1
        else admin_login_throttle.failure_count + 1 end,
      window_started_at = case
        when admin_login_throttle.window_started_at < now() - interval '15 minutes' then now()
        else admin_login_throttle.window_started_at end,
      locked_until = case
        when (case
          when admin_login_throttle.window_started_at < now() - interval '15 minutes' then 1
          else admin_login_throttle.failure_count + 1 end) >= ${MAX_ATTEMPTS}
        then now() + interval '15 minutes' else null end,
      updated_at = now()
    returning failure_count, locked_until`;
  return rows[0];
}

export default async function handler(req, res) {
  if (!method(req, res, ['POST'])) return;
  try {
    const body = await readBody(req);
    const username = typeof body?.username === 'string' ? body.username.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    if (!username || !password || username.length > 64 || password.length > 1024) {
      return json(res, 401, { error: 'Invalid admin credentials.' });
    }
    const key = keyFor(username, req);
    const sql = await getSql();
    const throttle = await sql`select locked_until from admin_login_throttle
      where client_key = ${key} and locked_until > now() limit 1`;
    if (throttle.length) {
      const retryAfter = Math.max(1, Math.ceil((new Date(throttle[0].locked_until).getTime() - Date.now()) / 1000));
      res.setHeader('Retry-After', String(retryAfter));
      console.warn('Admin login throttled', { username: username.toLowerCase(), retryAfter });
      return json(res, 429, { error: 'Too many login attempts. Try again later.' });
    }
    const accounts = await sql`select id, username, password_hash, is_active from admin_accounts
      where lower(username) = lower(${username}) limit 1`;
    const account = accounts[0];
    const valid = Boolean(account && account.is_active && await checkPassword(password, account.password_hash));
    if (!valid) {
      const result = await consumeFailure(key);
      if (result?.locked_until) {
        const retryAfter = Math.max(1, Math.ceil((new Date(result.locked_until).getTime() - Date.now()) / 1000));
        res.setHeader('Retry-After', String(retryAfter));
        console.warn('Admin login throttled', { username: username.toLowerCase(), retryAfter });
        return json(res, 429, { error: 'Too many login attempts. Try again later.' });
      }
      return json(res, 401, { error: 'Invalid admin credentials.' });
    }
    await sql`delete from admin_login_throttle where client_key = ${key}`;
    await sql`update admin_accounts set last_login_at = now(), updated_at = now() where id = ${account.id}`;
    await issueAdminSession(req, res, account.username);
    return json(res, 200, { authenticated: true, username: account.username });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Admin login failed.' });
  }
}
