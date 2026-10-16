import { getSql } from '../api/_lib/db.mjs';
import { hashPassword } from '../api/_lib/auth.mjs';

const username = (process.env.ADMIN_INITIAL_USERNAME || 'admin').trim();
const password = process.env.ADMIN_INITIAL_PASSWORD;
const suppliedHash = process.env.ADMIN_INITIAL_PASSWORD_HASH;

if (!/^[A-Za-z0-9._-]{1,64}$/.test(username)) {
  throw new Error('ADMIN_INITIAL_USERNAME must contain only letters, numbers, dot, underscore, or hyphen.');
}
if (!password && !suppliedHash) {
  throw new Error('Set ADMIN_INITIAL_PASSWORD in a protected environment before provisioning.');
}
if (password && password.length < 12) {
  throw new Error('ADMIN_INITIAL_PASSWORD must be at least 12 characters.');
}

const passwordHash = suppliedHash || await hashPassword(password);
const sql = await getSql();
const inserted = await sql`insert into admin_accounts (username, password_hash, role)
  values (${username}, ${passwordHash}, 'super_admin')
  on conflict (lower(username)) do nothing
  returning id`;

if (!inserted.length) {
  throw new Error('Admin account already exists; refusing to overwrite it.');
}
console.log('Admin account provisioned.');
