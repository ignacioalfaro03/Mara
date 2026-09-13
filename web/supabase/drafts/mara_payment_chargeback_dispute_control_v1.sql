-- MARA PAYMENT CHARGEBACK / DISPUTE CONTROL V1 — DRAFT ONLY.
--
-- DO NOT APPLY DIRECTLY TO THE CONNECTED PRODUCTION DATABASE.
-- Depends on reviewed activation of:
--   - mara_payment_ledger_v1.sql
--   - mara_payment_capture_materialization_v1.sql
--   - mara_payment_backed_fulfillment_v1.sql
--
-- Provider rule (Mercado Pago):
-- - DISPUTE is a claim/mediation state and is not financial loss by itself;
-- - CHARGEBACK is a separate financial event;
-- - provider/report truth is authoritative;
-- - V1 intentionally materializes only full, non-refunded chargeback loss.
-- Partial/overlapping refund+chargeback cases fail closed for manual/provider-led reconciliation.

create table if not exists public.commerce_payment_cases (
  id uuid primary key default extensions.gen_random_uuid(),
  payment_id uuid not null references public.commerce_payments(id) on delete restrict,
  purchase_id uuid null references public.commerce_purchases(id) on delete restrict,
  creator_id uuid not null references public.creators(id) on delete restrict,
  provider text not null check (char_length(provider) between 2 and 80),
  provider_case_id text not null check (char_length(provider_case_id) between 2 and 255),
  case_type text not null check (case_type in ('dispute', 'chargeback')),
  status text not null check (status in ('open', 'won', 'lost', 'closed')),
  disputed_amount_minor bigint not null check (disputed_amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  provider_event_id text null check (provider_event_id is null or char_length(provider_event_id) between 2 and 255),
  provider_created_at timestamptz null,
  provider_updated_at timestamptz null,
  financial_loss_materialized_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_case_id, case_type)
);

create index if not exists commerce_payment_cases_payment_created_idx
  on public.commerce_payment_cases (payment_id, created_at desc);

alter table public.commerce_payment_cases enable row level security;
revoke all on table public.commerce_payment_cases from anon, authenticated;
grant all on table public.commerce_payment_cases to service_role;

create or replace function public.upsert_mara_payment_case_v1(
  p_payment_id uuid,
  p_provider_case_id text,
  p_case_type text,
  p_status text,
  p_disputed_amount_minor bigint,
  p_currency text,
  p_provider_event_id text,
  p_provider_created_at timestamptz,
  p_provider_updated_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_payment public.commerce_payments%rowtype;
  v_existing public.commerce_payment_cases%rowtype;
  v_case_id uuid;
begin
  if p_payment_id is null then raise exception 'payment_case_payment_id_required'; end if;
  if p_provider_case_id is null or char_length(trim(p_provider_case_id)) < 2 then raise exception 'payment_case_provider_id_invalid'; end if;
  if p_case_type not in ('dispute', 'chargeback') then raise exception 'payment_case_type_invalid'; end if;
  if p_status not in ('open', 'won', 'lost', 'closed') then raise exception 'payment_case_status_invalid'; end if;
  if p_disputed_amount_minor <= 0 then raise exception 'payment_case_amount_invalid'; end if;
  if p_currency is null or p_currency !~ '^[A-Z]{3}$' then raise exception 'payment_case_currency_invalid'; end if;

  select * into v_payment
  from public.commerce_payments p
  where p.id = p_payment_id
  for update;

  if not found then raise exception 'payment_case_payment_not_found'; end if;
  if v_payment.provider <> 'mercado_pago_sandbox' then raise exception 'payment_case_provider_not_supported'; end if;
  if p_currency <> v_payment.currency then raise exception 'payment_case_currency_mismatch'; end if;
  if p_disputed_amount_minor > v_payment.amount_minor then raise exception 'payment_case_amount_exceeds_capture'; end if;

  select * into v_existing
  from public.commerce_payment_cases c
  where c.provider = v_payment.provider
    and c.provider_case_id = trim(p_provider_case_id)
    and c.case_type = p_case_type
  limit 1;

  if found then
    if v_existing.payment_id <> v_payment.id
       or v_existing.creator_id <> v_payment.creator_id
       or v_existing.currency <> v_payment.currency
       or v_existing.disputed_amount_minor <> p_disputed_amount_minor then
      raise exception 'payment_case_idempotency_conflict';
    end if;

    update public.commerce_payment_cases
    set status = p_status,
        provider_event_id = coalesce(nullif(trim(p_provider_event_id), ''), provider_event_id),
        provider_updated_at = coalesce(p_provider_updated_at, provider_updated_at),
        updated_at = now()
    where id = v_existing.id;

    return v_existing.id;
  end if;

  insert into public.commerce_payment_cases (
    payment_id, purchase_id, creator_id, provider, provider_case_id,
    case_type, status, disputed_amount_minor, currency, provider_event_id,
    provider_created_at, provider_updated_at
  ) values (
    v_payment.id, v_payment.purchase_id, v_payment.creator_id, v_payment.provider,
    trim(p_provider_case_id), p_case_type, p_status, p_disputed_amount_minor,
    v_payment.currency, nullif(trim(p_provider_event_id), ''),
    p_provider_created_at, p_provider_updated_at
  ) returning id into v_case_id;

  return v_case_id;
end;
$$;

revoke all on function public.upsert_mara_payment_case_v1(
  uuid, text, text, text, bigint, text, text, timestamptz, timestamptz
) from public, anon, authenticated;
grant execute on function public.upsert_mara_payment_case_v1(
  uuid, text, text, text, bigint, text, text, timestamptz, timestamptz
) to service_role;

create or replace function public.materialize_mara_full_chargeback_loss_v1(
  p_case_id uuid,
  p_provider_event_id text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_case public.commerce_payment_cases%rowtype;
  v_payment public.commerce_payments%rowtype;
  v_platform_fee_minor bigint;
  v_creator_reversal_minor bigint;
  v_tx_id uuid;
  v_existing_tx_id uuid;
begin
  if p_case_id is null then raise exception 'chargeback_case_id_required'; end if;
  if p_provider_event_id is null or char_length(trim(p_provider_event_id)) < 2 then raise exception 'chargeback_provider_event_id_invalid'; end if;

  select * into v_case
  from public.commerce_payment_cases c
  where c.id = p_case_id
  for update;

  if not found then raise exception 'chargeback_case_not_found'; end if;
  if v_case.case_type <> 'chargeback' or v_case.status <> 'lost' then
    raise exception 'chargeback_case_not_final_loss';
  end if;

  select * into v_payment
  from public.commerce_payments p
  where p.id = v_case.payment_id
  for update;

  if not found then raise exception 'chargeback_payment_not_found'; end if;
  if v_payment.status = 'chargeback' and v_case.financial_loss_materialized_at is not null then
    select t.id into v_existing_tx_id
    from public.commerce_ledger_transactions t
    where t.payment_id = v_payment.id
      and t.transaction_type = 'chargeback'
      and t.metadata ->> 'provider_case_id' = v_case.provider_case_id
    limit 1;
    if v_existing_tx_id is null then raise exception 'chargeback_state_without_ledger'; end if;
    return v_existing_tx_id;
  end if;

  -- V1 intentionally refuses ambiguous economics.
  if v_payment.status <> 'succeeded' then raise exception 'chargeback_payment_not_clean_succeeded'; end if;
  if v_payment.refunded_amount_minor <> 0 then raise exception 'chargeback_refund_overlap_requires_reconciliation'; end if;
  if v_case.disputed_amount_minor <> v_payment.amount_minor then raise exception 'partial_chargeback_not_supported_v1'; end if;
  if v_case.currency <> v_payment.currency then raise exception 'chargeback_currency_mismatch'; end if;

  begin
    v_platform_fee_minor := coalesce((v_payment.metadata ->> 'platform_fee_minor')::bigint, 0);
  exception when others then
    raise exception 'chargeback_platform_fee_snapshot_invalid';
  end;

  if v_platform_fee_minor < 0 or v_platform_fee_minor > v_payment.amount_minor then
    raise exception 'chargeback_platform_fee_snapshot_invalid';
  end if;
  v_creator_reversal_minor := v_payment.amount_minor - v_platform_fee_minor;

  insert into public.commerce_ledger_transactions (
    idempotency_key, transaction_type, payment_id, purchase_id, creator_id,
    provider, provider_event_id, occurred_at, metadata
  ) values (
    'chargeback:' || v_case.provider || ':' || v_case.provider_case_id,
    'chargeback', v_payment.id, v_payment.purchase_id, v_payment.creator_id,
    v_payment.provider, trim(p_provider_event_id), coalesce(v_case.provider_updated_at, now()),
    jsonb_build_object(
      'provider_case_id', v_case.provider_case_id,
      'case_type', v_case.case_type,
      'processor_fee_reversal_materialized', false,
      'scope', 'full_chargeback_v1'
    )
  ) returning id into v_tx_id;

  if v_creator_reversal_minor > 0 then
    insert into public.commerce_ledger_entries (
      transaction_id, line_no, creator_id, account_code, direction, amount_minor, currency
    ) values (
      v_tx_id, 1, v_payment.creator_id, 'creator_payable', 'debit',
      v_creator_reversal_minor, v_payment.currency
    );
  end if;

  if v_platform_fee_minor > 0 then
    insert into public.commerce_ledger_entries (
      transaction_id, line_no, creator_id, account_code, direction, amount_minor, currency
    ) values (
      v_tx_id,
      case when v_creator_reversal_minor > 0 then 2 else 1 end,
      v_payment.creator_id, 'platform_revenue', 'debit',
      v_platform_fee_minor, v_payment.currency
    );
  end if;

  insert into public.commerce_ledger_entries (
    transaction_id, line_no, creator_id, account_code, direction, amount_minor, currency
  ) values (
    v_tx_id,
    case
      when v_creator_reversal_minor > 0 and v_platform_fee_minor > 0 then 3
      when v_creator_reversal_minor > 0 or v_platform_fee_minor > 0 then 2
      else 1
    end,
    v_payment.creator_id, 'processor_clearing', 'credit',
    v_payment.amount_minor, v_payment.currency
  );

  perform private.assert_mara_ledger_transaction_balanced(v_tx_id);

  update public.commerce_payments
  set status = 'chargeback', updated_at = now()
  where id = v_payment.id;

  update public.commerce_payment_cases
  set financial_loss_materialized_at = coalesce(financial_loss_materialized_at, now()),
      provider_event_id = trim(p_provider_event_id),
      updated_at = now()
  where id = v_case.id;

  return v_tx_id;
end;
$$;

revoke all on function public.materialize_mara_full_chargeback_loss_v1(uuid, text) from public, anon, authenticated;
grant execute on function public.materialize_mara_full_chargeback_loss_v1(uuid, text) to service_role;

create or replace function public.mara_chargeback_dispute_reconciliation_v1()
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
    'CHARGEBACK_LEDGER_MISSING'::text, 'critical'::text, 'payment_case'::text,
    c.id::text,
    jsonb_build_object('payment_id', c.payment_id, 'provider_case_id', c.provider_case_id)
  from public.commerce_payment_cases c
  join public.commerce_payments p on p.id = c.payment_id
  where c.case_type = 'chargeback'
    and c.status = 'lost'
    and p.status = 'chargeback'
    and not exists (
      select 1 from public.commerce_ledger_transactions t
      where t.payment_id = p.id
        and t.transaction_type = 'chargeback'
        and t.metadata ->> 'provider_case_id' = c.provider_case_id
    )

  union all

  select
    'CHARGEBACK_PRODUCT_REVERSAL_PENDING'::text, 'warning'::text, 'payment'::text,
    p.id::text,
    jsonb_build_object('purchase_id', p.purchase_id, 'provider_payment_id', p.provider_payment_id)
  from public.commerce_payments p
  join public.commerce_purchases cp on cp.id = p.purchase_id
  where p.provider = 'mercado_pago_sandbox'
    and p.status = 'chargeback'
    and cp.status = 'succeeded'

  union all

  select
    'CHARGEBACK_REFUND_OVERLAP_UNSUPPORTED_V1'::text, 'critical'::text, 'payment_case'::text,
    c.id::text,
    jsonb_build_object(
      'payment_id', p.id,
      'refunded_amount_minor', p.refunded_amount_minor,
      'disputed_amount_minor', c.disputed_amount_minor,
      'amount_minor', p.amount_minor
    )
  from public.commerce_payment_cases c
  join public.commerce_payments p on p.id = c.payment_id
  where c.case_type = 'chargeback'
    and c.status = 'lost'
    and (p.refunded_amount_minor <> 0 or c.disputed_amount_minor <> p.amount_minor)

  union all

  select
    'DISPUTE_OPEN_NO_AUTOMATIC_FINANCIAL_MUTATION'::text, 'warning'::text, 'payment_case'::text,
    c.id::text,
    jsonb_build_object('payment_id', c.payment_id, 'provider_case_id', c.provider_case_id)
  from public.commerce_payment_cases c
  where c.case_type = 'dispute'
    and c.status = 'open';
$$;

revoke all on function public.mara_chargeback_dispute_reconciliation_v1() from public, anon, authenticated;
grant execute on function public.mara_chargeback_dispute_reconciliation_v1() to service_role;

-- Required isolated non-production proof:
-- 1. dispute/open never changes payment, product or ledger state;
-- 2. only provider-authoritative lost chargeback may enter loss materialization;
-- 3. partial chargeback and any refund overlap fail closed in V1;
-- 4. full loss reverses creator payable + platform revenue principal only;
-- 5. processor fee reversal is not invented without settlement/report truth;
-- 6. ledger balances and is idempotent per provider case;
-- 7. product reversal remains a separate downstream gate;
-- 8. browser roles cannot read/write payment cases or execute these RPCs;
-- 9. no production activation without isolated provider/report E2E proof.
