import { getSql } from '../api/_lib/db.mjs';

const username = (process.env.ADMIN_UNLOCK_USERNAME || 'admin').trim().toLowerCase();
if (!username) throw new Error('Set ADMIN_UNLOCK_USERNAME to the account to unlock.');
const clientKey = process.env.ADMIN_UNLOCK_CLIENT_KEY?.trim();
const prefix = `${username}:`;
const sql = await getSql();
const rows = clientKey
  ? await sql`delete from admin_login_throttle where client_key = ${prefix + clientKey} returning client_key`
  : await sql`delete from admin_login_throttle where client_key like ${prefix + '%'} returning client_key`;
console.log(`Cleared ${rows.length} admin login throttle record(s).`);
