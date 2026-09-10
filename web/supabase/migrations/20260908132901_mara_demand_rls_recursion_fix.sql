-- Mara — demand RLS recursion fix
-- Live Supabase migration: 20260908132901 / mara_demand_rls_recursion_fix
-- Break demand_requests <-> demand_signals RLS recursion through a narrow private helper.

create or replace function private.is_mara_demand_participant(p_request_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null
    and exists (
      select 1
      from public.demand_signals ds
      where ds.demand_request_id = p_request_id
        and ds.user_id = (select auth.uid())
    );
$$;

revoke all on function private.is_mara_demand_participant(uuid) from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_mara_demand_participant(uuid) to authenticated;

drop policy if exists demand_requests_select_participant on public.demand_requests;
create policy demand_requests_select_participant
on public.demand_requests for select
to authenticated
using ((select private.is_mara_demand_participant(public.demand_requests.id)));
