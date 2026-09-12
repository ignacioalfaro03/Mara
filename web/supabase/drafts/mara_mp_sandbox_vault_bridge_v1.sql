-- MARA MERCADO PAGO SANDBOX VAULT BRIDGE V1 — DRAFT ONLY.
--
-- DO NOT APPLY DIRECTLY TO THE CONNECTED PRODUCTION DATABASE.
-- This design is intended for an isolated non-production Supabase target after
-- migration-history reconciliation and security review.
--
-- Current Supabase guidance prefers Supabase Vault for database-managed secrets.
-- Raw Mercado Pago access/refresh tokens must never be stored in public product
-- tables, browser storage, logs, telemetry, URLs or checkout metadata.
--
-- This bridge exposes only service-role RPCs. Browser roles are explicitly revoked.
-- The opaque reference returned to application code is the Vault secret UUID.

create extension if not exists supabase_vault with schema vault;
create schema if not exists private;

create table if not exists private.mara_payment_vault_registry (
  secret_id uuid primary key,
  creator_id uuid not null references public.creators(id) on delete cascade,
  provider text not null check (provider = 'mercado_pago_sandbox'),
  provider_account_id text not null check (char_length(provider_account_id) between 2 and 255),
  purpose text not null check (purpose = 'oauth_credentials'),
  created_at timestamptz not null default now(),
  rotated_at timestamptz null,
  unique (creator_id, provider, provider_account_id, purpose)
);

alter table private.mara_payment_vault_registry enable row level security;
revoke all on table private.mara_payment_vault_registry from public, anon, authenticated;

create or replace function public.mara_mp_sandbox_vault_put(
  p_creator_id uuid,
  p_provider_account_id text,
  p_credential jsonb
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_secret_id uuid;
  v_access_token text;
  v_refresh_token text;
  v_expires_at timestamptz;
begin
  if p_creator_id is null then
    raise exception 'mara_mp_vault_creator_required';
  end if;
  if p_provider_account_id is null or char_length(trim(p_provider_account_id)) < 2 then
    raise exception 'mara_mp_vault_provider_account_required';
  end if;
  if p_credential is null or jsonb_typeof(p_credential) <> 'object' then
    raise exception 'mara_mp_vault_credential_object_required';
  end if;
  if (select array_agg(k order by k) from jsonb_object_keys(p_credential) as t(k))
     is distinct from array['accessToken','expiresAt','refreshToken']::text[] then
    raise exception 'mara_mp_vault_credential_shape_invalid';
  end if;

  v_access_token := nullif(trim(p_credential ->> 'accessToken'), '');
  v_refresh_token := nullif(trim(p_credential ->> 'refreshToken'), '');
  begin
    v_expires_at := (p_credential ->> 'expiresAt')::timestamptz;
  exception when others then
    raise exception 'mara_mp_vault_expiry_invalid';
  end;

  if v_access_token is null or char_length(v_access_token) < 8 then
    raise exception 'mara_mp_vault_access_token_invalid';
  end if;
  if v_refresh_token is null or char_length(v_refresh_token) < 8 then
    raise exception 'mara_mp_vault_refresh_token_invalid';
  end if;
  if v_expires_at <= now() then
    raise exception 'mara_mp_vault_credential_expired';
  end if;
  if not exists (select 1 from public.creators c where c.id = p_creator_id) then
    raise exception 'mara_mp_vault_creator_not_found';
  end if;

  select vault.create_secret(
    jsonb_build_object(
      'accessToken', v_access_token,
      'refreshToken', v_refresh_token,
      'expiresAt', v_expires_at
    )::text,
    null,
    'Mara Mercado Pago sandbox OAuth credential'
  ) into v_secret_id;

  insert into private.mara_payment_vault_registry (
    secret_id,
    creator_id,
    provider,
    provider_account_id,
    purpose
  ) values (
    v_secret_id,
    p_creator_id,
    'mercado_pago_sandbox',
    trim(p_provider_account_id),
    'oauth_credentials'
  );

  return v_secret_id::text;
exception
  when unique_violation then
    if v_secret_id is not null then
      delete from vault.secrets where id = v_secret_id;
    end if;
    raise exception 'mara_mp_vault_binding_already_exists';
end;
$$;

revoke all on function public.mara_mp_sandbox_vault_put(uuid, text, jsonb) from public, anon, authenticated;
grant execute on function public.mara_mp_sandbox_vault_put(uuid, text, jsonb) to service_role;

create or replace function public.mara_mp_sandbox_vault_read(
  p_reference text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_secret_id uuid;
  v_secret text;
begin
  begin
    v_secret_id := p_reference::uuid;
  exception when others then
    raise exception 'mara_mp_vault_reference_invalid';
  end;

  if not exists (
    select 1
    from private.mara_payment_vault_registry r
    where r.secret_id = v_secret_id
      and r.provider = 'mercado_pago_sandbox'
      and r.purpose = 'oauth_credentials'
  ) then
    return null;
  end if;

  select d.decrypted_secret
    into v_secret
  from vault.decrypted_secrets d
  where d.id = v_secret_id;

  if v_secret is null then
    return null;
  end if;

  return v_secret::jsonb;
end;
$$;

revoke all on function public.mara_mp_sandbox_vault_read(text) from public, anon, authenticated;
grant execute on function public.mara_mp_sandbox_vault_read(text) to service_role;

create or replace function public.mara_mp_sandbox_vault_replace(
  p_reference text,
  p_credential jsonb
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_secret_id uuid;
  v_access_token text;
  v_refresh_token text;
  v_expires_at timestamptz;
begin
  begin
    v_secret_id := p_reference::uuid;
  exception when others then
    raise exception 'mara_mp_vault_reference_invalid';
  end;

  if not exists (
    select 1
    from private.mara_payment_vault_registry r
    where r.secret_id = v_secret_id
      and r.provider = 'mercado_pago_sandbox'
      and r.purpose = 'oauth_credentials'
  ) then
    raise exception 'mara_mp_vault_reference_not_found';
  end if;

  if p_credential is null or jsonb_typeof(p_credential) <> 'object' then
    raise exception 'mara_mp_vault_credential_object_required';
  end if;
  if (select array_agg(k order by k) from jsonb_object_keys(p_credential) as t(k))
     is distinct from array['accessToken','expiresAt','refreshToken']::text[] then
    raise exception 'mara_mp_vault_credential_shape_invalid';
  end if;

  v_access_token := nullif(trim(p_credential ->> 'accessToken'), '');
  v_refresh_token := nullif(trim(p_credential ->> 'refreshToken'), '');
  begin
    v_expires_at := (p_credential ->> 'expiresAt')::timestamptz;
  exception when others then
    raise exception 'mara_mp_vault_expiry_invalid';
  end;

  if v_access_token is null or char_length(v_access_token) < 8 then
    raise exception 'mara_mp_vault_access_token_invalid';
  end if;
  if v_refresh_token is null or char_length(v_refresh_token) < 8 then
    raise exception 'mara_mp_vault_refresh_token_invalid';
  end if;
  if v_expires_at <= now() then
    raise exception 'mara_mp_vault_credential_expired';
  end if;

  perform vault.update_secret(
    v_secret_id,
    jsonb_build_object(
      'accessToken', v_access_token,
      'refreshToken', v_refresh_token,
      'expiresAt', v_expires_at
    )::text,
    null,
    'Mara Mercado Pago sandbox OAuth credential'
  );

  update private.mara_payment_vault_registry
  set rotated_at = now()
  where secret_id = v_secret_id;

  return v_secret_id::text;
end;
$$;

revoke all on function public.mara_mp_sandbox_vault_replace(text, jsonb) from public, anon, authenticated;
grant execute on function public.mara_mp_sandbox_vault_replace(text, jsonb) to service_role;

-- Activation checklist before this draft can become a migration:
-- 1. create migration with current Supabase CLI (`supabase migration new ...`);
-- 2. apply to an isolated development project only;
-- 3. verify service-role RPC success and anon/authenticated denial;
-- 4. verify vault.secrets remains encrypted at rest and decrypted values never
--    appear in application logs, telemetry or HTTP responses;
-- 5. run Supabase security/performance advisors;
-- 6. test token rotation and creator cleanup;
-- 7. keep production payment runtime OFF until the broader payment GO/NO-GO.
