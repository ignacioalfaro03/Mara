alter table public.relationship_state
  add column if not exists preferred_private_style text,
  add column if not exists private_session_count integer not null default 0,
  add column if not exists last_private_session_at timestamptz,
  add column if not exists last_private_offer_at timestamptz;

alter table public.relationship_state
  drop constraint if exists relationship_state_preferred_private_style_check;

alter table public.relationship_state
  add constraint relationship_state_preferred_private_style_check
  check (preferred_private_style is null or preferred_private_style in ('direct', 'slow'));

alter table public.relationship_state
  drop constraint if exists relationship_state_private_session_count_check;

alter table public.relationship_state
  add constraint relationship_state_private_session_count_check
  check (private_session_count >= 0);

create or replace function public.record_private_moment(p_style text)
returns table (
  preferred_private_style text,
  private_session_count integer,
  last_private_session_at timestamptz,
  last_private_offer_at timestamptz
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'authentication_required';
  end if;

  if p_style not in ('direct', 'slow') then
    raise exception 'invalid_private_style';
  end if;

  return query
  insert into public.relationship_state (
    user_id,
    preferred_private_style,
    private_session_count,
    last_private_session_at
  )
  values (
    v_user_id,
    p_style,
    1,
    now()
  )
  on conflict (user_id) do update
    set preferred_private_style = excluded.preferred_private_style,
        private_session_count = public.relationship_state.private_session_count + 1,
        last_private_session_at = now(),
        updated_at = now()
  returning
    public.relationship_state.preferred_private_style,
    public.relationship_state.private_session_count,
    public.relationship_state.last_private_session_at,
    public.relationship_state.last_private_offer_at;
end;
$$;

create or replace function public.mark_private_offer_shown()
returns table (
  preferred_private_style text,
  private_session_count integer,
  last_private_session_at timestamptz,
  last_private_offer_at timestamptz
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'authentication_required';
  end if;

  return query
  update public.relationship_state
    set last_private_offer_at = now(),
        updated_at = now()
  where user_id = v_user_id
  returning
    public.relationship_state.preferred_private_style,
    public.relationship_state.private_session_count,
    public.relationship_state.last_private_session_at,
    public.relationship_state.last_private_offer_at;
end;
$$;

grant execute on function public.record_private_moment(text) to authenticated;
grant execute on function public.mark_private_offer_shown() to authenticated;
