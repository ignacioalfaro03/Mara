alter table public.launch_events
  drop constraint if exists launch_events_surface_check;

alter table public.launch_events
  add constraint launch_events_surface_check
  check (surface is null or surface ~ '^(/|/[A-Za-z0-9][A-Za-z0-9_:/.-]{0,78}|[A-Za-z0-9][A-Za-z0-9_:/.-]{0,79})$');
