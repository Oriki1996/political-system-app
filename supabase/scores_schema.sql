create table if not exists public.psi_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'סטודנט',
  avatar_url text,
  share_scores boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.psi_scores (
  user_id uuid not null references public.psi_profiles(user_id) on delete cascade,
  unit_id text not null,
  earned int not null default 0,
  possible int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, unit_id)
);

create index if not exists psi_scores_user_idx on public.psi_scores(user_id);

alter table public.psi_profiles enable row level security;
alter table public.psi_scores enable row level security;

drop policy if exists psi_profiles_select on public.psi_profiles;
create policy psi_profiles_select on public.psi_profiles for select to authenticated using (auth.uid() = user_id or share_scores = true);

drop policy if exists psi_profiles_insert on public.psi_profiles;
create policy psi_profiles_insert on public.psi_profiles for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists psi_profiles_update on public.psi_profiles;
create policy psi_profiles_update on public.psi_profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists psi_scores_select on public.psi_scores;
create policy psi_scores_select on public.psi_scores for select to authenticated using (auth.uid() = user_id or exists (select 1 from public.psi_profiles p where p.user_id = psi_scores.user_id and p.share_scores = true));

drop policy if exists psi_scores_insert on public.psi_scores;
create policy psi_scores_insert on public.psi_scores for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists psi_scores_update on public.psi_scores;
create policy psi_scores_update on public.psi_scores for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
