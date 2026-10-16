// DB migrate runner: applies db/schema.sql (idempotent, IF NOT EXISTS).
// Usage: DATABASE_URL=... npm run db:migrate
import { readFileSync } from 'node:fs';
import { getSql } from '../api/_lib/db.mjs';
import { splitStatements, runStatements } from './runner.mjs';

const sql = await getSql();
const schema = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');
await runStatements(sql, splitStatements(schema), 'schema');
console.log('schema applied');
