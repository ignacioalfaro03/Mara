-- MARA MERCADO PAGO SANDBOX OAUTH RPC V1 — DRAFT ONLY.
--
-- DO NOT APPLY DIRECTLY TO THE CONNECTED PRODUCTION DATABASE.
-- Depends on review/activation of:
--   - mara_payment_ledger_v1.sql
--   - mara_payment_oauth_boundary_v1.sql
--   - mara_mp_sandbox_vault_bridge_v1.sql
--
-- Purpose:
-- - make OAuth state + PKCE server-authoritative and single-use;
-- - store PKCE verifier only in Supabase Vault;
-- - bind the resulting opaque provider credential reference atomically;
-- - expose only service-role RPCs;
-- - never return provider access/refresh tokens from these RPCs.

create or replace function public.mara_mp_sandbox_oauth_begin(
  p_creator_id uuid,
  p_state_hash text,
  p_pkce_verifier text,
  p_callback_url text,
  p_expires_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session_id uuid;
  v_pkce_secret_id uuid;
begin
  if p_creator_id is null then
    raise exception 'mara_mp_oauth_creator_required';
  end if;
  if p_state_hash is null or p_state_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'mara_mp_oauth_state_hash_invalid';
  end if;
  if p_pkce_verifier is null or char_length(p_pkce_verifier) < 43 or char_length(p_pkce_verifier) > 128 then
    raise exception 'mara_mp_oauth_pkce_invalid';
  end if;
  if p_callback_url is null or p_callback_url !~ '^https://' or char_length(p_callback_url) > 1200 then
    raise exception 'mara_mp_oauth_callback_invalid';
  end if;
  if p_expires_at <= now() or p_expires_at > now() + interval '15 minutes' then
    raise exception 'mara_mp_oauth_expiry_invalid';
  end if;
  if not exists (select 1 from public.creators c where c.id = p_creator_id) then
    raise exception 'mara_mp_oauth_creator_not_found';
  end if;

  select vault.create_secret(
    p_pkce_verifier,
    null,
    'Mara Mercado Pago sandbox temporary PKCE verifier'
  ) into v_pkce_secret_id;

  insert into public.creator_payment_oauth_sessions (
    creator_id,
    provider,
    state_hash,
    pkce_verifier_reference,
    callback_url,
    status,
    expires_at,
    metadata
  ) values (
    p_creator_id,
    'mercado_pago_sandbox',
    p_state_hash,
    v_pkce_secret_id::text,
    p_callback_url,
    'pending',
    p_expires_at,
    jsonb_build_object('environment', 'sandbox')
  ) returning id into v_session_id;

  return v_session_id;
exception
  when others then
    if v_pkce_secret_id is not null then
      delete from vault.secrets where id = v_pkce_secret_id;
    end if;
    raise;
end;
$$;

revoke all on function public.mara_mp_sandbox_oauth_begin(uuid, text, text, text, timestamptz) from public, anon, authenticated;
grant execute on function public.mara_mp_sandbox_oauth_begin(uuid, text, text, text, timestamptz) to service_role;

create or replace function public.mara_mp_sandbox_oauth_consume(
  p_state_hash text
)
returns table (
  session_id uuid,
  creator_id uuid,
  pkce_verifier text,
  callback_url text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session public.creator_payment_oauth_sessions%rowtype;
  v_secret_id uuid;
  v_pkce_verifier text;
begin
  if p_state_hash is null or p_state_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'mara_mp_oauth_state_hash_invalid';
  end if;

  select *
  into v_session
  from public.creator_payment_oauth_sessions s
  where s.provider = 'mercado_pago_sandbox'
    and s.state_hash = p_state_hash
  for update;

  if not found then
    raise exception 'mara_mp_oauth_session_not_found';
  end if;
  if v_session.status <> 'pending' then
    raise exception 'mara_mp_oauth_session_not_pending';
  end if;

  begin
    v_secret_id := v_session.pkce_verifier_reference::uuid;
  exception when others then
    raise exception 'mara_mp_oauth_pkce_reference_invalid';
  end;

  if v_session.expires_at <= now() then
    delete from vault.secrets where id = v_secret_id;
    update public.creator_payment_oauth_sessions
    set status = 'expired', updated_at = now()
    where id = v_session.id;
    return;
  end if;

  select d.decrypted_secret
  into v_pkce_verifier
  from vault.decrypted_secrets d
  where d.id = v_secret_id;

  if v_pkce_verifier is null then
    raise exception 'mara_mp_oauth_pkce_secret_missing';
  end if;

  update public.creator_payment_oauth_sessions
  set status = 'consumed', consumed_at = now(), updated_at = now()
  where id = v_session.id;

  delete from vault.secrets where id = v_secret_id;

  return query
  select v_session.id, v_session.creator_id, v_pkce_verifier, v_session.callback_url;
end;
$$;

revoke all on function public.mara_mp_sandbox_oauth_consume(text) from public, anon, authenticated;
grant execute on function public.mara_mp_sandbox_oauth_consume(text) to service_role;

create or replace function public.mara_mp_sandbox_bind_account(
  p_creator_id uuid,
  p_provider_account_id text,
  p_credential_reference text,
  p_credential_expires_at timestamptz
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_creator_id is null then
    raise exception 'mara_mp_bind_creator_required';
  end if;
  if p_provider_account_id is null or char_length(trim(p_provider_account_id)) < 2 then
    raise exception 'mara_mp_bind_provider_account_invalid';
  end if;
  if p_credential_reference is null or p_credential_reference !~ '^[0-9a-fA-F-]{36}$' then
    raise exception 'mara_mp_bind_credential_reference_invalid';
  end if;
  if p_credential_expires_at is null or p_credential_expires_at <= now() then
    raise exception 'mara_mp_bind_credential_expired';
  end if;

  insert into public.creator_payment_accounts (
    creator_id,
    provider,
    provider_account_id,
    status,
    charges_enabled,
    payouts_enabled,
    details_submitted,
    metadata,
    updated_at
  ) values (
    p_creator_id,
    'mercado_pago_sandbox',
    trim(p_provider_account_id),
    'active',
    true,
    false,
    true,
    jsonb_build_object('environment', 'sandbox'),
    now()
  )
  on conflict (creator_id) do update
  set provider = excluded.provider,
      provider_account_id = excluded.provider_account_id,
      status = excluded.status,
      charges_enabled = excluded.charges_enabled,
      payouts_enabled = excluded.payouts_enabled,
      details_submitted = excluded.details_submitted,
      metadata = excluded.metadata,
      updated_at = now();

  insert into public.creator_payment_credential_references (
    creator_id,
    provider,
    provider_account_id,
    credential_reference,
    credential_expires_at,
    rotated_at,
    updated_at
  ) values (
    p_creator_id,
    'mercado_pago_sandbox',
    trim(p_provider_account_id),
    p_credential_reference,
    p_credential_expires_at,
    now(),
    now()
  )
  on conflict (creator_id, provider) do update
  set provider_account_id = excluded.provider_account_id,
      credential_reference = excluded.credential_reference,
      credential_expires_at = excluded.credential_expires_at,
      rotated_at = now(),
      updated_at = now();
end;
$$;

revoke all on function public.mara_mp_sandbox_bind_account(uuid, text, text, timestamptz) from public, anon, authenticated;
grant execute on function public.mara_mp_sandbox_bind_account(uuid, text, text, timestamptz) to service_role;

-- Activation proof required in isolated non-production:
-- 1. anon/authenticated cannot execute any RPC above;
-- 2. state is stored only as SHA-256 hash;
-- 3. PKCE verifier exists only in Vault and is deleted on successful or expired consume;
-- 4. consume is single-use under concurrent callbacks;
-- 5. expired session is persisted as expired, deletes temporary PKCE material and returns no session row;
-- 6. binding writes opaque credential reference only, never raw provider tokens;
-- 7. account binding can be rotated idempotently;
-- 8. production Mercado Pago runtime remains hard-disabled.
