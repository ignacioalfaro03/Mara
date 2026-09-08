-- Mara Creator Alpha: preserve paid-but-unfulfilled state for manual creator offers.
-- Additive behavioral hardening: no new tables, no destructive data changes.

create or replace function private.set_mara_purchase_creator_scope()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_offer public.commerce_offers%rowtype;
  v_manual boolean := false;
begin
  select *
    into v_offer
  from public.commerce_offers o
  where o.id = new.offer_id;

  new.creator_id := v_offer.creator_id;
  new.world_id := v_offer.world_id;

  v_manual := v_offer.creator_id is not null
    and (
      v_offer.offer_family in ('personalized_digital','bounded_interaction')
      or coalesce(v_offer.metadata ->> 'fulfillment_mode', '') = 'creator_manual'
    );

  if tg_op = 'INSERT' and new.status = 'succeeded' and v_manual then
    new.fulfilled_at := null;
  end if;

  return new;
end;
$$;
revoke all on function private.set_mara_purchase_creator_scope() from public, anon, authenticated;

create or replace function private.prevent_early_manual_entitlement()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_fulfilled_at timestamptz;
  v_creator_id uuid;
  v_offer_family text;
  v_metadata jsonb;
begin
  select p.fulfilled_at, o.creator_id, o.offer_family, o.metadata
    into v_fulfilled_at, v_creator_id, v_offer_family, v_metadata
  from public.commerce_purchases p
  join public.commerce_offers o on o.id = p.offer_id
  where p.id = new.purchase_id;

  if v_creator_id is not null
     and (
       v_offer_family in ('personalized_digital','bounded_interaction')
       or coalesce(v_metadata ->> 'fulfillment_mode', '') = 'creator_manual'
     )
     and v_fulfilled_at is null then
    return null;
  end if;

  return new;
end;
$$;
revoke all on function private.prevent_early_manual_entitlement() from public, anon, authenticated;

drop trigger if exists commerce_entitlements_block_early_manual on public.commerce_entitlements;
create trigger commerce_entitlements_block_early_manual
before insert on public.commerce_entitlements
for each row execute function private.prevent_early_manual_entitlement();

create or replace function public.complete_mara_creator_fulfillment(p_purchase_id uuid)
returns table(purchase_id uuid, fulfilled_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid;
  v_purchase public.commerce_purchases%rowtype;
  v_offer public.commerce_offers%rowtype;
  v_manual boolean := false;
begin
  v_uid := (select auth.uid());
  if v_uid is null then
    raise exception 'authentication_required';
  end if;

  select p.*
    into v_purchase
  from public.commerce_purchases p
  join public.creators c on c.id = p.creator_id
  where p.id = p_purchase_id
    and c.user_id = v_uid
  for update of p;

  if not found then
    raise exception 'purchase_not_authorized';
  end if;

  if v_purchase.status <> 'succeeded' then
    raise exception 'purchase_not_fulfillable';
  end if;

  select *
    into v_offer
  from public.commerce_offers o
  where o.id = v_purchase.offer_id;

  v_manual := v_offer.creator_id is not null
    and (
      v_offer.offer_family in ('personalized_digital','bounded_interaction')
      or coalesce(v_offer.metadata ->> 'fulfillment_mode', '') = 'creator_manual'
    );

  if not v_manual then
    raise exception 'manual_fulfillment_not_required';
  end if;

  if v_purchase.fulfilled_at is null then
    update public.commerce_purchases p
    set fulfilled_at = now(), updated_at = now()
    where p.id = v_purchase.id
    returning p.* into v_purchase;
  end if;

  if v_offer.type = 'fixed_unlock' and v_offer.fulfillment_key is not null then
    insert into public.commerce_entitlements (
      user_id,
      offer_id,
      purchase_id,
      entitlement_key,
      status,
      granted_at,
      revoked_at,
      metadata
    )
    values (
      v_purchase.user_id,
      v_offer.id,
      v_purchase.id,
      v_offer.fulfillment_key,
      'active',
      now(),
      null,
      jsonb_build_object('fulfillment_mode','creator_manual')
    )
    on conflict (user_id, entitlement_key) do update
      set offer_id = excluded.offer_id,
          purchase_id = excluded.purchase_id,
          status = 'active',
          granted_at = now(),
          revoked_at = null,
          metadata = public.commerce_entitlements.metadata || excluded.metadata;
  end if;

  update public.creator_customer_relationships r
  set last_creator_action_at = now(),
      last_activity_at = greatest(r.last_activity_at, now()),
      updated_at = now()
  where r.creator_id = v_purchase.creator_id
    and r.user_id = v_purchase.user_id;

  return query select v_purchase.id, v_purchase.fulfilled_at;
end;
$$;

revoke all on function public.complete_mara_creator_fulfillment(uuid) from public, anon;
grant execute on function public.complete_mara_creator_fulfillment(uuid) to authenticated;
comment on function public.complete_mara_creator_fulfillment(uuid) is
  'Creator-scoped manual fulfillment. Only the owning creator may complete paid personalized/bounded offers; entitlement is granted only after fulfillment.';
