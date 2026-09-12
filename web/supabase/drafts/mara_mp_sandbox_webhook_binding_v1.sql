-- MARA MERCADO PAGO SANDBOX WEBHOOK BINDING V1 — DRAFT ONLY.
--
-- DO NOT APPLY DIRECTLY TO THE CONNECTED PRODUCTION DATABASE.
-- Depends on reviewed activation of the payment ledger + credential reference drafts.
--
-- This layer gives each creator payment account a random webhook binding id so the
-- notification URL never contains creator ids, provider account ids, access tokens,
-- refresh tokens or Vault credential references.

create table if not exists private.mara_payment_webhook_bindings (
  binding_id uuid primary key default extensions.gen_random_uuid(),
  creator_id uuid not null,
  provider text not null check (provider = 'mercado_pago_sandbox'),
  provider_account_id text not null,
  status text not null default 'active' check (status in ('active','rotated','disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (creator_id, provider),
  foreign key (creator_id, provider, provider_account_id)
    references public.creator_payment_accounts (creator_id, provider, provider_account_id)
    on delete cascade
);

alter table private.mara_payment_webhook_bindings enable row level security;
revoke all on table private.mara_payment_webhook_bindings from public, anon, authenticated;

create or replace function public.mara_mp_sandbox_ensure_webhook_binding(
  p_creator_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_provider_account_id text;
  v_binding_id uuid;
begin
  select a.provider_account_id
  into v_provider_account_id
  from public.creator_payment_accounts a
  where a.creator_id = p_creator_id
    and a.provider = 'mercado_pago_sandbox'
    and a.status = 'active'
    and a.charges_enabled = true;

  if v_provider_account_id is null then
    raise exception 'mara_mp_webhook_payment_account_not_ready';
  end if;

  insert into private.mara_payment_webhook_bindings (
    creator_id,
    provider,
    provider_account_id,
    status,
    updated_at
  ) values (
    p_creator_id,
    'mercado_pago_sandbox',
    v_provider_account_id,
    'active',
    now()
  )
  on conflict (creator_id, provider) do update
  set provider_account_id = excluded.provider_account_id,
      status = 'active',
      updated_at = now()
  returning binding_id into v_binding_id;

  return v_binding_id;
end;
$$;

revoke all on function public.mara_mp_sandbox_ensure_webhook_binding(uuid) from public, anon, authenticated;
grant execute on function public.mara_mp_sandbox_ensure_webhook_binding(uuid) to service_role;

create or replace function public.mara_mp_sandbox_resolve_webhook_binding(
  p_binding_id uuid
)
returns table (
  binding_id uuid,
  creator_id uuid,
  provider_account_id text,
  credential_reference text
)
language sql
security definer
set search_path = ''
stable
as $$
  select
    b.binding_id,
    b.creator_id,
    b.provider_account_id,
    r.credential_reference
  from private.mara_payment_webhook_bindings b
  join public.creator_payment_credential_references r
    on r.creator_id = b.creator_id
   and r.provider = b.provider
   and r.provider_account_id = b.provider_account_id
  where b.binding_id = p_binding_id
    and b.provider = 'mercado_pago_sandbox'
    and b.status = 'active'
    and (r.credential_expires_at is null or r.credential_expires_at > now())
  limit 1;
$$;

revoke all on function public.mara_mp_sandbox_resolve_webhook_binding(uuid) from public, anon, authenticated;
grant execute on function public.mara_mp_sandbox_resolve_webhook_binding(uuid) to service_role;

create or replace function public.mara_mp_sandbox_checkout_expectation(
  p_checkout_intent_id uuid
)
returns table (
  checkout_intent_id uuid,
  creator_id uuid,
  provider text,
  provider_account_id text,
  amount_minor bigint,
  currency text
)
language sql
security definer
set search_path = ''
stable
as $$
  select
    ci.id,
    o.creator_id,
    ci.provider,
    ci.provider_account_id_snapshot,
    ci.amount_minor::bigint,
    ci.currency
  from public.commerce_checkout_intents ci
  join public.commerce_offers o on o.id = ci.offer_id
  where ci.id = p_checkout_intent_id
    and ci.provider = 'mercado_pago_sandbox'
    and ci.provider_account_id_snapshot is not null
  limit 1;
$$;

revoke all on function public.mara_mp_sandbox_checkout_expectation(uuid) from public, anon, authenticated;
grant execute on function public.mara_mp_sandbox_checkout_expectation(uuid) to service_role;

-- Required isolated non-production proof:
-- 1. binding id is random UUID and not derived from creator/provider identifiers;
-- 2. anon/authenticated cannot resolve a binding;
-- 3. resolving a disabled/rotated binding returns no credential reference;
-- 4. checkout expectation is server-authoritative and freezes provider account + amount + currency;
-- 5. notification URL contains only `mara_account=<binding_id>` plus provider webhook fields;
-- 6. no raw provider credential is ever returned by these functions.
