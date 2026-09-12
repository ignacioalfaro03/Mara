-- MARA PAID INTERACTION SESSIONS V1 — DRAFT ONLY.
-- DO NOT APPLY DIRECTLY.
--
-- Purpose: represent a paid, bounded interaction window purchased through the
-- canonical commerce spine. Normal creator messaging remains free unless the
-- creator explicitly sells one of these sessions.
--
-- This draft depends on creator_threads, commerce_offers and commerce_purchases.
-- It must be reviewed against the live Mara schema and converted into a proper
-- non-production migration only after Supabase migration history is reconciled.

create table if not exists public.creator_paid_interaction_sessions (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  world_id uuid not null references public.creator_worlds(id) on delete cascade,
  thread_id uuid not null references public.creator_threads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  offer_id uuid not null references public.commerce_offers(id) on delete restrict,
  purchase_id uuid not null unique references public.commerce_purchases(id) on delete restrict,
  duration_minutes integer not null check (duration_minutes between 5 and 240),
  status text not null default 'purchased'
    check (status in ('purchased', 'active', 'ended', 'cancelled', 'refunded')),
  purchased_at timestamptz not null,
  started_at timestamptz null,
  ends_at timestamptz null,
  ended_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint creator_paid_session_timing check (
    (status = 'purchased' and started_at is null and ends_at is null)
    or
    (status in ('active', 'ended') and started_at is not null and ends_at is not null and ends_at > started_at)
    or
    (status in ('cancelled', 'refunded'))
  )
);

create index if not exists creator_paid_sessions_creator_status_idx
  on public.creator_paid_interaction_sessions (creator_id, status, updated_at desc);
create index if not exists creator_paid_sessions_user_status_idx
  on public.creator_paid_interaction_sessions (user_id, status, updated_at desc);
create index if not exists creator_paid_sessions_thread_status_idx
  on public.creator_paid_interaction_sessions (thread_id, status, updated_at desc);

alter table public.creator_paid_interaction_sessions enable row level security;
revoke all on table public.creator_paid_interaction_sessions from anon, authenticated;
grant select on table public.creator_paid_interaction_sessions to authenticated;
grant all on table public.creator_paid_interaction_sessions to service_role;

create policy creator_paid_sessions_select_participants
on public.creator_paid_interaction_sessions
for select
to authenticated
using (
  user_id = (select auth.uid())
  or creator_id in (
    select c.id from public.creators c where c.user_id = (select auth.uid())
  )
);

create or replace function public.start_creator_paid_interaction_session_v1(
  p_session_id uuid,
  p_started_at timestamptz default now()
)
returns public.creator_paid_interaction_sessions
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_session public.creator_paid_interaction_sessions%rowtype;
begin
  select * into v_session
  from public.creator_paid_interaction_sessions
  where id = p_session_id
  for update;

  if not found then
    raise exception 'paid_interaction_session_not_found';
  end if;
  if v_session.status <> 'purchased' then
    raise exception 'paid_interaction_session_not_startable';
  end if;
  if p_started_at < v_session.purchased_at then
    raise exception 'paid_interaction_start_before_purchase';
  end if;

  update public.creator_paid_interaction_sessions
  set
    status = 'active',
    started_at = p_started_at,
    ends_at = p_started_at + make_interval(mins => v_session.duration_minutes),
    updated_at = now()
  where id = v_session.id
  returning * into v_session;

  return v_session;
end;
$$;

revoke all on function public.start_creator_paid_interaction_session_v1(uuid, timestamptz)
from public, anon, authenticated;
grant execute on function public.start_creator_paid_interaction_session_v1(uuid, timestamptz)
to service_role;

create or replace function public.end_expired_creator_paid_interaction_sessions_v1(
  p_now timestamptz default now()
)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_count integer;
begin
  update public.creator_paid_interaction_sessions
  set
    status = 'ended',
    ended_at = coalesce(ended_at, ends_at, p_now),
    updated_at = now()
  where status = 'active'
    and ends_at is not null
    and ends_at <= p_now;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.end_expired_creator_paid_interaction_sessions_v1(timestamptz)
from public, anon, authenticated;
grant execute on function public.end_expired_creator_paid_interaction_sessions_v1(timestamptz)
to service_role;
