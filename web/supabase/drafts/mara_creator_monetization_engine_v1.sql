-- MARA CREATOR MONETIZATION ENGINE V1
-- DRAFT ONLY / DO NOT APPLY DIRECTLY.
--
-- This file is intentionally staged under supabase/drafts, not migrations.
-- It must be reconciled against the current Mara preview database, reviewed for RLS,
-- tested with Supabase CLI/advisors and explicitly authorized before becoming a migration.
--
-- Reuse, do not duplicate:
-- - commerce_offers / checkout / purchases / entitlements = canonical sale/payment spine
-- - commerce_goals + commerce_contributions = WISH/GOAL implementation
-- - creator_requests = CUSTOM_REQUEST implementation
-- - creator_threads + creator_messages + creator_content = PAID_INTERACTION implementation
-- - preference_events = creator-scoped Taste Engine event persistence
-- - payment ledger draft = future settled-money authority
--
-- New in this draft:
-- - offer mechanism vocabulary
-- - creator auctions + atomic service-only bid RPC
--
-- Browser clients never receive auction mutation grants.

begin;

-- ---------------------------------------------------------------------------
-- 1. Common mechanism vocabulary
-- ---------------------------------------------------------------------------

alter table public.commerce_offers
  add column if not exists mechanism text;

update public.commerce_offers
set mechanism = case
  when type = 'open_contribution' then 'WISH'
  else coalesce(nullif(metadata->>'mechanism', ''), 'FIXED_PRICE')
end
where mechanism is null;

alter table public.commerce_offers
  alter column mechanism set default 'FIXED_PRICE';

alter table public.commerce_offers
  add constraint commerce_offers_mechanism_v1_check
  check (mechanism in (
    'FIXED_PRICE',
    'AUCTION',
    'WISH',
    'CUSTOM_REQUEST',
    'LIMITED_DROP',
    'MEMBERSHIP',
    'PAID_INTERACTION'
  )) not valid;

-- Validate only after preview data inspection.
-- alter table public.commerce_offers validate constraint commerce_offers_mechanism_v1_check;

-- ---------------------------------------------------------------------------
-- 2. Auctions
-- ---------------------------------------------------------------------------

create table if not exists public.creator_auctions (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  world_id uuid not null,
  offer_id uuid null references public.commerce_offers(id) on delete set null,
  title text not null check (char_length(title) between 2 and 180),
  description text not null default '' check (char_length(description) <= 4000),
  currency text not null default 'CLP' check (currency ~ '^[A-Z]{3}$'),
  starting_bid_minor bigint not null check (starting_bid_minor > 0),
  minimum_increment_minor bigint not null check (minimum_increment_minor > 0),
  current_bid_minor bigint null check (current_bid_minor is null or current_bid_minor > 0),
  current_bidder_user_id uuid null references auth.users(id) on delete set null,
  bid_count integer not null default 0 check (bid_count >= 0),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  anti_sniping_window_seconds integer not null default 120
    check (anti_sniping_window_seconds between 0 and 3600),
  anti_sniping_extension_seconds integer not null default 120
    check (anti_sniping_extension_seconds between 0 and 3600),
  status text not null default 'draft'
    check (status in ('draft','scheduled','active','ended','cancelled')),
  winner_user_id uuid null references auth.users(id) on delete set null,
  winning_bid_id uuid null,
  payment_due_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  constraint creator_auctions_time_order check (ends_at > starts_at),
  constraint creator_auctions_creator_world_fk
    foreign key (creator_id, world_id)
    references public.creator_worlds (creator_id, id)
    on delete cascade
);

create index if not exists creator_auctions_creator_status_idx
  on public.creator_auctions (creator_id, status, ends_at asc);
create index if not exists creator_auctions_world_status_idx
  on public.creator_auctions (world_id, status, ends_at asc);
create index if not exists creator_auctions_offer_idx
  on public.creator_auctions (offer_id)
  where offer_id is not null;

create table if not exists public.creator_auction_bids (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.creator_auctions(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  idempotency_key text not null check (char_length(idempotency_key) between 8 and 180),
  status text not null default 'accepted'
    check (status in ('accepted','outbid','winning','won','invalidated')),
  placed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  unique (auction_id, idempotency_key)
);

create index if not exists creator_auction_bids_auction_amount_idx
  on public.creator_auction_bids (auction_id, amount_minor desc, placed_at asc);
create index if not exists creator_auction_bids_creator_user_idx
  on public.creator_auction_bids (creator_id, user_id, placed_at desc);

alter table public.creator_auctions
  add constraint creator_auctions_winning_bid_fk
  foreign key (winning_bid_id) references public.creator_auction_bids(id) on delete set null
  not valid;

alter table public.creator_auctions enable row level security;
alter table public.creator_auction_bids enable row level security;

revoke all on table public.creator_auctions from anon, authenticated;
revoke all on table public.creator_auction_bids from anon, authenticated;
grant select on table public.creator_auctions to anon, authenticated;
grant all on table public.creator_auctions to service_role;
grant all on table public.creator_auction_bids to service_role;

-- Public reads expose only the auction-level market state. Individual bid rows are
-- service-only so a public client cannot enumerate bidder identities or bid history.
create policy creator_auctions_public_select_v1
  on public.creator_auctions
  for select
  to anon, authenticated
  using (
    status in ('scheduled','active','ended')
    and exists (
      select 1
      from public.creator_worlds w
      where w.id = creator_auctions.world_id
        and w.creator_id = creator_auctions.creator_id
        and w.status = 'active'
        and w.visibility = 'public'
    )
  );

-- Atomic bid placement. This function is intentionally in the exposed `public`
-- schema ONLY so PostgREST can call it with the server credential. It is SECURITY
-- INVOKER, not DEFINER, and EXECUTE is revoked from browser roles. The service role
-- is the sole caller and the Next.js route authenticates the user before passing
-- p_user_id. This avoids exposing the private schema through the Data API.
create or replace function public.place_creator_auction_bid_v1(
  p_auction_id uuid,
  p_creator_id uuid,
  p_user_id uuid,
  p_amount_minor bigint,
  p_idempotency_key text,
  p_placed_at timestamptz default now()
)
returns table (
  bid_id uuid,
  accepted_amount_minor bigint,
  next_ends_at timestamptz,
  extended boolean
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_auction public.creator_auctions%rowtype;
  v_minimum bigint;
  v_bid_id uuid;
  v_next_ends_at timestamptz;
  v_extended boolean := false;
begin
  if p_amount_minor is null or p_amount_minor <= 0 then
    raise exception 'invalid_bid_amount';
  end if;

  if p_idempotency_key is null or char_length(p_idempotency_key) < 8 then
    raise exception 'invalid_idempotency_key';
  end if;

  select * into v_auction
  from public.creator_auctions
  where id = p_auction_id
    and creator_id = p_creator_id
  for update;

  if not found then
    raise exception 'auction_not_found';
  end if;

  select b.id into v_bid_id
  from public.creator_auction_bids b
  where b.auction_id = p_auction_id
    and b.idempotency_key = p_idempotency_key;

  if v_bid_id is not null then
    return query
    select b.id, b.amount_minor, v_auction.ends_at, false
    from public.creator_auction_bids b
    where b.id = v_bid_id;
    return;
  end if;

  if v_auction.status <> 'active' then
    raise exception 'auction_not_active';
  end if;

  if p_placed_at < v_auction.starts_at then
    raise exception 'auction_not_started';
  end if;

  if p_placed_at >= v_auction.ends_at then
    raise exception 'auction_ended';
  end if;

  v_minimum := case
    when v_auction.current_bid_minor is null then v_auction.starting_bid_minor
    else v_auction.current_bid_minor + v_auction.minimum_increment_minor
  end;

  if p_amount_minor < v_minimum then
    raise exception 'bid_too_low minimum=%', v_minimum;
  end if;

  update public.creator_auction_bids
  set status = 'outbid'
  where auction_id = p_auction_id
    and status = 'winning';

  insert into public.creator_auction_bids (
    auction_id,
    creator_id,
    user_id,
    amount_minor,
    currency,
    idempotency_key,
    status,
    placed_at
  ) values (
    p_auction_id,
    p_creator_id,
    p_user_id,
    p_amount_minor,
    v_auction.currency,
    p_idempotency_key,
    'winning',
    p_placed_at
  )
  returning id into v_bid_id;

  v_next_ends_at := v_auction.ends_at;
  if v_auction.anti_sniping_window_seconds > 0
     and v_auction.anti_sniping_extension_seconds > 0
     and p_placed_at >= v_auction.ends_at - make_interval(secs => v_auction.anti_sniping_window_seconds)
  then
    v_next_ends_at := v_auction.ends_at + make_interval(secs => v_auction.anti_sniping_extension_seconds);
    v_extended := true;
  end if;

  update public.creator_auctions
  set current_bid_minor = p_amount_minor,
      current_bidder_user_id = p_user_id,
      winning_bid_id = v_bid_id,
      bid_count = bid_count + 1,
      ends_at = v_next_ends_at,
      updated_at = now()
  where id = p_auction_id;

  return query select v_bid_id, p_amount_minor, v_next_ends_at, v_extended;
end;
$$;

revoke execute on function public.place_creator_auction_bid_v1(uuid, uuid, uuid, bigint, text, timestamptz)
  from public, anon, authenticated;
grant execute on function public.place_creator_auction_bid_v1(uuid, uuid, uuid, bigint, text, timestamptz)
  to service_role;

-- ---------------------------------------------------------------------------
-- 3. Taste Engine reuse — no duplicate table
-- ---------------------------------------------------------------------------

-- `preference_events` already supports creator/world scoping via the live
-- private-alpha foundation migration. Keep Taste Engine writes on that table.
-- Current API groups are explicit binary choices (format, personalization,
-- length, offer style). Do not create a second creator_taste_choices silo.
--
-- The existing table already enforces:
-- - authenticated user ownership;
-- - idempotent client_event_id per user;
-- - creator/world composite scope when signal_scope = 'creator_world';
-- - literal selected/alternative options rather than inferred traits.

-- ---------------------------------------------------------------------------
-- 4. Explicit reuse notes / no duplicate tables
-- ---------------------------------------------------------------------------

comment on column public.commerce_offers.mechanism is
  'Creator Commerce mechanism. WISH reuses commerce_goals/contributions; CUSTOM_REQUEST reuses creator_requests; PAID_INTERACTION reuses creator threads/messages/content plus canonical offers/purchases.';

comment on table public.creator_auctions is
  'Creator-scoped auction market state. A bid is free and is not a purchase; only the eventual winner may enter canonical checkout.';

comment on table public.creator_auction_bids is
  'Service-only observed willingness-to-pay events. Bid rows are not public customer history and are not settled money.';

comment on table public.preference_events is
  'Shared explicit preference-event stream. Creator Taste Engine uses creator_world scope; do not use it for psychographic/vulnerability profiling.';

rollback;

-- DRAFT ends with ROLLBACK by design. Do not remove until promoted through the
-- reviewed Mara preview migration process.
