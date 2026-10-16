// Shared SQL batch runner for db scripts (quote-aware splitter).
export function splitStatements(text) {
  const out = [];
  let cur = '';
  let inStr = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      cur += ch;
      if (ch === "'") {
        if (text[i + 1] === "'") { cur += "'"; i++; }
        else inStr = false;
      }
      continue;
    }
    if (ch === "'") { inStr = true; cur += ch; continue; }
    if (ch === '$') {
      const m = text.slice(i).match(/^\$[A-Za-z_]*\$/);
      if (m) {
        const tag = m[0];
        const close = text.indexOf(tag, i + tag.length);
        const end = close === -1 ? text.length : close + tag.length;
        cur += text.slice(i, end);
        i = end - 1;
        continue;
      }
      cur += ch;
      continue;
    }
    if (ch === '-' && text[i + 1] === '-') {
      while (i < text.length && text[i] !== '\n') i++;
      cur += '\n';
      continue;
    }
    if (ch === ';') { if (cur.trim()) out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

export async function runStatements(sql, statements, label) {
  let n = 0;
  for (const st of statements) {
    // Raw DDL strings: use .query() when available (required by
    // @neondatabase/serverless, which only allows sql`...` tagged calls
    // or sql.query()). The pg fallback exposes an identical .query().
    if (typeof sql.query === 'function') await sql.query(st);
    else await sql(st);
    if (++n % 200 === 0) console.log(`  ${label}: ${n}/${statements.length}`);
  }
  console.log(`  ${label}: done (${statements.length} statements)`);
}
