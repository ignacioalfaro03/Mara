begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions, pg_catalog;
select plan(10);

select ok(to_regclass('public.commerce_financial_transactions') is not null, 'financial transactions table exists');
select ok(to_regclass('public.commerce_financial_entries') is not null, 'financial entries table exists');
select ok(to_regclass('public.commerce_reconciliation_records') is not null, 'reconciliation table exists');
select ok((select relrowsecurity from pg_class where oid='public.commerce_financial_transactions'::regclass), 'financial transactions has RLS');
select ok((select relrowsecurity from pg_class where oid='public.commerce_reconciliation_records'::regclass), 'reconciliation records has RLS');
select ok(not has_function_privilege('authenticated','public.request_mara_creator_payout(uuid,text,bigint,uuid)','EXECUTE'), 'authenticated cannot request payout');
select ok(has_function_privilege('service_role','public.request_mara_creator_payout(uuid,text,bigint,uuid)','EXECUTE'), 'service role can request payout');
select ok(not has_function_privilege('authenticated','public.record_mara_reconciliation(text,text,text,uuid,bigint,text,jsonb)','EXECUTE'), 'authenticated cannot reconcile');
select ok(has_function_privilege('service_role','public.record_mara_reconciliation(text,text,text,uuid,bigint,text,jsonb)','EXECUTE'), 'service role can reconcile');
select ok(exists(select 1 from pg_trigger where tgrelid='public.commerce_financial_entries'::regclass and tgname='commerce_financial_entries_append_only' and not tgisinternal), 'financial entries append-only trigger exists');

select * from finish();
rollback;

