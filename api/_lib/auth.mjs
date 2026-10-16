// Authentication module (replaceable).
// Current implementation: email + bcrypt password hash in Neon (users table)
// with a signed HS256 JWT in an httpOnly session cookie.
// To adopt Neon Auth (Stack Auth) later, replace requireUser()/issueSession()
// and keep every route's ownership checks unchanged.
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { getSql } from './db.mjs';
import { parseCookies, setCookie, clearCookie, isSecure } from './http.mjs';

const COOKIE = 'dynamis_session';
const ADMIN_COOKIE = 'dynamis_admin_session';

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s) {
    const err = new Error('Backend not configured: set JWT_SECRET on the server.');
    err.status = 503;
    throw err;
  }
  return s;
}

const b64url = (buf) => Buffer.from(buf).toString('base64url');
const unb64url = (s) => Buffer.from(s, 'base64url');

export function signToken(userId, days = 30) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + days * 86400
  }));
  const sig = createHmac('sha256', secret()).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${sig}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  let payload;
  try { payload = JSON.parse(unb64url(p).toString('utf8')); } catch { return null; }
  if (!payload.sub || !payload.exp || payload.exp * 1000 < Date.now()) return null;
  const expect = createHmac('sha256', secret()).update(`${h}.${p}`).digest();
  let actual;
  try { actual = unb64url(s); } catch { return null; }
  if (actual.length !== expect.length) return null;
  if (!timingSafeEqual(actual, expect)) return null;
  return payload.sub;
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function checkPassword(password, hash) {
  try { return await bcrypt.compare(password, hash); } catch { return false; }
}

export function issueSession(res, req, userId) {
  setCookie(res, COOKIE, signToken(userId), { secure: isSecure(req) });
}

export function dropSession(res) {
  clearCookie(res, COOKIE);
}

// Returns { id, email } for the authenticated user, or null.
// The user ID ALWAYS comes from the verified session — never from the body.
export async function requireUser(req) {
  const token = parseCookies(req)[COOKIE];
  const sub = verifyToken(token);
  if (!sub) return null;
  const sql = await getSql();
  const rows = await sql`select id, email, role, status from users where id = ${sub} limit 1`;
  if (!rows.length) return null;
  if (rows[0].status !== 'active') return null;
  return rows[0];
}

export async function requireAdmin(req, roles = ['admin', 'super_admin']) {
  const user = await requireUser(req);
  if (!user || !roles.includes(user.role)) return null;
  return user;
}

function adminSecret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) {
    const err = new Error('Admin authentication is not configured.');
    err.status = 503;
    throw err;
  }
  return value;
}

export function adminConfig() {
  if (!process.env.ADMIN_SESSION_SECRET) {
    const err = new Error('Admin authentication is not configured.');
    err.status = 503;
    throw err;
  }
  return { configured: true };
}

export async function verifyAdminSession(req) {
  const token = parseCookies(req)[ADMIN_COOKIE];
  if (!token || token.length < 32) return null;
  const tokenHash = createHmac('sha256', adminSecret()).update(token).digest('hex');
  const sql = await getSql();
  const rows = await sql`select s.admin_username, a.id, a.role
    from admin_sessions s
    join admin_accounts a on lower(a.username) = lower(s.admin_username)
    where s.token_hash = ${tokenHash} and s.revoked_at is null
      and s.expires_at > now() and a.is_active = true
    limit 1`;
  if (!rows.length) return null;
  return { username: rows[0].admin_username, id: rows[0].id, role: rows[0].role, adminUsername: rows[0].admin_username };
}

export async function issueAdminSession(req, res, username) {
  const token = randomBytes(32).toString('base64url');
  const tokenHash = createHmac('sha256', adminSecret()).update(token).digest('hex');
  const sql = await getSql();
  await sql`insert into admin_sessions (token_hash, admin_username, expires_at)
    values (${tokenHash}, ${username}, now() + interval '8 hours')`;
  setCookie(res, ADMIN_COOKIE, token, { secure: isSecure(req), sameSite: 'Strict', maxAge: 8 * 3600 });
}

export async function revokeAdminSession(req, res) {
  const token = parseCookies(req)[ADMIN_COOKIE];
  if (token) {
    const tokenHash = createHmac('sha256', adminSecret()).update(token).digest('hex');
    const sql = await getSql();
    await sql`update admin_sessions set revoked_at = now() where token_hash = ${tokenHash} and revoked_at is null`;
  }
  clearCookie(res, ADMIN_COOKIE);
}

export function newResetToken() {
  return randomBytes(32).toString('hex');
}

export async function sha256hex(s) {
  return createHash('sha256').update(s).digest('hex');
}
