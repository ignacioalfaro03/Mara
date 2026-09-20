-- PREPARED ONLY — DO NOT APPLY TO PRODUCTION WITHOUT EXPLICIT FOUNDER AUTHORIZATION.
-- Mara Creator Site launch hardening, 2026-09-20.
--
-- Why:
-- 1) public handles must not collide with application/system routes even if a creator bypasses the web API;
-- 2) launch_events.event currently has a legacy closed allowlist that predates Creator Site product events;
-- 3) source attribution needs future-safe coarse YouTube/referral tokens without storing raw referrers.
--
-- Pre-apply checks:
--   select slug from public.creator_worlds where slug in (...reserved list...);
--   select distinct event from public.launch_events order by event;
--   select distinct entry_source from public.launch_events order by entry_source;
--
-- Rollback notes are at the bottom.

begin;

alter table public.creator_worlds
  drop constraint if exists creator_worlds_reserved_slug_check;

alter table public.creator_worlds
  add constraint creator_worlds_reserved_slug_check
  check (
    slug <> all (array[
      'api','auth','creator','creators','experience','legal','library','me','meet-mara','shop','world',
      '_next','favicon','robots','sitemap','admin','settings','account','login','signup','signin',
      'support','help','privacy','terms','mara','www'
    ]::text[])
  ) not valid;

alter table public.creator_worlds validate constraint creator_worlds_reserved_slug_check;

comment on table public.creator_worlds is
  'Compatibility storage backing Mara Creator Sites. World is not current product language; rename only through a separately reviewed migration.';

-- launch_events is server-only for writes. The application endpoint retains the
-- explicit event allowlist; the database constraint becomes a safe token shape
-- so adding a legitimate event no longer requires weakening runtime validation.
alter table public.launch_events
  drop constraint if exists launch_events_event_check;

alter table public.launch_events
  add constraint launch_events_event_check
  check (event ~ '^[a-z0-9][a-z0-9_]{1,79}$');

alter table public.launch_events
  drop constraint if exists launch_events_entry_source_check;

alter table public.launch_events
  add constraint launch_events_entry_source_check
  check (entry_source in ('ig','tt','x','yt','referral','direct','other'));

commit;

-- ROLLBACK (review current data first; old checks can fail if new values exist):
-- alter table public.creator_worlds drop constraint if exists creator_worlds_reserved_slug_check;
-- alter table public.launch_events drop constraint if exists launch_events_event_check;
-- alter table public.launch_events add constraint launch_events_event_check check (...previous explicit event list...);
-- alter table public.launch_events drop constraint if exists launch_events_entry_source_check;
-- alter table public.launch_events add constraint launch_events_entry_source_check check (entry_source in ('ig','tt','x','direct','other'));
