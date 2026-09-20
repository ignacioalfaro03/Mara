-- PREPARED ONLY — DO NOT APPLY WITHOUT EXPLICIT FOUNDER AUTHORIZATION.
-- Supply-validation fields for Creator Site pilot selection.
-- No legal identity, payout credentials, exact income, private addresses or sensitive free text.

begin;

alter table public.creator_interest
  add column if not exists creator_handle text,
  add column if not exists primary_channels text[] not null default '{}',
  add column if not exists market_country text,
  add column if not exists monetization_models text[] not null default '{}',
  add column if not exists biggest_pain text,
  add column if not exists desired_uses text[] not null default '{}',
  add column if not exists privacy_need text not null default 'not_sure',
  add column if not exists pilot_willingness text not null default 'not_sure',
  add column if not exists earnings_threshold_bucket text not null default 'not_sure';

alter table public.creator_interest
  add constraint creator_interest_handle_shape check (
    creator_handle is null or (
      char_length(creator_handle) between 2 and 80
      and creator_handle ~ '^[A-Za-z0-9._-]+$'
    )
  ) not valid,
  add constraint creator_interest_primary_channels_check check (
    primary_channels <@ array['instagram','tiktok','x','youtube','twitch','other']::text[]
  ) not valid,
  add constraint creator_interest_market_country_check check (
    market_country is null or market_country ~ '^[A-Z]{2}$'
  ) not valid,
  add constraint creator_interest_monetization_models_check check (
    monetization_models <@ array['none','subscriptions','digital_products','sponsorships','affiliate','services','events','other']::text[]
  ) not valid,
  add constraint creator_interest_biggest_pain_check check (
    biggest_pain is null or biggest_pain in ('fragmented_tools','demand_visibility','conversion','fulfillment','retention','analytics','privacy','other')
  ) not valid,
  add constraint creator_interest_desired_uses_check check (
    desired_uses <@ array['site','commerce','demand','crm','fulfillment','analytics','privacy']::text[]
  ) not valid,
  add constraint creator_interest_privacy_need_check check (
    privacy_need in ('public','selective','protected','not_sure')
  ) not valid,
  add constraint creator_interest_pilot_willingness_check check (
    pilot_willingness in ('yes','maybe','no','not_sure')
  ) not valid,
  add constraint creator_interest_earnings_threshold_check check (
    earnings_threshold_bucket in ('under_100k_clp','100k_500k_clp','500k_1m_clp','1m_plus_clp','not_sure')
  ) not valid;

alter table public.creator_interest validate constraint creator_interest_handle_shape;
alter table public.creator_interest validate constraint creator_interest_primary_channels_check;
alter table public.creator_interest validate constraint creator_interest_market_country_check;
alter table public.creator_interest validate constraint creator_interest_monetization_models_check;
alter table public.creator_interest validate constraint creator_interest_biggest_pain_check;
alter table public.creator_interest validate constraint creator_interest_desired_uses_check;
alter table public.creator_interest validate constraint creator_interest_privacy_need_check;
alter table public.creator_interest validate constraint creator_interest_pilot_willingness_check;
alter table public.creator_interest validate constraint creator_interest_earnings_threshold_check;

comment on table public.creator_interest is
  'Creator pilot supply validation. Bounded business-fit fields only; no identity documents, payout credentials or sensitive audience dossiers.';

commit;
