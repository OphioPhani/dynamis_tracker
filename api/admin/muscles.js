import { getSql } from '../_lib/db.mjs';
import { json, method, query } from '../_lib/http.mjs';
import { adminUser, safeError } from '../_lib/admin.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  const admin = await adminUser(req, res);
  if (!admin) return;
  try {
    const q = query(req);
    const from = /^\d{4}-\d{2}-\d{2}$/.test(q.get('from') || '') ? q.get('from') : null;
    const to = /^\d{4}-\d{2}-\d{2}$/.test(q.get('to') || '') ? q.get('to') : null;
    const sql = await getSql();
    const rows = await sql.query(`
      select mc.muscle_name, count(*)::int as coverage_count,
        count(distinct mc.user_id)::int as users_covered
      from muscle_coverage mc
      where ($1::date is null or mc.coverage_date >= $1::date)
        and ($2::date is null or mc.coverage_date <= $2::date)
      group by mc.muscle_name order by coverage_count desc limit 100`, [from, to]);
    return json(res, 200, { muscles: rows });
  } catch (e) { return safeError(res, e, 'Could not load muscle analytics.'); }
}
