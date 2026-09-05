-- Mara Vera — Launch Revenue Loop / Commerce Kernel P0.
-- Apply only to the dedicated Mara Supabase project.
-- Money is stored in minor units. Browser clients never mark payments as paid.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.commerce_offers (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9_-]{1,80}$'),
  type text not null check (type in ('fixed_unlock', 'open_contribution')),
  title text not null check (char_length(title) between 2 and 140),
  description text not null check (char_length(description) between 2 and 1200),
  price_mode text not null check (price_mode in ('fixed', 'custom_amount')),
  amount_minor integer null check (amount_minor is null or amount_minor > 0),
  min_amount_minor integer null check (min_amount_minor is null or min_amount_minor > 0),
  max_amount_minor integer null check (max_amount_minor is null or max_amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  fulfillment_key text null check (fulfillment_key is null or fulfillment_key ~ '^[a-z0-9][a-z0-9_-]{1,100}$'),
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint commerce_offer_fixed_amount check (
    (price_mode = 'fixed' and amount_minor is not null and min_amount_minor is null and max_amount_minor is null)
    or
    (price_mode = 'custom_amount' and amount_minor is null and min_amount_minor is not null and max_amount_minor is not null and min_amount_minor <= max_amount_minor)
  ),
  constraint commerce_offer_type_price_mode check (
    (type = 'fixed_unlock' and price_mode = 'fixed' and fulfillment_key is not null)
    or
    (type = 'open_contribution' and price_mode = 'custom_amount')
  )
);

create table if not exists public.commerce_goals (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9_-]{1,80}$'),
  offer_id uuid not null unique references public.commerce_offers(id) on delete restrict,
  title text not null check (char_length(title) between 2 and 140),
  description text not null check (char_length(description) between 2 and 1400),
  visual_path text null check (visual_path is null or char_length(visual_path) <= 240),
  target_amount_minor integer not null check (target_amount_minor > 0),
  funded_amount_minor integer not null default 0 check (funded_amount_minor >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  status text not null default 'funding' check (status in ('draft', 'funding', 'funded', 'fulfillment', 'canonicalized', 'archived')),
  completed_at timestamptz null,
  world_state_key text not null unique check (world_state_key ~ '^[a-z0-9][a-z0-9_-]{1,100}$'),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_checkout_intents (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  offer_id uuid not null references public.commerce_offers(id) on delete restrict,
  client_request_id uuid not null,
  amount_minor integer not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  provider text not null check (char_length(provider) between 2 and 80),
  provider_checkout_id text null,
  provider_checkout_url text null check (provider_checkout_url is null or char_length(provider_checkout_url) <= 1200),
  status text not null default 'pending' check (status in ('pending', 'provider_failed', 'completed', 'expired', 'canceled')),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint commerce_checkout_user_idempotency unique (user_id, client_request_id),
  constraint commerce_checkout_provider_id unique (provider, provider_checkout_id)
);

create table if not exists public.commerce_purchases (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  offer_id uuid not null references public.commerce_offers(id) on delete restrict,
  checkout_intent_id uuid null unique references public.commerce_checkout_intents(id) on delete set null,
  amount_minor integer not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  provider text not null check (char_length(provider) between 2 and 80),
  provider_payment_id text not null,
  status text not null check (status in ('succeeded', 'failed', 'refunded')),
  fulfilled_at timestamptz null,
  refunded_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint commerce_purchase_provider_payment unique (provider, provider_payment_id)
);

create table if not exists public.commerce_entitlements (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  offer_id uuid not null references public.commerce_offers(id) on delete restrict,
  purchase_id uuid not null unique references public.commerce_purchases(id) on delete cascade,
  entitlement_key text not null check (entitlement_key ~ '^[a-z0-9][a-z0-9_-]{1,100}$'),
  status text not null default 'active' check (status in ('active', 'revoked')),
  granted_at timestamptz not null default now(),
  revoked_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  constraint commerce_entitlement_user_key unique (user_id, entitlement_key)
);

create table if not exists public.commerce_contributions (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  offer_id uuid not null references public.commerce_offers(id) on delete restrict,
  goal_id uuid not null references public.commerce_goals(id) on delete restrict,
  purchase_id uuid not null unique references public.commerce_purchases(id) on delete cascade,
  amount_minor integer not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  status text not null default 'succeeded' check (status in ('succeeded', 'refunded')),
  amount_visibility text not null default 'hidden' check (amount_visibility in ('hidden', 'public')),
  community_alias text null check (community_alias is null or char_length(community_alias) between 2 and 32),
  created_at timestamptz not null default now(),
  refunded_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object')
);

create table if not exists public.commerce_webhook_events (
  id uuid primary key default extensions.gen_random_uuid(),
  provider text not null check (char_length(provider) between 2 and 80),
  provider_event_id text not null,
  event_type text not null check (char_length(event_type) between 2 and 120),
  payload_sha256 text null check (payload_sha256 is null or payload_sha256 ~ '^[a-f0-9]{64}$'),
  status text not null default 'received' check (status in ('received', 'processed', 'ignored', 'failed')),
  received_at timestamptz not null default now(),
  processed_at timestamptz null,
  error text null check (error is null or char_length(error) <= 400),
  constraint commerce_webhook_event_idempotency unique (provider, provider_event_id)
);

alter table public.commerce_offers enable row level security;
alter table public.commerce_goals enable row level security;
alter table public.commerce_checkout_intents enable row level security;
alter table public.commerce_purchases enable row level security;
alter table public.commerce_entitlements enable row level security;
alter table public.commerce_contributions enable row level security;
alter table public.commerce_webhook_events enable row level security;

revoke all on public.commerce_offers from anon, authenticated;
revoke all on public.commerce_goals from anon, authenticated;
revoke all on public.commerce_checkout_intents from anon, authenticated;
revoke all on public.commerce_purchases from anon, authenticated;
revoke all on public.commerce_entitlements from anon, authenticated;
revoke all on public.commerce_contributions from anon, authenticated;
revoke all on public.commerce_webhook_events from anon, authenticated;

grant select on public.commerce_offers to anon, authenticated;
grant select on public.commerce_goals to anon, authenticated;
grant select on public.commerce_checkout_intents to authenticated;
grant select on public.commerce_purchases to authenticated;
grant select on public.commerce_entitlements to authenticated;
grant select on public.commerce_contributions to authenticated;

create policy "commerce_offers_select_active"
on public.commerce_offers
for select
to anon, authenticated
using (status = 'active');

create policy "commerce_goals_select_public_active"
on public.commerce_goals
for select
to anon, authenticated
using (status in ('funding', 'funded', 'fulfillment', 'canonicalized'));

create policy "commerce_checkout_intents_select_own"
on public.commerce_checkout_intents
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "commerce_purchases_select_own"
on public.commerce_purchases
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "commerce_entitlements_select_own"
on public.commerce_entitlements
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "commerce_contributions_select_own"
on public.commerce_contributions
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "commerce_webhook_events_no_browser_access"
on public.commerce_webhook_events
for all
to anon, authenticated
using (false)
with check (false);

create index if not exists commerce_checkout_intents_offer_id_idx
on public.commerce_checkout_intents (offer_id);

create index if not exists commerce_purchases_user_id_idx
on public.commerce_purchases (user_id);

create index if not exists commerce_purchases_offer_id_idx
on public.commerce_purchases (offer_id);

create index if not exists commerce_entitlements_offer_id_idx
on public.commerce_entitlements (offer_id);

create index if not exists commerce_contributions_user_id_idx
on public.commerce_contributions (user_id);

create index if not exists commerce_contributions_offer_id_idx
on public.commerce_contributions (offer_id);

create index if not exists commerce_contributions_goal_id_idx
on public.commerce_contributions (goal_id);

create or replace function private.set_mara_commerce_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_mara_commerce_updated_at() from public, anon, authenticated;

drop trigger if exists set_commerce_offers_updated_at on public.commerce_offers;
create trigger set_commerce_offers_updated_at
before update on public.commerce_offers
for each row execute function private.set_mara_commerce_updated_at();

drop trigger if exists set_commerce_goals_updated_at on public.commerce_goals;
create trigger set_commerce_goals_updated_at
before update on public.commerce_goals
for each row execute function private.set_mara_commerce_updated_at();

drop trigger if exists set_commerce_checkout_intents_updated_at on public.commerce_checkout_intents;
create trigger set_commerce_checkout_intents_updated_at
before update on public.commerce_checkout_intents
for each row execute function private.set_mara_commerce_updated_at();

drop trigger if exists set_commerce_purchases_updated_at on public.commerce_purchases;
create trigger set_commerce_purchases_updated_at
before update on public.commerce_purchases
for each row execute function private.set_mara_commerce_updated_at();

create or replace function private.refresh_mara_commerce_goal_status(p_goal_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_target integer;
  v_funded bigint;
begin
  select target_amount_minor
  into v_target
  from public.commerce_goals
  where id = p_goal_id
  for update;

  if not found then
    raise exception 'commerce_goal_not_found';
  end if;

  select coalesce(sum(amount_minor), 0)
  into v_funded
  from public.commerce_contributions
  where goal_id = p_goal_id and status = 'succeeded';

  update public.commerce_goals
  set
    status = case
      when status in ('draft', 'archived', 'fulfillment', 'canonicalized') then status
      when v_funded >= v_target then 'funded'
      else 'funding'
    end,
    funded_amount_minor = least(v_funded, 2147483647)::integer,
    completed_at = case
      when v_funded >= v_target and completed_at is null then now()
      when v_funded < v_target and status = 'funded' then null
      else completed_at
    end
  where id = p_goal_id;
end;
$$;

revoke all on function private.refresh_mara_commerce_goal_status(uuid) from public, anon, authenticated;

create or replace function public.fulfill_mara_commerce_checkout(
  p_provider text,
  p_provider_event_id text,
  p_provider_checkout_id text,
  p_provider_payment_id text,
  p_amount_minor integer,
  p_currency text,
  p_event_type text default 'payment_succeeded',
  p_payload_sha256 text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_inserted_events integer := 0;
  v_intent public.commerce_checkout_intents%rowtype;
  v_offer public.commerce_offers%rowtype;
  v_goal public.commerce_goals%rowtype;
  v_purchase_id uuid;
begin
  if p_provider is null or char_length(p_provider) < 2 then
    raise exception 'invalid_provider';
  end if;

  if p_provider_event_id is null or char_length(p_provider_event_id) < 2 then
    raise exception 'invalid_provider_event_id';
  end if;

  if p_provider_checkout_id is null or char_length(p_provider_checkout_id) < 2 then
    raise exception 'invalid_provider_checkout_id';
  end if;

  if p_provider_payment_id is null or char_length(p_provider_payment_id) < 2 then
    raise exception 'invalid_provider_payment_id';
  end if;

  if p_amount_minor <= 0 then
    raise exception 'invalid_amount';
  end if;

  if p_currency !~ '^[A-Z]{3}$' then
    raise exception 'invalid_currency';
  end if;

  insert into public.commerce_webhook_events (
    provider,
    provider_event_id,
    event_type,
    payload_sha256,
    status
  )
  values (
    p_provider,
    p_provider_event_id,
    p_event_type,
    p_payload_sha256,
    'received'
  )
  on conflict (provider, provider_event_id) do nothing;

  get diagnostics v_inserted_events = row_count;

  if v_inserted_events = 0 then
    select id
    into v_purchase_id
    from public.commerce_purchases
    where provider = p_provider and provider_payment_id = p_provider_payment_id
    limit 1;

    return v_purchase_id;
  end if;

  select *
  into v_intent
  from public.commerce_checkout_intents
  where provider = p_provider
    and provider_checkout_id = p_provider_checkout_id
  for update;

  if not found then
    update public.commerce_webhook_events
    set status = 'failed', processed_at = now(), error = 'checkout_intent_not_found'
    where provider = p_provider and provider_event_id = p_provider_event_id;
    raise exception 'checkout_intent_not_found';
  end if;

  if v_intent.status = 'completed' then
    select id
    into v_purchase_id
    from public.commerce_purchases
    where checkout_intent_id = v_intent.id
    limit 1;

    update public.commerce_webhook_events
    set status = 'ignored', processed_at = now()
    where provider = p_provider and provider_event_id = p_provider_event_id;

    return v_purchase_id;
  end if;

  if v_intent.status <> 'pending' then
    update public.commerce_webhook_events
    set status = 'failed', processed_at = now(), error = 'checkout_intent_not_pending'
    where provider = p_provider and provider_event_id = p_provider_event_id;
    raise exception 'checkout_intent_not_pending';
  end if;

  if v_intent.amount_minor <> p_amount_minor or v_intent.currency <> p_currency then
    update public.commerce_webhook_events
    set status = 'failed', processed_at = now(), error = 'payment_truth_mismatch'
    where provider = p_provider and provider_event_id = p_provider_event_id;
    raise exception 'payment_truth_mismatch';
  end if;

  select *
  into v_offer
  from public.commerce_offers
  where id = v_intent.offer_id and status = 'active'
  for update;

  if not found then
    update public.commerce_webhook_events
    set status = 'failed', processed_at = now(), error = 'offer_not_active'
    where provider = p_provider and provider_event_id = p_provider_event_id;
    raise exception 'offer_not_active';
  end if;

  insert into public.commerce_purchases (
    user_id,
    offer_id,
    checkout_intent_id,
    amount_minor,
    currency,
    provider,
    provider_payment_id,
    status,
    fulfilled_at,
    metadata
  )
  values (
    v_intent.user_id,
    v_intent.offer_id,
    v_intent.id,
    p_amount_minor,
    p_currency,
    p_provider,
    p_provider_payment_id,
    'succeeded',
    now(),
    jsonb_build_object('provider_event_id', p_provider_event_id)
  )
  on conflict (provider, provider_payment_id) do update
  set updated_at = now()
  returning id into v_purchase_id;

  update public.commerce_checkout_intents
  set status = 'completed'
  where id = v_intent.id;

  if v_offer.type = 'fixed_unlock' then
    insert into public.commerce_entitlements (
      user_id,
      offer_id,
      purchase_id,
      entitlement_key,
      status
    )
    values (
      v_intent.user_id,
      v_intent.offer_id,
      v_purchase_id,
      v_offer.fulfillment_key,
      'active'
    )
    on conflict (user_id, entitlement_key) do update
    set status = 'active', revoked_at = null;
  end if;

  if v_offer.type = 'open_contribution' then
    select *
    into v_goal
    from public.commerce_goals
    where offer_id = v_offer.id
    for update;

    if not found then
      update public.commerce_webhook_events
      set status = 'failed', processed_at = now(), error = 'goal_not_found'
      where provider = p_provider and provider_event_id = p_provider_event_id;
      raise exception 'goal_not_found';
    end if;

    insert into public.commerce_contributions (
      user_id,
      offer_id,
      goal_id,
      purchase_id,
      amount_minor,
      currency,
      status
    )
    values (
      v_intent.user_id,
      v_intent.offer_id,
      v_goal.id,
      v_purchase_id,
      p_amount_minor,
      p_currency,
      'succeeded'
    )
    on conflict (purchase_id) do nothing;

    perform private.refresh_mara_commerce_goal_status(v_goal.id);
  end if;

  update public.commerce_webhook_events
  set status = 'processed', processed_at = now()
  where provider = p_provider and provider_event_id = p_provider_event_id;

  return v_purchase_id;
end;
$$;

revoke all on function public.fulfill_mara_commerce_checkout(text, text, text, text, integer, text, text, text) from public, anon, authenticated;
grant execute on function public.fulfill_mara_commerce_checkout(text, text, text, text, integer, text, text, text) to service_role;

create or replace function public.refund_mara_commerce_purchase(
  p_provider text,
  p_provider_event_id text,
  p_provider_payment_id text,
  p_payload_sha256 text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_inserted_events integer := 0;
  v_purchase public.commerce_purchases%rowtype;
  v_goal_id uuid;
begin
  insert into public.commerce_webhook_events (
    provider,
    provider_event_id,
    event_type,
    payload_sha256,
    status
  )
  values (
    p_provider,
    p_provider_event_id,
    'payment_refunded',
    p_payload_sha256,
    'received'
  )
  on conflict (provider, provider_event_id) do nothing;

  get diagnostics v_inserted_events = row_count;

  if v_inserted_events = 0 then
    select *
    into v_purchase
    from public.commerce_purchases
    where provider = p_provider and provider_payment_id = p_provider_payment_id
    limit 1;

    return v_purchase.id;
  end if;

  select *
  into v_purchase
  from public.commerce_purchases
  where provider = p_provider and provider_payment_id = p_provider_payment_id
  for update;

  if not found then
    update public.commerce_webhook_events
    set status = 'failed', processed_at = now(), error = 'purchase_not_found'
    where provider = p_provider and provider_event_id = p_provider_event_id;
    raise exception 'purchase_not_found';
  end if;

  update public.commerce_purchases
  set status = 'refunded', refunded_at = coalesce(refunded_at, now())
  where id = v_purchase.id;

  update public.commerce_entitlements
  set status = 'revoked', revoked_at = coalesce(revoked_at, now())
  where purchase_id = v_purchase.id;

  update public.commerce_contributions
  set status = 'refunded', refunded_at = coalesce(refunded_at, now())
  where purchase_id = v_purchase.id
  returning goal_id into v_goal_id;

  if v_goal_id is not null then
    perform private.refresh_mara_commerce_goal_status(v_goal_id);
  end if;

  update public.commerce_webhook_events
  set status = 'processed', processed_at = now()
  where provider = p_provider and provider_event_id = p_provider_event_id;

  return v_purchase.id;
end;
$$;

revoke all on function public.refund_mara_commerce_purchase(text, text, text, text) from public, anon, authenticated;
grant execute on function public.refund_mara_commerce_purchase(text, text, text, text) to service_role;

insert into public.commerce_offers (
  slug,
  type,
  title,
  description,
  price_mode,
  amount_minor,
  currency,
  fulfillment_key,
  status,
  metadata
)
values (
  'private_after_scene_note_v1',
  'fixed_unlock',
  'Nota privada de la noche',
  'Una continuación breve y concreta de lo que pasó después de la primera escena. Se desbloquea una vez y queda en tu historia con Mara.',
  'fixed',
  499,
  'USD',
  'private_after_scene_note_v1',
  'active',
  '{"surface":"launch_open_loop","reward_style":"continuation","no_pay_to_affection":true}'::jsonb
)
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  amount_minor = excluded.amount_minor,
  currency = excluded.currency,
  fulfillment_key = excluded.fulfillment_key,
  status = excluded.status,
  metadata = excluded.metadata;

insert into public.commerce_offers (
  slug,
  type,
  title,
  description,
  price_mode,
  min_amount_minor,
  max_amount_minor,
  currency,
  status,
  metadata
)
values (
  'black_bag_capricho_01',
  'open_contribution',
  'Capricho: Black Bag',
  'Mara quiere sumar un objeto a su mundo. La participación es privada por defecto; el progreso público se deriva solo de pagos confirmados.',
  'custom_amount',
  100,
  10000000,
  'USD',
  'active',
  '{"surface":"launch_capricho","world_asset_key":"black_bag_01","hard_close_at_100_percent":true,"private_participation_default":true}'::jsonb
)
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  min_amount_minor = excluded.min_amount_minor,
  max_amount_minor = excluded.max_amount_minor,
  currency = excluded.currency,
  status = excluded.status,
  metadata = excluded.metadata;

insert into public.commerce_goals (
  slug,
  offer_id,
  title,
  description,
  visual_path,
  target_amount_minor,
  funded_amount_minor,
  currency,
  status,
  world_state_key,
  metadata
)
select
  'black_bag_01',
  id,
  'Black Bag',
  'No lo necesita. Ese claramente no es el problema. Si se completa, el objeto entra al canon de Mara como un World Asset real antes de usarse en futuros callbacks.',
  '/mara/mara-v1-reference.jpg',
  42000,
  0,
  'USD',
  'funding',
  'world_asset_black_bag_01',
  '{"overfunding_policy":"hard_close","failure_policy":"disclose_before_payment","contributor_payoff":"First Look + private Mara callback"}'::jsonb
from public.commerce_offers
where slug = 'black_bag_capricho_01'
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  visual_path = excluded.visual_path,
  target_amount_minor = excluded.target_amount_minor,
  funded_amount_minor = least(public.commerce_goals.funded_amount_minor, excluded.target_amount_minor),
  currency = excluded.currency,
  metadata = excluded.metadata;

comment on table public.commerce_offers is
  'Public commercial offer definitions. Contains product facts only; browser clients cannot mark payments as paid.';

comment on table public.commerce_purchases is
  'Private commercial purchase truth. Rows are created only by server-side payment confirmation.';

comment on table public.commerce_contributions is
  'Private Capricho contribution records derived from confirmed purchases. Public progress must not come from browser-editable state.';

comment on function public.fulfill_mara_commerce_checkout(text, text, text, text, integer, text, text, text) is
  'Service-role-only idempotent payment fulfillment. Verifies provider amount/currency against checkout intent, grants entitlements or contributions, and processes duplicate webhooks safely.';
