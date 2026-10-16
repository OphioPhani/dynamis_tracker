-- Dynamis Tracker — Neon PostgreSQL schema (consolidated).
-- Run against a fresh Neon database: psql "$DATABASE_URL" -f db/schema.sql
-- or: npm run db:migrate
--
-- Security model: enforced in the API layer (api/), NOT database RLS.
-- Every user-owned row carries user_id; all API queries constrain to the
-- authenticated user derived from the session cookie. Never trust a
-- user_id supplied by the browser.

create extension if not exists "pgcrypto";

-- ============ users (auth identity — replaces Supabase auth.users) ============
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  password_hash text not null,
  role text not null default 'user' check (role in ('user','admin','super_admin')),
  status text not null default 'active' check (status in ('active','suspended')),
  created_at timestamptz not null default now()
);
alter table public.users add column if not exists role text not null default 'user';
alter table public.users add column if not exists status text not null default 'active';
alter table public.users drop constraint if exists users_role_check;
alter table public.users add constraint users_role_check check (role in ('user','admin','super_admin'));
alter table public.users drop constraint if exists users_status_check;
alter table public.users add constraint users_status_check check (status in ('active','suspended'));
create unique index if not exists idx_users_email on public.users (lower(email));
create index if not exists idx_users_role_status on public.users(role, status);

-- ============ dedicated admin accounts ============
create table if not exists public.admin_accounts (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  password_hash text not null,
  role text not null default 'super_admin' check (role in ('admin', 'super_admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);
create unique index if not exists idx_admin_accounts_username
  on public.admin_accounts (lower(username));
create index if not exists idx_admin_accounts_active
  on public.admin_accounts (lower(username), is_active);

-- ============ private admin sessions ============
create table if not exists public.admin_sessions (
  token_hash text primary key,
  admin_username text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);
create index if not exists idx_admin_sessions_expiry on public.admin_sessions(expires_at);

create table if not exists public.admin_login_throttle (
  client_key text primary key,
  failure_count int not null default 0,
  window_started_at timestamptz not null default now(),
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);
create index if not exists idx_admin_throttle_lock on public.admin_login_throttle(locked_until);

-- password reset tokens (single-use, expiring; requested via API)
create table if not exists public.password_resets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_resets_user on public.password_resets(user_id);

-- ============ profiles (public profile data — email NEVER public) ============
create table if not exists public.profiles (
  id uuid primary key references public.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ workout_days (per-user config) ============
create table if not exists public.workout_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  day_of_week text not null check (day_of_week in ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
  name text not null,
  description text default '',
  created_at timestamptz not null default now(),
  unique(user_id, day_of_week)
);

-- ============ exercises (global catalog, seeded) ============
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  muscle text not null,
  exercise_name text not null,
  rank text not null check (rank in ('good','better','best')),
  equipment text not null default '',
  grip text not null default '',
  grip_detail text not null default '',
  sets text not null default '',
  reps text not null default '',
  rest_seconds int not null default 60,
  technique text not null default '',
  form_cue text not null default '',
  difficulty text not null default 'Beginner',
  rationale text not null default '',
  mode text not null default 'Direct' check (mode in ('Direct','Functional')),
  primary_muscles text[] not null default '{}',
  secondary_muscles text[] not null default '{}',
  stabilizer_muscles text[] not null default '{}',
  day text not null default '',
  muscle_group text not null default '',
  unique(muscle, rank)
);
create index if not exists idx_exercises_muscle on public.exercises(muscle);
create index if not exists idx_exercises_day on public.exercises(day);

-- ============ workout_exercises (user's weekly selection) ============
create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  workout_day_id uuid not null references public.workout_days(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, exercise_id)
);

-- ============ workout_splits (global presets + user customs) ============
create table if not exists public.workout_splits (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  description text default '',
  category text not null default 'Custom',
  level text not null default 'Intermediate',
  goals text[] not null default '{}',
  tags text[] not null default '{}',
  days_per_week int not null default 5,
  is_preset boolean not null default false,
  is_personal_preset boolean not null default false,
  is_immutable boolean not null default false,
  created_at timestamptz not null default now(),
  check (is_preset = false or user_id is null)
);

create table if not exists public.split_days (
  id uuid primary key default gen_random_uuid(),
  split_id text not null references public.workout_splits(id) on delete cascade,
  day_of_week text not null check (day_of_week in ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
  name text not null default '',
  is_rest_day boolean not null default false,
  order_index int not null default 0,
  unique(split_id, day_of_week)
);

create table if not exists public.split_muscle_targets (
  id uuid primary key default gen_random_uuid(),
  split_day_id uuid not null references public.split_days(id) on delete cascade,
  muscle_name text not null,
  priority int not null default 1,
  unique(split_day_id, muscle_name)
);
create index if not exists idx_targets_day on public.split_muscle_targets(split_day_id);

-- ============ workout_sessions (split versioning per day) ============
create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null,
  split_id text references public.workout_splits(id) on delete set null,
  split_name text not null default '',
  workout_day text not null default '',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'in_progress' check (status in ('planned','in_progress','completed')),
  updated_at timestamptz not null default now(),
  session_no int not null default 1
);
create index if not exists idx_sessions_lookup on public.workout_sessions(user_id, date, split_id, workout_day, session_no);

-- ============ workout_logs (one row per logged SET) ============
create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  workout_day_id uuid references public.workout_days(id) on delete set null,
  performed_at timestamptz not null default now(),
  sets_completed int not null default 1,
  reps_completed int not null default 0 check (reps_completed >= 0),
  weight numeric not null default 0 check (weight >= 0),
  duration_seconds int not null default 0,
  notes text default '',
  completed boolean not null default true,
  workout_date date,
  split_id text,
  split_name text not null default '',
  session_id uuid references public.workout_sessions(id) on delete cascade,
  set_number int,
  workout_day text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists idx_logs_user_date on public.workout_logs(user_id, performed_at desc);
create index if not exists idx_logs_exercise on public.workout_logs(user_id, exercise_id);
create index if not exists idx_logs_session on public.workout_logs(session_id);
create index if not exists idx_logs_session_exercise on public.workout_logs(user_id, session_id, exercise_id);
create index if not exists idx_logs_workout_date on public.workout_logs(user_id, workout_date desc);
create index if not exists idx_logs_performed_at on public.workout_logs(performed_at desc);

-- ============ muscle_coverage (derived per set) ============
create table if not exists public.muscle_coverage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  workout_log_id uuid not null references public.workout_logs(id) on delete cascade,
  muscle_name text not null,
  coverage_type text not null check (coverage_type in ('primary','secondary','stabilizer')),
  coverage_date date not null default current_date
);
create index if not exists idx_coverage_user_date on public.muscle_coverage(user_id, coverage_date desc);
create index if not exists idx_cov_user_muscle on public.muscle_coverage(user_id, muscle_name);

-- ============ append-only administrative audit log ============
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references public.users(id) on delete restrict,
  admin_identity text,
  action text not null,
  target_type text not null,
  target_id text,
  success boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  request_id text,
  created_at timestamptz not null default now(),
  check (admin_user_id is not null or admin_identity is not null)
);
alter table public.admin_audit_logs add column if not exists admin_identity text;
alter table public.admin_audit_logs alter column admin_user_id drop not null;
create index if not exists idx_admin_audit_created on public.admin_audit_logs(created_at desc);
create index if not exists idx_admin_audit_admin on public.admin_audit_logs(admin_user_id, created_at desc);
create or replace function public.prevent_admin_audit_mutation()
returns trigger language plpgsql as $$
begin raise exception 'admin audit logs are append-only'; end $$;
drop trigger if exists trg_admin_audit_immutable on public.admin_audit_logs;
create trigger trg_admin_audit_immutable before update or delete on public.admin_audit_logs
for each row execute function public.prevent_admin_audit_mutation();

-- ============ user_preferences (active split + equipment) ============
create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  active_split_id text references public.workout_splits(id) on delete set null,
  weight_unit text not null default 'kg',
  available_equipment text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ muscles registry (reference data) ============
create table if not exists public.muscles (
  id text primary key,
  canonical_name text not null,
  display_name text not null,
  category text not null default '',
  bucket text not null default 'ALL',
  is_surface boolean not null default true,
  location text default '',
  primary_function text default '',
  training_role text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.muscle_aliases (
  muscle_id text not null references public.muscles(id) on delete cascade,
  alias text not null,
  primary key (muscle_id, alias)
);
create index if not exists idx_alias_lookup on public.muscle_aliases(alias);

-- ============ updated_at trigger ============
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
for each row execute function public.handle_updated_at();
