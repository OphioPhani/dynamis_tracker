import { getSql } from '../_lib/db.mjs';
import { json, method } from '../_lib/http.mjs';
import { adminUser, audit, pageParams, safeError } from '../_lib/admin.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  const admin = await adminUser(req, res);
  if (!admin) return;
  try {
    const sql = await getSql();
    const { q, page, limit, offset } = pageParams(req);
    const search = (q.get('search') || '').trim().slice(0, 100);
    const role = ['user', 'admin', 'super_admin'].includes(q.get('role')) ? q.get('role') : null;
    const status = ['active', 'suspended'].includes(q.get('status')) ? q.get('status') : null;
    const sortMap = { created: 'u.created_at', activity: 'last_activity', workouts: 'workout_count', email: 'u.email' };
    const sort = sortMap[q.get('sort')] || 'u.created_at';
    const direction = q.get('direction') === 'asc' ? 'asc' : 'desc';
    const where = [];
    const params = [];
    if (search) { params.push(`%${search}%`); where.push(`(u.email ilike $${params.length} or coalesce(p.display_name, '') ilike $${params.length} or u.id::text ilike $${params.length})`); }
    if (role) { params.push(role); where.push(`u.role = $${params.length}`); }
    if (status) { params.push(status); where.push(`u.status = $${params.length}`); }
    const clause = where.length ? `where ${where.join(' and ')}` : '';
    const countRows = await sql.query(`select count(*)::int as total from users u left join profiles p on p.id = u.id ${clause}`, params);
    params.push(limit, offset);
    const rows = await sql.query(`
      select u.id, u.email, u.role, u.status, u.created_at,
        p.display_name,
        count(l.id)::int as workout_count,
        max(l.performed_at) as last_activity
      from users u left join profiles p on p.id = u.id
      left join workout_logs l on l.user_id = u.id
      ${clause}
      group by u.id, p.display_name
      order by ${sort} ${direction}
      limit $${params.length - 1} offset $${params.length}`, params);
    await audit(admin.id, 'view_users', 'users', null, { page, limit });
    return json(res, 200, { users: rows, page, limit, total: countRows[0]?.total || 0 });
  } catch (e) { return safeError(res, e, 'Could not load users.'); }
}
