-- MARA PAYMENT CAPTURE MATERIALIZATION V1 — DRAFT ONLY.
-- DO NOT APPLY DIRECTLY.
--
-- Prerequisite: mara_payment_ledger_v1.sql has been reviewed and converted into an
-- approved non-production migration first. This draft is intentionally outside
-- supabase/migrations and MUST NOT activate real payments.
--
-- Purpose:
--   authenticated provider snapshot
--   -> frozen checkout economics re-validation
--   -> idempotent commerce_payment
--   -> balanced capture journal
--   -> optional balanced processor-fee journal
--
-- This RPC does NOT create a commerce_purchase, entitlement, contribution, payout
-- or refund. Product fulfillment remains a separate canonical step after payment
-- acceptance. No browser role may execute this function.

create or replace function public.materialize_mara_payment_capture_v1(
  p_checkout_intent_id uuid,
  p_provider text,
  p_provider_payment_id text,
  p_provider_account_id text,
  p_amount_minor bigint,
  p_currency text,
  p_processor_fee_minor bigint,
  p_processor_fee_bearer text,
  p_provider_event_id text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_intent public.commerce_checkout_intents%rowtype;
  v_creator_id uuid;
  v_platform_fee_minor bigint;
  v_creator_gross_share_minor bigint;
  v_payment_id uuid;
  v_existing public.commerce_payments%rowtype;
  v_capture_tx_id uuid;
  v_processor_fee_tx_id uuid;
begin
  if p_provider is null or char_length(p_provider) < 2 then
    raise exception 'invalid_provider';
  end if;
  if p_provider_payment_id is null or char_length(p_provider_payment_id) < 2 then
    raise exception 'invalid_provider_payment_id';
  end if;
  if p_provider_account_id is null or char_length(p_provider_account_id) < 2 then
    raise exception 'invalid_provider_account_id';
  end if;
  if p_amount_minor <= 0 then
    raise exception 'invalid_amount_minor';
  end if;
  if p_processor_fee_minor < 0 then
    raise exception 'invalid_processor_fee_minor';
  end if;
  if p_processor_fee_minor > p_amount_minor then
    raise exception 'processor_fee_exceeds_gross';
  end if;
  if p_currency !~ '^[A-Z]{3}$' then
    raise exception 'invalid_currency';
  end if;
  if p_processor_fee_bearer not in ('platform', 'creator') then
    raise exception 'processor_fee_bearer_required';
  end if;
  if p_provider_event_id is null or char_length(p_provider_event_id) < 2 then
    raise exception 'invalid_provider_event_id';
  end if;

  select ci,
         o.creator_id
  into v_intent,
       v_creator_id
  from public.commerce_checkout_intents ci
  join public.commerce_offers o on o.id = ci.offer_id
  where ci.id = p_checkout_intent_id
  for update of ci;

  if not found then
    raise exception 'checkout_intent_not_found';
  end if;
  if v_creator_id is null then
    raise exception 'creator_checkout_required';
  end if;
  if v_intent.provider <> p_provider then
    raise exception 'checkout_provider_mismatch';
  end if;
  if v_intent.provider_account_id_snapshot is null
     or v_intent.provider_account_id_snapshot <> p_provider_account_id then
    raise exception 'checkout_provider_account_mismatch';
  end if;
  if v_intent.amount_minor <> p_amount_minor then
    raise exception 'checkout_amount_mismatch';
  end if;
  if v_intent.currency <> p_currency then
    raise exception 'checkout_currency_mismatch';
  end if;
  if v_intent.platform_fee_minor is null then
    raise exception 'checkout_platform_fee_snapshot_required';
  end if;

  v_platform_fee_minor := v_intent.platform_fee_minor;
  if v_platform_fee_minor < 0 or v_platform_fee_minor > p_amount_minor then
    raise exception 'invalid_platform_fee_snapshot';
  end if;

  v_creator_gross_share_minor := p_amount_minor - v_platform_fee_minor;
  if p_processor_fee_bearer = 'creator'
     and p_processor_fee_minor > v_creator_gross_share_minor then
    raise exception 'processor_fee_exceeds_creator_share';
  end if;

  select *
  into v_existing
  from public.commerce_payments
  where provider = p_provider
    and provider_payment_id = p_provider_payment_id
  limit 1;

  if found then
    if v_existing.checkout_intent_id <> p_checkout_intent_id
       or v_existing.creator_id <> v_creator_id
       or v_existing.provider_account_id <> p_provider_account_id
       or v_existing.amount_minor <> p_amount_minor
       or v_existing.currency <> p_currency then
      raise exception 'provider_payment_idempotency_conflict';
    end if;
    return v_existing.id;
  end if;

  insert into public.commerce_payments (
    checkout_intent_id,
    purchase_id,
    user_id,
    creator_id,
    provider,
    provider_account_id,
    provider_payment_id,
    amount_minor,
    currency,
    status,
    refunded_amount_minor,
    captured_at,
    metadata
  ) values (
    v_intent.id,
    null,
    v_intent.user_id,
    v_creator_id,
    p_provider,
    p_provider_account_id,
    p_provider_payment_id,
    p_amount_minor,
    p_currency,
    'succeeded',
    0,
    now(),
    jsonb_build_object(
      'provider_event_id', p_provider_event_id,
      'platform_fee_minor', v_platform_fee_minor,
      'processor_fee_minor', p_processor_fee_minor,
      'processor_fee_bearer', p_processor_fee_bearer
    )
  )
  returning id into v_payment_id;

  insert into public.commerce_ledger_transactions (
    idempotency_key,
    transaction_type,
    payment_id,
    purchase_id,
    creator_id,
    provider,
    provider_event_id,
    occurred_at,
    metadata
  ) values (
    'payment_capture:' || p_provider || ':' || p_provider_payment_id,
    'payment_capture',
    v_payment_id,
    null,
    v_creator_id,
    p_provider,
    p_provider_event_id,
    now(),
    jsonb_build_object('checkout_intent_id', v_intent.id)
  )
  returning id into v_capture_tx_id;

  insert into public.commerce_ledger_entries (
    transaction_id, line_no, creator_id, account_code, direction, amount_minor, currency
  ) values
    (v_capture_tx_id, 1, v_creator_id, 'processor_clearing', 'debit', p_amount_minor, p_currency);

  if v_creator_gross_share_minor > 0 then
    insert into public.commerce_ledger_entries (
      transaction_id, line_no, creator_id, account_code, direction, amount_minor, currency
    ) values (
      v_capture_tx_id, 2, v_creator_id, 'creator_payable', 'credit', v_creator_gross_share_minor, p_currency
    );
  end if;

  if v_platform_fee_minor > 0 then
    insert into public.commerce_ledger_entries (
      transaction_id, line_no, creator_id, account_code, direction, amount_minor, currency
    ) values (
      v_capture_tx_id,
      case when v_creator_gross_share_minor > 0 then 3 else 2 end,
      v_creator_id,
      'platform_revenue',
      'credit',
      v_platform_fee_minor,
      p_currency
    );
  end if;

  perform private.assert_mara_ledger_transaction_balanced(v_capture_tx_id);

  if p_processor_fee_minor > 0 then
    insert into public.commerce_ledger_transactions (
      idempotency_key,
      transaction_type,
      payment_id,
      purchase_id,
      creator_id,
      provider,
      provider_event_id,
      occurred_at,
      metadata
    ) values (
      'processor_fee:' || p_provider || ':' || p_provider_payment_id,
      'processor_fee',
      v_payment_id,
      null,
      v_creator_id,
      p_provider,
      p_provider_event_id,
      now(),
      jsonb_build_object('fee_bearer', p_processor_fee_bearer)
    )
    returning id into v_processor_fee_tx_id;

    insert into public.commerce_ledger_entries (
      transaction_id, line_no, creator_id, account_code, direction, amount_minor, currency
    ) values
      (
        v_processor_fee_tx_id,
        1,
        v_creator_id,
        case when p_processor_fee_bearer = 'platform' then 'processor_fee_expense' else 'creator_payable' end,
        'debit',
        p_processor_fee_minor,
        p_currency
      ),
      (
        v_processor_fee_tx_id,
        2,
        v_creator_id,
        'processor_clearing',
        'credit',
        p_processor_fee_minor,
        p_currency
      );

    perform private.assert_mara_ledger_transaction_balanced(v_processor_fee_tx_id);
  end if;

  return v_payment_id;
end;
$$;

revoke all on function public.materialize_mara_payment_capture_v1(
  uuid, text, text, text, bigint, text, bigint, text, text
) from public, anon, authenticated;

grant execute on function public.materialize_mara_payment_capture_v1(
  uuid, text, text, text, bigint, text, bigint, text, text
) to service_role;
