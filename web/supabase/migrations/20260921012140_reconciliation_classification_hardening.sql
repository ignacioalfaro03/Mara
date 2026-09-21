alter table public.commerce_reconciliation_records drop constraint if exists commerce_reconciliation_records_status_check;
alter table public.commerce_reconciliation_records add constraint commerce_reconciliation_records_status_check check (status in ('matched','amount_mismatch','currency_mismatch','missing_internal','missing_provider','requires_review'));

create or replace function public.record_mara_reconciliation(p_provider text,p_object_type text,p_provider_reference text,p_internal_reference uuid,p_provider_amount_minor bigint,p_provider_currency text,p_details jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_id uuid; v_internal_amount bigint; v_internal_currency text; v_status text;
begin
 if auth.role()<>'service_role' then raise exception 'service_role_required'; end if;
 if p_object_type not in ('payment','refund','payout') then raise exception 'invalid_reconciliation_object_type'; end if;
 if p_provider_amount_minor is not null and p_provider_amount_minor<0 then raise exception 'invalid_provider_amount'; end if;
 if p_provider_currency is not null and p_provider_currency !~ '^[A-Z]{3}$' then raise exception 'invalid_provider_currency'; end if;
 if p_internal_reference is null then v_status:='missing_internal';
 else
  if p_object_type='payment' then select amount_minor,currency into v_internal_amount,v_internal_currency from public.commerce_purchases where id=p_internal_reference;
  elsif p_object_type='refund' then select amount_minor,currency into v_internal_amount,v_internal_currency from public.commerce_refunds where id=p_internal_reference;
  else select amount_minor,currency into v_internal_amount,v_internal_currency from public.commerce_payouts where id=p_internal_reference; end if;
  if not found then v_status:='missing_internal';
  elsif p_provider_currency is null or p_provider_amount_minor is null then v_status:='requires_review';
  elsif p_provider_currency<>v_internal_currency then v_status:='currency_mismatch';
  elsif p_provider_amount_minor<>v_internal_amount then v_status:='amount_mismatch';
  else v_status:='matched'; end if;
 end if;
 insert into public.commerce_reconciliation_records(provider,object_type,provider_reference,internal_reference,status,provider_amount_minor,internal_amount_minor,currency,details,checked_at)
 values(p_provider,p_object_type,p_provider_reference,p_internal_reference,v_status,p_provider_amount_minor,v_internal_amount,coalesce(p_provider_currency,v_internal_currency),coalesce(p_details,'{}'::jsonb),now())
 on conflict(provider,object_type,provider_reference) do update set internal_reference=excluded.internal_reference,status=excluded.status,provider_amount_minor=excluded.provider_amount_minor,internal_amount_minor=excluded.internal_amount_minor,currency=excluded.currency,details=excluded.details,checked_at=now()
 returning id into v_id; return v_id;
end $$;
revoke all on function public.record_mara_reconciliation(text,text,text,uuid,bigint,text,jsonb) from public,anon,authenticated;
grant execute on function public.record_mara_reconciliation(text,text,text,uuid,bigint,text,jsonb) to service_role;

create or replace function public.mark_mara_missing_provider(p_object_type text,p_internal_reference uuid,p_provider text)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_id uuid; v_amount bigint; v_currency text; v_reference text;
begin
 if auth.role()<>'service_role' then raise exception 'service_role_required'; end if;
 if p_object_type='payment' then select amount_minor,currency,coalesce(provider_payment_id,id::text) into v_amount,v_currency,v_reference from public.commerce_purchases where id=p_internal_reference;
 elsif p_object_type='refund' then select amount_minor,currency,provider_refund_id into v_amount,v_currency,v_reference from public.commerce_refunds where id=p_internal_reference;
 elsif p_object_type='payout' then select amount_minor,currency,coalesce(provider_payout_id,id::text) into v_amount,v_currency,v_reference from public.commerce_payouts where id=p_internal_reference;
 else raise exception 'invalid_reconciliation_object_type'; end if;
 if not found then raise exception 'internal_object_not_found'; end if;
 insert into public.commerce_reconciliation_records(provider,object_type,provider_reference,internal_reference,status,internal_amount_minor,currency,details)
 values(p_provider,p_object_type,'missing:'||p_internal_reference::text,p_internal_reference,'missing_provider',v_amount,v_currency,jsonb_build_object('expected_provider_reference',v_reference))
 on conflict(provider,object_type,provider_reference) do update set status='missing_provider',internal_amount_minor=excluded.internal_amount_minor,currency=excluded.currency,details=excluded.details,checked_at=now()
 returning id into v_id; return v_id;
end $$;
revoke all on function public.mark_mara_missing_provider(text,uuid,text) from public,anon,authenticated;
grant execute on function public.mark_mara_missing_provider(text,uuid,text) to service_role;
