-- Mara Vera — Public Alpha grant hardening.
-- Supabase grants and RLS are separate layers. Keep browser/API roles on the
-- smallest table privileges needed by the current app routes and policies.

revoke all on table public.profiles from anon, authenticated, service_role;
revoke all on table public.preference_events from anon, authenticated, service_role;
revoke all on table public.relationship_state from anon, authenticated, service_role;
revoke all on table public.user_world_knowledge from anon, authenticated, service_role;
revoke all on table public.launch_events from anon, authenticated, service_role;
revoke all on table public.commerce_offers from anon, authenticated, service_role;
revoke all on table public.commerce_goals from anon, authenticated, service_role;
revoke all on table public.commerce_checkout_intents from anon, authenticated, service_role;
revoke all on table public.commerce_purchases from anon, authenticated, service_role;
revoke all on table public.commerce_entitlements from anon, authenticated, service_role;
revoke all on table public.commerce_contributions from anon, authenticated, service_role;
revoke all on table public.commerce_webhook_events from anon, authenticated, service_role;

grant select, update on table public.profiles to authenticated;
grant select, insert on table public.preference_events to authenticated;
grant select, insert, update on table public.relationship_state to authenticated;
grant select, insert on table public.user_world_knowledge to authenticated;

grant select, insert on table public.launch_events to service_role;

grant select on table public.commerce_offers to anon, authenticated, service_role;
grant select on table public.commerce_goals to anon, authenticated, service_role;
grant select on table public.commerce_checkout_intents to authenticated, service_role;
grant insert on table public.commerce_checkout_intents to service_role;
grant select on table public.commerce_purchases to authenticated;
grant select on table public.commerce_entitlements to authenticated;
grant select on table public.commerce_contributions to authenticated;
