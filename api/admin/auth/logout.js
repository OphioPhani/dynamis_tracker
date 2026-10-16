import { revokeAdminSession } from '../../_lib/auth.mjs';
import { json, method } from '../../_lib/http.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['POST'])) return;
  try {
    await revokeAdminSession(req, res);
    return json(res, 200, { authenticated: false });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Admin logout failed.' });
  }
}
