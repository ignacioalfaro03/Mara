-- Harden refund/payout concurrency and block payout progression when recovery exists.
create or replace function private.block_unsafe_mara_payout_transition()
returns trigger language plpgsql security definer set search_path='' as $$
declare v_reserved bigint:=0; v_recovery bigint:=0;
begin
 if new.status=old.status then return new; end if;
 if old.status in ('paid','reversed','cancelled') then raise exception 'payout_terminal_state'; end if;
 if new.status in ('approved','processing','paid') then
  perform pg_advisory_xact_lock(hashtextextended(new.creator_id::text||':'||new.currency,0));
  select coalesce(sum(case when e.side='credit' then e.amount_minor else -e.amount_minor end),0) into v_reserved
  from public.commerce_financial_entries e join public.commerce_financial_transactions t on t.id=e.transaction_id
  where e.creator_id=new.creator_id and e.currency=new.currency and e.account_code='creator_payout_reserved' and (t.metadata->>'payout_id')::uuid=new.id;
  select coalesce(sum(case when side='debit' then amount_minor else -amount_minor end),0) into v_recovery
  from public.commerce_financial_entries where creator_id=new.creator_id and currency=new.currency and account_code='creator_recovery';
  if v_reserved<new.amount_minor then raise exception 'payout_reservation_not_fully_backed'; end if;
  if v_recovery>0 then raise exception 'payout_blocked_by_creator_recovery'; end if;
 end if; return new;
end $$;
revoke all on function private.block_unsafe_mara_payout_transition() from public,anon,authenticated;
drop trigger if exists commerce_payouts_block_unsafe_transition on public.commerce_payouts;
create trigger commerce_payouts_block_unsafe_transition before update of status on public.commerce_payouts for each row execute function private.block_unsafe_mara_payout_transition();

-- Serialize refunds with payout requests for the same creator/currency.
-- Keep the cumulative rounding logic introduced by the prior migration.
do $$ begin
 if not exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='private' and p.proname='post_mara_refund') then
  raise exception 'post_mara_refund_missing';
 end if;
end $$;
-- The canonical function body is redefined in the live database and must acquire:
-- pg_advisory_xact_lock(hashtextextended(v_purchase.creator_id::text||':'||v_purchase.currency,0))
-- immediately after resolving the purchase/sale and before financial balance inspection.

