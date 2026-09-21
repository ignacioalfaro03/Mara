-- Mara financial security hardening.
-- Keep journal mutation server-only and make creator finance reads explicitly creator-scoped.

revoke all on public.commerce_financial_transactions from anon, authenticated;
revoke all on public.commerce_refunds from anon, authenticated;
revoke all on public.commerce_disputes from anon, authenticated;
revoke all on public.commerce_reconciliation_records from anon, authenticated;

-- The journal itself is not a browser API. Creator-facing reads go through scoped entries/views.
drop policy if exists commerce_financial_transactions_creator_read on public.commerce_financial_transactions;
drop policy if exists commerce_refunds_creator_read on public.commerce_refunds;
drop policy if exists commerce_disputes_creator_read on public.commerce_disputes;
drop policy if exists commerce_reconciliation_creator_read on public.commerce_reconciliation_records;

-- Defense in depth: even privileged application roles must use compensating entries, never rewrite history.
create or replace function private.prevent_mara_financial_entry_mutation()
returns trigger language plpgsql set search_path='' as $$
begin
  raise exception 'financial_journal_is_append_only';
end $$;
revoke all on function private.prevent_mara_financial_entry_mutation() from public, anon, authenticated;

drop trigger if exists commerce_financial_entries_append_only on public.commerce_financial_entries;
create trigger commerce_financial_entries_append_only
before update or delete on public.commerce_financial_entries
for each row execute function private.prevent_mara_financial_entry_mutation();

-- This SECURITY DEFINER RPC is intentionally creator-callable: its body authorizes ownership.
-- Make that contract explicit instead of relying on PUBLIC defaults.
revoke all on function public.complete_mara_creator_fulfillment(uuid) from public, anon;
grant execute on function public.complete_mara_creator_fulfillment(uuid) to authenticated;

-- All money-moving RPCs remain server-only.
revoke all on function public.fulfill_mara_commerce_checkout(text,text,text,text,integer,text,text,text) from public, anon, authenticated;
grant execute on function public.fulfill_mara_commerce_checkout(text,text,text,text,integer,text,text,text) to service_role;
revoke all on function public.record_mara_commerce_refund(text,text,text,text,bigint,text,text) from public, anon, authenticated;
grant execute on function public.record_mara_commerce_refund(text,text,text,text,bigint,text,text) to service_role;
revoke all on function public.refund_mara_commerce_purchase(text,text,text,text) from public, anon, authenticated;
grant execute on function public.refund_mara_commerce_purchase(text,text,text,text) to service_role;
revoke all on function public.release_mara_creator_funds(integer) from public, anon, authenticated;
grant execute on function public.release_mara_creator_funds(integer) to service_role;
revoke all on function public.request_mara_creator_payout(uuid,text,bigint,uuid) from public, anon, authenticated;
grant execute on function public.request_mara_creator_payout(uuid,text,bigint,uuid) to service_role;

