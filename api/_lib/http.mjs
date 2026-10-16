// Minimal connect-style HTTP helpers (work in Vercel functions and Vite dev).

export function parseCookies(req) {
  const out = {};
  const header = req.headers?.cookie || '';
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function setCookie(res, name, value, opts = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push('Path=/');
  parts.push(`Max-Age=${opts.maxAge ?? 30 * 24 * 3600}`);
  if (opts.httpOnly !== false) parts.push('HttpOnly');
  parts.push(`SameSite=${opts.sameSite || 'Lax'}`);
  if (opts.secure) parts.push('Secure');
  const prev = res.getHeader?.('Set-Cookie');
  const list = Array.isArray(prev) ? prev : prev ? [prev] : [];
  list.push(parts.join('; '));
  res.setHeader('Set-Cookie', list);
}

export function clearCookie(res, name) {
  setCookie(res, name, '', { maxAge: 0 });
}

export async function readBody(req) {
  // Vercel pre-parses JSON bodies; raw Node streams need manual parsing.
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string' && req.body) {
      try { return JSON.parse(req.body); } catch { return {}; }
    }
  }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const text = Buffer.concat(chunks).toString('utf8');
  if (!text) return {};
  try { return JSON.parse(text); } catch { return {}; }
}

export function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

export function method(req, res, allowed) {
  if (!allowed.includes(req.method)) {
    res.writeHead(405, { 'Content-Type': 'application/json', Allow: allowed.join(', ') });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return false;
  }
  return true;
}

export function query(req) {
  const url = req.url || '/';
  const i = url.indexOf('?');
  return new URLSearchParams(i >= 0 ? url.slice(i + 1) : '');
}

export function isSecure(req) {
  const proto = req.headers?.['x-forwarded-proto'];
  if (proto) return String(proto).split(',')[0].trim() === 'https';
  return process.env.NODE_ENV === 'production';
}
