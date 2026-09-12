-- MARA PAYMENT-BACKED FULFILLMENT V1 — DRAFT ONLY.
--
-- DO NOT APPLY DIRECTLY TO THE CONNECTED PRODUCTION DATABASE.
-- Depends on reviewed activation of:
--   - mara_payment_ledger_v1.sql
--   - mara_payment_capture_materialization_v1.sql
--   - the existing canonical commerce fulfillment kernel
--
-- Goal:
--   commerce_payments.id (server-authoritative succeeded capture)
--   -> canonical commerce purchase/entitlement/contribution fulfillment
--   -> commerce_payments.purchase_id link
--
-- The caller supplies only a payment UUID. Provider id, checkout id, amount,
-- currency and buyer/offer truth are reloaded from the database.

create or replace function public.fulfill_mara_materialized_payment_v1(
  p_payment_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_payment public.commerce_payments%rowtype;
  v_intent public.commerce_checkout_intents%rowtype;
  v_purchase_id uuid;
  v_fulfillment_event_id text;
begin
  if p_payment_id is null then
    raise exception 'payment_id_required';
  end if;

  select *
  into v_payment
  from public.commerce_payments p
  where p.id = p_payment_id
  for update;

  if not found then
    raise exception 'materialized_payment_not_found';
  end if;

  if v_payment.status <> 'succeeded' then
    raise exception 'materialized_payment_not_succeeded';
  end if;

  if v_payment.purchase_id is not null then
    return v_payment.purchase_id;
  end if;

  select *
  into v_intent
  from public.commerce_checkout_intents ci
  where ci.id = v_payment.checkout_intent_id
  for update;

  if not found then
    raise exception 'materialized_payment_checkout_not_found';
  end if;

  if v_intent.provider <> v_payment.provider then
    raise exception 'materialized_payment_provider_mismatch';
  end if;
  if v_intent.provider_account_id_snapshot is null
     or v_intent.provider_account_id_snapshot <> v_payment.provider_account_id then
    raise exception 'materialized_payment_provider_account_mismatch';
  end if;
  if v_intent.amount_minor <> v_payment.amount_minor then
    raise exception 'materialized_payment_amount_mismatch';
  end if;
  if v_intent.currency <> v_payment.currency then
    raise exception 'materialized_payment_currency_mismatch';
  end if;
  if v_intent.provider_checkout_id is null or char_length(v_intent.provider_checkout_id) < 2 then
    raise exception 'materialized_payment_provider_checkout_missing';
  end if;
  if v_intent.status not in ('pending', 'completed') then
    raise exception 'materialized_payment_checkout_not_fulfillable';
  end if;

  -- Synthetic deterministic event identity: product fulfillment is now driven from
  -- the already-materialized payment, not directly from provider-delivered fields.
  v_fulfillment_event_id := 'financial_fulfillment:' || v_payment.id::text;

  select public.fulfill_mara_commerce_checkout(
    v_payment.provider,
    v_fulfillment_event_id,
    v_intent.provider_checkout_id,
    v_payment.provider_payment_id,
    v_payment.amount_minor::integer,
    v_payment.currency,
    'payment_succeeded',
    null
  ) into v_purchase_id;

  if v_purchase_id is null then
    raise exception 'materialized_payment_purchase_missing';
  end if;

  update public.commerce_payments
  set purchase_id = v_purchase_id,
      updated_at = now()
  where id = v_payment.id
    and purchase_id is null;

  -- If a concurrent/replayed fulfillment linked the payment first, converge to the
  -- canonical purchase rather than creating a second product record.
  select purchase_id
  into v_purchase_id
  from public.commerce_payments
  where id = v_payment.id;

  if v_purchase_id is null then
    raise exception 'materialized_payment_purchase_link_failed';
  end if;

  return v_purchase_id;
end;
$$;

revoke all on function public.fulfill_mara_materialized_payment_v1(uuid) from public, anon, authenticated;
grant execute on function public.fulfill_mara_materialized_payment_v1(uuid) to service_role;

-- Required isolated non-production proof:
-- 1. anon/authenticated cannot execute this RPC;
-- 2. non-succeeded payment cannot create a purchase;
-- 3. caller cannot supply amount/currency/provider/offer/buyer truth;
-- 4. duplicate invocation returns the same purchase id;
-- 5. payment.purchase_id links to the canonical commerce purchase;
-- 6. fixed unlock entitlement and contribution behavior remain canonical;
-- 7. webhook route can only call this after successful financial materialization;
-- 8. production fulfillment remains disabled until an explicit release gate.
