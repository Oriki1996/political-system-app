-- =====================================================================
--  political-system-app · shared scoring schema
--  Run ONCE in the shared Supabase project → SQL Editor → paste → Run.
--  Tables are namespaced psi_* so they don't collide with psychopath-app.
-- =====================================================================

-- 1) Per-student profile: display name + visibility choice (default: visible)
create table if not exists public.psi_profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'סטודנט',
  avatar_url   text,
  share_scores boolean not null default true,   -- visible to others by default
  updated_at   timestamptz not null default now()
);

-- 2) Per-student, per-unit exam score (only exams are scored)
create table if not exists public.psi_scores (
  user_id    uuid not null references public.psi_profiles(user_id) on delete cascade,
  unit_id    text not null,
  earned     int  not null default 0,
  possible   int  not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, unit_id)
);

create index if not exists psi_scores_user_idx on public.psi_scores(user_id);

-- 3) Row-Level Security
alter table public.psi_profiles enable row level security;
alter table public.psi_scores   enable row level security;

-- profiles: read your own always; read others only if they chose to share.
drop policy if exists psi_profiles_select on public.psi_profiles;
create policy psi_profiles_select on public.psi_profiles
  for select to authenticated
  using ( auth.uid() = user_id or share_scores = true );

drop policy if exists psi_profiles_insert on public.psi_profiles;
create policy psi_profiles_insert on public.psi_profiles
  for insert to authenticated
  with check ( auth.uid() = user_id );

drop policy if exists psi_profiles_update on public.psi_profiles;
create policy psi_profiles_update on public.psi_profiles
  for update to authenticated
  using ( auth.uid() = user_id ) with check ( auth.uid() = user_id );

-- scores: read your own always; read others only if their profile shares.
drop policy if exists psi_scores_select on public.psi_scores;
create policy psi_scores_select on public.psi_scores
  for select to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.psi_profiles p
      where p.user_id = psi_scores.user_id and p.share_scores = true
    )
  );

drop policy if exists psi_scores_insert on public.psi_scores;
create policy psi_scores_insert on public.psi_scores
  for insert to authenticated
  with check ( auth.uid() = user_id );

drop policy if exists psi_scores_update on public.psi_scores;
create policy psi_scores_update on public.psi_scores
  for update to authenticated
  using ( auth.uid() = user_id ) with check ( auth.uid() = user_id );

-- Done. The app upserts a psi_profiles row on Google login and upserts
-- psi_scores per unit when an exam score changes; the class board reads
-- psi_scores embedding psi_profiles (RLS hides non-sharers automatically).
