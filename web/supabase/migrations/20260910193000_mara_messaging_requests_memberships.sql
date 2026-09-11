-- Mara messaging, requests and membership readiness.
-- Versioned only on codex/full-product-realization-v1 until explicit founder DB release approval.
-- Browser clients may READ participant data under RLS. Commercial lifecycle writes are
-- server-owned so sender identity, creator ownership, prices and purchase links cannot be spoofed.

create table if not exists public.creator_threads (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  world_id uuid not null references public.creator_worlds(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active','archived','blocked')),
  last_message_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (creator_id, user_id),
  constraint creator_threads_world_matches_creator
    check (creator_id is not null and world_id is not null)
);

create index if not exists creator_threads_consumer_idx on public.creator_threads (user_id, last_message_at desc nulls last);
create index if not exists creator_threads_creator_idx on public.creator_threads (creator_id, last_message_at desc nulls last);

alter table public.creator_threads enable row level security;
revoke all on table public.creator_threads from anon, authenticated;
grant select on table public.creator_threads to authenticated;
grant all on table public.creator_threads to service_role;

create policy creator_threads_select_participant
  on public.creator_threads
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
  );

create trigger creator_threads_set_updated_at
  before update on public.creator_threads
  for each row execute function private.set_mara_commerce_updated_at();

create table if not exists public.creator_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.creator_threads(id) on delete cascade,
  sender_kind text not null check (sender_kind in ('consumer','creator','system')),
  sender_user_id uuid null references auth.users(id) on delete set null,
  type text not null default 'text'
    check (type in ('text','photo','audio','video','paid_media','offer','request','purchase','experience')),
  body text not null default '' check (char_length(body) <= 8000),
  content_id uuid null references public.creator_content(id) on delete set null,
  offer_id uuid null references public.commerce_offers(id) on delete set null,
  purchase_id uuid null references public.commerce_purchases(id) on delete set null,
  locked boolean not null default false,
  media_ref jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  read_at timestamptz null,
  constraint creator_messages_locked_offer check (not locked or offer_id is not null)
);

create index if not exists creator_messages_thread_idx on public.creator_messages (thread_id, created_at asc);

alter table public.creator_messages enable row level security;
revoke all on table public.creator_messages from anon, authenticated;
grant select on table public.creator_messages to authenticated;
grant all on table public.creator_messages to service_role;

create policy creator_messages_select_participant
  on public.creator_messages
  for select
  to authenticated
  using (
    exists (
      select 1 from public.creator_threads t
      where t.id = creator_messages.thread_id
        and (
          t.user_id = (select auth.uid())
          or t.creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
        )
    )
  );

create table if not exists public.creator_requests (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  world_id uuid not null references public.creator_worlds(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'requested'
    check (status in ('requested','reviewing','countered','accepted','payment_pending','paid','in_progress','delivered','completed','declined','cancelled','refunded')),
  category text not null default 'custom' check (char_length(category) between 1 and 80),
  description text not null check (char_length(description) between 1 and 4000),
  budget_minor integer null check (budget_minor is null or budget_minor > 0),
  counter_amount_minor integer null check (counter_amount_minor is null or counter_amount_minor > 0),
  currency text not null default 'CLP' check (char_length(currency) between 3 and 8),
  turnaround_days integer null check (turnaround_days is null or turnaround_days between 1 and 365),
  offer_id uuid null references public.commerce_offers(id) on delete set null,
  purchase_id uuid null references public.commerce_purchases(id) on delete set null,
  fulfillment_notes text null check (fulfillment_notes is null or char_length(fulfillment_notes) <= 4000),
  delivered_at timestamptz null,
  completed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists creator_requests_consumer_idx on public.creator_requests (user_id, created_at desc);
create index if not exists creator_requests_creator_idx on public.creator_requests (creator_id, status, created_at desc);

alter table public.creator_requests enable row level security;
revoke all on table public.creator_requests from anon, authenticated;
grant select on table public.creator_requests to authenticated;
grant all on table public.creator_requests to service_role;

create policy creator_requests_select_participant
  on public.creator_requests
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
  );

create trigger creator_requests_set_updated_at
  before update on public.creator_requests
  for each row execute function private.set_mara_commerce_updated_at();

create table if not exists public.creator_membership_tiers (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  world_id uuid not null references public.creator_worlds(id) on delete cascade,
  offer_id uuid not null references public.commerce_offers(id) on delete restrict,
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '' check (char_length(description) <= 2000),
  billing_period text not null check (billing_period in ('monthly','quarterly','annual','one_time_access')),
  benefits jsonb not null default '[]'::jsonb,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists creator_membership_tiers_world_idx on public.creator_membership_tiers (world_id, active, created_at desc);

alter table public.creator_membership_tiers enable row level security;
revoke all on table public.creator_membership_tiers from anon, authenticated;
grant select on table public.creator_membership_tiers to anon;
grant select, insert, update, delete on table public.creator_membership_tiers to authenticated;
grant all on table public.creator_membership_tiers to service_role;

create policy creator_membership_tiers_public_select
  on public.creator_membership_tiers
  for select
  to anon
  using (
    active
    and exists (
      select 1 from public.creator_worlds w
      where w.id = creator_membership_tiers.world_id
        and w.creator_id = creator_membership_tiers.creator_id
        and w.status = 'active'
        and w.visibility = 'public'
    )
  );

create policy creator_membership_tiers_authenticated_select
  on public.creator_membership_tiers
  for select
  to authenticated
  using (
    (
      active
      and exists (
        select 1 from public.creator_worlds w
        where w.id = creator_membership_tiers.world_id
          and w.creator_id = creator_membership_tiers.creator_id
          and w.status = 'active'
          and w.visibility = 'public'
      )
    )
    or creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
  );

create policy creator_membership_tiers_owner_insert
  on public.creator_membership_tiers
  for insert
  to authenticated
  with check (
    creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()) and c.status in ('pilot','active'))
    and exists (select 1 from public.creator_worlds w where w.id = world_id and w.creator_id = creator_id)
    and exists (select 1 from public.commerce_offers o where o.id = offer_id and o.creator_id = creator_id and o.world_id = world_id)
  );

create policy creator_membership_tiers_owner_update
  on public.creator_membership_tiers
  for update
  to authenticated
  using (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid())))
  with check (
    creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
    and exists (select 1 from public.creator_worlds w where w.id = world_id and w.creator_id = creator_id)
    and exists (select 1 from public.commerce_offers o where o.id = offer_id and o.creator_id = creator_id and o.world_id = world_id)
  );

create policy creator_membership_tiers_owner_delete
  on public.creator_membership_tiers
  for delete
  to authenticated
  using (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid())));

create trigger creator_membership_tiers_set_updated_at
  before update on public.creator_membership_tiers
  for each row execute function private.set_mara_commerce_updated_at();

create table if not exists public.creator_memberships (
  id uuid primary key default gen_random_uuid(),
  tier_id uuid not null references public.creator_membership_tiers(id) on delete restrict,
  creator_id uuid not null references public.creators(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  purchase_id uuid null references public.commerce_purchases(id) on delete set null,
  provider_subscription_id text null,
  status text not null default 'active' check (status in ('active','past_due','cancelled','expired')),
  started_at timestamptz not null default now(),
  current_period_ends_at timestamptz null,
  cancelled_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tier_id, user_id)
);

alter table public.creator_memberships enable row level security;
revoke all on table public.creator_memberships from anon, authenticated;
grant select on table public.creator_memberships to authenticated;
grant all on table public.creator_memberships to service_role;

create policy creator_memberships_select_participant
  on public.creator_memberships
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
  );

create trigger creator_memberships_set_updated_at
  before update on public.creator_memberships
  for each row execute function private.set_mara_commerce_updated_at();
