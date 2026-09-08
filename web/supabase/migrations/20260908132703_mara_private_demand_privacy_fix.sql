-- Mara — private demand privacy fix
-- Live Supabase migration: 20260908132703 / mara_private_demand_privacy_fix
-- Private demand contributes to aggregate metrics but must not identify the user to the creator CRM.

create or replace function private.touch_mara_creator_customer_from_demand()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_creator_id uuid;
begin
  if new.privacy_mode = 'private' then
    return new;
  end if;

  select dr.creator_id into v_creator_id
  from public.demand_requests dr
  where dr.id = new.demand_request_id;

  if v_creator_id is not null then
    insert into public.creator_customer_relationships (
      creator_id, user_id, first_seen_at, last_activity_at, attribution_source
    ) values (
      v_creator_id, new.user_id, now(), now(), 'mara'
    )
    on conflict (creator_id, user_id) do update set
      last_activity_at = greatest(public.creator_customer_relationships.last_activity_at, excluded.last_activity_at),
      updated_at = now();
  end if;
  return new;
end;
$$;

revoke all on function private.touch_mara_creator_customer_from_demand() from public, anon, authenticated;
