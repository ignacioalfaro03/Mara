-- Mara Vera — minimal relationship ritual memory for the first DM vertical slice.
-- Extends the existing relationship_state projection; it does not create a second memory engine.

alter table public.relationship_state
  add column if not exists last_ritual_key text null,
  add column if not exists last_ritual_completed_at timestamptz null;

alter table public.relationship_state
  drop constraint if exists relationship_state_last_ritual_key_check;

alter table public.relationship_state
  add constraint relationship_state_last_ritual_key_check
  check (last_ritual_key is null or last_ritual_key in ('junk_food_date_v1'));

create or replace function public.complete_mara_ritual(p_ritual_key text)
returns table(last_ritual_key text, last_ritual_completed_at timestamptz)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'authentication_required';
  end if;

  if p_ritual_key not in ('junk_food_date_v1') then
    raise exception 'invalid_ritual_key';
  end if;

  insert into public.relationship_state (
    user_id,
    first_seen_at,
    last_seen_at,
    last_ritual_key,
    last_ritual_completed_at,
    updated_at
  )
  values (
    v_user_id,
    now(),
    now(),
    p_ritual_key,
    now(),
    now()
  )
  on conflict (user_id) do update
  set
    last_seen_at = greatest(coalesce(public.relationship_state.last_seen_at, excluded.last_seen_at), excluded.last_seen_at),
    last_ritual_completed_at = case
      when public.relationship_state.last_ritual_key = excluded.last_ritual_key
        and public.relationship_state.last_ritual_completed_at is not null
      then public.relationship_state.last_ritual_completed_at
      else excluded.last_ritual_completed_at
    end,
    last_ritual_key = excluded.last_ritual_key,
    updated_at = now();

  return query
  select rs.last_ritual_key, rs.last_ritual_completed_at
  from public.relationship_state rs
  where rs.user_id = v_user_id;
end;
$$;

revoke all on function public.complete_mara_ritual(text) from public, anon;
grant execute on function public.complete_mara_ritual(text) to authenticated;

comment on function public.complete_mara_ritual(text) is
  'Records only an explicit, low-sensitivity ritual completion for auth.uid(). No photo proof, free text, sensitive inference or vulnerability score is stored.';
