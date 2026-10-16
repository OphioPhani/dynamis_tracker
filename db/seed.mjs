// DB seed runner: catalog data only (exercises, splits, muscles).
// Safe to re-run (all statements are upserts / conflict-guarded).
// Usage: DATABASE_URL=... npm run db:seed
import { readFileSync } from 'node:fs';
import { getSql } from '../api/_lib/db.mjs';
import { splitStatements, runStatements } from './runner.mjs';

const sql = await getSql();
for (const f of ['seed.sql', 'seed_splits.sql', 'seed_muscles.sql']) {
  const text = readFileSync(new URL(`./${f}`, import.meta.url), 'utf8');
  await runStatements(sql, splitStatements(text), f);
}
