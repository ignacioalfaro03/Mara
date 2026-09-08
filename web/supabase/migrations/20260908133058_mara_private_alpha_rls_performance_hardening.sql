-- Mara — Private Alpha RLS/performance hardening
-- Live Supabase migration: 20260908133058 / mara_private_alpha_rls_performance_hardening
-- Adds FK-covering indexes and consolidates permissive policies without weakening access boundaries.

create index commerce_offers_creator_world_fk_idx on public.commerce_offers (creator_id, world_id);
create index commerce_purchases_creator_world_fk_idx on public.commerce_purchases (creator_id, world_id);
create index demand_requests_created_by_user_idx on public.demand_requests (created_by_user_id) where created_by_user_id is not null;
create index demand_requests_creator_world_fk_idx on public.demand_requests (creator_id, world_id);
create index user_declared_preferences_creator_world_fk_idx on public.user_declared_preferences (creator_id, world_id) where creator_id is not null;

-- Creator Worlds
drop policy if exists creator_worlds_select_public on public.creator_worlds;
drop policy if exists creator_worlds_select_owner on public.creator_worlds;
create policy creator_worlds_select_public_anon
on public.creator_worlds for select
to anon
using (status = 'active' and visibility = 'public');
create policy creator_worlds_select_authenticated
on public.creator_worlds for select
to authenticated
using (
  (status = 'active' and visibility = 'public')
  or creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
);

-- Profiles
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_select_creator_customers on public.profiles;
create policy profiles_select_authenticated
on public.profiles for select
to authenticated
using (
  id = (select auth.uid())
  or exists (
    select 1
    from public.creator_customer_relationships r
    join public.creators c on c.id = r.creator_id
    where r.user_id = public.profiles.id
      and c.user_id = (select auth.uid())
  )
);

-- Preference events
drop policy if exists preference_events_select_own on public.preference_events;
drop policy if exists preference_events_select_creator_scoped on public.preference_events;
create policy preference_events_select_authenticated
on public.preference_events for select
to authenticated
using (
  user_id = (select auth.uid())
  or (
    signal_scope = 'creator_world'
    and creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
  )
);

-- Declared preferences
drop policy if exists user_declared_preferences_select_own on public.user_declared_preferences;
drop policy if exists user_declared_preferences_select_creator_scoped on public.user_declared_preferences;
create policy user_declared_preferences_select_authenticated
on public.user_declared_preferences for select
to authenticated
using (
  user_id = (select auth.uid())
  or (
    creator_visible
    and scope = 'creator_world'
    and creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
  )
);

-- Demand requests
drop policy if exists demand_requests_select_public on public.demand_requests;
drop policy if exists demand_requests_select_creator on public.demand_requests;
drop policy if exists demand_requests_select_creator_user on public.demand_requests;
drop policy if exists demand_requests_select_participant on public.demand_requests;
create policy demand_requests_select_public_anon
on public.demand_requests for select
to anon
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
create policy demand_requests_select_authenticated
on public.demand_requests for select
to authenticated
using (
  (
    status <> 'archived'
    and privacy_mode <> 'private'
    and exists (
      select 1 from public.creator_worlds w
      where w.creator_id = public.demand_requests.creator_id
        and w.id = public.demand_requests.world_id
        and w.status = 'active'
        and w.visibility = 'public'
    )
  )
  or creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
  or created_by_user_id = (select auth.uid())
  or (select private.is_mara_demand_participant(public.demand_requests.id))
);

drop policy if exists demand_requests_insert_community on public.demand_requests;
drop policy if exists demand_requests_insert_creator on public.demand_requests;
create policy demand_requests_insert_authenticated
on public.demand_requests for insert
to authenticated
with check (
  (
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
  )
  or (
    origin = 'creator'
    and creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()) and c.status in ('pilot','active'))
  )
);

-- Demand signals
drop policy if exists demand_signals_select_own on public.demand_signals;
drop policy if exists demand_signals_select_creator_visible on public.demand_signals;
create policy demand_signals_select_authenticated
on public.demand_signals for select
to authenticated
using (
  user_id = (select auth.uid())
  or (
    privacy_mode <> 'private'
    and exists (
      select 1
      from public.demand_requests dr
      join public.creators c on c.id = dr.creator_id
      where dr.id = public.demand_signals.demand_request_id
        and c.user_id = (select auth.uid())
    )
  )
);

-- Demand metrics
drop policy if exists demand_request_metrics_select_public on public.demand_request_metrics;
drop policy if exists demand_request_metrics_select_creator on public.demand_request_metrics;
drop policy if exists demand_request_metrics_select_participant on public.demand_request_metrics;
create policy demand_request_metrics_select_public_anon
on public.demand_request_metrics for select
to anon
using (
  exists (
    select 1 from public.demand_requests dr
    where dr.id = public.demand_request_metrics.demand_request_id
      and dr.status <> 'archived'
      and dr.privacy_mode <> 'private'
  )
);
create policy demand_request_metrics_select_authenticated
on public.demand_request_metrics for select
to authenticated
using (
  exists (
    select 1
    from public.demand_requests dr
    where dr.id = public.demand_request_metrics.demand_request_id
      and (
        (dr.status <> 'archived' and dr.privacy_mode <> 'private')
        or dr.creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
        or dr.created_by_user_id = (select auth.uid())
        or (select private.is_mara_demand_participant(dr.id))
      )
  )
);

-- Commerce offers
drop policy if exists commerce_offers_select_active on public.commerce_offers;
drop policy if exists commerce_offers_select_creator_owner on public.commerce_offers;
drop policy if exists commerce_offers_select_purchased_own on public.commerce_offers;
create policy commerce_offers_select_public_anon
on public.commerce_offers for select
to anon
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
create policy commerce_offers_select_authenticated
on public.commerce_offers for select
to authenticated
using (
  (
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
  )
  or creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
  or exists (
    select 1 from public.commerce_purchases p
    where p.offer_id = public.commerce_offers.id
      and p.user_id = (select auth.uid())
  )
);

-- Commerce purchases
drop policy if exists commerce_purchases_select_own on public.commerce_purchases;
drop policy if exists commerce_purchases_select_creator_owner on public.commerce_purchases;
create policy commerce_purchases_select_authenticated
on public.commerce_purchases for select
to authenticated
using (
  user_id = (select auth.uid())
  or creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
);

-- Entitlements
drop policy if exists commerce_entitlements_select_own on public.commerce_entitlements;
drop policy if exists commerce_entitlements_select_creator_owner on public.commerce_entitlements;
create policy commerce_entitlements_select_authenticated
on public.commerce_entitlements for select
to authenticated
using (
  user_id = (select auth.uid())
  or exists (
    select 1 from public.commerce_purchases p
    where p.id = public.commerce_entitlements.purchase_id
      and p.creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid()))
  )
);
