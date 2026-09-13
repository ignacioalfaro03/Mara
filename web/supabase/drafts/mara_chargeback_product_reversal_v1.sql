-- MARA CHARGEBACK PRODUCT REVERSAL V1 — DRAFT ONLY.
--
-- DO NOT APPLY DIRECTLY TO THE CONNECTED PRODUCTION DATABASE.
-- Depends on reviewed activation of:
--   - mara_payment_ledger_v1.sql
--   - mara_payment_chargeback_dispute_control_v1.sql
--   - existing commerce purchase / entitlement / contribution kernel
--
-- Goal:
--   financially materialized full chargeback
--   -> explicit product chargeback state
--   -> entitlement revocation / contribution reversal
--
-- A dispute/open case can never reach this RPC. The caller supplies only a Mara
-- payment UUID; chargeback case, ledger and purchase truth are reloaded from DB.

alter table public.commerce_purchases
  add column if not exists charged_back_at timestamptz null;

alter table public.commerce_purchases
  drop constraint if exists commerce_purchases_status_check;
alter table public.commerce_purchases
  add constraint commerce_purchases_status_check
  check (status in ('succeeded','failed','refunded','chargeback'));

alter table public.commerce_contributions
  add column if not exists charged_back_at timestamptz null;

alter table public.commerce_contributions
  drop constraint if exists commerce_contributions_status_check;
alter table public.commerce_contributions
  add constraint commerce_contributions_status_check
  check (status in ('succeeded','refunded','chargeback'));

create or replace function public.reverse_mara_chargeback_payment_product_v1(
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
  v_case public.commerce_payment_cases%rowtype;
  v_case_count integer;
  v_chargeback_tx_id uuid;
  v_goal_id uuid;
begin
  if p_payment_id is null then
    raise exception 'chargeback_product_payment_id_required';
  end if;

  select * into v_payment
  from public.commerce_payments p
  where p.id = p_payment_id
  for update;

  if not found then raise exception 'chargeback_product_payment_not_found'; end if;
  if v_payment.provider <> 'mercado_pago_sandbox' then raise exception 'chargeback_product_provider_not_supported'; end if;
  if v_payment.status <> 'chargeback' then raise exception 'chargeback_product_financial_loss_required'; end if;
  if v_payment.purchase_id is null then raise exception 'chargeback_product_purchase_required'; end if;

  select count(*)::integer into v_case_count
  from public.commerce_payment_cases c
  where c.payment_id = v_payment.id
    and c.case_type = 'chargeback'
    and c.status = 'lost'
    and c.financial_loss_materialized_at is not null
    and c.disputed_amount_minor = v_payment.amount_minor
    and c.currency = v_payment.currency;

  if v_case_count = 0 then raise exception 'chargeback_product_materialized_case_required'; end if;
  if v_case_count > 1 then raise exception 'chargeback_product_case_ambiguous'; end if;

  select * into v_case
  from public.commerce_payment_cases c
  where c.payment_id = v_payment.id
    and c.case_type = 'chargeback'
    and c.status = 'lost'
    and c.financial_loss_materialized_at is not null
    and c.disputed_amount_minor = v_payment.amount_minor
    and c.currency = v_payment.currency
  limit 1
  for update;

  select t.id into v_chargeback_tx_id
  from public.commerce_ledger_transactions t
  where t.payment_id = v_payment.id
    and t.transaction_type = 'chargeback'
    and t.metadata ->> 'provider_case_id' = v_case.provider_case_id
  limit 1;

  if v_chargeback_tx_id is null then
    raise exception 'chargeback_product_financial_ledger_required';
  end if;

  perform private.assert_mara_ledger_transaction_balanced(v_chargeback_tx_id);

  select * into v_purchase
  from public.commerce_purchases p
  where p.id = v_payment.purchase_id
  for update;

  if not found then raise exception 'chargeback_product_purchase_not_found'; end if;

  if v_purchase.provider <> v_payment.provider
     or v_purchase.provider_payment_id <> v_payment.provider_payment_id
     or v_purchase.amount_minor::bigint <> v_payment.amount_minor
     or v_purchase.currency <> v_payment.currency then
    raise exception 'chargeback_product_purchase_truth_mismatch';
  end if;

  if v_purchase.status not in ('succeeded','chargeback') then
    raise exception 'chargeback_product_purchase_state_invalid';
  end if;

  update public.commerce_purchases
  set status = 'chargeback',
      charged_back_at = coalesce(charged_back_at, now()),
      updated_at = now(),
      metadata = metadata || jsonb_build_object(
        'chargeback_case_id', v_case.id,
        'provider_case_id', v_case.provider_case_id,
        'chargeback_ledger_transaction_id', v_chargeback_tx_id
      )
  where id = v_purchase.id;

  update public.commerce_entitlements
  set status = 'revoked',
      revoked_at = coalesce(revoked_at, now()),
      metadata = metadata || jsonb_build_object(
        'revocation_reason', 'chargeback',
        'chargeback_case_id', v_case.id
      )
  where purchase_id = v_purchase.id
    and status <> 'revoked';

  update public.commerce_contributions
  set status = 'chargeback',
      charged_back_at = coalesce(charged_back_at, now()),
      metadata = metadata || jsonb_build_object(
        'reversal_reason', 'chargeback',
        'chargeback_case_id', v_case.id
      )
  where purchase_id = v_purchase.id
    and status <> 'chargeback'
  returning goal_id into v_goal_id;

  if v_goal_id is not null then
    perform private.refresh_mara_commerce_goal_status(v_goal_id);
  end if;

  return v_purchase.id;
end;
$$;

revoke all on function public.reverse_mara_chargeback_payment_product_v1(uuid)
  from public, anon, authenticated;
grant execute on function public.reverse_mara_chargeback_payment_product_v1(uuid)
  to service_role;

create or replace function public.mara_chargeback_product_reversal_reconciliation_v1()
returns table (
  issue_code text,
  severity text,
  entity_type text,
  entity_id text,
  details jsonb
)
language sql
security definer
set search_path = ''
stable
as $$
  select
    'CHARGEBACK_PRODUCT_REVERSAL_PENDING'::text,
    'warning'::text,
    'payment'::text,
    p.id::text,
    jsonb_build_object(
      'purchase_id', p.purchase_id,
      'purchase_status', cp.status,
      'provider_payment_id', p.provider_payment_id
    )
  from public.commerce_payments p
  join public.commerce_purchases cp on cp.id = p.purchase_id
  where p.provider = 'mercado_pago_sandbox'
    and p.status = 'chargeback'
    and cp.status <> 'chargeback'

  union all

  select
    'CHARGEBACK_ENTITLEMENT_STILL_ACTIVE'::text,
    'critical'::text,
    'entitlement'::text,
    e.id::text,
    jsonb_build_object('purchase_id', e.purchase_id, 'entitlement_key', e.entitlement_key)
  from public.commerce_purchases cp
  join public.commerce_entitlements e on e.purchase_id = cp.id
  where cp.status = 'chargeback'
    and e.status <> 'revoked'

  union all

  select
    'CHARGEBACK_CONTRIBUTION_NOT_REVERSED'::text,
    'critical'::text,
    'contribution'::text,
    c.id::text,
    jsonb_build_object('purchase_id', c.purchase_id, 'goal_id', c.goal_id)
  from public.commerce_purchases cp
  join public.commerce_contributions c on c.purchase_id = cp.id
  where cp.status = 'chargeback'
    and c.status <> 'chargeback';
$$;

revoke all on function public.mara_chargeback_product_reversal_reconciliation_v1()
  from public, anon, authenticated;
grant execute on function public.mara_chargeback_product_reversal_reconciliation_v1()
  to service_role;

-- Required isolated non-production proof:
-- 1. dispute/open cases cannot revoke product access;
-- 2. payment must already be in financially materialized chargeback state;
-- 3. exactly one full lost/materialized provider chargeback case must exist;
-- 4. matching chargeback ledger journal must exist and be balanced;
-- 5. caller supplies only payment UUID; purchase/case/amount/provider truth comes from DB;
-- 6. purchase uses explicit chargeback state, never masquerades as refund;
-- 7. entitlements are revoked and contributions leave funded totals;
-- 8. duplicate execution converges to same product state;
-- 9. financial tables/ledger are not rewritten by product reversal;
-- 10. browser roles cannot execute reversal/reconciliation RPCs.
