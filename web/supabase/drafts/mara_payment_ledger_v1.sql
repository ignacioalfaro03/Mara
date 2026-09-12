-- MARA PAYMENT LEDGER V1 — DRAFT ONLY.
--
-- DO NOT APPLY DIRECTLY.
-- This file is intentionally outside supabase/migrations.
-- When the founder authorizes payment-schema activation, create the real migration
-- with `supabase migration new <name>`, copy/review this SQL, apply first to an
-- isolated development database, run security/performance advisors and execute
-- reconciliation/idempotency tests before production consideration.
--
-- Design intent:
-- - commerce_purchases remains the product/fulfillment record;
-- - payments/refunds/payouts are explicit financial objects;
-- - ledger journal is append-only;
-- - browser roles receive no financial write grants;
-- - all money uses positive minor-unit bigint amounts;
-- - double-entry journal lines carry debit/credit direction.

create table if not exists public.creator_payment_accounts (
  creator_id uuid primary key references public.creators(id) on delete cascade,
  provider text not null check (char_length(provider) between 2 and 80),
  provider_account_id text not null check (char_length(provider_account_id) between 2 and 255),
  status text not null default 'pending'
    check (status in ('pending', 'restricted', 'active', 'disabled')),
  charges_enabled boolean not null default false,
  payouts_enabled boolean not null default false,
  details_submitted boolean not null default false,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_account_id)
);

create table if not exists public.commerce_payments (
  id uuid primary key default extensions.gen_random_uuid(),
  checkout_intent_id uuid not null references public.commerce_checkout_intents(id) on delete restrict,
  purchase_id uuid null unique references public.commerce_purchases(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  creator_id uuid null references public.creators(id) on delete restrict,
  provider text not null check (char_length(provider) between 2 and 80),
  provider_payment_id text not null check (char_length(provider_payment_id) between 2 and 255),
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  status text not null
    check (status in ('pending', 'authorized', 'succeeded', 'failed', 'partially_refunded', 'refunded', 'chargeback')),
  refunded_amount_minor bigint not null default 0 check (refunded_amount_minor >= 0 and refunded_amount_minor <= amount_minor),
  captured_at timestamptz null,
  failed_at timestamptz null,
  provider_created_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_payment_id)
);

create table if not exists public.commerce_refunds (
  id uuid primary key default extensions.gen_random_uuid(),
  payment_id uuid not null references public.commerce_payments(id) on delete restrict,
  purchase_id uuid not null references public.commerce_purchases(id) on delete restrict,
  creator_id uuid null references public.creators(id) on delete restrict,
  provider text not null check (char_length(provider) between 2 and 80),
  provider_refund_id text not null check (char_length(provider_refund_id) between 2 and 255),
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  status text not null check (status in ('pending', 'succeeded', 'failed', 'canceled')),
  reason text null check (reason is null or char_length(reason) <= 240),
  provider_created_at timestamptz null,
  succeeded_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  unique (provider, provider_refund_id)
);

create table if not exists public.creator_payouts (
  id uuid primary key default extensions.gen_random_uuid(),
  -- One creator maps to one provider payment account in V1. Referencing the
  -- payment account directly makes it impossible to create a payout for creator A
  -- while accidentally attaching creator B's provider account.
  creator_id uuid not null references public.creator_payment_accounts(creator_id) on delete restrict,
  provider text not null check (char_length(provider) between 2 and 80),
  provider_payout_id text null check (provider_payout_id is null or char_length(provider_payout_id) between 2 and 255),
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'paid', 'failed', 'canceled', 'reversed')),
  initiated_at timestamptz null,
  paid_at timestamptz null,
  failed_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists creator_payout_provider_id_uniq
  on public.creator_payouts (provider, provider_payout_id)
  where provider_payout_id is not null;

create table if not exists public.commerce_ledger_transactions (
  id uuid primary key default extensions.gen_random_uuid(),
  idempotency_key text not null unique check (char_length(idempotency_key) between 8 and 255),
  transaction_type text not null
    check (transaction_type in ('payment_capture', 'processor_fee', 'platform_fee', 'creator_earning', 'refund', 'chargeback', 'payout', 'payout_reversal', 'adjustment')),
  payment_id uuid null references public.commerce_payments(id) on delete restrict,
  refund_id uuid null references public.commerce_refunds(id) on delete restrict,
  payout_id uuid null references public.creator_payouts(id) on delete restrict,
  purchase_id uuid null references public.commerce_purchases(id) on delete restrict,
  creator_id uuid null references public.creators(id) on delete restrict,
  provider text null check (provider is null or char_length(provider) between 2 and 80),
  provider_event_id text null check (provider_event_id is null or char_length(provider_event_id) between 2 and 255),
  occurred_at timestamptz not null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);

create unique index if not exists commerce_ledger_provider_event_type_uniq
  on public.commerce_ledger_transactions (provider, provider_event_id, transaction_type)
  where provider is not null and provider_event_id is not null;

create table if not exists public.commerce_ledger_entries (
  id uuid primary key default extensions.gen_random_uuid(),
  transaction_id uuid not null references public.commerce_ledger_transactions(id) on delete restrict,
  line_no smallint not null check (line_no > 0),
  creator_id uuid null references public.creators(id) on delete restrict,
  account_code text not null
    check (account_code in ('processor_clearing', 'creator_payable', 'platform_revenue', 'processor_fee_expense', 'refund_liability', 'chargeback_loss', 'payout_clearing')),
  direction text not null check (direction in ('debit', 'credit')),
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  created_at timestamptz not null default now(),
  unique (transaction_id, line_no)
);

create index if not exists commerce_payments_creator_created_idx
  on public.commerce_payments (creator_id, created_at desc);
create index if not exists commerce_payments_purchase_idx
  on public.commerce_payments (purchase_id);
create index if not exists commerce_refunds_purchase_created_idx
  on public.commerce_refunds (purchase_id, created_at desc);
create index if not exists creator_payouts_creator_created_idx
  on public.creator_payouts (creator_id, created_at desc);
create index if not exists commerce_ledger_transactions_creator_occurred_idx
  on public.commerce_ledger_transactions (creator_id, occurred_at desc);
create index if not exists commerce_ledger_entries_creator_account_idx
  on public.commerce_ledger_entries (creator_id, account_code, created_at desc);

alter table public.creator_payment_accounts enable row level security;
alter table public.commerce_payments enable row level security;
alter table public.commerce_refunds enable row level security;
alter table public.creator_payouts enable row level security;
alter table public.commerce_ledger_transactions enable row level security;
alter table public.commerce_ledger_entries enable row level security;

revoke all on table public.creator_payment_accounts from anon, authenticated;
revoke all on table public.commerce_payments from anon, authenticated;
revoke all on table public.commerce_refunds from anon, authenticated;
revoke all on table public.creator_payouts from anon, authenticated;
revoke all on table public.commerce_ledger_transactions from anon, authenticated;
revoke all on table public.commerce_ledger_entries from anon, authenticated;

-- Service-side financial processing only. Creator-facing balances should later be
-- exposed through narrowly scoped security-invoker views/RPCs rather than broad
-- table grants.
grant all on table public.creator_payment_accounts to service_role;
grant all on table public.commerce_payments to service_role;
grant all on table public.commerce_refunds to service_role;
grant all on table public.creator_payouts to service_role;
grant all on table public.commerce_ledger_transactions to service_role;
grant all on table public.commerce_ledger_entries to service_role;

create or replace function private.reject_mara_financial_ledger_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  raise exception 'mara_financial_ledger_is_append_only';
end;
$$;

revoke all on function private.reject_mara_financial_ledger_mutation() from public, anon, authenticated;

drop trigger if exists commerce_ledger_transactions_append_only on public.commerce_ledger_transactions;
create trigger commerce_ledger_transactions_append_only
before update or delete on public.commerce_ledger_transactions
for each row execute function private.reject_mara_financial_ledger_mutation();

drop trigger if exists commerce_ledger_entries_append_only on public.commerce_ledger_entries;
create trigger commerce_ledger_entries_append_only
before update or delete on public.commerce_ledger_entries
for each row execute function private.reject_mara_financial_ledger_mutation();

-- Creator payment account/payment/payout records are stateful and may be updated
-- only by service-side provider reconciliation. Ledger journal rows themselves
-- are immutable.

create or replace function private.assert_mara_ledger_transaction_balanced(p_transaction_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_unbalanced_count integer;
begin
  select count(*)
  into v_unbalanced_count
  from (
    select
      currency,
      coalesce(sum(amount_minor) filter (where direction = 'debit'), 0) as debits,
      coalesce(sum(amount_minor) filter (where direction = 'credit'), 0) as credits
    from public.commerce_ledger_entries
    where transaction_id = p_transaction_id
    group by currency
    having coalesce(sum(amount_minor) filter (where direction = 'debit'), 0)
        <> coalesce(sum(amount_minor) filter (where direction = 'credit'), 0)
  ) imbalance;

  if v_unbalanced_count > 0 then
    raise exception 'mara_ledger_transaction_unbalanced';
  end if;
end;
$$;

revoke all on function private.assert_mara_ledger_transaction_balanced(uuid) from public, anon, authenticated;

-- Before activation, add a single transaction-writing RPC in private/server scope
-- that inserts the header + all lines atomically and calls
-- private.assert_mara_ledger_transaction_balanced(...) before commit.
-- Do not permit browser clients to assemble ledger entries line by line.