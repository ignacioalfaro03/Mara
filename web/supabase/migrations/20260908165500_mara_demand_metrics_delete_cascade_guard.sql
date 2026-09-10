-- Prevent demand_signals DELETE triggers from recreating aggregate metrics
-- after the parent demand_request has already been removed by cascade.

create or replace function private.refresh_mara_demand_request_metrics()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_request_id uuid;
begin
  v_request_id := coalesce(new.demand_request_id, old.demand_request_id);

  if not exists (
    select 1 from public.demand_requests dr where dr.id = v_request_id
  ) then
    return coalesce(new, old);
  end if;

  insert into public.demand_request_metrics (
    demand_request_id,
    want_count,
    pledge_count,
    commit_count,
    wtp_count,
    wtp_total_minor,
    pledge_wtp_total_minor,
    commit_wtp_total_minor,
    updated_at
  )
  select
    v_request_id,
    count(*) filter (where ds.signal_level in ('want','pledge','commit'))::integer,
    count(*) filter (where ds.signal_level in ('pledge','commit'))::integer,
    count(*) filter (where ds.signal_level = 'commit')::integer,
    count(ds.wtp_amount_minor)::integer,
    coalesce(sum(ds.wtp_amount_minor),0)::bigint,
    coalesce(sum(ds.wtp_amount_minor) filter (where ds.signal_level in ('pledge','commit')),0)::bigint,
    coalesce(sum(ds.wtp_amount_minor) filter (where ds.signal_level = 'commit'),0)::bigint,
    now()
  from public.demand_signals ds
  where ds.demand_request_id = v_request_id
  on conflict (demand_request_id) do update set
    want_count = excluded.want_count,
    pledge_count = excluded.pledge_count,
    commit_count = excluded.commit_count,
    wtp_count = excluded.wtp_count,
    wtp_total_minor = excluded.wtp_total_minor,
    pledge_wtp_total_minor = excluded.pledge_wtp_total_minor,
    commit_wtp_total_minor = excluded.commit_wtp_total_minor,
    updated_at = now();

  return coalesce(new, old);
end;
$$;

revoke all on function private.refresh_mara_demand_request_metrics() from public, anon, authenticated;
