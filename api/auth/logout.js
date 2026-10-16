import { json, method } from '../_lib/http.mjs';
import { dropSession } from '../_lib/auth.mjs';

export default async function handler(req, res) {
  if (!method(req, res, ['POST'])) return;
  dropSession(res);
  return json(res, 200, { ok: true });
}
