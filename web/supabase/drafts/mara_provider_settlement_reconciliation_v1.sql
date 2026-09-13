-- MARA PROVIDER SETTLEMENT RECONCILIATION V1 — DRAFT ONLY.
--
-- DO NOT APPLY DIRECTLY TO THE CONNECTED PRODUCTION DATABASE.
-- Creates a provider-report evidence layer and read-only reconciliation snapshot.
-- It does not auto-heal payments, refunds, chargebacks, payouts or ledger.
--
-- Mercado Pago Account Money fields used by V1:
-- SOURCE_ID, EXTERNAL_REFERENCE, TRANSACTION_TYPE, TRANSACTION_AMOUNT,
-- TRANSACTION_CURRENCY, SELLER_AMOUNT, FEE_AMOUNT, SETTLEMENT_NET_AMOUNT,
-- REAL_AMOUNT, TRANSACTION_DATE, SETTLEMENT_DATE, METADATA.
--
-- Important provider fact: FEE_AMOUNT may aggregate processing, shipping,
-- financing and coupon fees. V1 therefore treats it as total provider-fee evidence,
-- not as a guaranteed 1:1 processor-fee field.
--
-- V1 is intentionally scoped to Mercado Pago Chile / CLP. Mara stores CLP in
-- integral peso minor units, so report values must be integral before comparison.

create table if not exists public.commerce_provider_report_batches (
  id uuid primary key default extensions.gen_random_uuid(),
  provider text not null check (char_length(provider) between 2 and 80),
  report_scope text not null check (char_length(report_scope) between 2 and 80),
  report_batch_key text not null check (char_length(report_batch_key) between 8 and 255),
  coverage_start timestamptz not null,
  coverage_end timestamptz not null,
  status text not null default 'importing' check (status in ('importing','complete','failed')),
  expected_row_count integer null check (expected_row_count is null or expected_row_count >= 0),
  imported_row_count integer null check (imported_row_count is null or imported_row_count >= 0),
  completed_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, report_scope, report_batch_key),
  check (coverage_end > coverage_start)
);

create table if not exists public.commerce_provider_report_rows (
  id uuid primary key default extensions.gen_random_uuid(),
  provider text not null check (char_length(provider) between 2 and 80),
  report_scope text not null check (char_length(report_scope) between 2 and 80),
  report_batch_key text not null check (char_length(report_batch_key) between 8 and 255),
  report_row_key text not null check (char_length(report_row_key) between 8 and 255),
  source_id text null check (source_id is null or char_length(source_id) <= 255),
  external_reference text null check (external_reference is null or char_length(external_reference) <= 255),
  transaction_type text not null check (transaction_type in (
    'SETTLEMENT','REFUND','CHARGEBACK','DISPUTE',
    'WITHDRAWAL','WITHDRAWAL_CANCEL','PAYOUT','OTHER'
  )),
  transaction_amount numeric(20,2) null,
  transaction_currency text null check (transaction_currency is null or transaction_currency ~ '^[A-Z]{3}$'),
  seller_amount numeric(20,2) null,
  fee_amount numeric(20,2) null,
  settlement_net_amount numeric(20,2) null,
  settlement_currency text null check (settlement_currency is null or settlement_currency ~ '^[A-Z]{3}$'),
  real_amount numeric(20,2) null,
  transaction_date timestamptz null,
  settlement_date timestamptz null,
  metadata_raw jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata_raw) = 'object'),
  row_raw jsonb not null default '{}'::jsonb check (jsonb_typeof(row_raw) = 'object'),
  imported_at timestamptz not null default now(),
  unique (provider, report_scope, report_row_key),
  foreign key (provider, report_scope, report_batch_key)
    references public.commerce_provider_report_batches(provider, report_scope, report_batch_key)
    on delete restrict
);

create index if not exists commerce_provider_report_rows_source_idx
  on public.commerce_provider_report_rows (provider, source_id, transaction_type);
create index if not exists commerce_provider_report_rows_batch_idx
  on public.commerce_provider_report_rows (provider, report_batch_key, imported_at desc);
create index if not exists commerce_provider_report_batches_coverage_idx
  on public.commerce_provider_report_batches (provider, report_scope, status, coverage_start, coverage_end);

alter table public.commerce_provider_report_batches enable row level security;
alter table public.commerce_provider_report_rows enable row level security;
revoke all on table public.commerce_provider_report_batches from anon, authenticated;
revoke all on table public.commerce_provider_report_rows from anon, authenticated;
grant all on table public.commerce_provider_report_batches to service_role;
grant all on table public.commerce_provider_report_rows to service_role;

-- Evidence rows are immutable. Corrected provider exports must use a new batch/row
-- identity rather than rewriting historical provider evidence.
create or replace function private.reject_mara_provider_report_row_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  raise exception 'mara_provider_report_evidence_is_append_only';
end;
$$;

revoke all on function private.reject_mara_provider_report_row_mutation() from public, anon, authenticated;

drop trigger if exists commerce_provider_report_rows_append_only on public.commerce_provider_report_rows;
create trigger commerce_provider_report_rows_append_only
before update or delete on public.commerce_provider_report_rows
for each row execute function private.reject_mara_provider_report_row_mutation();

create or replace function public.begin_mara_mp_account_money_batch_v1(
  p_report_batch_key text,
  p_coverage_start timestamptz,
  p_coverage_end timestamptz,
  p_expected_row_count integer,
  p_metadata jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_existing public.commerce_provider_report_batches%rowtype;
begin
  if p_report_batch_key is null or char_length(trim(p_report_batch_key)) < 8 then
    raise exception 'provider_report_batch_key_invalid';
  end if;
  if p_coverage_start is null or p_coverage_end is null or p_coverage_end <= p_coverage_start then
    raise exception 'provider_report_coverage_invalid';
  end if;
  if p_expected_row_count is not null and p_expected_row_count < 0 then
    raise exception 'provider_report_expected_row_count_invalid';
  end if;

  select * into v_existing
  from public.commerce_provider_report_batches b
  where b.provider = 'mercado_pago_sandbox'
    and b.report_scope = 'account_money'
    and b.report_batch_key = trim(p_report_batch_key)
  limit 1;

  if found then
    if v_existing.coverage_start <> p_coverage_start
       or v_existing.coverage_end <> p_coverage_end
       or coalesce(v_existing.expected_row_count, -1) <> coalesce(p_expected_row_count, -1) then
      raise exception 'provider_report_batch_idempotency_conflict';
    end if;
    return v_existing.id;
  end if;

  insert into public.commerce_provider_report_batches (
    provider, report_scope, report_batch_key, coverage_start, coverage_end,
    status, expected_row_count, metadata
  ) values (
    'mercado_pago_sandbox', 'account_money', trim(p_report_batch_key),
    p_coverage_start, p_coverage_end, 'importing', p_expected_row_count,
    coalesce(p_metadata, '{}'::jsonb)
  ) returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.begin_mara_mp_account_money_batch_v1(text,timestamptz,timestamptz,integer,jsonb)
  from public, anon, authenticated;
grant execute on function public.begin_mara_mp_account_money_batch_v1(text,timestamptz,timestamptz,integer,jsonb)
  to service_role;

create or replace function public.ingest_mara_mp_account_money_row_v1(
  p_report_batch_key text,
  p_report_row_key text,
  p_source_id text,
  p_external_reference text,
  p_transaction_type text,
  p_transaction_amount numeric,
  p_transaction_currency text,
  p_seller_amount numeric,
  p_fee_amount numeric,
  p_settlement_net_amount numeric,
  p_settlement_currency text,
  p_real_amount numeric,
  p_transaction_date timestamptz,
  p_settlement_date timestamptz,
  p_metadata_raw jsonb,
  p_row_raw jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_existing public.commerce_provider_report_rows%rowtype;
  v_batch public.commerce_provider_report_batches%rowtype;
  v_type text;
begin
  if p_report_batch_key is null or char_length(trim(p_report_batch_key)) < 8 then
    raise exception 'provider_report_batch_key_invalid';
  end if;
  if p_report_row_key is null or char_length(trim(p_report_row_key)) < 8 then
    raise exception 'provider_report_row_key_invalid';
  end if;

  select * into v_batch
  from public.commerce_provider_report_batches b
  where b.provider = 'mercado_pago_sandbox'
    and b.report_scope = 'account_money'
    and b.report_batch_key = trim(p_report_batch_key)
  for update;

  if not found then raise exception 'provider_report_batch_not_found'; end if;
  if v_batch.status <> 'importing' then raise exception 'provider_report_batch_not_importing'; end if;

  v_type := upper(coalesce(trim(p_transaction_type), ''));
  if v_type not in ('SETTLEMENT','REFUND','CHARGEBACK','DISPUTE','WITHDRAWAL','WITHDRAWAL_CANCEL','PAYOUT') then
    v_type := 'OTHER';
  end if;

  if p_transaction_currency is not null and upper(trim(p_transaction_currency)) <> 'CLP' then
    raise exception 'provider_report_v1_currency_not_supported';
  end if;
  if p_settlement_currency is not null and upper(trim(p_settlement_currency)) <> 'CLP' then
    raise exception 'provider_report_v1_settlement_currency_not_supported';
  end if;

  select * into v_existing
  from public.commerce_provider_report_rows r
  where r.provider = 'mercado_pago_sandbox'
    and r.report_scope = 'account_money'
    and r.report_row_key = trim(p_report_row_key)
  limit 1;

  if found then
    if v_existing.report_batch_key <> trim(p_report_batch_key)
       or coalesce(v_existing.source_id, '') <> coalesce(nullif(trim(p_source_id), ''), '')
       or v_existing.transaction_type <> v_type
       or coalesce(v_existing.transaction_amount, 0) <> coalesce(p_transaction_amount, 0)
       or coalesce(v_existing.transaction_currency, '') <> coalesce(upper(nullif(trim(p_transaction_currency), '')), '') then
      raise exception 'provider_report_row_idempotency_conflict';
    end if;
    return v_existing.id;
  end if;

  insert into public.commerce_provider_report_rows (
    provider, report_scope, report_batch_key, report_row_key,
    source_id, external_reference, transaction_type,
    transaction_amount, transaction_currency, seller_amount, fee_amount,
    settlement_net_amount, settlement_currency, real_amount,
    transaction_date, settlement_date, metadata_raw, row_raw
  ) values (
    'mercado_pago_sandbox', 'account_money', trim(p_report_batch_key), trim(p_report_row_key),
    nullif(trim(p_source_id), ''), nullif(trim(p_external_reference), ''), v_type,
    p_transaction_amount, upper(nullif(trim(p_transaction_currency), '')), p_seller_amount, p_fee_amount,
    p_settlement_net_amount, upper(nullif(trim(p_settlement_currency), '')), p_real_amount,
    p_transaction_date, p_settlement_date, coalesce(p_metadata_raw, '{}'::jsonb), coalesce(p_row_raw, '{}'::jsonb)
  ) returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.ingest_mara_mp_account_money_row_v1(
  text,text,text,text,text,numeric,text,numeric,numeric,numeric,text,numeric,timestamptz,timestamptz,jsonb,jsonb
) from public, anon, authenticated;
grant execute on function public.ingest_mara_mp_account_money_row_v1(
  text,text,text,text,text,numeric,text,numeric,numeric,numeric,text,numeric,timestamptz,timestamptz,jsonb,jsonb
) to service_role;

create or replace function public.complete_mara_mp_account_money_batch_v1(
  p_report_batch_key text,
  p_imported_row_count integer
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_batch public.commerce_provider_report_batches%rowtype;
  v_actual integer;
begin
  select * into v_batch
  from public.commerce_provider_report_batches b
  where b.provider = 'mercado_pago_sandbox'
    and b.report_scope = 'account_money'
    and b.report_batch_key = trim(p_report_batch_key)
  for update;

  if not found then raise exception 'provider_report_batch_not_found'; end if;
  if v_batch.status = 'complete' then return v_batch.id; end if;
  if v_batch.status <> 'importing' then raise exception 'provider_report_batch_not_completable'; end if;

  select count(*)::integer into v_actual
  from public.commerce_provider_report_rows r
  where r.provider = v_batch.provider
    and r.report_scope = v_batch.report_scope
    and r.report_batch_key = v_batch.report_batch_key;

  if p_imported_row_count is null or p_imported_row_count <> v_actual then
    raise exception 'provider_report_imported_row_count_mismatch';
  end if;
  if v_batch.expected_row_count is not null and v_batch.expected_row_count <> v_actual then
    raise exception 'provider_report_expected_row_count_mismatch';
  end if;

  update public.commerce_provider_report_batches
  set status = 'complete', imported_row_count = v_actual, completed_at = now(), updated_at = now()
  where id = v_batch.id;

  return v_batch.id;
end;
$$;

revoke all on function public.complete_mara_mp_account_money_batch_v1(text,integer)
  from public, anon, authenticated;
grant execute on function public.complete_mara_mp_account_money_batch_v1(text,integer)
  to service_role;

create or replace function public.mara_provider_settlement_reconciliation_v1()
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
  -- Missing settlement evidence is only actionable when a completed provider batch
  -- explicitly covers the payment capture time. An incomplete/partial report never
  -- creates a false release-gate failure.
  select
    'PROVIDER_SETTLEMENT_EVIDENCE_MISSING'::text,
    'critical'::text,
    'payment'::text,
    p.id::text,
    jsonb_build_object('provider_payment_id', p.provider_payment_id, 'captured_at', p.captured_at)
  from public.commerce_payments p
  where p.provider = 'mercado_pago_sandbox'
    and p.status in ('succeeded','partially_refunded','refunded','chargeback')
    and p.captured_at is not null
    and exists (
      select 1 from public.commerce_provider_report_batches b
      where b.provider = p.provider
        and b.report_scope = 'account_money'
        and b.status = 'complete'
        and p.captured_at >= b.coverage_start
        and p.captured_at < b.coverage_end
    )
    and not exists (
      select 1 from public.commerce_provider_report_rows r
      join public.commerce_provider_report_batches b
        on b.provider = r.provider
       and b.report_scope = r.report_scope
       and b.report_batch_key = r.report_batch_key
      where r.provider = p.provider
        and r.report_scope = 'account_money'
        and b.status = 'complete'
        and r.transaction_type = 'SETTLEMENT'
        and r.source_id = p.provider_payment_id
    )

  union all

  select
    'PROVIDER_SETTLEMENT_NON_INTEGRAL_CLP'::text,
    'critical'::text,
    'provider_report_row'::text,
    r.id::text,
    jsonb_build_object('source_id', r.source_id, 'transaction_amount', r.transaction_amount)
  from public.commerce_provider_report_rows r
  join public.commerce_provider_report_batches b
    on b.provider = r.provider and b.report_scope = r.report_scope and b.report_batch_key = r.report_batch_key
  where r.provider = 'mercado_pago_sandbox'
    and b.status = 'complete'
    and r.transaction_type in ('SETTLEMENT','REFUND','CHARGEBACK','DISPUTE')
    and r.transaction_currency = 'CLP'
    and r.transaction_amount is not null
    and r.transaction_amount <> round(r.transaction_amount)

  union all

  select
    'PROVIDER_SETTLEMENT_CAPTURE_MISMATCH'::text,
    'critical'::text,
    'payment'::text,
    p.id::text,
    jsonb_build_object(
      'provider_payment_id', p.provider_payment_id,
      'mara_amount_minor', p.amount_minor,
      'provider_transaction_amount', r.transaction_amount,
      'mara_currency', p.currency,
      'provider_currency', r.transaction_currency
    )
  from public.commerce_payments p
  join public.commerce_provider_report_rows r
    on r.provider = p.provider and r.report_scope = 'account_money'
   and r.transaction_type = 'SETTLEMENT' and r.source_id = p.provider_payment_id
  join public.commerce_provider_report_batches b
    on b.provider = r.provider and b.report_scope = r.report_scope and b.report_batch_key = r.report_batch_key
  where p.provider = 'mercado_pago_sandbox'
    and b.status = 'complete'
    and (
      r.transaction_currency <> p.currency
      or r.transaction_amount is null
      or r.transaction_amount <> round(r.transaction_amount)
      or round(r.transaction_amount)::bigint <> p.amount_minor
    )

  union all

  -- FEE_AMOUNT is a total fee bucket and may include more than processing fees.
  -- Surface evidence for review; do not falsely assert 1:1 processor-fee equality.
  select
    'PROVIDER_TOTAL_FEE_EVIDENCE_REVIEW'::text,
    'warning'::text,
    'payment'::text,
    p.id::text,
    jsonb_build_object(
      'provider_payment_id', p.provider_payment_id,
      'mara_processor_fee_minor', p.metadata ->> 'processor_fee_minor',
      'provider_total_fee_amount', r.fee_amount,
      'note', 'FEE_AMOUNT may aggregate processing, shipping, financing and coupon fees'
    )
  from public.commerce_payments p
  join public.commerce_provider_report_rows r
    on r.provider = p.provider and r.report_scope = 'account_money'
   and r.transaction_type = 'SETTLEMENT' and r.source_id = p.provider_payment_id
  join public.commerce_provider_report_batches b
    on b.provider = r.provider and b.report_scope = r.report_scope and b.report_batch_key = r.report_batch_key
  where p.provider = 'mercado_pago_sandbox'
    and b.status = 'complete'
    and r.fee_amount is not null

  union all

  select
    'PROVIDER_MONEY_MOVEMENT_UNMATCHED'::text,
    'critical'::text,
    'provider_report_row'::text,
    r.id::text,
    jsonb_build_object(
      'transaction_type', r.transaction_type,
      'source_id', r.source_id,
      'external_reference', r.external_reference,
      'transaction_amount', r.transaction_amount,
      'settlement_net_amount', r.settlement_net_amount,
      'real_amount', r.real_amount
    )
  from public.commerce_provider_report_rows r
  join public.commerce_provider_report_batches b
    on b.provider = r.provider and b.report_scope = r.report_scope and b.report_batch_key = r.report_batch_key
  where r.provider = 'mercado_pago_sandbox'
    and b.status = 'complete'
    and r.transaction_type in ('SETTLEMENT','REFUND','CHARGEBACK','DISPUTE')
    and not exists (
      select 1 from public.commerce_payments p
      where p.provider = r.provider and p.provider_payment_id = r.source_id
    )

  union all

  select
    'PROVIDER_NET_IMPACT_REVIEW'::text,
    'warning'::text,
    'provider_report_row'::text,
    r.id::text,
    jsonb_build_object(
      'transaction_type', r.transaction_type,
      'source_id', r.source_id,
      'seller_amount', r.seller_amount,
      'fee_amount', r.fee_amount,
      'settlement_net_amount', r.settlement_net_amount,
      'real_amount', r.real_amount
    )
  from public.commerce_provider_report_rows r
  join public.commerce_provider_report_batches b
    on b.provider = r.provider and b.report_scope = r.report_scope and b.report_batch_key = r.report_batch_key
  where r.provider = 'mercado_pago_sandbox'
    and b.status = 'complete'
    and r.transaction_type in ('SETTLEMENT','REFUND','CHARGEBACK','DISPUTE')
    and (r.settlement_net_amount is not null or r.real_amount is not null);
$$;

revoke all on function public.mara_provider_settlement_reconciliation_v1() from public, anon, authenticated;
grant execute on function public.mara_provider_settlement_reconciliation_v1() to service_role;

-- Required isolated non-production proof:
-- 1. evidence rows are append-only;
-- 2. only completed report batches can produce release-gate reconciliation findings;
-- 3. batch completion proves imported row count and optional expected row count;
-- 4. browser roles cannot read/write evidence or execute import/reconciliation RPCs;
-- 5. unsupported currencies fail closed;
-- 6. capture amount/currency mismatches fail the release gate;
-- 7. FEE_AMOUNT is treated conservatively as aggregate provider-fee evidence;
-- 8. unmatched money-impact rows in complete batches fail the release gate;
-- 9. reconciliation is read-only and never auto-heals ledger/product/payment state;
-- 10. no payout automation is enabled by this draft.
