-- Mara Product Realization hardening.
-- Versioned only. Do not apply to canonical production without founder DB/release authorization.
-- This migration strengthens ownership/data-shape constraints introduced by the realization branch.

-- A thread/request/content/membership tier must belong to the same creator+World pair.
-- creator_worlds already exposes the composite key used by commerce_offers.
alter table public.creator_threads
  add constraint creator_threads_creator_world_fkey
  foreign key (creator_id, world_id)
  references public.creator_worlds (creator_id, id)
  on delete cascade;

alter table public.creator_requests
  add constraint creator_requests_creator_world_fkey
  foreign key (creator_id, world_id)
  references public.creator_worlds (creator_id, id)
  on delete cascade;

alter table public.creator_content
  add constraint creator_content_creator_world_fkey
  foreign key (creator_id, world_id)
  references public.creator_worlds (creator_id, id)
  on delete cascade;

alter table public.creator_membership_tiers
  add constraint creator_membership_tiers_creator_world_fkey
  foreign key (creator_id, world_id)
  references public.creator_worlds (creator_id, id)
  on delete cascade;

-- Currency is stored as an ISO-style uppercase 3-letter code in the current commerce backbone.
alter table public.creator_requests
  drop constraint if exists creator_requests_currency_check;
alter table public.creator_requests
  add constraint creator_requests_currency_check
  check (currency ~ '^[A-Z]{3}$');

-- Lifecycle writes remain server-owned. RLS is defense in depth; browser roles do not get DML.
revoke insert, update, delete on table public.creator_threads from anon, authenticated;
revoke insert, update, delete on table public.creator_messages from anon, authenticated;
revoke insert, update, delete on table public.creator_requests from anon, authenticated;
revoke insert, update, delete on table public.creator_memberships from anon, authenticated;

-- Private CRM context is never exposed to anon and remains creator-scoped under RLS.
revoke all on table public.creator_customer_private_context from anon;
revoke all on table public.creator_customer_notes from anon;

-- Paid/private media object coordinates are creator/server metadata, not a consumer Data API surface.
revoke all on table public.creator_content_media from anon;

-- Make RLS state explicit even if a future migration changes table defaults.
alter table public.creator_follows enable row level security;
alter table public.creator_content enable row level security;
alter table public.creator_content_media enable row level security;
alter table public.creator_customer_private_context enable row level security;
alter table public.creator_customer_notes enable row level security;
alter table public.creator_threads enable row level security;
alter table public.creator_messages enable row level security;
alter table public.creator_requests enable row level security;
alter table public.creator_membership_tiers enable row level security;
alter table public.creator_memberships enable row level security;
