import { getSql } from '../_lib/db.mjs';
import { json, method } from '../_lib/http.mjs';
import { adminUser, pageParams, safeError } from '../_lib/admin.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  const admin = await adminUser(req, res, ['super_admin']);
  if (!admin) return;
  try {
    const sql = await getSql(); const { page, limit, offset } = pageParams(req);
    const count = await sql`select count(*)::int as total from admin_audit_logs`;
    const rows = await sql`
      select a.id, a.action, a.target_type, a.target_id, a.success, a.metadata, a.request_id, a.created_at,
        coalesce(a.admin_identity, p.display_name, u.email) as admin_name
      from admin_audit_logs a left join users u on u.id = a.admin_user_id
      left join profiles p on p.id = a.admin_user_id
      order by a.created_at desc limit ${limit} offset ${offset}`;
    return json(res, 200, { logs: rows, page, limit, total: count[0]?.total || 0 });
  } catch (e) { return safeError(res, e, 'Could not load audit logs.'); }
}
