alter table public.commerce_financial_entries drop constraint if exists commerce_financial_entries_account_code_check;
alter table public.commerce_financial_entries add constraint commerce_financial_entries_account_code_check check (account_code in ('processor_clearing','platform_revenue','creator_pending','creator_available','creator_held','creator_payout_reserved','creator_payout_paid','creator_recovery','tax_payable','processor_fee_expense'));

create or replace function public.transition_mara_creator_payout(p_payout_id uuid,p_new_status text,p_provider text default null,p_provider_payout_id text default null,p_failure_reason text default null)
returns uuid language plpgsql security definer set search_path='' as $$
declare v public.commerce_payouts%rowtype; v_tx uuid; v_recovery bigint:=0; v_return_available bigint:=0; v_absorb_recovery bigint:=0;
begin
 if auth.role()<>'service_role' then raise exception 'service_role_required'; end if;
 select * into v from public.commerce_payouts where id=p_payout_id for update; if not found then raise exception 'payout_not_found'; end if;
 perform pg_advisory_xact_lock(hashtextextended(v.creator_id::text||':'||v.currency,0));
 if p_new_status not in ('approved','processing','paid','failed','cancelled') then raise exception 'invalid_payout_status'; end if;
 if v.status in ('paid','cancelled') then raise exception 'payout_terminal_state'; end if;
 if v.status=p_new_status then return v.id; end if;
 if p_new_status in ('approved','processing') and v.status not in ('requested','approved') then raise exception 'invalid_payout_transition'; end if;
 if p_new_status='paid' and v.status not in ('approved','processing') then raise exception 'invalid_payout_transition'; end if;
 if p_new_status in ('failed','cancelled') and v.status not in ('requested','approved','processing') then raise exception 'invalid_payout_transition'; end if;
 if p_new_status='paid' then
  insert into public.commerce_financial_transactions(event_key,event_type,creator_id,currency,provider,provider_reference,metadata) values('payout_paid:'||v.id::text,'payout',v.creator_id,v.currency,p_provider,p_provider_payout_id,jsonb_build_object('payout_id',v.id,'transition','paid')) on conflict(event_key) do nothing returning id into v_tx;
  if v_tx is not null then insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency) values(v_tx,'creator_payout_reserved','debit',v.amount_minor,v.creator_id,v.currency),(v_tx,'creator_payout_paid','credit',v.amount_minor,v.creator_id,v.currency); perform private.assert_mara_financial_transaction_balanced(v_tx); end if;
  update public.commerce_payouts set status='paid',provider=coalesce(p_provider,provider),provider_payout_id=coalesce(p_provider_payout_id,provider_payout_id),processed_at=coalesce(processed_at,now()),paid_at=now(),failure_reason=null where id=v.id;
 elsif p_new_status in ('failed','cancelled') then
  select greatest(coalesce(sum(case when side='debit' then amount_minor else -amount_minor end),0),0) into v_recovery from public.commerce_financial_entries where creator_id=v.creator_id and currency=v.currency and account_code='creator_recovery';
  v_absorb_recovery:=least(v.amount_minor,v_recovery); v_return_available:=v.amount_minor-v_absorb_recovery;
  insert into public.commerce_financial_transactions(event_key,event_type,creator_id,currency,provider,provider_reference,metadata) values('payout_release:'||v.id::text,'adjustment',v.creator_id,v.currency,p_provider,p_provider_payout_id,jsonb_build_object('payout_id',v.id,'transition',p_new_status,'recovery_absorbed_minor',v_absorb_recovery)) on conflict(event_key) do nothing returning id into v_tx;
  if v_tx is not null then
   insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency) values(v_tx,'creator_payout_reserved','debit',v.amount_minor,v.creator_id,v.currency);
   if v_return_available>0 then insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency) values(v_tx,'creator_available','credit',v_return_available,v.creator_id,v.currency); end if;
   if v_absorb_recovery>0 then insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency) values(v_tx,'creator_recovery','credit',v_absorb_recovery,v.creator_id,v.currency); end if;
   perform private.assert_mara_financial_transaction_balanced(v_tx);
  end if;
  update public.commerce_payouts set status=p_new_status,provider=coalesce(p_provider,provider),provider_payout_id=coalesce(p_provider_payout_id,provider_payout_id),failure_reason=p_failure_reason,processed_at=now() where id=v.id;
 else
  update public.commerce_payouts set status=p_new_status,provider=coalesce(p_provider,provider),provider_payout_id=coalesce(p_provider_payout_id,provider_payout_id),processed_at=case when p_new_status='processing' then now() else processed_at end where id=v.id;
 end if;
 return v.id;
end $$;
revoke all on function public.transition_mara_creator_payout(uuid,text,text,text,text) from public,anon,authenticated;
grant execute on function public.transition_mara_creator_payout(uuid,text,text,text,text) to service_role;
