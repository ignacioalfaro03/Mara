-- PREPARED CONTRACT ONLY — NOT APPLIED TO PRODUCTION.
-- Creator Business OS P1 external revenue import foundation.
-- The currently connected Supabase tooling does not expose a dedicated Mara
-- project. Do not apply this file to another product environment.

create table if not exists public.creator_external_sources (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  source text not null check (source in ('ONLYFANS','ARSMATE','INSTAGRAM','TIKTOK','X','OTHER')),
  account_label text,
  ingestion_mode text not null check (ingestion_mode in ('OFFICIAL_API','CSV_IMPORT','XLSX_IMPORT','MANUAL_ENTRY','PARTNER_EXPORT')),
  status text not null default 'prepared' check (status in ('prepared','active','disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists creator_external_sources_creator_idx
  on public.creator_external_sources (creator_id, source);

alter table public.creator_external_sources enable row level security;

revoke all on table public.creator_external_sources from anon, authenticated;
grant select on table public.creator_external_sources to authenticated;
grant all on table public.creator_external_sources to service_role;

drop policy if exists creator_external_sources_select_owner on public.creator_external_sources;
create policy creator_external_sources_select_owner
on public.creator_external_sources
for select
to authenticated
using (
  creator_id in (
    select c.id from public.creators c
    where c.user_id = (select auth.uid())
  )
);

create table if not exists public.creator_import_batches (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  source_id uuid not null references public.creator_external_sources(id) on delete cascade,
  provenance_type text not null check (provenance_type in ('CSV_IMPORT','XLSX_IMPORT','OFFICIAL_API','PARTNER_EXPORT','MANUAL_ENTRY')),
  original_filename text,
  status text not null default 'preview' check (status in ('preview','accepted','rejected')),
  row_count integer not null default 0 check (row_count >= 0),
  accepted_rows integer not null default 0 check (accepted_rows >= 0),
  rejected_rows integer not null default 0 check (rejected_rows >= 0),
  imported_at timestamptz not null default now()
);

create index if not exists creator_import_batches_creator_idx
  on public.creator_import_batches (creator_id, imported_at desc);

alter table public.creator_import_batches enable row level security;

revoke all on table public.creator_import_batches from anon, authenticated;
grant select on table public.creator_import_batches to authenticated;
grant all on table public.creator_import_batches to service_role;

drop policy if exists creator_import_batches_select_owner on public.creator_import_batches;
create policy creator_import_batches_select_owner
on public.creator_import_batches
for select
to authenticated
using (
  creator_id in (
    select c.id from public.creators c
    where c.user_id = (select auth.uid())
  )
);

create table if not exists public.creator_external_revenue_events (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  source_id uuid not null references public.creator_external_sources(id) on delete cascade,
  import_batch_id uuid references public.creator_import_batches(id) on delete set null,
  source text not null check (source in ('ONLYFANS','ARSMATE','INSTAGRAM','TIKTOK','X','OTHER')),
  source_record_id text not null,
  occurred_at timestamptz not null,
  imported_at timestamptz not null default now(),
  event_type text not null check (event_type in ('SALE','REFUND')),
  gross_amount_minor bigint not null check (gross_amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  customer_external_id text,
  provenance_type text not null check (provenance_type in ('CSV_IMPORT','XLSX_IMPORT','OFFICIAL_API','PARTNER_EXPORT','MANUAL_ENTRY')),
  metadata jsonb not null default '{}'::jsonb,
  unique (creator_id, source, source_record_id)
);

create index if not exists creator_external_revenue_events_creator_period_idx
  on public.creator_external_revenue_events (creator_id, occurred_at desc);

create index if not exists creator_external_revenue_events_customer_idx
  on public.creator_external_revenue_events (creator_id, source, customer_external_id)
  where customer_external_id is not null;

alter table public.creator_external_revenue_events enable row level security;

revoke all on table public.creator_external_revenue_events from anon, authenticated;
grant select on table public.creator_external_revenue_events to authenticated;
grant all on table public.creator_external_revenue_events to service_role;

drop policy if exists creator_external_revenue_events_select_owner on public.creator_external_revenue_events;
create policy creator_external_revenue_events_select_owner
on public.creator_external_revenue_events
for select
to authenticated
using (
  creator_id in (
    select c.id from public.creators c
    where c.user_id = (select auth.uid())
  )
);

comment on table public.creator_external_sources is
  'Creator-owned registry of verified external business data sources. A source row is not proof that an official connector exists.';
comment on table public.creator_import_batches is
  'Audit trail for creator-authorized external data ingestion. Writes remain server-controlled in P1.';
comment on table public.creator_external_revenue_events is
  'Normalized external revenue events with provenance and stable-source deduplication. Does not perform cross-platform identity auto-merge.';
