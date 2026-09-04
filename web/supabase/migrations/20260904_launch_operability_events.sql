-- Mara Vera launch operability: anonymous public funnel telemetry.
-- This is not user memory and must not contain identity, free text, fantasies,
-- payment details, social handles, referrers, IP-derived identity or device fingerprints.

create table if not exists public.launch_events (
  id uuid primary key default extensions.gen_random_uuid(),
  event text not null check (event in (
    'page_view',
    'landing_view',
    'session_started',
    'hero_cta_click',
    'cta_clicked',
    'mara_entered',
    'first_interaction',
    'social_to_web',
    'age_gate_view',
    'age_gate_pass',
    'age_gate_accepted',
    'age_gate_fail',
    'returning_user',
    'memory_recall_rendered',
    'memory_recall_engaged',
    'launch_experience_started',
    'experience_started',
    'experience_completed',
    'launch_return_continued',
    'launch_state_reset',
    'preference_selected',
    'first_preference_signal',
    'preference_updated',
    'signup_started',
    'signup_completed',
    'signin_started',
    'signin_completed',
    'ritual_viewed',
    'ritual_completed',
    'ritual_skipped',
    'paywall_impression',
    'offer_viewed',
    'offer_clicked',
    'commercial_offer_dismissed',
    'commercial_post_offer_continued',
    'capricho_viewed',
    'commerce_offer_viewed',
    'commerce_checkout_started',
    'commerce_checkout_blocked',
    'commerce_checkout_returned',
    'commerce_entitlement_unlocked',
    'purchase_completed',
    'commerce_contribution_progress_viewed'
  )),
  session_id uuid,
  entry_source text not null default 'direct' check (entry_source in ('ig', 'tt', 'x', 'direct', 'other')),
  surface text check (surface is null or surface ~ '^(/|/[A-Za-z0-9][A-Za-z0-9_:/.-]{0,78}|[A-Za-z0-9][A-Za-z0-9_:/.-]{0,79})$'),
  target text check (target is null or target ~ '^[A-Za-z0-9][A-Za-z0-9_:/.-]{0,79}$'),
  placement text check (placement is null or placement ~ '^[A-Za-z0-9][A-Za-z0-9_:/.-]{0,79}$'),
  memory_source text check (memory_source is null or memory_source in ('local', 'server')),
  preference_group text check (preference_group is null or preference_group ~ '^[A-Za-z0-9][A-Za-z0-9_:/.-]{0,79}$'),
  offer_slug text check (offer_slug is null or offer_slug ~ '^[A-Za-z0-9][A-Za-z0-9_:/.-]{0,79}$'),
  offer_type text check (offer_type is null or offer_type ~ '^[A-Za-z0-9][A-Za-z0-9_:/.-]{0,79}$'),
  capricho_slug text check (capricho_slug is null or capricho_slug ~ '^[A-Za-z0-9][A-Za-z0-9_:/.-]{0,79}$'),
  amount_bucket text check (amount_bucket is null or amount_bucket in ('under_5', '5_9', '10_24', '25_99', '100_plus')),
  currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  provider_status text check (provider_status is null or provider_status in ('configured', 'not_configured')),
  return_count_bucket text check (return_count_bucket is null or return_count_bucket in ('1', '2', '3-4', '5+')),
  days_since_first_bucket text check (days_since_first_bucket is null or days_since_first_bucket in ('same_day', '1-2d', '3-7d', '8+d', 'unknown')),
  properties jsonb not null default '{}'::jsonb check (jsonb_typeof(properties) = 'object'),
  occurred_at timestamptz not null,
  received_at timestamptz not null default now()
);

alter table public.launch_events enable row level security;

revoke all on table public.launch_events from anon, authenticated, service_role;
grant select, insert on table public.launch_events to service_role;

drop policy if exists launch_events_no_browser_access on public.launch_events;
create policy launch_events_no_browser_access
  on public.launch_events
  for all
  to anon, authenticated
  using (false)
  with check (false);

create index if not exists launch_events_received_at_event_idx
  on public.launch_events (received_at desc, event);

create index if not exists launch_events_session_idx
  on public.launch_events (session_id, received_at desc)
  where session_id is not null;

comment on table public.launch_events is
  'Anonymous, coarse launch funnel events for founder/operator decisions. No identity, free text, intimate content, payment details, social handles or vulnerability data.';
