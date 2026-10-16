# Dynamis Tracker — mobile-first 5-day workout tracking app

React + Vite + Tailwind + Neon PostgreSQL (via secure Vercel API). Sharp 90° UI, dark gym-dashboard theme. Tracks all **45 muscles / 135 exercises (GOOD/BETTER/BEST)** from the original plan.

Legacy static plan is preserved at `legacy-plan.html`.

## 1. Install Node.js
Node 18+ recommended (`node --version`).

## 2. Install dependencies
```bash
npm install
```

## 3. Create a Neon database
1. Go to https://neon.tech → New project (PostgreSQL).
2. Copy the connection string (Dashboard → Connection Details).
   It looks like `postgresql://user:password@ep-xxx.aws.neon.tech/dbname?sslmode=require`.

## 4. Run migrations + seeds
```bash
cp .env.example .env
# edit .env: set DATABASE_URL (Neon string above) + JWT_SECRET
# (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
npm run db:migrate   # creates all tables (users, profiles, workout_days,
                     # exercises, workout_exercises, workout_logs,
                     # muscle_coverage, splits/days/targets, user_preferences,
                     # workout_sessions, muscles, muscle_aliases)
npm run db:seed      # 135 exercises + 13 split presets (920 targets) + 45 muscles
```
Seeded catalog data (matches the original Supabase dataset row-for-row):
135 exercises · 13 splits · 91 split days · 920 muscle targets · 45 muscles.

Migrating an existing Supabase database instead of starting fresh?
```bash
# 1. Export from Supabase (Dashboard → Database → Backups, or pg_dump).
# 2. Import into Neon: psql "$DATABASE_URL" -f backup.sql
# 3. Auth users do NOT transfer with table data: existing users re-register
#    (same email) or use password reset; their old rows stay keyed by id.
# Do NOT delete the Supabase project until the Neon deployment is verified.
```

## 5. Configure `.env`
```bash
cp .env.example .env
```
```text
DATABASE_URL=postgresql://... (Neon — SERVER ONLY, never VITE_-prefixed)
JWT_SECRET=<long random string>
# ALLOW_DEV_RESET=true   # local testing only: return reset tokens in API responses
```
Never commit `.env`. `DATABASE_URL` must never appear in browser code.

## 6. Architecture
```text
React mobile frontend (Vite build -> dist, no secrets)
        ↓  fetch /api/* (same origin, session cookie)
Vercel serverless functions (api/*.js, DATABASE_URL only here)
        ↓  parameterized SQL, user id always from verified session
Neon PostgreSQL (+ JWT-cookie auth in users table, bcrypt hashes)
```
Local dev serves the same handlers through Vite (`npm run dev` — no extra
process). Security model (replaces Supabase RLS): every user-owned query is
constrained to the session user server-side; `user_id` from the browser is
never trusted; presets/exercises/muscles are global read-only; immutable
Snake's Split (`is_immutable`) is rejected by all user write paths.

## 7. Run locally
```bash
npm run dev
```
Open http://localhost:5173. Without `DATABASE_URL`/`JWT_SECRET` the API
returns `503 Backend not configured` and the app runs in **local demo mode**
(localStorage, sync banner shows LOCAL MODE). With env set, sign up for a
real Neon-backed account.

## 8. Test authentication
- `/signup` → create user → profile auto-created server-side.
- `/login`, `/forgot` (dev: set `ALLOW_DEV_RESET=true` to receive the reset
  token in the response; production needs an SMTP integration), Settings → Logout.
## 9. Test workout logging
- Open WORKOUT tab (today's day auto-selected; Wed/Sun show REST).
- Pick GOOD/BETTER/BEST per muscle → enter weight (kg default) + reps → ✓ COMPLETE SET → rest timer starts.
- REPEAT LAST SET, edit/delete sets, coverage + progress update instantly; rows go to `workout_logs` + `muscle_coverage` when online, else queued in localStorage and synced on reconnect.

## 10. Push to GitHub
```bash
git init; git add .; git commit -m "Dynamis Tracker"; git branch -M main
git remote add origin <url>; git push -u origin main
```

## Admin portal

The protected admin console is available at `/admin` after signing in through
the private `/admin/login` route. Admin access is checked on every
`/api/admin/*` request using the dedicated database-backed httpOnly session;
frontend route visibility is not a security boundary. Admin actions are
recorded in the append-only `admin_audit_logs` table. Password hashes, tokens,
connection strings, and arbitrary SQL are never exposed through the portal.

The migration adds `users.role`, `users.status`, the `admin_accounts`,
`admin_audit_logs`, and supporting indexes/triggers. Run `npm run db:migrate`
before using `/admin`.

### Private admin login

The owner-only admin login is at `/admin/login`. It is separate from normal
Dynamis user authentication and uses a Neon-backed account plus a
database-backed, revocable httpOnly session. Configure this server-only
variable locally and in Vercel:

```text
ADMIN_SESSION_SECRET=<long random secret>
```

Provision the first account once from a protected shell or secret manager. The
command hashes the password before insertion and refuses to overwrite an
existing account:

```bash
ADMIN_INITIAL_USERNAME=admin ADMIN_INITIAL_PASSWORD='your-password' npm run admin:provision
```

Do not put the password in `.env`, source control, or command history; use a
protected environment variable or interactive secret injection instead. The
application reads the password hash from `admin_accounts` only. Admin
sessions expire after eight hours, logout revokes the stored session, and
failed logins are throttled per normalized username and trusted client key.
If a legitimate owner is locked out, use the private server-side recovery
command after verifying access to the deployment environment:

```bash
ADMIN_UNLOCK_USERNAME=admin npm run admin:unlock
```

This only clears throttle records; it does not bypass password verification or
create an account. On Vercel, run the command from a secure administrative
environment with `DATABASE_URL`, rather than exposing a reset endpoint.

## 11. Import into Vercel
Vercel → Add New Project → Import GitHub repo. Framework preset: **Vite**. Build `npm run build`, output `dist` (see `vercel.json`).

## 12. Add Vercel environment variables
Project → Settings → Environment Variables (Production + Preview):
- `DATABASE_URL` (Neon connection string)
- `JWT_SECRET` (long random string, same value everywhere)
- `ALLOW_DEV_RESET` — leave UNSET in production.
Redeploy after adding. The `api/` directory deploys as serverless functions
automatically (`vercel.json` excludes `/api/*` from the SPA rewrite).

## 13. Deploy
Deploy → open URL on phone → Add to Home Screen (PWA manifest + `sw.js` shell cache).

## Backend verification checklist
- [x] `npm run db:migrate` + `npm run db:seed` succeed (135/13/45 rows)
- [x] Signup/login/logout/session persistence work; wrong password rejected
- [x] User A cannot read/modify user B rows (tested: cross-user PATCH → 404)
- [x] Leaderboard exposes display_name only (no emails, no user ids)
- [x] Preset splits (incl. immutable Snake's Split) reject user writes
- [x] Delete account removes auth + all user data (cascade verified)

## Coverage algorithm
`src/utils/coverage.js → calculateMuscleCoverage(logs)`: primary=1.0, secondary=0.5, stabilizer=0.25. Returns `{ totalMuscles, uniqueMusclesCovered, directMusclesCovered, weightedCoverage, muscles[] }`. Daily/weekly/monthly derived from filtered `workout_logs`. No double-counting within a session for unique counts; sets increment volume.

## Split library architecture
```text
MUSCLE DB (45) -> EXERCISE DB (135, good/better/best) -> SPLIT TEMPLATES (13 presets in src/data/splits.js = db/seed_splits.sql)
  -> USER'S ACTIVE SPLIT (user_preferences.active_split_id) -> TODAY'S WORKOUT (splitEngine.generateWorkoutFromSplit)
  -> EXERCISE LOGS (stamped split_id/split_name) -> ACTUAL COVERAGE -> DAILY/WEEKLY/MONTHLY ANALYTICS
```
- Library: `/splits` (search + category/days/goal filters), `/splits/:id` (structure, expected coverage, USE THIS SPLIT with history-preserving confirm, CUSTOMIZE → personal copy `Name — My Version`, presets never mutated), `/splits/new` (create custom), `/setup` (post-signup wizard: split → equipment → ready + non-binding recommendation).
- Equipment (`src/data/equipment.js`, 24 items, Settings + setup): engine auto-selects highest-ranked available exercise per muscle; unavailable ranks shown ✕ but still changeable via CHANGE buttons.
- Expected vs actual: Workout header + Progress Planned-vs-Actual bars per weekday.
- Extensible: add splits via SQL inserts into `workout_splits/split_days/split_muscle_targets` — no component changes needed.

## Project structure
See spec §39. PWA: `public/manifest.json` + `public/sw.js` (app-shell cache; third-party APIs never cached).

## Mobile targets
360/375/390/412/430px, no page-level horizontal scroll (`.no-hscroll`, `.hscroll` only for heatmap), ≥44px targets, `input[type=number]`, sticky header + bottom nav with `env(safe-area-inset-bottom)`.

## Test account (dev only — never on the login page)
1. Sign up in the app as `test@dynamistracker.com` (any strong password),
   OR insert directly (see `docs/TEST_ACCOUNT.md`).
2. Find the user id: `select id from users where email = 'test@dynamistracker.com';`
3. Run `db/seed_demo.sql` with `<TEST_USER_ID>` replaced by that id
   (same for `db/seed_demo_yearly.sql` for Yearly-tab data).
Demo rows are marked `notes='DEMO DATA'` (one full + one partial workout +
scattered sets). Real accounts start empty. Never hard-code passwords.

## Account deletion
`DELETE /api/account` (Settings → Account → type DELETE to confirm) deletes
the auth row; cascading foreign keys remove profile, logs, coverage,
sessions, splits, preferences. The session cookie is cleared client-side and
the user is redirected to login. Verified: deleted users 401 immediately and
leave no orphan rows.

## Branding
Product name: **Dynamis Tracker** (short: **Dynamis**). Geometric D logo: `public/logo.svg` (full), `public/logo-mark.svg` (mark), `public/favicon.svg`, `public/icon-192.png` + `public/icon-512.png` (PWA). Brand green `#22C55E`, secondary `#3B82F6`, background `#09090B`, font Space Grotesk.

## Workout journal model (day + date + session)
- Workout page defaults to today (Asia/Kolkata) with a MON–SUN strip (● TODAY).
  `?day=` / `?date=` / `?seq=` select another day; past days default to their most
  recent date (CHANGE DATE allowed, never future); future days show UPCOMING with
  an explicit LOG THIS WORKOUT TODAY (keeps `workout_day`, dates today).
- Rest days show REST + explicit LOG EXTRA WORKOUT. Extra sessions render as
  REST DAY — EXTRA SESSION in Progress/History.
- One session = user + workout_date + split + workout_day (+ seq for deliberate
  START NEW SESSION repeats). Sets append to the exercise's session block;
  COMPLETED cards show VIEW LOG (edit/delete inline) — reopening never
  duplicates or re-asks. Completion persists in Neon (`workout_sessions`
  status planned/in_progress/completed + `workout_logs.session_id/set_number`).
- Dashboard shows ✓ TODAY'S WORKOUT COMPLETE + VIEW SESSION once done.

## Muscle Intelligence + REAL 3D anatomy
- Real anatomical model: 161 unique muscle meshes shared across 38/45 muscles (overlap without duplication,
  BodyParts3D 4.0 © DBCLS, **CC BY 4.0**) repacked to
  `public/models/dynamis-muscles.{json,bin}` (5MB, ~2MB gzipped, lazy-loaded
  with progress + service-worker cache). Full license research, vendoring
  rationale and per-muscle gap analysis in `public/ATTRIBUTION.md`.
  7 muscles with no individual mesh in the licensed source (lats, rectus
  abdominis, internal/transverse abdominals, multifidus, QL, pelvic floor)
  show an honest model-limitation card — never fake geometry.
- `src/components/AnatomyViewer.jsx`: vanilla three.js (lean bundle, no R3F),
  touch orbit/pinch/pan, raycast tap-to-mesh, emissive coverage tint +
  blue selection, animated front/back rotation, search-to-mesh focus + zoom,
  DPR cap, dispose on unmount. Same model rotated — never two drawings.
- Canonical mapping `src/data/anatomyMapping.js` (mesh name/side per muscle);
  tap/search flows mesh -> canonical id -> analysis. Logs count bilateral;
  LEFT/RIGHT/BOTH highlight control on the sheet.
- Legacy note: an earlier hand-drawn SVG map was removed per requirements.
- Canonical registry `src/data/muscles.js` (45 ids, aliases, groups, location/function/role). Same ids drive the viewer, analytics and exercise mapping everywhere.
- `src/utils/muscleStats.js`: logs -> deterministic exercise mapping -> per-muscle sessions/sets/reps/volume/frequency/recency/score (see METHODOLOGY export, also shown in Settings → Methodology). Snake's Split contribution per muscle computed read-only from the immutable split.
- Muscles tab = Muscle Intelligence hub; tap any muscle for full analysis (score, frequency, volume/frequency graphs 7D–ALL, sets/week, recency, Snake's Split contribution, planned vs actual, exercise options).
