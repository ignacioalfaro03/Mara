-- MARA PAYMENT REFUND MATERIALIZATION V1 — DRAFT ONLY.
--
-- DO NOT APPLY DIRECTLY TO THE CONNECTED PRODUCTION DATABASE.
-- Depends on reviewed activation of:
--   - mara_payment_ledger_v1.sql
--   - mara_payment_capture_materialization_v1.sql
--   - mara_payment_backed_fulfillment_v1.sql
--
-- Provider direction for Mercado Pago Split Payments 1:1:
-- - provider processing fee is borne by the seller/creator;
-- - refunded customer value is split back proportionally between seller and marketplace;
-- - this draft therefore reverses creator payable + platform revenue proportionally;
-- - processor-fee reversal is NOT inferred without provider settlement/report truth.

create or replace function public.mara_mp_sandbox_refund_context_v1(
  p_payment_id uuid
)
returns table (
  payment_id uuid,
  creator_id uuid,
  provider_payment_id text,
  provider_account_id text,
  credential_reference text,
  amount_minor bigint,
  refunded_amount_minor bigint,
  currency text
)
language sql
security definer
set search_path = ''
stable
as $$
  select
    p.id,
    p.creator_id,
    p.provider_payment_id,
    p.provider_account_id,
    r.credential_reference,
    p.amount_minor,
    p.refunded_amount_minor,
    p.currency
  from public.commerce_payments p
  join public.creator_payment_credential_references r
    on r.creator_id = p.creator_id
   and r.provider = p.provider
   and r.provider_account_id = p.provider_account_id
  where p.id = p_payment_id
    and p.provider = 'mercado_pago_sandbox'
    and p.status in ('succeeded', 'partially_refunded')
    and p.purchase_id is not null
    and (r.credential_expires_at is null or r.credential_expires_at > now())
  limit 1;
$$;

revoke all on function public.mara_mp_sandbox_refund_context_v1(uuid) from public, anon, authenticated;
grant execute on function public.mara_mp_sandbox_refund_context_v1(uuid) to service_role;

create or replace function public.materialize_mara_payment_refund_v1(
  p_payment_id uuid,
  p_provider_refund_id text,
  p_refund_amount_minor bigint,
  p_provider_created_at timestamptz,
  p_provider_event_id text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_payment public.commerce_payments%rowtype;
  v_existing public.commerce_refunds%rowtype;
  v_refund_id uuid;
  v_refund_tx_id uuid;
  v_platform_fee_minor bigint;
  v_previous_refunded bigint;
  v_new_refunded bigint;
  v_previous_platform_reversed bigint;
  v_new_platform_reversed bigint;
  v_platform_refund_minor bigint;
  v_creator_refund_minor bigint;
begin
  if p_payment_id is null then
    raise exception 'refund_payment_id_required';
  end if;
  if p_provider_refund_id is null or char_length(trim(p_provider_refund_id)) < 2 then
    raise exception 'refund_provider_id_invalid';
  end if;
  if p_refund_amount_minor <= 0 then
    raise exception 'refund_amount_invalid';
  end if;
  if p_provider_event_id is null or char_length(trim(p_provider_event_id)) < 2 then
    raise exception 'refund_provider_event_id_invalid';
  end if;

  select *
  into v_payment
  from public.commerce_payments p
  where p.id = p_payment_id
  for update;

  if not found then
    raise exception 'refund_payment_not_found';
  end if;
  if v_payment.status not in ('succeeded', 'partially_refunded') then
    raise exception 'refund_payment_not_refundable';
  end if;
  if v_payment.purchase_id is null then
    raise exception 'refund_purchase_required';
  end if;

  select *
  into v_existing
  from public.commerce_refunds r
  where r.provider = v_payment.provider
    and r.provider_refund_id = trim(p_provider_refund_id)
  limit 1;

  if found then
    if v_existing.payment_id <> v_payment.id
       or v_existing.purchase_id <> v_payment.purchase_id
       or v_existing.amount_minor <> p_refund_amount_minor
       or v_existing.currency <> v_payment.currency then
      raise exception 'provider_refund_idempotency_conflict';
    end if;
    return v_existing.id;
  end if;

  v_previous_refunded := v_payment.refunded_amount_minor;
  v_new_refunded := v_previous_refunded + p_refund_amount_minor;
  if v_new_refunded > v_payment.amount_minor then
    raise exception 'refund_exceeds_remaining_payment';
  end if;

  begin
    v_platform_fee_minor := coalesce((v_payment.metadata ->> 'platform_fee_minor')::bigint, 0);
  exception when others then
    raise exception 'refund_platform_fee_snapshot_invalid';
  end;

  if v_platform_fee_minor < 0 or v_platform_fee_minor > v_payment.amount_minor then
    raise exception 'refund_platform_fee_snapshot_invalid';
  end if;

  -- Cumulative proportional allocation avoids drift across multiple partial refunds.
  -- At a full refund the platform reversal converges exactly to the original platform fee.
  v_previous_platform_reversed := round(
    v_previous_refunded::numeric * v_platform_fee_minor::numeric / v_payment.amount_minor::numeric
  )::bigint;
  v_new_platform_reversed := round(
    v_new_refunded::numeric * v_platform_fee_minor::numeric / v_payment.amount_minor::numeric
  )::bigint;
  v_platform_refund_minor := v_new_platform_reversed - v_previous_platform_reversed;
  v_creator_refund_minor := p_refund_amount_minor - v_platform_refund_minor;

  if v_platform_refund_minor < 0 or v_creator_refund_minor < 0 then
    raise exception 'refund_allocation_invalid';
  end if;

  insert into public.commerce_refunds (
    payment_id,
    purchase_id,
    provider,
    provider_refund_id,
    amount_minor,
    currency,
    status,
    reason,
    provider_created_at,
    succeeded_at,
    metadata
  ) values (
    v_payment.id,
    v_payment.purchase_id,
    v_payment.provider,
    trim(p_provider_refund_id),
    p_refund_amount_minor,
    v_payment.currency,
    'succeeded',
    null,
    p_provider_created_at,
    now(),
    jsonb_build_object(
      'provider_event_id', trim(p_provider_event_id),
      'platform_refund_minor', v_platform_refund_minor,
      'creator_refund_minor', v_creator_refund_minor,
      'processor_fee_reversal_materialized', false
    )
  )
  returning id into v_refund_id;

  insert into public.commerce_ledger_transactions (
    idempotency_key,
    transaction_type,
    payment_id,
    refund_id,
    purchase_id,
    creator_id,
    provider,
    provider_event_id,
    occurred_at,
    metadata
  ) values (
    'refund:' || v_payment.provider || ':' || trim(p_provider_refund_id),
    'refund',
    v_payment.id,
    v_refund_id,
    v_payment.purchase_id,
    v_payment.creator_id,
    v_payment.provider,
    trim(p_provider_event_id),
    coalesce(p_provider_created_at, now()),
    jsonb_build_object(
      'processor_fee_reversal_materialized', false,
      'allocation_method', 'proportional_marketplace_split'
    )
  )
  returning id into v_refund_tx_id;

  if v_creator_refund_minor > 0 then
    insert into public.commerce_ledger_entries (
      transaction_id, line_no, creator_id, account_code, direction, amount_minor, currency
    ) values (
      v_refund_tx_id, 1, v_payment.creator_id, 'creator_payable', 'debit', v_creator_refund_minor, v_payment.currency
    );
  end if;

  if v_platform_refund_minor > 0 then
    insert into public.commerce_ledger_entries (
      transaction_id, line_no, creator_id, account_code, direction, amount_minor, currency
    ) values (
      v_refund_tx_id,
      case when v_creator_refund_minor > 0 then 2 else 1 end,
      v_payment.creator_id,
      'platform_revenue',
      'debit',
      v_platform_refund_minor,
      v_payment.currency
    );
  end if;

  insert into public.commerce_ledger_entries (
    transaction_id, line_no, creator_id, account_code, direction, amount_minor, currency
  ) values (
    v_refund_tx_id,
    case
      when v_creator_refund_minor > 0 and v_platform_refund_minor > 0 then 3
      when v_creator_refund_minor > 0 or v_platform_refund_minor > 0 then 2
      else 1
    end,
    v_payment.creator_id,
    'processor_clearing',
    'credit',
    p_refund_amount_minor,
    v_payment.currency
  );

  perform private.assert_mara_ledger_transaction_balanced(v_refund_tx_id);

  update public.commerce_payments
  set refunded_amount_minor = v_new_refunded,
      status = case when v_new_refunded = amount_minor then 'refunded' else 'partially_refunded' end,
      updated_at = now()
  where id = v_payment.id;

  return v_refund_id;
end;
$$;

revoke all on function public.materialize_mara_payment_refund_v1(
  uuid, text, bigint, timestamptz, text
) from public, anon, authenticated;

grant execute on function public.materialize_mara_payment_refund_v1(
  uuid, text, bigint, timestamptz, text
) to service_role;

-- Required isolated non-production proof:
-- 1. browser roles cannot read refund credentials or execute materialization;
-- 2. provider refund id is idempotent;
-- 3. cumulative partial refunds cannot exceed captured amount;
-- 4. proportional creator/platform reversals balance exactly by currency;
-- 5. full refund converges to full original marketplace fee reversal;
-- 6. processor-fee reversal remains unmaterialized without provider settlement truth;
-- 7. product entitlement/request reversal remains a separate payment-backed gate;
-- 8. production refunds remain disabled until explicit release authorization.
