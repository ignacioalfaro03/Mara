-- Mara payments hardening: balanced financial subledger + creator liabilities.
-- Does NOT activate a real provider or payouts. Money remains integer minor units.

create table public.commerce_economics_policies (
  id uuid primary key default extensions.gen_random_uuid(),
  creator_id uuid references public.creators(id) on delete cascade,
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  platform_fee_bps integer not null check (platform_fee_bps between 0 and 10000),
  reserve_bps integer not null default 0 check (reserve_bps between 0 and 10000),
  payout_delay_days integer not null default 7 check (payout_delay_days between 0 and 180),
  payout_minimum_minor bigint not null default 0 check (payout_minimum_minor >= 0),
  effective_from timestamptz not null default now(),
  effective_to timestamptz,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  check (effective_to is null or effective_to > effective_from)
);
create unique index commerce_economics_one_open_policy
  on public.commerce_economics_policies (coalesce(creator_id, '00000000-0000-0000-0000-000000000000'::uuid), currency)
  where effective_to is null;

create table public.commerce_financial_transactions (
  id uuid primary key default extensions.gen_random_uuid(),
  event_key text not null unique check (char_length(event_key) between 3 and 180),
  event_type text not null check (event_type in ('sale','refund','dispute_hold','dispute_release','dispute_loss','payout','payout_reversal','adjustment')),
  purchase_id uuid references public.commerce_purchases(id) on delete restrict,
  creator_id uuid references public.creators(id) on delete restrict,
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  provider text,
  provider_reference text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);

create table public.commerce_financial_entries (
  id uuid primary key default extensions.gen_random_uuid(),
  transaction_id uuid not null references public.commerce_financial_transactions(id) on delete restrict,
  account_code text not null check (account_code in ('processor_clearing','platform_revenue','creator_pending','creator_available','creator_held','creator_paid','refunds','chargebacks','processor_fees','tax_payable')),
  side text not null check (side in ('debit','credit')),
  amount_minor bigint not null check (amount_minor > 0),
  creator_id uuid references public.creators(id) on delete restrict,
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  created_at timestamptz not null default now()
);
create index commerce_financial_entries_transaction_idx on public.commerce_financial_entries(transaction_id);
create index commerce_financial_entries_creator_idx on public.commerce_financial_entries(creator_id, currency, created_at) where creator_id is not null;

create table public.commerce_refunds (
  id uuid primary key default extensions.gen_random_uuid(),
  purchase_id uuid not null references public.commerce_purchases(id) on delete restrict,
  provider text not null,
  provider_refund_id text not null,
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  status text not null check (status in ('pending','succeeded','failed')),
  reason text,
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  unique(provider, provider_refund_id)
);

create table public.commerce_disputes (
  id uuid primary key default extensions.gen_random_uuid(),
  purchase_id uuid not null references public.commerce_purchases(id) on delete restrict,
  provider text not null,
  provider_dispute_id text not null,
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  status text not null check (status in ('opened','won','lost','closed')),
  reason text,
  evidence_due_at timestamptz,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  unique(provider, provider_dispute_id)
);

create table public.commerce_payouts (
  id uuid primary key default extensions.gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete restrict,
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  amount_minor bigint not null check (amount_minor > 0),
  status text not null default 'requested' check (status in ('requested','approved','processing','paid','failed','reversed','cancelled')),
  idempotency_key uuid not null unique,
  provider text,
  provider_payout_id text,
  failure_reason text,
  requested_at timestamptz not null default now(),
  processed_at timestamptz,
  paid_at timestamptz,
  unique(provider, provider_payout_id)
);

create table public.commerce_payout_items (
  payout_id uuid not null references public.commerce_payouts(id) on delete restrict,
  purchase_id uuid not null references public.commerce_purchases(id) on delete restrict,
  amount_minor bigint not null check (amount_minor > 0),
  primary key (payout_id, purchase_id),
  unique(purchase_id)
);

create table public.commerce_reconciliation_records (
  id uuid primary key default extensions.gen_random_uuid(),
  provider text not null,
  object_type text not null check (object_type in ('payment','refund','payout')),
  provider_reference text not null,
  internal_reference uuid,
  status text not null check (status in ('matched','mismatch','missing_internal','missing_provider','requires_review')),
  provider_amount_minor bigint,
  internal_amount_minor bigint,
  currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  checked_at timestamptz not null default now(),
  unique(provider, object_type, provider_reference)
);

alter table public.commerce_economics_policies enable row level security;
alter table public.commerce_financial_transactions enable row level security;
alter table public.commerce_financial_entries enable row level security;
alter table public.commerce_refunds enable row level security;
alter table public.commerce_disputes enable row level security;
alter table public.commerce_payouts enable row level security;
alter table public.commerce_payout_items enable row level security;
alter table public.commerce_reconciliation_records enable row level security;

revoke all on public.commerce_economics_policies, public.commerce_financial_transactions, public.commerce_financial_entries,
  public.commerce_refunds, public.commerce_disputes, public.commerce_payouts, public.commerce_payout_items,
  public.commerce_reconciliation_records from anon, authenticated;
grant all on public.commerce_economics_policies, public.commerce_financial_transactions, public.commerce_financial_entries,
  public.commerce_refunds, public.commerce_disputes, public.commerce_payouts, public.commerce_payout_items,
  public.commerce_reconciliation_records to service_role;

grant select on public.commerce_economics_policies, public.commerce_financial_entries, public.commerce_payouts, public.commerce_payout_items to authenticated;
create policy commerce_economics_creator_read on public.commerce_economics_policies for select to authenticated
  using (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid())));
create policy commerce_financial_entries_creator_read on public.commerce_financial_entries for select to authenticated
  using (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid())));
create policy commerce_payouts_creator_read on public.commerce_payouts for select to authenticated
  using (creator_id in (select c.id from public.creators c where c.user_id = (select auth.uid())));
create policy commerce_payout_items_creator_read on public.commerce_payout_items for select to authenticated
  using (exists (select 1 from public.commerce_payouts p join public.creators c on c.id=p.creator_id where p.id=commerce_payout_items.payout_id and c.user_id=(select auth.uid())));

create or replace function private.assert_mara_financial_transaction_balanced(p_transaction_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_debits bigint; v_credits bigint;
begin
  select coalesce(sum(amount_minor) filter(where side='debit'),0), coalesce(sum(amount_minor) filter(where side='credit'),0)
    into v_debits, v_credits from public.commerce_financial_entries where transaction_id=p_transaction_id;
  if v_debits = 0 or v_debits <> v_credits then raise exception 'unbalanced_financial_transaction'; end if;
end; $$;
revoke all on function private.assert_mara_financial_transaction_balanced(uuid) from public, anon, authenticated;

create view public.creator_finance_summary with (security_invoker=true) as
select c.id creator_id, e.currency,
  coalesce(sum(case when e.account_code='creator_pending' and e.side='credit' then e.amount_minor when e.account_code='creator_pending' and e.side='debit' then -e.amount_minor else 0 end),0)::bigint pending_minor,
  coalesce(sum(case when e.account_code='creator_available' and e.side='credit' then e.amount_minor when e.account_code='creator_available' and e.side='debit' then -e.amount_minor else 0 end),0)::bigint available_minor,
  coalesce(sum(case when e.account_code='creator_held' and e.side='credit' then e.amount_minor when e.account_code='creator_held' and e.side='debit' then -e.amount_minor else 0 end),0)::bigint held_minor,
  coalesce(sum(case when e.account_code='creator_paid' and e.side='credit' then e.amount_minor when e.account_code='creator_paid' and e.side='debit' then -e.amount_minor else 0 end),0)::bigint paid_minor
from public.creators c join public.commerce_financial_entries e on e.creator_id=c.id group by c.id,e.currency;
revoke all on public.creator_finance_summary from anon, authenticated;
grant select on public.creator_finance_summary to authenticated;

create or replace function public.request_mara_creator_payout(p_creator_id uuid, p_currency text, p_amount_minor bigint, p_idempotency_key uuid)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_available bigint; v_payout uuid;
begin
  if auth.role() <> 'service_role' then raise exception 'service_role_required'; end if;
  if p_amount_minor <= 0 then raise exception 'invalid_payout_amount'; end if;
  select coalesce(sum(case when side='credit' then amount_minor else -amount_minor end),0)::bigint into v_available
  from public.commerce_financial_entries where creator_id=p_creator_id and currency=p_currency and account_code='creator_available';
  if p_amount_minor > v_available then raise exception 'payout_exceeds_available_balance'; end if;
  insert into public.commerce_payouts(creator_id,currency,amount_minor,idempotency_key)
  values(p_creator_id,p_currency,p_amount_minor,p_idempotency_key)
  on conflict(idempotency_key) do update set idempotency_key=excluded.idempotency_key returning id into v_payout;
  return v_payout;
end $$;
revoke all on function public.request_mara_creator_payout(uuid,text,bigint,uuid) from public,anon,authenticated;
grant execute on function public.request_mara_creator_payout(uuid,text,bigint,uuid) to service_role;

comment on table public.commerce_financial_transactions is 'Immutable economic event header. Purchase truth remains commerce_purchases; this subledger records allocation and liabilities.';
comment on table public.commerce_financial_entries is 'Double-entry financial journal in integer minor units. Browser clients have no mutation grants.';
comment on table public.commerce_payouts is 'Creator payout lifecycle only. Creating a row does not move real money.';
comment on table public.commerce_reconciliation_records is 'Internal/provider reconciliation evidence. Provider ingestion remains server-only.';
