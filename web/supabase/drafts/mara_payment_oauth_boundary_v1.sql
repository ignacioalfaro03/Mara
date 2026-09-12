-- MARA PAYMENT OAUTH BOUNDARY V1 — DRAFT ONLY.
--
-- DO NOT APPLY DIRECTLY.
-- Depends on reviewed activation of `mara_payment_ledger_v1.sql` because
-- credential references attach to `creator_payment_accounts`.
--
-- Security goals:
-- - browser roles never read OAuth sessions or credential references;
-- - raw provider credentials are never stored in these tables;
-- - OAuth state is persisted only as SHA-256 hash;
-- - PKCE verifier is persisted only as an opaque vault reference;
-- - provider credential material is represented only by an opaque vault reference;
-- - callback sessions expire and are single-use.

create table if not exists public.creator_payment_oauth_sessions (
  id uuid primary key default extensions.gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  provider text not null check (char_length(provider) between 2 and 80),
  state_hash text not null unique check (state_hash ~ '^[a-f0-9]{64}$'),
  pkce_verifier_reference text not null check (char_length(pkce_verifier_reference) between 8 and 512),
  callback_url text not null check (char_length(callback_url) between 8 and 1200),
  status text not null default 'pending' check (status in ('pending','consumed','expired','canceled')),
  expires_at timestamptz not null,
  consumed_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint creator_payment_oauth_expiry_after_create check (expires_at > created_at),
  constraint creator_payment_oauth_consumed_consistency check (
    (status = 'consumed' and consumed_at is not null)
    or (status <> 'consumed' and consumed_at is null)
  )
);

create index if not exists creator_payment_oauth_creator_provider_idx
  on public.creator_payment_oauth_sessions (creator_id, provider, created_at desc);
create index if not exists creator_payment_oauth_pending_expiry_idx
  on public.creator_payment_oauth_sessions (expires_at)
  where status = 'pending';

create table if not exists public.creator_payment_credential_references (
  creator_id uuid not null,
  provider text not null,
  provider_account_id text not null,
  credential_reference text not null check (char_length(credential_reference) between 8 and 512),
  credential_expires_at timestamptz null,
  rotated_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (creator_id, provider),
  foreign key (creator_id, provider, provider_account_id)
    references public.creator_payment_accounts (creator_id, provider, provider_account_id)
    on delete cascade
);

alter table public.creator_payment_oauth_sessions enable row level security;
alter table public.creator_payment_credential_references enable row level security;

revoke all on table public.creator_payment_oauth_sessions from public, anon, authenticated;
revoke all on table public.creator_payment_credential_references from public, anon, authenticated;
grant all on table public.creator_payment_oauth_sessions to service_role;
grant all on table public.creator_payment_credential_references to service_role;

create policy creator_payment_oauth_browser_deny
on public.creator_payment_oauth_sessions
for all
to anon, authenticated
using (false)
with check (false);

create policy creator_payment_credential_references_browser_deny
on public.creator_payment_credential_references
for all
to anon, authenticated
using (false)
with check (false);

-- Activation implementation must consume an OAuth session atomically, verify the
-- supplied state hash, ensure `expires_at > now()`, retrieve the PKCE verifier from
-- the referenced secret vault, exchange the authorization code server-side, write
-- only the resulting opaque credential reference, and then destroy the temporary
-- PKCE secret.
--
-- Never add raw provider token columns to either table.
