create table if not exists public.user_world_knowledge (
  user_id uuid not null references auth.users(id) on delete cascade,
  fact_key text not null,
  source_key text not null,
  discovered_at timestamptz not null default now(),
  primary key (user_id, fact_key),
  constraint user_world_knowledge_fact_key_check
    check (fact_key in ('sofi_found_footage_v1')),
  constraint user_world_knowledge_source_key_check
    check (source_key in ('sofi_phone_clip_v1'))
);

alter table public.user_world_knowledge enable row level security;

revoke all on table public.user_world_knowledge from public, anon;
grant select, insert on table public.user_world_knowledge to authenticated;

drop policy if exists "world knowledge select own" on public.user_world_knowledge;
create policy "world knowledge select own"
on public.user_world_knowledge
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "world knowledge insert own" on public.user_world_knowledge;
create policy "world knowledge insert own"
on public.user_world_knowledge
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create or replace function public.record_sofi_found_footage()
returns table (
  fact_key text,
  source_key text,
  discovered_at timestamptz
)
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

  insert into public.user_world_knowledge (user_id, fact_key, source_key)
  values (v_user_id, 'sofi_found_footage_v1', 'sofi_phone_clip_v1')
  on conflict (user_id, fact_key) do nothing;

  return query
  select
    k.fact_key,
    k.source_key,
    k.discovered_at
  from public.user_world_knowledge k
  where k.user_id = v_user_id
    and k.fact_key = 'sofi_found_footage_v1'
  limit 1;
end;
$$;

revoke all on function public.record_sofi_found_footage() from public, anon;
grant execute on function public.record_sofi_found_footage() to authenticated;

comment on table public.user_world_knowledge is
  'Private per-user knowledge of fixed Mara World facts. No intimate free text, inferred sexuality, vulnerability, loneliness, dependency or arousal data.';

comment on function public.record_sofi_found_footage() is
  'Records only that auth.uid() discovered the fixed Sofi phone-footage clue. SECURITY INVOKER keeps RLS authoritative.';
