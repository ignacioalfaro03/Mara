-- Mara Vera — Commerce grant hardening.
-- Removes inherited table privileges from browser roles, then grants only the
-- read surfaces required by RLS policies.

revoke all on public.commerce_offers from anon, authenticated;
revoke all on public.commerce_goals from anon, authenticated;
revoke all on public.commerce_checkout_intents from anon, authenticated;
revoke all on public.commerce_purchases from anon, authenticated;
revoke all on public.commerce_entitlements from anon, authenticated;
revoke all on public.commerce_contributions from anon, authenticated;
revoke all on public.commerce_webhook_events from anon, authenticated;

grant select on public.commerce_offers to anon, authenticated;
grant select on public.commerce_goals to anon, authenticated;
grant select on public.commerce_checkout_intents to authenticated;
grant select on public.commerce_purchases to authenticated;
grant select on public.commerce_entitlements to authenticated;
grant select on public.commerce_contributions to authenticated;
