import { randomUUID } from 'node:crypto';
import { getSql } from './db.mjs';
import { verifyAdminSession } from './auth.mjs';
import { json, query } from './http.mjs';

export async function adminUser(req, res, roles) {
  const user = await verifyAdminSession(req);
  if (!user) {
    json(res, 403, { error: 'Administrator access required.' });
    return null;
  }
  return user;
}

export function pageParams(req) {
  const q = query(req);
  const page = Math.max(1, Math.min(10000, Number.parseInt(q.get('page') || '1', 10) || 1));
  const limit = Math.max(1, Math.min(100, Number.parseInt(q.get('limit') || '25', 10) || 25));
  return { q, page, limit, offset: (page - 1) * limit };
}

export function isUuid(value) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function audit(adminUserId, action, targetType, targetId, metadata = {}, success = true, requestId = randomUUID()) {
  const sql = await getSql();
  const adminId = adminUserId?.id || null;
  const identity = adminUserId?.adminUsername || null;
  await sql`insert into admin_audit_logs
    (admin_user_id, admin_identity, action, target_type, target_id, success, metadata, request_id)
    values (${adminId}, ${identity}, ${action}, ${targetType}, ${targetId || null}, ${success}, ${JSON.stringify(metadata)}::jsonb, ${requestId})`;
  return requestId;
}

export function safeError(res, error, fallback = 'Admin request failed.') {
  return json(res, error?.status || 500, { error: error?.status ? error.message : fallback });
}
