-- Connect canonical purchase truth to the financial subledger.
-- Fail closed for creator sales without an explicit economics policy.

alter table public.commerce_financial_entries drop constraint if exists commerce_financial_entries_account_code_check;
alter table public.commerce_financial_entries add constraint commerce_financial_entries_account_code_check
  check (account_code in ('processor_clearing','platform_revenue','creator_pending','creator_available','creator_held','creator_payout_reserved','creator_paid','creator_recovery','refunds','chargebacks','processor_fees','tax_payable'));

-- Payout items remain purchase-backed; payout reservation is represented in the journal.

create or replace function private.post_mara_creator_sale(p_purchase_id uuid)
returns uuid language plpgsql security definer set search_path='' as $$
declare
  v_purchase public.commerce_purchases%rowtype;
  v_policy public.commerce_economics_policies%rowtype;
  v_tx uuid;
  v_platform bigint;
  v_creator bigint;
  v_reserve bigint;
  v_pending bigint;
  v_event_key text;
begin
  select * into v_purchase from public.commerce_purchases where id=p_purchase_id for update;
  if not found then raise exception 'purchase_not_found'; end if;
  if v_purchase.status <> 'succeeded' then raise exception 'purchase_not_succeeded'; end if;
  if v_purchase.creator_id is null then return null; end if;

  v_event_key := 'sale:' || v_purchase.provider || ':' || v_purchase.provider_payment_id;
  select id into v_tx from public.commerce_financial_transactions where event_key=v_event_key;
  if found then return v_tx; end if;

  select * into v_policy from public.commerce_economics_policies p
   where p.currency=v_purchase.currency
     and (p.creator_id=v_purchase.creator_id or p.creator_id is null)
     and p.effective_from <= v_purchase.created_at
     and (p.effective_to is null or p.effective_to > v_purchase.created_at)
   order by (p.creator_id is not null) desc, p.effective_from desc limit 1;
  if not found then raise exception 'creator_economics_policy_missing'; end if;

  v_platform := (v_purchase.amount_minor::bigint * v_policy.platform_fee_bps) / 10000;
  v_creator := v_purchase.amount_minor::bigint - v_platform;
  v_reserve := (v_creator * v_policy.reserve_bps) / 10000;
  v_pending := v_creator - v_reserve;

  insert into public.commerce_financial_transactions(event_key,event_type,purchase_id,creator_id,currency,provider,provider_reference,metadata)
  values(v_event_key,'sale',v_purchase.id,v_purchase.creator_id,v_purchase.currency,v_purchase.provider,v_purchase.provider_payment_id,
    jsonb_build_object('economics_policy_id',v_policy.id,'platform_fee_bps',v_policy.platform_fee_bps,'reserve_bps',v_policy.reserve_bps,'payout_delay_days',v_policy.payout_delay_days,'gross_minor',v_purchase.amount_minor))
  on conflict(event_key) do nothing returning id into v_tx;
  if v_tx is null then select id into v_tx from public.commerce_financial_transactions where event_key=v_event_key; return v_tx; end if;

  insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency)
  values(v_tx,'processor_clearing','debit',v_purchase.amount_minor,null,v_purchase.currency);
  if v_platform > 0 then insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency)
    values(v_tx,'platform_revenue','credit',v_platform,null,v_purchase.currency); end if;
  if v_pending > 0 then insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency)
    values(v_tx,'creator_pending','credit',v_pending,v_purchase.creator_id,v_purchase.currency); end if;
  if v_reserve > 0 then insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency)
    values(v_tx,'creator_held','credit',v_reserve,v_purchase.creator_id,v_purchase.currency); end if;
  perform private.assert_mara_financial_transaction_balanced(v_tx);
  return v_tx;
end $$;
revoke all on function private.post_mara_creator_sale(uuid) from public,anon,authenticated;

create or replace function private.post_mara_creator_sale_trigger()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  if new.status='succeeded' and new.creator_id is not null then perform private.post_mara_creator_sale(new.id); end if;
  return new;
end $$;
revoke all on function private.post_mara_creator_sale_trigger() from public,anon,authenticated;
drop trigger if exists commerce_purchases_post_financial_sale on public.commerce_purchases;
create constraint trigger commerce_purchases_post_financial_sale after insert or update of status on public.commerce_purchases
deferrable initially immediate for each row execute function private.post_mara_creator_sale_trigger();

create or replace function public.release_mara_creator_funds(p_limit integer default 200)
returns integer language plpgsql security definer set search_path='' as $$
declare r record; v_tx uuid; v_amount bigint; v_count integer:=0;
begin
  if auth.role() <> 'service_role' then raise exception 'service_role_required'; end if;
  if p_limit < 1 or p_limit > 1000 then raise exception 'invalid_limit'; end if;
  for r in
    select t.id,t.purchase_id,t.creator_id,t.currency,t.created_at,(t.metadata->>'payout_delay_days')::integer delay_days
    from public.commerce_financial_transactions t
    where t.event_type='sale' and t.creator_id is not null
      and t.created_at + make_interval(days=>coalesce((t.metadata->>'payout_delay_days')::integer,7)) <= now()
      and not exists(select 1 from public.commerce_financial_transactions x where x.event_key='release:'||t.id::text)
    order by t.created_at for update skip locked limit p_limit
  loop
    select coalesce(sum(case when side='credit' then amount_minor else -amount_minor end),0) into v_amount
      from public.commerce_financial_entries where transaction_id=r.id and account_code='creator_pending' and creator_id=r.creator_id;
    if v_amount <= 0 then continue; end if;
    insert into public.commerce_financial_transactions(event_key,event_type,purchase_id,creator_id,currency,metadata)
      values('release:'||r.id::text,'adjustment',r.purchase_id,r.creator_id,r.currency,jsonb_build_object('source_sale_transaction_id',r.id,'reason','payout_delay_elapsed'))
      on conflict(event_key) do nothing returning id into v_tx;
    if v_tx is null then continue; end if;
    insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency) values
      (v_tx,'creator_pending','debit',v_amount,r.creator_id,r.currency),
      (v_tx,'creator_available','credit',v_amount,r.creator_id,r.currency);
    perform private.assert_mara_financial_transaction_balanced(v_tx); v_count:=v_count+1;
  end loop;
  return v_count;
end $$;
revoke all on function public.release_mara_creator_funds(integer) from public,anon,authenticated;
grant execute on function public.release_mara_creator_funds(integer) to service_role;

create or replace function public.request_mara_creator_payout(p_creator_id uuid,p_currency text,p_amount_minor bigint,p_idempotency_key uuid)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_available bigint; v_min bigint:=0; v_payout uuid; v_tx uuid;
begin
  if auth.role()<>'service_role' then raise exception 'service_role_required'; end if;
  if p_amount_minor<=0 or p_currency !~ '^[A-Z]{3}$' then raise exception 'invalid_payout_request'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_creator_id::text||':'||p_currency,0));
  select id into v_payout from public.commerce_payouts where idempotency_key=p_idempotency_key;
  if found then return v_payout; end if;
  select coalesce(sum(case when side='credit' then amount_minor else -amount_minor end),0) into v_available
    from public.commerce_financial_entries where creator_id=p_creator_id and currency=p_currency and account_code='creator_available';
  select coalesce(payout_minimum_minor,0) into v_min from public.commerce_economics_policies
    where currency=p_currency and (creator_id=p_creator_id or creator_id is null) and effective_from<=now() and (effective_to is null or effective_to>now())
    order by (creator_id is not null) desc,effective_from desc limit 1;
  if p_amount_minor < coalesce(v_min,0) then raise exception 'payout_below_minimum'; end if;
  if p_amount_minor > v_available then raise exception 'payout_exceeds_available_balance'; end if;
  insert into public.commerce_payouts(creator_id,currency,amount_minor,idempotency_key) values(p_creator_id,p_currency,p_amount_minor,p_idempotency_key) returning id into v_payout;
  insert into public.commerce_financial_transactions(event_key,event_type,creator_id,currency,metadata)
    values('payout_reserve:'||p_idempotency_key::text,'adjustment',p_creator_id,p_currency,jsonb_build_object('payout_id',v_payout)) returning id into v_tx;
  insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency) values
    (v_tx,'creator_available','debit',p_amount_minor,p_creator_id,p_currency),
    (v_tx,'creator_payout_reserved','credit',p_amount_minor,p_creator_id,p_currency);
  perform private.assert_mara_financial_transaction_balanced(v_tx);
  return v_payout;
end $$;
revoke all on function public.request_mara_creator_payout(uuid,text,bigint,uuid) from public,anon,authenticated;
grant execute on function public.request_mara_creator_payout(uuid,text,bigint,uuid) to service_role;

create or replace function private.post_mara_refund(p_purchase_id uuid,p_provider_refund_id text,p_amount_minor bigint)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_purchase public.commerce_purchases%rowtype; v_sale uuid; v_tx uuid; v_refunded bigint; v_platform bigint; v_creator bigint; v_sale_platform bigint; v_sale_creator bigint; v_key text;
begin
  select * into v_purchase from public.commerce_purchases where id=p_purchase_id for update;
  if not found then raise exception 'purchase_not_found'; end if;
  if p_amount_minor<=0 then raise exception 'invalid_refund_amount'; end if;
  select id into v_sale from public.commerce_financial_transactions where purchase_id=p_purchase_id and event_type='sale' limit 1;
  if v_purchase.creator_id is null or v_sale is null then return null; end if;
  select coalesce(sum(amount_minor),0) into v_refunded from public.commerce_refunds where purchase_id=p_purchase_id and status='succeeded';
  if v_refunded > v_purchase.amount_minor then raise exception 'refund_exceeds_captured_amount'; end if;
  v_key:='refund:'||v_purchase.provider||':'||p_provider_refund_id;
  select id into v_tx from public.commerce_financial_transactions where event_key=v_key; if found then return v_tx; end if;
  select coalesce(sum(amount_minor) filter(where account_code='platform_revenue' and side='credit'),0),
         coalesce(sum(amount_minor) filter(where account_code in ('creator_pending','creator_held') and side='credit'),0)
    into v_sale_platform,v_sale_creator from public.commerce_financial_entries where transaction_id=v_sale;
  v_platform := case when p_amount_minor=v_purchase.amount_minor then v_sale_platform else (v_sale_platform*p_amount_minor)/v_purchase.amount_minor end;
  v_creator := p_amount_minor-v_platform;
  insert into public.commerce_financial_transactions(event_key,event_type,purchase_id,creator_id,currency,provider,provider_reference,metadata)
    values(v_key,'refund',p_purchase_id,v_purchase.creator_id,v_purchase.currency,v_purchase.provider,p_provider_refund_id,jsonb_build_object('amount_minor',p_amount_minor,'source_sale_transaction_id',v_sale)) returning id into v_tx;
  -- Cash leaves clearing; platform share is reversed. Creator recovery is explicit and may drive a negative economic position.
  insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency)
    values(v_tx,'processor_clearing','credit',p_amount_minor,null,v_purchase.currency);
  if v_platform>0 then insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency) values(v_tx,'platform_revenue','debit',v_platform,null,v_purchase.currency); end if;
  if v_creator>0 then insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency) values(v_tx,'creator_recovery','debit',v_creator,v_purchase.creator_id,v_purchase.currency); end if;
  perform private.assert_mara_financial_transaction_balanced(v_tx); return v_tx;
end $$;
revoke all on function private.post_mara_refund(uuid,text,bigint) from public,anon,authenticated;

create or replace function public.record_mara_commerce_refund(p_provider text,p_provider_event_id text,p_provider_payment_id text,p_provider_refund_id text,p_amount_minor bigint,p_currency text,p_payload_sha256 text default null)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_purchase public.commerce_purchases%rowtype; v_refund uuid; v_prior bigint;
begin
 if auth.role()<>'service_role' then raise exception 'service_role_required'; end if;
 select * into v_purchase from public.commerce_purchases where provider=p_provider and provider_payment_id=p_provider_payment_id for update;
 if not found then raise exception 'purchase_not_found'; end if;
 if v_purchase.currency<>p_currency then raise exception 'refund_currency_mismatch'; end if;
 select coalesce(sum(amount_minor),0) into v_prior from public.commerce_refunds where purchase_id=v_purchase.id and status='succeeded';
 if p_amount_minor<=0 or v_prior+p_amount_minor>v_purchase.amount_minor then raise exception 'refund_exceeds_captured_amount'; end if;
 insert into public.commerce_refunds(purchase_id,provider,provider_refund_id,amount_minor,currency,status,processed_at)
 values(v_purchase.id,p_provider,p_provider_refund_id,p_amount_minor,p_currency,'succeeded',now())
 on conflict(provider,provider_refund_id) do update set provider_refund_id=excluded.provider_refund_id returning id into v_refund;
 perform private.post_mara_refund(v_purchase.id,p_provider_refund_id,p_amount_minor);
 if v_prior+p_amount_minor=v_purchase.amount_minor then
   update public.commerce_purchases set status='refunded',refunded_at=coalesce(refunded_at,now()) where id=v_purchase.id;
   update public.commerce_entitlements set status='revoked',revoked_at=coalesce(revoked_at,now()) where purchase_id=v_purchase.id;
 end if;
 insert into public.commerce_webhook_events(provider,provider_event_id,event_type,payload_sha256,status,processed_at)
 values(p_provider,p_provider_event_id,'payment_refunded',p_payload_sha256,'processed',now()) on conflict(provider,provider_event_id) do nothing;
 return v_refund;
end $$;
revoke all on function public.record_mara_commerce_refund(text,text,text,text,bigint,text,text) from public,anon,authenticated;
grant execute on function public.record_mara_commerce_refund(text,text,text,text,bigint,text,text) to service_role;

-- Preserve the legacy full-refund API while routing it through the audited refund journal.
create or replace function public.refund_mara_commerce_purchase(p_provider text,p_provider_event_id text,p_provider_payment_id text,p_payload_sha256 text default null)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_purchase public.commerce_purchases%rowtype; v_goal_id uuid;
begin
 if auth.role()<>'service_role' then raise exception 'service_role_required'; end if;
 select * into v_purchase from public.commerce_purchases where provider=p_provider and provider_payment_id=p_provider_payment_id for update;
 if not found then raise exception 'purchase_not_found'; end if;
 if v_purchase.status='refunded' then return v_purchase.id; end if;
 perform public.record_mara_commerce_refund(p_provider,p_provider_event_id,p_provider_payment_id,p_provider_event_id,v_purchase.amount_minor,v_purchase.currency,p_payload_sha256);
 update public.commerce_contributions set status='refunded',refunded_at=coalesce(refunded_at,now()) where purchase_id=v_purchase.id returning goal_id into v_goal_id;
 if v_goal_id is not null then perform private.refresh_mara_commerce_goal_status(v_goal_id); end if;
 return v_purchase.id;
end $$;
revoke all on function public.refund_mara_commerce_purchase(text,text,text,text) from public,anon,authenticated;
grant execute on function public.refund_mara_commerce_purchase(text,text,text,text) to service_role;

create or replace view public.creator_finance_summary with (security_invoker=true) as
select c.id creator_id,e.currency,
 coalesce(sum(case when e.account_code='creator_pending' and e.side='credit' then e.amount_minor when e.account_code='creator_pending' and e.side='debit' then -e.amount_minor else 0 end),0)::bigint pending_minor,
 coalesce(sum(case when e.account_code='creator_available' and e.side='credit' then e.amount_minor when e.account_code='creator_available' and e.side='debit' then -e.amount_minor else 0 end),0)::bigint available_minor,
 coalesce(sum(case when e.account_code in ('creator_held','creator_payout_reserved') and e.side='credit' then e.amount_minor when e.account_code in ('creator_held','creator_payout_reserved') and e.side='debit' then -e.amount_minor else 0 end),0)::bigint held_minor,
 coalesce(sum(case when e.account_code='creator_paid' and e.side='credit' then e.amount_minor when e.account_code='creator_paid' and e.side='debit' then -e.amount_minor else 0 end),0)::bigint paid_minor,
 coalesce(sum(case when e.account_code='creator_recovery' and e.side='debit' then e.amount_minor when e.account_code='creator_recovery' and e.side='credit' then -e.amount_minor else 0 end),0)::bigint recovery_minor
from public.creators c join public.commerce_financial_entries e on e.creator_id=c.id group by c.id,e.currency;
revoke all on public.creator_finance_summary from anon,authenticated; grant select on public.creator_finance_summary to authenticated;

create or replace view public.mara_finance_control_tower with (security_invoker=true) as
select currency,
 coalesce(sum(case when account_code='processor_clearing' and side='debit' then amount_minor when account_code='processor_clearing' and side='credit' then -amount_minor else 0 end),0)::bigint net_gmv_minor,
 coalesce(sum(case when account_code='platform_revenue' and side='credit' then amount_minor when account_code='platform_revenue' and side='debit' then -amount_minor else 0 end),0)::bigint platform_revenue_minor,
 coalesce(sum(case when account_code in ('creator_pending','creator_available','creator_held','creator_payout_reserved') and side='credit' then amount_minor when account_code in ('creator_pending','creator_available','creator_held','creator_payout_reserved') and side='debit' then -amount_minor else 0 end),0)::bigint creator_liability_minor,
 coalesce(sum(case when account_code='creator_recovery' and side='debit' then amount_minor when account_code='creator_recovery' and side='credit' then -amount_minor else 0 end),0)::bigint creator_recovery_minor
from public.commerce_financial_entries group by currency;
revoke all on public.mara_finance_control_tower from anon,authenticated; grant select on public.mara_finance_control_tower to service_role;

-- Red-team corrections: idempotent refund retries, refund-before-release safety, and recovery-aware payouts.
create or replace function private.post_mara_refund(p_purchase_id uuid,p_provider_refund_id text,p_amount_minor bigint)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_purchase public.commerce_purchases%rowtype; v_sale uuid; v_tx uuid; v_platform bigint; v_creator bigint; v_sale_platform bigint; v_pending_credit bigint; v_held_credit bigint; v_creator_total bigint; v_pending_refund bigint:=0; v_held_refund bigint:=0; v_available bigint:=0; v_available_debit bigint:=0; v_recovery bigint:=0; v_released boolean; v_key text;
begin
 select * into v_purchase from public.commerce_purchases where id=p_purchase_id for update; if not found then raise exception 'purchase_not_found'; end if;
 select id into v_sale from public.commerce_financial_transactions where purchase_id=p_purchase_id and event_type='sale' limit 1;
 if v_purchase.creator_id is null or v_sale is null then return null; end if;
 v_key:='refund:'||v_purchase.provider||':'||p_provider_refund_id; select id into v_tx from public.commerce_financial_transactions where event_key=v_key; if found then return v_tx; end if;
 select coalesce(sum(amount_minor) filter(where account_code='platform_revenue' and side='credit'),0),coalesce(sum(amount_minor) filter(where account_code='creator_pending' and side='credit'),0),coalesce(sum(amount_minor) filter(where account_code='creator_held' and side='credit'),0)
 into v_sale_platform,v_pending_credit,v_held_credit from public.commerce_financial_entries where transaction_id=v_sale;
 v_platform:=case when p_amount_minor=v_purchase.amount_minor then v_sale_platform else (v_sale_platform*p_amount_minor)/v_purchase.amount_minor end;
 v_creator:=p_amount_minor-v_platform; v_creator_total:=v_pending_credit+v_held_credit;
 select exists(select 1 from public.commerce_financial_transactions where event_key='release:'||v_sale::text) into v_released;
 if not v_released then
   if v_creator_total>0 then v_held_refund:=(v_creator*v_held_credit)/v_creator_total; end if;
   v_pending_refund:=v_creator-v_held_refund;
 else
   select greatest(coalesce(sum(case when side='credit' then amount_minor else -amount_minor end),0),0) into v_available from public.commerce_financial_entries where creator_id=v_purchase.creator_id and currency=v_purchase.currency and account_code='creator_available';
   v_available_debit:=least(v_creator,v_available); v_recovery:=v_creator-v_available_debit;
 end if;
 insert into public.commerce_financial_transactions(event_key,event_type,purchase_id,creator_id,currency,provider,provider_reference,metadata)
 values(v_key,'refund',p_purchase_id,v_purchase.creator_id,v_purchase.currency,v_purchase.provider,p_provider_refund_id,jsonb_build_object('amount_minor',p_amount_minor,'source_sale_transaction_id',v_sale,'released_before_refund',v_released)) returning id into v_tx;
 insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency) values(v_tx,'processor_clearing','credit',p_amount_minor,null,v_purchase.currency);
 if v_platform>0 then insert into public.commerce_financial_entries values(extensions.gen_random_uuid(),v_tx,'platform_revenue','debit',v_platform,null,v_purchase.currency,now()); end if;
 if v_pending_refund>0 then insert into public.commerce_financial_entries values(extensions.gen_random_uuid(),v_tx,'creator_pending','debit',v_pending_refund,v_purchase.creator_id,v_purchase.currency,now()); end if;
 if v_held_refund>0 then insert into public.commerce_financial_entries values(extensions.gen_random_uuid(),v_tx,'creator_held','debit',v_held_refund,v_purchase.creator_id,v_purchase.currency,now()); end if;
 if v_available_debit>0 then insert into public.commerce_financial_entries values(extensions.gen_random_uuid(),v_tx,'creator_available','debit',v_available_debit,v_purchase.creator_id,v_purchase.currency,now()); end if;
 if v_recovery>0 then insert into public.commerce_financial_entries values(extensions.gen_random_uuid(),v_tx,'creator_recovery','debit',v_recovery,v_purchase.creator_id,v_purchase.currency,now()); end if;
 perform private.assert_mara_financial_transaction_balanced(v_tx); return v_tx;
end $$;

-- A refunded sale can never later become available.
create or replace function public.release_mara_creator_funds(p_limit integer default 200)
returns integer language plpgsql security definer set search_path='' as $$
declare r record; v_tx uuid; v_amount bigint; v_count integer:=0;
begin
 if auth.role()<>'service_role' then raise exception 'service_role_required'; end if; if p_limit<1 or p_limit>1000 then raise exception 'invalid_limit'; end if;
 for r in select t.id,t.purchase_id,t.creator_id,t.currency from public.commerce_financial_transactions t
   where t.event_type='sale' and t.creator_id is not null and t.created_at+make_interval(days=>coalesce((t.metadata->>'payout_delay_days')::integer,7))<=now()
   and not exists(select 1 from public.commerce_financial_transactions x where x.event_key='release:'||t.id::text)
   and not exists(select 1 from public.commerce_financial_transactions x where x.purchase_id=t.purchase_id and x.event_type='refund')
   order by t.created_at for update skip locked limit p_limit
 loop
   select coalesce(sum(case when side='credit' then amount_minor else -amount_minor end),0) into v_amount from public.commerce_financial_entries where transaction_id=r.id and account_code='creator_pending' and creator_id=r.creator_id;
   if v_amount<=0 then continue; end if;
   insert into public.commerce_financial_transactions(event_key,event_type,purchase_id,creator_id,currency,metadata) values('release:'||r.id::text,'adjustment',r.purchase_id,r.creator_id,r.currency,jsonb_build_object('source_sale_transaction_id',r.id,'reason','payout_delay_elapsed')) on conflict(event_key) do nothing returning id into v_tx;
   if v_tx is null then continue; end if;
   insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency) values(v_tx,'creator_pending','debit',v_amount,r.creator_id,r.currency),(v_tx,'creator_available','credit',v_amount,r.creator_id,r.currency);
   perform private.assert_mara_financial_transaction_balanced(v_tx); v_count:=v_count+1;
 end loop; return v_count;
end $$;
revoke all on function public.release_mara_creator_funds(integer) from public,anon,authenticated; grant execute on function public.release_mara_creator_funds(integer) to service_role;

create or replace function public.record_mara_commerce_refund(p_provider text,p_provider_event_id text,p_provider_payment_id text,p_provider_refund_id text,p_amount_minor bigint,p_currency text,p_payload_sha256 text default null)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_purchase public.commerce_purchases%rowtype; v_refund uuid; v_prior bigint;
begin
 if auth.role()<>'service_role' then raise exception 'service_role_required'; end if;
 select id into v_refund from public.commerce_refunds where provider=p_provider and provider_refund_id=p_provider_refund_id;
 if found then return v_refund; end if;
 select * into v_purchase from public.commerce_purchases where provider=p_provider and provider_payment_id=p_provider_payment_id for update; if not found then raise exception 'purchase_not_found'; end if;
 if v_purchase.currency<>p_currency then raise exception 'refund_currency_mismatch'; end if;
 select coalesce(sum(amount_minor),0) into v_prior from public.commerce_refunds where purchase_id=v_purchase.id and status='succeeded';
 if p_amount_minor<=0 or v_prior+p_amount_minor>v_purchase.amount_minor then raise exception 'refund_exceeds_captured_amount'; end if;
 insert into public.commerce_refunds(purchase_id,provider,provider_refund_id,amount_minor,currency,status,processed_at) values(v_purchase.id,p_provider,p_provider_refund_id,p_amount_minor,p_currency,'succeeded',now()) returning id into v_refund;
 perform private.post_mara_refund(v_purchase.id,p_provider_refund_id,p_amount_minor);
 if v_prior+p_amount_minor=v_purchase.amount_minor then update public.commerce_purchases set status='refunded',refunded_at=coalesce(refunded_at,now()) where id=v_purchase.id; update public.commerce_entitlements set status='revoked',revoked_at=coalesce(revoked_at,now()) where purchase_id=v_purchase.id; end if;
 insert into public.commerce_webhook_events(provider,provider_event_id,event_type,payload_sha256,status,processed_at) values(p_provider,p_provider_event_id,'payment_refunded',p_payload_sha256,'processed',now()) on conflict(provider,provider_event_id) do nothing;
 return v_refund;
end $$;
revoke all on function public.record_mara_commerce_refund(text,text,text,text,bigint,text,text) from public,anon,authenticated; grant execute on function public.record_mara_commerce_refund(text,text,text,text,bigint,text,text) to service_role;

create or replace function public.request_mara_creator_payout(p_creator_id uuid,p_currency text,p_amount_minor bigint,p_idempotency_key uuid)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_available bigint; v_recovery bigint; v_min bigint:=0; v_payout uuid; v_tx uuid;
begin
 if auth.role()<>'service_role' then raise exception 'service_role_required'; end if; if p_amount_minor<=0 or p_currency !~ '^[A-Z]{3}$' then raise exception 'invalid_payout_request'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_creator_id::text||':'||p_currency,0));
 select id into v_payout from public.commerce_payouts where idempotency_key=p_idempotency_key; if found then return v_payout; end if;
 select coalesce(sum(case when side='credit' then amount_minor else -amount_minor end),0) into v_available from public.commerce_financial_entries where creator_id=p_creator_id and currency=p_currency and account_code='creator_available';
 select coalesce(sum(case when side='debit' then amount_minor else -amount_minor end),0) into v_recovery from public.commerce_financial_entries where creator_id=p_creator_id and currency=p_currency and account_code='creator_recovery';
 v_available:=greatest(v_available-greatest(v_recovery,0),0);
 select coalesce(payout_minimum_minor,0) into v_min from public.commerce_economics_policies where currency=p_currency and (creator_id=p_creator_id or creator_id is null) and effective_from<=now() and (effective_to is null or effective_to>now()) order by (creator_id is not null) desc,effective_from desc limit 1;
 if p_amount_minor<coalesce(v_min,0) then raise exception 'payout_below_minimum'; end if; if p_amount_minor>v_available then raise exception 'payout_exceeds_available_balance'; end if;
 insert into public.commerce_payouts(creator_id,currency,amount_minor,idempotency_key) values(p_creator_id,p_currency,p_amount_minor,p_idempotency_key) returning id into v_payout;
 insert into public.commerce_financial_transactions(event_key,event_type,creator_id,currency,metadata) values('payout_reserve:'||p_idempotency_key::text,'adjustment',p_creator_id,p_currency,jsonb_build_object('payout_id',v_payout)) returning id into v_tx;
 insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency) values(v_tx,'creator_available','debit',p_amount_minor,p_creator_id,p_currency),(v_tx,'creator_payout_reserved','credit',p_amount_minor,p_creator_id,p_currency);
 perform private.assert_mara_financial_transaction_balanced(v_tx); return v_payout;
end $$;
revoke all on function public.request_mara_creator_payout(uuid,text,bigint,uuid) from public,anon,authenticated; grant execute on function public.request_mara_creator_payout(uuid,text,bigint,uuid) to service_role;
