create or replace function private.post_mara_refund(p_purchase_id uuid,p_provider_refund_id text,p_amount_minor bigint)
returns uuid language plpgsql security definer set search_path='' as $$
declare
 v_purchase public.commerce_purchases%rowtype; v_sale uuid; v_tx uuid;
 v_sale_platform bigint; v_pending_credit bigint; v_held_credit bigint; v_creator_total bigint;
 v_prior_refund bigint:=0; v_cumulative_refund bigint:=0;
 v_prior_platform bigint:=0; v_target_platform bigint:=0; v_platform bigint:=0;
 v_prior_held bigint:=0; v_target_held bigint:=0; v_held_refund bigint:=0;
 v_creator bigint:=0; v_cumulative_creator bigint:=0; v_pending_refund bigint:=0;
 v_available bigint:=0; v_available_debit bigint:=0; v_recovery bigint:=0; v_released boolean; v_key text;
begin
 select * into v_purchase from public.commerce_purchases where id=p_purchase_id for update;
 if not found then raise exception 'purchase_not_found'; end if;
 select id into v_sale from public.commerce_financial_transactions where purchase_id=p_purchase_id and event_type='sale' limit 1;
 if v_purchase.creator_id is null or v_sale is null then return null; end if;
 v_key:='refund:'||v_purchase.provider||':'||p_provider_refund_id;
 select id into v_tx from public.commerce_financial_transactions where event_key=v_key;
 if found then return v_tx; end if;

 select coalesce(sum(amount_minor) filter(where account_code='platform_revenue' and side='credit'),0),
        coalesce(sum(amount_minor) filter(where account_code='creator_pending' and side='credit'),0),
        coalesce(sum(amount_minor) filter(where account_code='creator_held' and side='credit'),0)
 into v_sale_platform,v_pending_credit,v_held_credit
 from public.commerce_financial_entries where transaction_id=v_sale;
 v_creator_total:=v_pending_credit+v_held_credit;

 select coalesce(sum(r.amount_minor),0) into v_prior_refund
 from public.commerce_refunds r
 where r.purchase_id=p_purchase_id and r.status='succeeded' and r.provider_refund_id<>p_provider_refund_id;
 v_cumulative_refund:=v_prior_refund+p_amount_minor;
 if v_cumulative_refund>v_purchase.amount_minor then raise exception 'refund_exceeds_captured_amount'; end if;

 select coalesce(sum(e.amount_minor),0) into v_prior_platform
 from public.commerce_financial_transactions t join public.commerce_financial_entries e on e.transaction_id=t.id
 where t.purchase_id=p_purchase_id and t.event_type='refund' and e.account_code='platform_revenue' and e.side='debit';
 v_target_platform:=case when v_cumulative_refund=v_purchase.amount_minor then v_sale_platform else (v_sale_platform*v_cumulative_refund)/v_purchase.amount_minor end;
 v_platform:=v_target_platform-v_prior_platform;
 if v_platform<0 then raise exception 'refund_platform_reversal_invalid'; end if;
 v_creator:=p_amount_minor-v_platform;
 v_cumulative_creator:=v_cumulative_refund-v_target_platform;

 select exists(select 1 from public.commerce_financial_transactions where event_key='release:'||v_sale::text) into v_released;
 if not v_released then
   select coalesce(sum(e.amount_minor),0) into v_prior_held
   from public.commerce_financial_transactions t join public.commerce_financial_entries e on e.transaction_id=t.id
   where t.purchase_id=p_purchase_id and t.event_type='refund' and e.account_code='creator_held' and e.side='debit';
   v_target_held:=case when v_cumulative_refund=v_purchase.amount_minor then v_held_credit
     when v_creator_total>0 then (v_cumulative_creator*v_held_credit)/v_creator_total else 0 end;
   v_held_refund:=v_target_held-v_prior_held;
   if v_held_refund<0 or v_held_refund>v_creator then raise exception 'refund_held_reversal_invalid'; end if;
   v_pending_refund:=v_creator-v_held_refund;
 else
   select greatest(coalesce(sum(case when side='credit' then amount_minor else -amount_minor end),0),0)
   into v_available from public.commerce_financial_entries
   where creator_id=v_purchase.creator_id and currency=v_purchase.currency and account_code='creator_available';
   v_available_debit:=least(v_creator,v_available); v_recovery:=v_creator-v_available_debit;
 end if;

 insert into public.commerce_financial_transactions(event_key,event_type,purchase_id,creator_id,currency,provider,provider_reference,metadata)
 values(v_key,'refund',p_purchase_id,v_purchase.creator_id,v_purchase.currency,v_purchase.provider,p_provider_refund_id,
 jsonb_build_object('amount_minor',p_amount_minor,'cumulative_refund_minor',v_cumulative_refund,'source_sale_transaction_id',v_sale,'released_before_refund',v_released))
 returning id into v_tx;
 insert into public.commerce_financial_entries(transaction_id,account_code,side,amount_minor,creator_id,currency)
 values(v_tx,'processor_clearing','credit',p_amount_minor,null,v_purchase.currency);
 if v_platform>0 then insert into public.commerce_financial_entries values(extensions.gen_random_uuid(),v_tx,'platform_revenue','debit',v_platform,null,v_purchase.currency,now()); end if;
 if v_pending_refund>0 then insert into public.commerce_financial_entries values(extensions.gen_random_uuid(),v_tx,'creator_pending','debit',v_pending_refund,v_purchase.creator_id,v_purchase.currency,now()); end if;
 if v_held_refund>0 then insert into public.commerce_financial_entries values(extensions.gen_random_uuid(),v_tx,'creator_held','debit',v_held_refund,v_purchase.creator_id,v_purchase.currency,now()); end if;
 if v_available_debit>0 then insert into public.commerce_financial_entries values(extensions.gen_random_uuid(),v_tx,'creator_available','debit',v_available_debit,v_purchase.creator_id,v_purchase.currency,now()); end if;
 if v_recovery>0 then insert into public.commerce_financial_entries values(extensions.gen_random_uuid(),v_tx,'creator_recovery','debit',v_recovery,v_purchase.creator_id,v_purchase.currency,now()); end if;
 perform private.assert_mara_financial_transaction_balanced(v_tx); return v_tx;
end $$;
revoke all on function private.post_mara_refund(uuid,text,bigint) from public,anon,authenticated;

