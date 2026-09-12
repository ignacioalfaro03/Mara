-- MARA PAYMENT RECONCILIATION SNAPSHOT V1 — DRAFT ONLY.
--
-- READ-ONLY CONTROL PLANE.
-- DO NOT APPLY DIRECTLY TO THE CONNECTED PRODUCTION DATABASE.
-- Intended for isolated non-production proof first, then a reviewed operational
-- reconciliation surface if/when the payment stack is authorized.

create or replace function public.mara_payment_reconciliation_snapshot_v1()
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
  -- Successful Mercado Pago payment has no canonical capture journal.
  select
    'PAYMENT_CAPTURE_LEDGER_MISSING'::text,
    'critical'::text,
    'payment'::text,
    p.id::text,
    jsonb_build_object(
      'provider_payment_id', p.provider_payment_id,
      'amount_minor', p.amount_minor,
      'currency', p.currency
    )
  from public.commerce_payments p
  where p.provider = 'mercado_pago_sandbox'
    and p.status in ('succeeded', 'partially_refunded', 'refunded')
    and not exists (
      select 1
      from public.commerce_ledger_transactions t
      where t.payment_id = p.id
        and t.transaction_type = 'payment_capture'
    )

  union all

  -- Materialized success exists but product fulfillment has not converged yet.
  select
    'SUCCEEDED_PAYMENT_UNFULFILLED'::text,
    'warning'::text,
    'payment'::text,
    p.id::text,
    jsonb_build_object(
      'provider_payment_id', p.provider_payment_id,
      'checkout_intent_id', p.checkout_intent_id
    )
  from public.commerce_payments p
  where p.provider = 'mercado_pago_sandbox'
    and p.status in ('succeeded', 'partially_refunded', 'refunded')
    and p.purchase_id is null

  union all

  -- Payment/purchase link disagrees on provider payment identity or amount/currency.
  select
    'PAYMENT_PURCHASE_MISMATCH'::text,
    'critical'::text,
    'payment'::text,
    p.id::text,
    jsonb_build_object(
      'payment_provider_payment_id', p.provider_payment_id,
      'purchase_provider_payment_id', cp.provider_payment_id,
      'payment_amount_minor', p.amount_minor,
      'purchase_amount_minor', cp.amount_minor,
      'payment_currency', p.currency,
      'purchase_currency', cp.currency
    )
  from public.commerce_payments p
  join public.commerce_purchases cp on cp.id = p.purchase_id
  where p.provider = 'mercado_pago_sandbox'
    and (
      cp.provider <> p.provider
      or cp.provider_payment_id <> p.provider_payment_id
      or cp.amount_minor::bigint <> p.amount_minor
      or cp.currency <> p.currency
    )

  union all

  -- Payment cumulative refund truth must equal succeeded refund objects.
  select
    'PAYMENT_REFUND_TOTAL_MISMATCH'::text,
    'critical'::text,
    'payment'::text,
    p.id::text,
    jsonb_build_object(
      'payment_refunded_amount_minor', p.refunded_amount_minor,
      'refund_rows_amount_minor', coalesce(sum(r.amount_minor) filter (where r.status = 'succeeded'), 0)
    )
  from public.commerce_payments p
  left join public.commerce_refunds r on r.payment_id = p.id
  where p.provider = 'mercado_pago_sandbox'
  group by p.id, p.refunded_amount_minor
  having p.refunded_amount_minor <> coalesce(sum(r.amount_minor) filter (where r.status = 'succeeded'), 0)

  union all

  -- Every succeeded refund must have a refund journal.
  select
    'REFUND_LEDGER_MISSING'::text,
    'critical'::text,
    'refund'::text,
    r.id::text,
    jsonb_build_object(
      'provider_refund_id', r.provider_refund_id,
      'payment_id', r.payment_id,
      'amount_minor', r.amount_minor,
      'currency', r.currency
    )
  from public.commerce_refunds r
  join public.commerce_payments p on p.id = r.payment_id
  where p.provider = 'mercado_pago_sandbox'
    and r.status = 'succeeded'
    and not exists (
      select 1
      from public.commerce_ledger_transactions t
      where t.refund_id = r.id
        and t.transaction_type = 'refund'
    )

  union all

  -- Full financial refund should eventually converge to product reversal.
  select
    'FULL_REFUND_PRODUCT_REVERSAL_PENDING'::text,
    'warning'::text,
    'payment'::text,
    p.id::text,
    jsonb_build_object(
      'purchase_id', p.purchase_id,
      'purchase_status', cp.status,
      'refunded_amount_minor', p.refunded_amount_minor,
      'amount_minor', p.amount_minor
    )
  from public.commerce_payments p
  join public.commerce_purchases cp on cp.id = p.purchase_id
  where p.provider = 'mercado_pago_sandbox'
    and p.status = 'refunded'
    and p.refunded_amount_minor = p.amount_minor
    and cp.status <> 'refunded'

  union all

  -- Ledger transactions must balance independently by currency.
  select
    'LEDGER_TRANSACTION_UNBALANCED'::text,
    'critical'::text,
    'ledger_transaction'::text,
    t.id::text,
    jsonb_build_object(
      'transaction_type', t.transaction_type,
      'currency', e.currency,
      'debit_minor', sum(case when e.direction = 'debit' then e.amount_minor else 0 end),
      'credit_minor', sum(case when e.direction = 'credit' then e.amount_minor else 0 end)
    )
  from public.commerce_ledger_transactions t
  join public.commerce_ledger_entries e on e.transaction_id = t.id
  where t.provider = 'mercado_pago_sandbox'
  group by t.id, t.transaction_type, e.currency
  having sum(case when e.direction = 'debit' then e.amount_minor else 0 end)
      <> sum(case when e.direction = 'credit' then e.amount_minor else 0 end)

  union all

  -- Provider-account snapshot on payment must still belong to the creator.
  select
    'PAYMENT_PROVIDER_ACCOUNT_SCOPE_MISMATCH'::text,
    'critical'::text,
    'payment'::text,
    p.id::text,
    jsonb_build_object(
      'creator_id', p.creator_id,
      'provider_account_id', p.provider_account_id
    )
  from public.commerce_payments p
  where p.provider = 'mercado_pago_sandbox'
    and not exists (
      select 1
      from public.creator_payment_accounts a
      where a.creator_id = p.creator_id
        and a.provider = p.provider
        and a.provider_account_id = p.provider_account_id
    );
$$;

revoke all on function public.mara_payment_reconciliation_snapshot_v1() from public, anon, authenticated;
grant execute on function public.mara_payment_reconciliation_snapshot_v1() to service_role;

-- Interpretation:
-- critical => payment release gate fails;
-- warning  => state is financially coherent but operational convergence is incomplete.
--
-- This snapshot does not mutate or auto-heal any financial/product record.
