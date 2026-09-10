-- Mara — Private Alpha backend foundation
-- Live Supabase migration: 20260908132539 / mara_private_alpha_backend_foundation
-- Applied 2026-09-08 to project hctykprkwenhatbjxkpb.
-- Additive only: preserves legacy Mara commerce/memory while adding multi-creator scope.

create schema if not exists private;

-- ============================================================
-- 1. CREATOR + WORLD FOUNDATION
-- ============================================================

create table public.creators (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  status text not null default 'pilot' check (status in ('draft','pilot','active','suspended')),
  plan text not null default 'free' check (plan in ('free','pro')),
  onboarding_state text not null default 'invited' check (onboarding_state in ('invited','setup','ready','active')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.creators is 'Private operational creator account. No KYC, legal identity, payout credentials or protected location data belongs here.';

create table public.creator_worlds (
  id uuid primary key default extensions.gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9_-]{1,80}$'),
  display_name text not null check (char_length(display_name) between 2 and 80),
  description text not null default '' check (char_length(description) <= 1200),
  status text not null default 'draft' check (status in ('draft','active','archived')),
  visibility text not null default 'public' check (visibility in ('public','private')),
  persona jsonb not null default '{}'::jsonb check (jsonb_typeof(persona) = 'object'),
  settings jsonb not null default '{}'::jsonb check (jsonb_typeof(settings) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (creator_id, id)
);
comment on table public.creator_worlds is 'Creator-owned World container. The surface may feel immersive; this remains a practical product container, not a metaverse object.';

create index creator_worlds_creator_status_idx on public.creator_worlds (creator_id, status);

create trigger creator_worlds_set_updated_at
before update on public.creator_worlds
for each row execute function private.set_mara_commerce_updated_at();

create trigger creators_set_updated_at
before update on public.creators
for each row execute function private.set_mara_commerce_updated_at();

-- ============================================================
-- 2. CREATOR <-> CUSTOMER CRM BOUNDARY
-- ============================================================

create table public.creator_customer_relationships (
  creator_id uuid not null references public.creators(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  first_seen_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  last_creator_action_at timestamptz,
  attribution_source text not null default 'mara' check (attribution_source in ('creator','mara','cross_world','unknown')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (creator_id, user_id)
);
comment on table public.creator_customer_relationships is 'Creator-scoped commercial relationship boundary. Transaction totals remain derived from commerce truth rather than duplicated here.';

create index creator_customer_relationships_creator_activity_idx on public.creator_customer_relationships (creator_id, last_activity_at desc);
create index creator_customer_relationships_user_idx on public.creator_customer_relationships (user_id, last_activity_at desc);

create trigger creator_customer_relationships_set_updated_at
before update on public.creator_customer_relationships
for each row execute function private.set_mara_commerce_updated_at();

-- ============================================================
-- 3. EXTEND BINARY PREFERENCE EVENTS WITHOUT REPLACING THEM
-- ============================================================

alter table public.preference_events
  add column creator_id uuid,
  add column world_id uuid,
  add column signal_scope text not null default 'network';

alter table public.preference_events
  add constraint preference_events_creator_world_fkey
    foreign key (creator_id, world_id)
    references public.creator_worlds (creator_id, id)
    on delete cascade,
  add constraint preference_events_signal_scope_check
    check (signal_scope in ('network','creator_world')),
  add constraint preference_events_scope_shape_check
    check (
      (signal_scope = 'network' and creator_id is null and world_id is null)
      or
      (signal_scope = 'creator_world' and creator_id is not null and world_id is not null)
    );

alter table public.preference_events drop constraint if exists preference_events_event_type_check;
alter table public.preference_events drop constraint if exists preference_events_choice_group_check;
alter table public.preference_events drop constraint if exists preference_events_selected_option_check;
alter table public.preference_events drop constraint if exists preference_events_alternative_option_check;
alter table public.preference_events drop constraint if exists preference_events_surface_check;
alter table public.preference_events drop constraint if exists preference_events_context_version_check;

alter table public.preference_events
  add constraint preference_events_event_type_check check (event_type ~ '^[a-z0-9][a-z0-9_]{1,63}$'),
  add constraint preference_events_choice_group_check check (choice_group ~ '^[a-z0-9][a-z0-9_:-]{1,119}$'),
  add constraint preference_events_selected_option_check check (char_length(selected_option) between 1 and 120),
  add constraint preference_events_alternative_option_check check (char_length(alternative_option) between 1 and 120),
  add constraint preference_events_surface_check check (surface ~ '^(/|/[A-Za-z0-9][A-Za-z0-9_:/.-]{0,118}|[A-Za-z0-9][A-Za-z0-9_:/.-]{0,119})$'),
  add constraint preference_events_context_version_check check (context_version ~ '^[A-Za-z0-9][A-Za-z0-9_.-]{0,39}$');

create index preference_events_creator_world_idx on public.preference_events (creator_id, world_id, created_at desc) where creator_id is not null;
create index preference_events_user_created_idx on public.preference_events (user_id, created_at desc);

comment on column public.preference_events.signal_scope is 'network = Mara-only network signal; creator_world = creator-scoped signal that may be visible inside that creator relationship.';

-- ============================================================
-- 4. EDITABLE DECLARED PREFERENCES / MY WEAKNESS
-- ============================================================

create table public.user_declared_preferences (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  creator_id uuid,
  world_id uuid,
  scope text not null check (scope in ('network','creator_world')),
  preference_type text not null check (preference_type ~ '^[a-z0-9][a-z0-9_:-]{1,79}$'),
  value_text text not null check (char_length(value_text) between 1 and 1000),
  source text not null default 'user_free_text' check (source in ('user_free_text','user_choice','user_edit')),
  creator_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_confirmed_at timestamptz not null default now(),
  constraint user_declared_preferences_creator_world_fkey
    foreign key (creator_id, world_id)
    references public.creator_worlds (creator_id, id)
    on delete cascade,
  constraint user_declared_preferences_scope_shape_check
    check (
      (scope = 'network' and creator_id is null and world_id is null)
      or
      (scope = 'creator_world' and creator_id is not null and world_id is not null)
    )
);
comment on table public.user_declared_preferences is 'User-declared current preferences, including optional My Weakness free text. Treat as preference, never as authorization for vulnerability exploitation.';
comment on column public.user_declared_preferences.value_text is 'Raw user-declared preference text. USER SAID THIS is distinct from any future derived inference.';

create unique index user_declared_preferences_network_unique
  on public.user_declared_preferences (user_id, preference_type)
  where scope = 'network';
create unique index user_declared_preferences_creator_unique
  on public.user_declared_preferences (user_id, creator_id, preference_type)
  where scope = 'creator_world';
create index user_declared_preferences_creator_idx
  on public.user_declared_preferences (creator_id, user_id, updated_at desc)
  where creator_id is not null;

create trigger user_declared_preferences_set_updated_at
before update on public.user_declared_preferences
for each row execute function private.set_mara_commerce_updated_at();

-- ============================================================
-- 5. PERSISTENT DEMAND ENGINE
-- ============================================================

create table public.demand_requests (
  id uuid primary key default extensions.gen_random_uuid(),
  creator_id uuid not null,
  world_id uuid not null,
  created_by_user_id uuid references auth.users(id) on delete set null,
  origin text not null default 'community' check (origin in ('community','creator')),
  title text not null check (char_length(title) between 3 and 160),
  description text not null default '' check (char_length(description) <= 1600),
  category text not null check (category ~ '^[A-Za-z0-9][A-Za-z0-9 _:/.-]{1,79}$'),
  fulfillment_type text not null check (fulfillment_type in ('digital_product','digital_experience','membership','collab','merch','physical_experience','hybrid')),
  privacy_mode text not null default 'pseudonymous' check (privacy_mode in ('public','pseudonymous','private')),
  location_label text check (location_label is null or char_length(location_label) <= 120),
  target_commitments integer not null default 10 check (target_commitments > 0),
  status text not null default 'open' check (status in ('open','validated','unlocked','offered','fulfilled','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint demand_requests_creator_world_fkey
    foreign key (creator_id, world_id)
    references public.creator_worlds (creator_id, id)
    on delete cascade
);
comment on table public.demand_requests is 'Canonical creator-linked demand object. WANT, PLEDGE and COMMIT remain separate from PURCHASE.';

create index demand_requests_creator_status_idx on public.demand_requests (creator_id, status, updated_at desc);
create index demand_requests_world_status_idx on public.demand_requests (world_id, status, updated_at desc);

create trigger demand_requests_set_updated_at
before update on public.demand_requests
for each row execute function private.set_mara_commerce_updated_at();

create table public.demand_signals (
  demand_request_id uuid not null references public.demand_requests(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  signal_level text not null check (signal_level in ('want','pledge','commit')),
  wtp_amount_minor integer check (wtp_amount_minor is null or wtp_amount_minor > 0),
  currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  privacy_mode text not null default 'pseudonymous' check (privacy_mode in ('public','pseudonymous','private')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (demand_request_id, user_id),
  constraint demand_signals_wtp_currency_pair check (
    (wtp_amount_minor is null and currency is null)
    or
    (wtp_amount_minor is not null and currency is not null)
  )
);
comment on table public.demand_signals is 'Current user demand signal. WANT != PLEDGE != COMMIT != PURCHASE. Private signals are not exposed raw to creators.';

create index demand_signals_request_level_idx on public.demand_signals (demand_request_id, signal_level, updated_at desc);
create index demand_signals_user_idx on public.demand_signals (user_id, updated_at desc);

create trigger demand_signals_set_updated_at
before update on public.demand_signals
for each row execute function private.set_mara_commerce_updated_at();

create table public.demand_request_metrics (
  demand_request_id uuid primary key references public.demand_requests(id) on delete cascade,
  want_count integer not null default 0 check (want_count >= 0),
  pledge_count integer not null default 0 check (pledge_count >= 0),
  commit_count integer not null default 0 check (commit_count >= 0),
  wtp_count integer not null default 0 check (wtp_count >= 0),
  wtp_total_minor bigint not null default 0 check (wtp_total_minor >= 0),
  pledge_wtp_total_minor bigint not null default 0 check (pledge_wtp_total_minor >= 0),
  commit_wtp_total_minor bigint not null default 0 check (commit_wtp_total_minor >= 0),
  updated_at timestamptz not null default now()
);
comment on table public.demand_request_metrics is 'Privacy-safe aggregate demand projection. Includes private demand in aggregate while raw private signals stay hidden from creators.';

-- ============================================================
-- 6. CREATOR-SCOPE EXISTING COMMERCE WITHOUT A SECOND LEDGER
-- ============================================================

alter table public.commerce_offers
  add column creator_id uuid,
  add column world_id uuid,
  add column offer_family text not null default 'digital_product',
  add column demand_request_id uuid;

alter table public.commerce_offers
  add constraint commerce_offers_creator_world_fkey
    foreign key (creator_id, world_id)
    references public.creator_worlds (creator_id, id)
    on delete set null,
  add constraint commerce_offers_scope_shape_check
    check ((creator_id is null and world_id is null) or (creator_id is not null and world_id is not null)),
  add constraint commerce_offers_offer_family_check
    check (offer_family in ('digital_product','personalized_digital','limited_drop','membership','bounded_interaction')),
  add constraint commerce_offers_demand_request_fkey
    foreign key (demand_request_id)
    references public.demand_requests(id)
    on delete set null;

create index commerce_offers_creator_status_idx on public.commerce_offers (creator_id, status, updated_at desc) where creator_id is not null;
create index commerce_offers_world_idx on public.commerce_offers (world_id, status) where world_id is not null;
create index commerce_offers_demand_request_idx on public.commerce_offers (demand_request_id) where demand_request_id is not null;

alter table public.commerce_purchases
  add column creator_id uuid,
  add column world_id uuid;

alter table public.commerce_purchases
  add constraint commerce_purchases_creator_world_fkey
    foreign key (creator_id, world_id)
    references public.creator_worlds (creator_id, id)
    on delete set null,
  add constraint commerce_purchases_scope_shape_check
    check ((creator_id is null and world_id is null) or (creator_id is not null and world_id is not null));

create index commerce_purchases_creator_user_idx on public.commerce_purchases (creator_id, user_id, created_at desc) where creator_id is not null;
create index commerce_purchases_creator_fulfillment_idx on public.commerce_purchases (creator_id, fulfilled_at, created_at desc) where creator_id is not null;

-- ============================================================
-- 7. INTERNAL PROJECTIONS / TRIGGERS
-- ============================================================

create or replace function private.set_mara_purchase_creator_scope()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select o.creator_id, o.world_id
    into new.creator_id, new.world_id
  from public.commerce_offers o
  where o.id = new.offer_id;
  return new;
end;
$$;
revoke all on function private.set_mara_purchase_creator_scope() from public, anon, authenticated;

create trigger commerce_purchases_set_creator_scope
before insert or update of offer_id on public.commerce_purchases
for each row execute function private.set_mara_purchase_creator_scope();

create or replace function private.refresh_mara_demand_request_metrics()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_request_id uuid;
begin
  v_request_id := coalesce(new.demand_request_id, old.demand_request_id);

  insert into public.demand_request_metrics (
    demand_request_id,
    want_count,
    pledge_count,
    commit_count,
    wtp_count,
    wtp_total_minor,
    pledge_wtp_total_minor,
    commit_wtp_total_minor,
    updated_at
  )
  select
    v_request_id,
    count(*) filter (where ds.signal_level in ('want','pledge','commit'))::integer,
    count(*) filter (where ds.signal_level in ('pledge','commit'))::integer,
    count(*) filter (where ds.signal_level = 'commit')::integer,
    count(ds.wtp_amount_minor)::integer,
    coalesce(sum(ds.wtp_amount_minor),0)::bigint,
    coalesce(sum(ds.wtp_amount_minor) filter (where ds.signal_level in ('pledge','commit')),0)::bigint,
    coalesce(sum(ds.wtp_amount_minor) filter (where ds.signal_level = 'commit'),0)::bigint,
    now()
  from public.demand_signals ds
  where ds.demand_request_id = v_request_id
  on conflict (demand_request_id) do update set
    want_count = excluded.want_count,
    pledge_count = excluded.pledge_count,
    commit_count = excluded.commit_count,
    wtp_count = excluded.wtp_count,
    wtp_total_minor = excluded.wtp_total_minor,
    pledge_wtp_total_minor = excluded.pledge_wtp_total_minor,
    commit_wtp_total_minor = excluded.commit_wtp_total_minor,
    updated_at = now();

  return coalesce(new, old);
end;
$$;
revoke all on function private.refresh_mara_demand_request_metrics() from public, anon, authenticated;

create trigger demand_signals_refresh_metrics
after insert or update or delete on public.demand_signals
for each row execute function private.refresh_mara_demand_request_metrics();

create or replace function private.touch_mara_creator_customer_from_demand()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_creator_id uuid;
begin
  select dr.creator_id into v_creator_id
  from public.demand_requests dr
  where dr.id = new.demand_request_id;

  if v_creator_id is not null then
    insert into public.creator_customer_relationships (
      creator_id, user_id, first_seen_at, last_activity_at, attribution_source
    ) values (
      v_creator_id, new.user_id, now(), now(), 'mara'
    )
    on conflict (creator_id, user_id) do update set
      last_activity_at = greatest(public.creator_customer_relationships.last_activity_at, excluded.last_activity_at),
      updated_at = now();
  end if;
  return new;
end;
$$;
revoke all on function private.touch_mara_creator_customer_from_demand() from public, anon, authenticated;

create trigger demand_signals_touch_creator_customer
after insert or update on public.demand_signals
for each row execute function private.touch_mara_creator_customer_from_demand();

create or replace function private.touch_mara_creator_customer_from_purchase()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'succeeded' and new.creator_id is not null then
    insert into public.creator_customer_relationships (
      creator_id, user_id, first_seen_at, last_activity_at, attribution_source
    ) values (
      new.creator_id, new.user_id, new.created_at, greatest(new.created_at, coalesce(new.fulfilled_at, new.created_at)), 'mara'
    )
    on conflict (creator_id, user_id) do update set
      first_seen_at = least(public.creator_customer_relationships.first_seen_at, excluded.first_seen_at),
      last_activity_at = greatest(public.creator_customer_relationships.last_activity_at, excluded.last_activity_at),
      updated_at = now();
  end if;
  return new;
end;
$$;
revoke all on function private.touch_mara_creator_customer_from_purchase() from public, anon, authenticated;

create trigger commerce_purchases_touch_creator_customer
after insert or update of status, fulfilled_at on public.commerce_purchases
for each row execute function private.touch_mara_creator_customer_from_purchase();

-- ============================================================
-- 8. RLS + EXPLICIT GRANTS
-- ============================================================

alter table public.creators enable row level security;
alter table public.creator_worlds enable row level security;
alter table public.creator_customer_relationships enable row level security;
alter table public.user_declared_preferences enable row level security;
alter table public.demand_requests enable row level security;
alter table public.demand_signals enable row level security;
alter table public.demand_request_metrics enable row level security;

revoke all on table public.creators from anon, authenticated;
revoke all on table public.creator_worlds from anon, authenticated;
revoke all on table public.creator_customer_relationships from anon, authenticated;
revoke all on table public.user_declared_preferences from anon, authenticated;
revoke all on table public.demand_requests from anon, authenticated;
revoke all on table public.demand_signals from anon, authenticated;
revoke all on table public.demand_request_metrics from anon, authenticated;

grant select on table public.creators to authenticated;
grant select, insert, update on table public.creator_worlds to authenticated;
grant select on table public.creator_worlds to anon;
grant select on table public.creator_customer_relationships to authenticated;
grant select, insert, update, delete on table public.user_declared_preferences to authenticated;
grant select on table public.demand_requests to anon;
grant select, insert, update on table public.demand_requests to authenticated;
grant select, insert, update, delete on table public.demand_signals to authenticated;
grant select on table public.demand_request_metrics to anon, authenticated;

grant all on table public.creators, public.creator_worlds, public.creator_customer_relationships,
  public.user_declared_preferences, public.demand_requests, public.demand_signals, public.demand_request_metrics
  to service_role;

create policy creators_select_own
on public.creators for select
to authenticated
using ((select auth.uid()) = user_id);

create policy creator_worlds_select_public
on public.creator_worlds for select
to anon, authenticated
using (status = 'active' and visibility = 'public');

create policy creator_worlds_select_owner
on public.creator_worlds for select
to authenticated
using (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid())));

create policy creator_worlds_insert_owner
on public.creator_worlds for insert
to authenticated
with check (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()) and c.status in ('pilot','active')));

create policy creator_worlds_update_owner
on public.creator_worlds for update
to authenticated
using (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()) and c.status in ('pilot','active')))
with check (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()) and c.status in ('pilot','active')));

create policy creator_customer_relationships_select_creator
on public.creator_customer_relationships for select
to authenticated
using (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid())));

create policy profiles_select_creator_customers
on public.profiles for select
to authenticated
using (
  exists (
    select 1
    from public.creator_customer_relationships r
    join public.creators c on c.id = r.creator_id
    where r.user_id = public.profiles.id
      and c.user_id = (select auth.uid())
  )
);

drop policy if exists preference_events_insert_own on public.preference_events;
create policy preference_events_insert_own
on public.preference_events for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and (
    signal_scope = 'network'
    or exists (
      select 1 from public.creator_worlds w
      where w.creator_id = public.preference_events.creator_id
        and w.id = public.preference_events.world_id
        and w.status = 'active'
        and w.visibility = 'public'
    )
  )
);

create policy preference_events_select_creator_scoped
on public.preference_events for select
to authenticated
using (
  signal_scope = 'creator_world'
  and creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
);

create policy user_declared_preferences_select_own
on public.user_declared_preferences for select
to authenticated
using ((select auth.uid()) = user_id);

create policy user_declared_preferences_insert_own
on public.user_declared_preferences for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and (
    scope = 'network'
    or exists (
      select 1 from public.creator_worlds w
      where w.creator_id = public.user_declared_preferences.creator_id
        and w.id = public.user_declared_preferences.world_id
        and w.status = 'active'
        and w.visibility = 'public'
    )
  )
);

create policy user_declared_preferences_update_own
on public.user_declared_preferences for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    scope = 'network'
    or exists (
      select 1 from public.creator_worlds w
      where w.creator_id = public.user_declared_preferences.creator_id
        and w.id = public.user_declared_preferences.world_id
        and w.status = 'active'
        and w.visibility = 'public'
    )
  )
);

create policy user_declared_preferences_delete_own
on public.user_declared_preferences for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy user_declared_preferences_select_creator_scoped
on public.user_declared_preferences for select
to authenticated
using (
  creator_visible
  and scope = 'creator_world'
  and creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
);

create policy demand_requests_select_public
on public.demand_requests for select
to anon, authenticated
using (
  status <> 'archived'
  and privacy_mode <> 'private'
  and exists (
    select 1 from public.creator_worlds w
    where w.creator_id = public.demand_requests.creator_id
      and w.id = public.demand_requests.world_id
      and w.status = 'active'
      and w.visibility = 'public'
  )
);

create policy demand_requests_select_creator
on public.demand_requests for select
to authenticated
using (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid())));

create policy demand_requests_select_creator_user
on public.demand_requests for select
to authenticated
using ((select auth.uid()) = created_by_user_id);

create policy demand_requests_select_participant
on public.demand_requests for select
to authenticated
using (
  exists (
    select 1 from public.demand_signals ds
    where ds.demand_request_id = public.demand_requests.id
      and ds.user_id = (select auth.uid())
  )
);

create policy demand_requests_insert_community
on public.demand_requests for insert
to authenticated
with check (
  origin = 'community'
  and created_by_user_id = (select auth.uid())
  and status = 'open'
  and exists (
    select 1 from public.creator_worlds w
    where w.creator_id = public.demand_requests.creator_id
      and w.id = public.demand_requests.world_id
      and w.status = 'active'
      and w.visibility = 'public'
  )
);

create policy demand_requests_insert_creator
on public.demand_requests for insert
to authenticated
with check (
  origin = 'creator'
  and creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()) and c.status in ('pilot','active'))
);

create policy demand_requests_update_creator
on public.demand_requests for update
to authenticated
using (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()) and c.status in ('pilot','active')))
with check (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()) and c.status in ('pilot','active')));

create policy demand_signals_select_own
on public.demand_signals for select
to authenticated
using ((select auth.uid()) = user_id);

create policy demand_signals_select_creator_visible
on public.demand_signals for select
to authenticated
using (
  privacy_mode <> 'private'
  and exists (
    select 1
    from public.demand_requests dr
    join public.creators c on c.id = dr.creator_id
    where dr.id = public.demand_signals.demand_request_id
      and c.user_id = (select auth.uid())
  )
);

create policy demand_signals_insert_own
on public.demand_signals for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.demand_requests dr
    where dr.id = public.demand_signals.demand_request_id
      and dr.status in ('open','validated','unlocked')
  )
);

create policy demand_signals_update_own
on public.demand_signals for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.demand_requests dr
    where dr.id = public.demand_signals.demand_request_id
      and dr.status in ('open','validated','unlocked')
  )
);

create policy demand_signals_delete_own
on public.demand_signals for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy demand_request_metrics_select_public
on public.demand_request_metrics for select
to anon, authenticated
using (
  exists (
    select 1 from public.demand_requests dr
    where dr.id = public.demand_request_metrics.demand_request_id
      and dr.status <> 'archived'
      and dr.privacy_mode <> 'private'
  )
);

create policy demand_request_metrics_select_creator
on public.demand_request_metrics for select
to authenticated
using (
  exists (
    select 1
    from public.demand_requests dr
    join public.creators c on c.id = dr.creator_id
    where dr.id = public.demand_request_metrics.demand_request_id
      and c.user_id = (select auth.uid())
  )
);

create policy demand_request_metrics_select_participant
on public.demand_request_metrics for select
to authenticated
using (
  exists (
    select 1 from public.demand_signals ds
    where ds.demand_request_id = public.demand_request_metrics.demand_request_id
      and ds.user_id = (select auth.uid())
  )
);

grant insert, update on table public.commerce_offers to authenticated;

drop policy if exists commerce_offers_select_active on public.commerce_offers;
create policy commerce_offers_select_active
on public.commerce_offers for select
to anon, authenticated
using (
  status = 'active'
  and (
    world_id is null
    or exists (
      select 1 from public.creator_worlds w
      where w.creator_id = public.commerce_offers.creator_id
        and w.id = public.commerce_offers.world_id
        and w.status = 'active'
        and w.visibility = 'public'
    )
  )
);

create policy commerce_offers_select_creator_owner
on public.commerce_offers for select
to authenticated
using (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid())));

create policy commerce_offers_select_purchased_own
on public.commerce_offers for select
to authenticated
using (
  exists (
    select 1 from public.commerce_purchases p
    where p.offer_id = public.commerce_offers.id
      and p.user_id = (select auth.uid())
  )
);

create policy commerce_offers_insert_creator_owner
on public.commerce_offers for insert
to authenticated
with check (
  creator_id is not null and world_id is not null
  and creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()) and c.status in ('pilot','active'))
  and exists (
    select 1 from public.creator_worlds w
    where w.creator_id = public.commerce_offers.creator_id
      and w.id = public.commerce_offers.world_id
  )
);

create policy commerce_offers_update_creator_owner
on public.commerce_offers for update
to authenticated
using (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()) and c.status in ('pilot','active')))
with check (
  creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()) and c.status in ('pilot','active'))
  and exists (
    select 1 from public.creator_worlds w
    where w.creator_id = public.commerce_offers.creator_id
      and w.id = public.commerce_offers.world_id
  )
);

create policy commerce_purchases_select_creator_owner
on public.commerce_purchases for select
to authenticated
using (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid())));

create policy commerce_entitlements_select_creator_owner
on public.commerce_entitlements for select
to authenticated
using (
  exists (
    select 1 from public.commerce_purchases p
    where p.id = public.commerce_entitlements.purchase_id
      and p.creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
  )
);

-- ============================================================
-- 9. QUERYABLE CRM / OPPORTUNITY / HISTORY VIEWS
-- ============================================================

create view public.creator_customer_summary
with (security_invoker = true)
as
select
  r.creator_id,
  r.user_id,
  p.alias,
  r.first_seen_at,
  r.last_activity_at,
  r.last_creator_action_at,
  r.attribution_source,
  coalesce(s.purchase_count, 0)::bigint as purchase_count,
  coalesce(s.creator_gmv_minor, 0)::bigint as creator_gmv_minor,
  s.first_purchase_at,
  s.last_purchase_at,
  coalesce(s.fulfilled_purchase_count, 0)::bigint as fulfilled_purchase_count,
  s.last_fulfillment_at,
  case
    when coalesce(s.purchase_count, 0) >= 2 then 'repeat_buyer'
    when coalesce(s.purchase_count, 0) = 1 then 'first_buyer'
    when r.last_activity_at < now() - interval '30 days' then 'dormant_prospect'
    else 'prospect'
  end as lifecycle_stage
from public.creator_customer_relationships r
left join public.profiles p on p.id = r.user_id
left join lateral (
  select
    count(*) filter (where cp.status = 'succeeded') as purchase_count,
    coalesce(sum(cp.amount_minor) filter (where cp.status = 'succeeded'),0)::bigint as creator_gmv_minor,
    min(cp.created_at) filter (where cp.status = 'succeeded') as first_purchase_at,
    max(cp.created_at) filter (where cp.status = 'succeeded') as last_purchase_at,
    count(*) filter (where cp.status = 'succeeded' and cp.fulfilled_at is not null) as fulfilled_purchase_count,
    max(cp.fulfilled_at) filter (where cp.status = 'succeeded' and cp.fulfilled_at is not null) as last_fulfillment_at
  from public.commerce_purchases cp
  where cp.creator_id = r.creator_id
    and cp.user_id = r.user_id
) s on true;

revoke all on public.creator_customer_summary from anon, authenticated;
grant select on public.creator_customer_summary to authenticated;

create view public.creator_next_best_actions
with (security_invoker = true)
as
select
  s.creator_id,
  s.user_id,
  case
    when exists (
      select 1 from public.commerce_purchases p
      where p.creator_id = s.creator_id
        and p.user_id = s.user_id
        and p.status = 'succeeded'
        and p.fulfilled_at is null
    ) then 'fulfill'
    when s.last_purchase_at >= now() - interval '3 days' then 'wait'
    when s.purchase_count = 1 and s.last_purchase_at >= now() - interval '10 days' then 'post_purchase_followup'
    when s.last_purchase_at < now() - interval '30 days' then 'reactivate_with_value'
    when s.purchase_count >= 2 then 'related_offer'
    else 'learn_more'
  end as action,
  case
    when exists (
      select 1 from public.commerce_purchases p
      where p.creator_id = s.creator_id
        and p.user_id = s.user_id
        and p.status = 'succeeded'
        and p.fulfilled_at is null
    ) then 'Paid value is still waiting for fulfillment; deliver before selling again.'
    when s.last_purchase_at >= now() - interval '3 days' then 'Recent purchase: protect experience quality and avoid immediate sales pressure.'
    when s.purchase_count = 1 and s.last_purchase_at >= now() - interval '10 days' then 'First buyer: prioritize a relevant post-purchase follow-up before an upsell.'
    when s.last_purchase_at < now() - interval '30 days' then 'Commercial relationship is dormant; reintroduce value before asking for another purchase.'
    when s.purchase_count >= 2 then 'Repeat buyer: a relevant related offer may be appropriate if product fit is strong.'
    else 'Not enough commercial context yet; collect useful preference or demand signals first.'
  end as reason,
  case
    when exists (
      select 1 from public.commerce_purchases p
      where p.creator_id = s.creator_id
        and p.user_id = s.user_id
        and p.status = 'succeeded'
        and p.fulfilled_at is null
    ) then 'high'
    when s.last_purchase_at >= now() - interval '3 days' then 'low'
    else 'medium'
  end as priority,
  jsonb_build_object(
    'purchase_count', s.purchase_count,
    'creator_gmv_minor', s.creator_gmv_minor,
    'last_purchase_at', s.last_purchase_at,
    'lifecycle_stage', s.lifecycle_stage
  ) as evidence
from public.creator_customer_summary s;

revoke all on public.creator_next_best_actions from anon, authenticated;
grant select on public.creator_next_best_actions to authenticated;

create view public.creator_demand_opportunities
with (security_invoker = true)
as
select
  dr.id as demand_request_id,
  dr.creator_id,
  dr.world_id,
  dr.title,
  dr.category,
  dr.fulfillment_type,
  dr.status,
  dr.target_commitments,
  coalesce(m.want_count,0) as want_count,
  coalesce(m.pledge_count,0) as pledge_count,
  coalesce(m.commit_count,0) as commit_count,
  coalesce(m.wtp_count,0) as wtp_count,
  coalesce(m.wtp_total_minor,0) as wtp_total_minor,
  coalesce(m.pledge_wtp_total_minor,0) as pledged_demand_gmv_minor,
  coalesce(m.commit_wtp_total_minor,0) as verified_demand_gmv_minor,
  case when coalesce(m.commit_count,0) > 0
    then round(coalesce(m.commit_wtp_total_minor,0)::numeric / m.commit_count)
    else null
  end as average_commit_wtp_minor,
  least(100, round((coalesce(m.commit_count,0)::numeric / greatest(dr.target_commitments,1)) * 100))::integer as progress_percent,
  dr.updated_at
from public.demand_requests dr
left join public.demand_request_metrics m on m.demand_request_id = dr.id;

revoke all on public.creator_demand_opportunities from anon, authenticated;
grant select on public.creator_demand_opportunities to authenticated;

create view public.user_activity_history
with (security_invoker = true)
as
select
  ds.user_id,
  dr.creator_id,
  dr.world_id,
  upper(ds.signal_level) as event_type,
  ds.updated_at as event_at,
  dr.id as object_id,
  jsonb_build_object('title', dr.title, 'signal_level', ds.signal_level) as metadata
from public.demand_signals ds
join public.demand_requests dr on dr.id = ds.demand_request_id
union all
select
  p.user_id,
  p.creator_id,
  p.world_id,
  'PURCHASE_COMPLETED'::text as event_type,
  p.created_at as event_at,
  p.id as object_id,
  jsonb_build_object('amount_minor', p.amount_minor, 'currency', p.currency, 'status', p.status) as metadata
from public.commerce_purchases p
where p.status = 'succeeded'
union all
select
  p.user_id,
  p.creator_id,
  p.world_id,
  'FULFILLMENT_COMPLETED'::text as event_type,
  p.fulfilled_at as event_at,
  p.id as object_id,
  jsonb_build_object('purchase_id', p.id) as metadata
from public.commerce_purchases p
where p.status = 'succeeded' and p.fulfilled_at is not null
union all
select
  udp.user_id,
  udp.creator_id,
  udp.world_id,
  'PREFERENCE_DECLARED'::text as event_type,
  udp.updated_at as event_at,
  udp.id as object_id,
  jsonb_build_object('preference_type', udp.preference_type, 'scope', udp.scope) as metadata
from public.user_declared_preferences udp;

revoke all on public.user_activity_history from anon, authenticated;
grant select on public.user_activity_history to authenticated;

grant select, insert, update, delete on table public.commerce_offers, public.commerce_purchases to service_role;

-- launch_events remains analytics-only; durable history is derived from product truth.
