revoke all on table public.launch_events from anon, authenticated, service_role;
grant select, insert on table public.launch_events to service_role;
