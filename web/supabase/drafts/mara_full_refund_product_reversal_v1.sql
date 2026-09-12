-- MARA FULL REFUND PRODUCT REVERSAL V1 — DRAFT ONLY.
--
-- DO NOT APPLY DIRECTLY TO THE CONNECTED PRODUCTION DATABASE.
-- Depends on reviewed activation of:
--   - mara_payment_ledger_v1.sql
--   - mara_payment_capture_materialization_v1.sql
--   - mara_payment_backed_fulfillment_v1.sql
--   - mara_payment_refund_materialization_v1.sql
--
-- Goal:
--   fully-refunded commerce_payments.id
--   -> canonical commerce purchase product reversal
--
-- The caller supplies only a payment UUID. Purchase/provider/refund truth is
-- reloaded from the database. Partial refunds can never revoke product access.

create or replace function public.reverse_mara_fully_refunded_payment_product_v1(
  p_payment_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_payment public.commerce_payments%rowtype;
  v_purchase public.commerce_purchases%rowtype;
  v_goal_id uuid;
  v_refund_total bigint;
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
    raise exception 'refunded_payment_not_found';
  end if;

  if v_payment.purchase_id is null then
    raise exception 'refunded_payment_purchase_required';
  end if;

  -- Fail closed: product reversal is authorized only by the fully-refunded
  -- financial state, never by a webhook payload or a partial refund request.
  if v_payment.status <> 'refunded'
     or v_payment.refunded_amount_minor <> v_payment.amount_minor then
    raise exception 'payment_not_fully_refunded';
  end if;

  select coalesce(sum(r.amount_minor), 0)
  into v_refund_total
  from public.commerce_refunds r
  where r.payment_id = v_payment.id
    and r.status = 'succeeded';

  if v_refund_total <> v_payment.amount_minor then
    raise exception 'refund_materialization_total_mismatch';
  end if;

  select *
  into v_purchase
  from public.commerce_purchases p
  where p.id = v_payment.purchase_id
  for update;

  if not found then
    raise exception 'refunded_purchase_not_found';
  end if;

  if v_purchase.provider <> v_payment.provider
     or v_purchase.provider_payment_id <> v_payment.provider_payment_id
     or v_purchase.amount_minor::bigint <> v_payment.amount_minor
     or v_purchase.currency <> v_payment.currency then
    raise exception 'refunded_purchase_payment_truth_mismatch';
  end if;

  -- Idempotent convergence: a repeated full-refund reversal returns the same
  -- purchase after ensuring downstream product state remains revoked.
  if v_purchase.status not in ('succeeded', 'refunded') then
    raise exception 'refunded_purchase_state_invalid';
  end if;

  update public.commerce_purchases
  set status = 'refunded',
      refunded_at = coalesce(refunded_at, now()),
      updated_at = now()
  where id = v_purchase.id;

  update public.commerce_entitlements
  set status = 'revoked',
      revoked_at = coalesce(revoked_at, now())
  where purchase_id = v_purchase.id
    and status <> 'revoked';

  update public.commerce_contributions
  set status = 'refunded',
      refunded_at = coalesce(refunded_at, now())
  where purchase_id = v_purchase.id
    and status <> 'refunded'
  returning goal_id into v_goal_id;

  if v_goal_id is not null then
    perform private.refresh_mara_commerce_goal_status(v_goal_id);
  end if;

  return v_purchase.id;
end;
$$;

revoke all on function public.reverse_mara_fully_refunded_payment_product_v1(uuid) from public, anon, authenticated;
grant execute on function public.reverse_mara_fully_refunded_payment_product_v1(uuid) to service_role;

-- Required isolated non-production proof:
-- 1. anon/authenticated cannot execute this RPC;
-- 2. partial refund cannot change purchase/entitlement/contribution state;
-- 3. payment.status must be refunded and refunded_amount_minor = amount_minor;
-- 4. succeeded commerce_refunds must sum exactly to captured amount;
-- 5. purchase/provider/payment/amount/currency truth must match the payment;
-- 6. duplicate invocation converges to the same refunded product state;
-- 7. financial ledger remains append-only and untouched by product reversal;
-- 8. production product reversal remains disabled until explicit release authorization.
