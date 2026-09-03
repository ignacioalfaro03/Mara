-- Mara Vera — Identity + Preference Memory
-- Prepared for Issue #5. Apply only to the dedicated Mara Supabase project.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  alias text null check (alias is null or char_length(alias) between 2 and 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

grant select, update on public.profiles to authenticated;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create table if not exists public.preference_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  client_event_id uuid not null,
  event_type text not null check (event_type = 'visual_choice'),
  choice_group text not null check (choice_group = 'pose_pair_launch_v1'),
  selected_option text not null check (selected_option in ('pose_a', 'pose_b')),
  alternative_option text not null check (alternative_option in ('pose_a', 'pose_b')),
  surface text not null check (surface = 'launch_experience'),
  context_version text not null check (context_version = 'v1'),
  created_at timestamptz not null default now(),
  constraint preference_choice_distinct check (selected_option <> alternative_option),
  constraint preference_event_idempotency unique (user_id, client_event_id)
);

alter table public.preference_events enable row level security;

grant select, insert on public.preference_events to authenticated;

create policy "preference_events_select_own"
on public.preference_events
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "preference_events_insert_own"
on public.preference_events
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create table if not exists public.relationship_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  first_seen_at timestamptz null,
  last_seen_at timestamptz null,
  return_count integer not null default 0 check (return_count >= 0),
  last_visual_choice text null check (last_visual_choice is null or last_visual_choice in ('pose_a', 'pose_b')),
  updated_at timestamptz not null default now()
);

alter table public.relationship_state enable row level security;

grant select, insert, update on public.relationship_state to authenticated;

create policy "relationship_state_select_own"
on public.relationship_state
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "relationship_state_insert_own"
on public.relationship_state
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "relationship_state_update_own"
on public.relationship_state
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create or replace function private.handle_mara_user_created()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;

  insert into public.relationship_state (user_id, first_seen_at, last_seen_at)
  values (new.id, now(), now())
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke all on function private.handle_mara_user_created() from public, anon, authenticated;

drop trigger if exists on_mara_auth_user_created on auth.users;
create trigger on_mara_auth_user_created
after insert on auth.users
for each row execute function private.handle_mara_user_created();

-- Existing users created before this migration, if any.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

insert into public.relationship_state (user_id, first_seen_at, last_seen_at)
select id, created_at, created_at from auth.users
on conflict (user_id) do nothing;

comment on table public.preference_events is
  'Private, literal behavioral choices only. Do not store inferred sexual identity, loneliness, distress, dependency or arousal labels here.';
