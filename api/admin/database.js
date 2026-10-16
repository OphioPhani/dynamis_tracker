import { performance } from 'node:perf_hooks';
import { getSql } from '../_lib/db.mjs';
import { json, method } from '../_lib/http.mjs';
import { adminUser, safeError } from '../_lib/admin.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  const admin = await adminUser(req, res, ['super_admin']);
  if (!admin) return;
  try {
    const started = performance.now();
    const sql = await getSql();
    const identity = await sql`select current_database() as database, current_user as user`;
    const latencyMs = Math.round(performance.now() - started);
    const tables = await sql`
      select schemaname, relname as table_name, n_live_tup::bigint as approximate_rows
      from pg_stat_user_tables where schemaname = 'public' order by relname`;
    return json(res, 200, { ok: true, identity: identity[0], latencyMs, tables });
  } catch (e) { return safeError(res, e, 'Database health check failed.'); }
}
