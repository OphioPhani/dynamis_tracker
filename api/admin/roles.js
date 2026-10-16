import { getSql } from '../_lib/db.mjs';
import { json, method, readBody } from '../_lib/http.mjs';
import { adminUser, audit, isUuid, safeError } from '../_lib/admin.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['PATCH'])) return;
  const admin = await adminUser(req, res, ['super_admin']);
  if (!admin) return;
  try {
    const { userId, role } = await readBody(req);
    if (!isUuid(userId) || !['user', 'admin', 'super_admin'].includes(role)) return json(res, 400, { error: 'Valid userId and role are required.' });
    if (userId === admin.id) return json(res, 400, { error: 'Use an out-of-band recovery process to change your own role.' });
    const sql = await getSql();
    const target = await sql`select role from users where id = ${userId}`;
    if (!target.length) return json(res, 404, { error: 'User not found.' });
    if (target[0].role === 'super_admin' && role !== 'super_admin') {
      const count = await sql`select count(*)::int as n from users where role = 'super_admin' and status = 'active'`;
      if ((count[0]?.n || 0) <= 1) return json(res, 409, { error: 'The last active super-admin cannot be demoted.' });
    }
    await sql`update users set role = ${role} where id = ${userId}`;
    await audit(admin.id, 'change_role', 'user', userId, { from: target[0].role, to: role });
    return json(res, 200, { role });
  } catch (e) { return safeError(res, e, 'Could not change role.'); }
}
