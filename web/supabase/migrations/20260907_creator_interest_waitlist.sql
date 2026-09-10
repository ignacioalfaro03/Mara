-- MARA private creator economy: supply-side discovery only.
-- This migration does NOT activate creator payouts, marketplace payments or creator accounts.

create table if not exists public.creator_interest (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  exposure_level text not null,
  product_interests text[] not null default '{}',
  audience_size text not null default 'not_sure',
  current_creator_status text not null default 'never',
  source text not null default 'web_creators',
  status text not null default 'new',
  consented_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint creator_interest_email_shape check (
    char_length(email) between 5 and 320
    and email = lower(email)
    and email like '%@%'
  ),
  constraint creator_interest_exposure_level check (
    exposure_level in ('character_only', 'voice', 'selective_real_content', 'direct_interaction', 'not_sure')
  ),
  constraint creator_interest_audience_size check (
    audience_size in ('none', 'under_5k', '5k_25k', '25k_plus', 'not_sure')
  ),
  constraint creator_interest_current_status check (
    current_creator_status in ('never', 'private_creator', 'public_creator', 'not_sure')
  ),
  constraint creator_interest_status check (
    status in ('new', 'contacted', 'qualified', 'pilot', 'declined', 'archived')
  ),
  constraint creator_interest_source check (
    source in ('web_creators', 'founder_outreach', 'referral', 'other')
  ),
  constraint creator_interest_product_interests check (
    product_interests <@ array[
      'digital_content',
      'audio',
      'personalized',
      'chat',
      'scheduled_sessions',
      'membership',
      'not_sure'
    ]::text[]
  )
);

alter table public.creator_interest enable row level security;

-- No browser/user direct access. The Next server writes with the existing
-- server-only Supabase credential. Admin review remains server-side/manual.
revoke all on table public.creator_interest from anon;
revoke all on table public.creator_interest from authenticated;

-- service_role bypasses RLS but still needs PostgreSQL table privileges.
-- Upsert requires INSERT + UPDATE; SELECT is kept server-only for pilot review.
grant select, insert, update on table public.creator_interest to service_role;

create index if not exists creator_interest_status_created_idx
  on public.creator_interest (status, created_at desc);

comment on table public.creator_interest is
  'Minimal creator pilot interest intake. Contains contact email plus bounded commercial preference tokens only; no intimate free text, legal identity document, payout data or customer-facing creator profile.';
