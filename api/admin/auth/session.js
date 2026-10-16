import { verifyAdminSession } from '../../_lib/auth.mjs';
import { json, method } from '../../_lib/http.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['GET'])) return;
  try {
    const session = await verifyAdminSession(req);
    return json(res, 200, session
      ? { authenticated: true, username: session.username }
      : { authenticated: false });
  } catch (e) {
    return json(res, e.status || 500, { error: e.status ? e.message : 'Could not verify admin session.' });
  }
}
