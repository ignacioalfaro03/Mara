-- Mara Vera — Commerce advisor cleanup.
-- Makes webhook no-browser-access explicit and indexes commerce foreign keys.

create policy "commerce_webhook_events_no_browser_access"
on public.commerce_webhook_events
for all
to anon, authenticated
using (false)
with check (false);

create index if not exists commerce_checkout_intents_offer_id_idx
on public.commerce_checkout_intents (offer_id);

create index if not exists commerce_purchases_user_id_idx
on public.commerce_purchases (user_id);

create index if not exists commerce_purchases_offer_id_idx
on public.commerce_purchases (offer_id);

create index if not exists commerce_entitlements_offer_id_idx
on public.commerce_entitlements (offer_id);

create index if not exists commerce_contributions_user_id_idx
on public.commerce_contributions (user_id);

create index if not exists commerce_contributions_offer_id_idx
on public.commerce_contributions (offer_id);

create index if not exists commerce_contributions_goal_id_idx
on public.commerce_contributions (goal_id);
