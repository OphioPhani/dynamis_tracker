// Shared database client. DATABASE_URL is SERVER-SIDE ONLY — it must never
// reach browser JavaScript (no VITE_ prefix, never imported by src/).
//
// Primary driver is @neondatabase/serverless (Neon, incl. Vercel). For local
// development against a plain PostgreSQL, any non-Neon DATABASE_URL falls
// back to node-postgres with an identical rows-array interface.
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

let cached = null;

function isNeonUrl(url) {
  if (process.env.DB_DRIVER === 'pg') return false;
  if (process.env.DB_DRIVER === 'neon') return true;
  // Neon hostnames always contain neon.tech; anything else (localhost,
  // unix sockets, other providers) uses node-postgres locally.
  return /neon\./i.test(url);
}

async function createPg(url) {
  const { default: pg } = await import('pg');
  // DATE (OID 1082) must stay an exact YYYY-MM-DD calendar string — the JS
  // Date round-trip would shift it across timezones and corrupt workout days.
  pg.types.setTypeParser(1082, (v) => v);
  const pool = new pg.Pool({ connectionString: url });
  const tag = (strings, ...values) => {
    if (typeof strings === 'string') {
      return pool.query(strings, values.length ? values : undefined).then((r) => r.rows);
    }
    let text = '';
    const params = [];
    strings.forEach((s, i) => {
      text += s;
      if (i < values.length) { params.push(values[i]); text += `$${params.length}`; }
    });
    return pool.query(text, params).then((r) => r.rows);
  };
  tag.query = (text, params) => pool.query(text, params || []).then((r) => r.rows);
  return tag;
}

function normalizeCalendarDates(rows) {
  return rows.map((row) => {
    for (const key of ['date', 'workout_date', 'coverage_date']) {
      const value = row[key];
      if (value instanceof Date) {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        row[key] = `${year}-${month}-${day}`;
      }
    }
    return row;
  });
}

function createNeon(url) {
  const client = neon(url);
  const tag = (...args) => client(...args).then(normalizeCalendarDates);
  tag.query = (text, params) => client.query(text, params || []).then(normalizeCalendarDates);
  return tag;
}

export async function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    const err = new Error('Backend not configured: set DATABASE_URL on the server.');
    err.status = 503;
    throw err;
  }
  if (!cached) {
    cached = isNeonUrl(url)
      ? createNeon(url)
      : await createPg(url);
  }
  return cached;
}
