-- PREPARED CONTRACT ONLY — NOT APPLIED TO PRODUCTION.
-- Apply only to an authorized dedicated Mara Supabase environment after review.
-- This file is intentionally outside migrations because the current connected
-- Supabase account does not expose a Mara project and the Supabase CLI was not
-- available here to generate canonical migration history safely.

create table if not exists public.creator_business_settings (
  creator_id uuid primary key references public.creators(id) on delete cascade,
  currency text not null default 'CLP' check (currency ~ '^[A-Z]{3}$'),
  monthly_revenue_goal_minor bigint not null default 0 check (monthly_revenue_goal_minor >= 0),
  monthly_fixed_costs_minor bigint not null default 0 check (monthly_fixed_costs_minor >= 0),
  variable_cost_rate_bps integer not null default 0 check (variable_cost_rate_bps >= 0 and variable_cost_rate_bps < 10000),
  time_zone text not null default 'America/Santiago',
  updated_at timestamptz not null default now()
);

alter table public.creator_business_settings enable row level security;

revoke all on table public.creator_business_settings from anon, authenticated;
grant select, insert, update on table public.creator_business_settings to authenticated;
grant all on table public.creator_business_settings to service_role;

drop policy if exists creator_business_settings_select_owner on public.creator_business_settings;
create policy creator_business_settings_select_owner
on public.creator_business_settings
for select
to authenticated
using (
  creator_id in (
    select c.id
    from public.creators c
    where c.user_id = (select auth.uid())
  )
);

drop policy if exists creator_business_settings_insert_owner on public.creator_business_settings;
create policy creator_business_settings_insert_owner
on public.creator_business_settings
for insert
to authenticated
with check (
  creator_id in (
    select c.id
    from public.creators c
    where c.user_id = (select auth.uid())
      and c.status in ('pilot', 'active')
  )
);

drop policy if exists creator_business_settings_update_owner on public.creator_business_settings;
create policy creator_business_settings_update_owner
on public.creator_business_settings
for update
to authenticated
using (
  creator_id in (
    select c.id
    from public.creators c
    where c.user_id = (select auth.uid())
      and c.status in ('pilot', 'active')
  )
)
with check (
  creator_id in (
    select c.id
    from public.creators c
    where c.user_id = (select auth.uid())
      and c.status in ('pilot', 'active')
  )
);

comment on table public.creator_business_settings is
  'Creator-scoped financial-control assumptions for Creator Business OS. No customer vulnerability data, payment authority or external-platform credentials belong here.';
