-- Mara Vera — atomic, monotonic account-backed relationship memory.
-- The caller is always the authenticated user. No service role is required.

create or replace function public.merge_mara_relationship_state(
  p_return_count integer,
  p_first_seen_at timestamptz,
  p_last_seen_at timestamptz,
  p_last_visual_choice text,
  p_launch_completed boolean
)
returns void
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

  if p_return_count < 0 or p_return_count > 100000 then
    raise exception 'invalid_return_count';
  end if;

  if p_first_seen_at is null or p_last_seen_at is null or p_first_seen_at > p_last_seen_at then
    raise exception 'invalid_relationship_timestamps';
  end if;

  if p_last_visual_choice is not null and p_last_visual_choice not in ('pose_a', 'pose_b') then
    raise exception 'invalid_visual_choice';
  end if;

  insert into public.relationship_state (
    user_id,
    first_seen_at,
    last_seen_at,
    return_count,
    last_visual_choice,
    launch_completed,
    updated_at
  )
  values (
    v_user_id,
    p_first_seen_at,
    p_last_seen_at,
    p_return_count,
    p_last_visual_choice,
    p_launch_completed,
    now()
  )
  on conflict (user_id) do update
  set
    first_seen_at = case
      when public.relationship_state.first_seen_at is null then excluded.first_seen_at
      when excluded.first_seen_at is null then public.relationship_state.first_seen_at
      else least(public.relationship_state.first_seen_at, excluded.first_seen_at)
    end,
    last_seen_at = case
      when public.relationship_state.last_seen_at is null then excluded.last_seen_at
      when excluded.last_seen_at is null then public.relationship_state.last_seen_at
      else greatest(public.relationship_state.last_seen_at, excluded.last_seen_at)
    end,
    return_count = greatest(public.relationship_state.return_count, excluded.return_count),
    -- Dedicated preference events are authoritative after a server choice exists.
    -- Relationship snapshots can seed an empty projection, but cannot overwrite it later.
    last_visual_choice = coalesce(public.relationship_state.last_visual_choice, excluded.last_visual_choice),
    launch_completed = public.relationship_state.launch_completed or excluded.launch_completed,
    updated_at = now();
end;
$$;

revoke all on function public.merge_mara_relationship_state(integer, timestamptz, timestamptz, text, boolean) from public, anon;
grant execute on function public.merge_mara_relationship_state(integer, timestamptz, timestamptz, text, boolean) to authenticated;

comment on function public.merge_mara_relationship_state(integer, timestamptz, timestamptz, text, boolean) is
  'Atomically merges low-sensitivity Mara relationship continuity for auth.uid(); counters/completion never decrease and an existing preference projection is not overwritten by stale local snapshots.';
