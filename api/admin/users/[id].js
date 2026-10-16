import { getSql } from '../../_lib/db.mjs';
import { json, method, readBody } from '../../_lib/http.mjs';
import { adminUser, audit, isUuid, safeError } from '../../_lib/admin.mjs';

function idFrom(req) {
  const parts = (req.url || '').split('?')[0].split('/').filter(Boolean);
  return parts[parts.length - 1];
}

export default async function handler(req, res) {
  if ((req.url || '').split('?')[0].endsWith('/status')) {
    const { default: statusHandler } = await import('./[id]/status.js');
    return statusHandler(req, res);
  }
  if (!method(req, res, ['GET', 'PATCH', 'DELETE'])) return;
  const admin = await adminUser(req, res, req.method === 'DELETE' ? ['super_admin'] : undefined);
  if (!admin) return;
  const id = idFrom(req);
  if (!isUuid(id)) return json(res, 400, { error: 'Invalid user id.' });
  try {
    const sql = await getSql();
    if (req.method === 'GET') {
      const rows = await sql`
        select u.id, u.email, u.role, u.status, u.created_at, p.display_name, p.avatar_url,
          count(l.id)::int as workout_count, max(l.performed_at) as last_activity
        from users u left join profiles p on p.id = u.id left join workout_logs l on l.user_id = u.id
        where u.id = ${id} group by u.id, p.display_name, p.avatar_url`;
      if (!rows.length) return json(res, 404, { error: 'User not found.' });
      const workouts = await sql`
        select l.id, l.workout_date, l.workout_day, l.reps_completed, l.weight, e.exercise_name, e.muscle
        from workout_logs l join exercises e on e.id = l.exercise_id
        where l.user_id = ${id} order by l.performed_at desc limit 50`;
      return json(res, 200, { user: rows[0], workouts });
    }
    if (req.method === 'DELETE') {
      if (admin.id === id) return json(res, 400, { error: 'You cannot delete your own administrator account.' });
      const target = await sql`select role from users where id = ${id}`;
      if (!target.length) return json(res, 404, { error: 'User not found.' });
      if (target[0].role === 'super_admin') return json(res, 403, { error: 'Super-admin deletion requires an out-of-band recovery process.' });
      await sql`delete from users where id = ${id}`;
      await audit(admin.id, 'delete_user', 'user', id, { role: target[0].role });
      return json(res, 200, { deleted: true });
    }
    const body = await readBody(req);
    if (typeof body.displayName !== 'string' || body.displayName.trim().length > 60) {
      return json(res, 400, { error: 'A display name of 60 characters or fewer is required.' });
    }
    await sql`update profiles set display_name = ${body.displayName.trim()}, updated_at = now() where id = ${id}`;
    await audit(admin.id, 'edit_profile', 'user', id, { fields: ['display_name'] });
    return json(res, 200, { updated: true });
  } catch (e) { return safeError(res, e, 'Could not update user.'); }
}
