import { getSql } from '../../../_lib/db.mjs';
import { json, method, readBody } from '../../../_lib/http.mjs';
import { adminUser, audit, isUuid, safeError } from '../../../_lib/admin.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['PATCH'])) return;
  const admin = await adminUser(req, res);
  if (!admin) return;
  const parts = (req.url || '').split('?')[0].split('/').filter(Boolean);
  const id = parts[parts.length - 2];
  if (!isUuid(id)) return json(res, 400, { error: 'Invalid user id.' });
  try {
    const { status } = await readBody(req);
    if (!['active', 'suspended'].includes(status)) return json(res, 400, { error: 'Invalid account status.' });
    if (id === admin.id) return json(res, 400, { error: 'You cannot suspend your own account.' });
    const sql = await getSql();
    const target = await sql`select role, status from users where id = ${id}`;
    if (!target.length) return json(res, 404, { error: 'User not found.' });
    if (target[0].role === 'super_admin') return json(res, 403, { error: 'Super-admin status requires an out-of-band recovery process.' });
    await sql`update users set status = ${status} where id = ${id}`;
    await audit(admin.id, status === 'suspended' ? 'suspend_user' : 'reactivate_user', 'user', id, { status });
    return json(res, 200, { status });
  } catch (e) { return safeError(res, e, 'Could not change account status.'); }
}
