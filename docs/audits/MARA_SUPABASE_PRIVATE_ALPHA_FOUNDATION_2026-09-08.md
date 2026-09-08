# MARA — SUPABASE PRIVATE ALPHA FOUNDATION AUDIT

Date: **2026-09-08**  
Project: `Mara_vera` / `hctykprkwenhatbjxkpb`  
Branch: `strategy/mara-strategic-consolidation-v1`  
Founder boundary: **NO MERGE unless Ignacio explicitly writes `mergea`.**

This is execution evidence, not a new strategy authority.

---

## 1. OUTCOME

The live Supabase project has been evolved additively from a Mara-centric/single-world backend into a foundation capable of supporting a private multi-creator Alpha.

The new backend can represent:

`CREATOR → CREATOR WORLD → CUSTOMER RELATIONSHIP → PREFERENCES / TASTE → DEMAND → OFFER → PURCHASE → FULFILLMENT → HISTORY → NEXT BEST ACTION`

Existing commerce, Auth, launch analytics and Mara memory primitives were preserved rather than replaced.

---

## 2. LIVE BASELINE AUDITED

Existing canonical tables retained:

- `profiles`;
- `preference_events`;
- `relationship_state`;
- `user_world_knowledge`;
- `launch_events`;
- `commerce_offers`;
- `commerce_checkout_intents`;
- `commerce_purchases`;
- `commerce_entitlements`;
- `commerce_goals`;
- `commerce_contributions`;
- `commerce_webhook_events`.

RLS was already enabled on all existing public tables.

Important reuse decisions:

- `commerce_purchases` remains transaction truth;
- `commerce_entitlements` remains entitlement truth;
- `commerce_offers` was extended instead of creating a new creator-commerce ledger;
- `preference_events` was widened instead of creating a parallel taste-game event table;
- `launch_events` remains analytics-only and is **not** durable product history;
- legacy `relationship_state` remains compatible for the original Mara experience while new creator/customer relationships live in a creator-scoped primitive.

---

## 3. NEW DOMAIN FOUNDATION

### `creators`

Private operational creator account:

- authenticated operator user;
- status;
- Free/Pro-ready plan field;
- onboarding state;
- timestamps.

It intentionally does not store KYC, legal identity, payout credentials or protected location details.

### `creator_worlds`

Creator-owned product container:

- creator;
- slug;
- display identity;
- description;
- status;
- public/private visibility;
- lightweight persona/settings JSON.

This is a practical World container, not 3D/metaverse infrastructure.

### `creator_customer_relationships`

Canonical CRM boundary:

`creator_id + user_id`

Stores relationship state and attribution, while purchase aggregates are derived from transaction truth to avoid drift.

---

## 4. CUSTOMER MEMORY / TASTE

### Existing `preference_events`

Extended with:

- `creator_id`;
- `world_id`;
- `signal_scope = network | creator_world`;
- reusable validation for lightweight A/B preference games.

The original launch pose-choice flow remains compatible.

### `user_declared_preferences`

New editable declared-preference truth for concepts such as:

- `my_weakness`;
- preferred format;
- other explicit creator/world or network preferences.

Contract:

`USER SAID THIS != MARA INFERRED THIS`

Raw user text remains explicitly user-declared rather than being treated as psychological truth.

Users can own/update/delete their declared-preference rows under RLS.

Creator visibility only exists for creator-scoped preferences explicitly marked creator-visible.

---

## 5. PERSISTENT DEMAND

### `demand_requests`

Creator/World-scoped demand object with:

- community or creator origin;
- category;
- fulfillment family;
- privacy mode;
- optional coarse location label;
- target commitment;
- lifecycle status.

### `demand_signals`

Current user state:

- `want`;
- `pledge`;
- `commit`;
- optional WTP;
- privacy mode.

Permanent semantic boundary:

`WANT != PLEDGE != COMMIT != PURCHASE`

### `demand_request_metrics`

Privacy-safe aggregate projection containing:

- want ladder count;
- pledge ladder count;
- commit count;
- WTP totals;
- pledged demand GMV;
- verified demand GMV.

Private demand contributes to aggregate opportunity without exposing the raw private participant to the creator.

---

## 6. PRIVATE DEMAND PRIVACY FIX

During implementation review a privacy issue was caught before sign-off:

A `privacy_mode = private` demand signal would have contributed to aggregate demand **and** created an identifiable `creator_customer_relationships` row.

That was corrected.

Current rule:

> **PRIVATE DEMAND COUNTS IN AGGREGATE BUT DOES NOT CREATE AN IDENTIFIABLE CREATOR CRM RELATIONSHIP.**

The raw private signal is not visible to the creator.

---

## 7. CREATOR-SCOPED COMMERCE

`commerce_offers` now supports:

- creator;
- World;
- offer family;
- source demand request.

Legacy first-party offers may remain unscoped for backwards compatibility.

`commerce_purchases` now carries creator/World scope automatically from the offer through a private trigger.

This makes creator CRM queries and RLS possible without creating a second purchase ledger.

Browser users still do not write purchase truth.

---

## 8. CRM QUERY SURFACES

All new views use `security_invoker = true`.

### `creator_customer_summary`

Answers:

- who the customer is by alias;
- relationship dates;
- purchase count;
- creator-specific GMV;
- first / last purchase;
- fulfilled purchase count;
- last fulfillment;
- simple lifecycle stage.

### `creator_next_best_actions`

Deterministic Alpha rules only.

Examples:

- paid but unfulfilled → `fulfill`;
- purchased in last 3 days → `wait`;
- recent first buyer → `post_purchase_followup`;
- dormant >30 days → `reactivate_with_value`;
- repeat buyer → `related_offer`;
- insufficient context → `learn_more`.

Each recommendation includes reason, priority and evidence.

No ML or autonomous sales agent was added.

### `creator_demand_opportunities`

Aggregates:

- WANT;
- PLEDGE;
- COMMIT;
- WTP;
- pledged demand GMV;
- verified demand GMV;
- progress toward target.

### `user_activity_history`

Durable return context is projected from product truth:

- demand state;
- purchase;
- fulfillment;
- declared preference.

`launch_events` remains funnel analytics and is not treated as durable history.

---

## 9. RLS MODEL

### Customer

Can access own:

- profile;
- preference events;
- declared preferences;
- demand signals;
- purchases/entitlements;
- activity history.

Cannot read creator CRM relationship tables as a customer.

### Creator

Can access only:

- own private creator account;
- own Worlds;
- own creator/customer relationships;
- aliases of customers in those relationships;
- creator-scoped declared preferences marked visible;
- creator-scoped non-private demand signals;
- own aggregate demand metrics;
- own offers;
- own purchase/entitlement commercial context.

Creator A cannot read Creator B private account, CRM or creator-scoped preferences.

### Mara / service layer

Service-role access remains reserved for server-side operations and is never exposed to browser clients.

Authorization does not rely on editable `user_metadata`.

---

## 10. RLS RECURSION FOUND AND FIXED

The first transactional security test detected an infinite RLS recursion:

`demand_requests participant policy → demand_signals → demand_requests creator visibility → ...`

No test data persisted because the proof ran inside a transaction and rolled back.

Fix:

- narrow `private.is_mara_demand_participant(request_id)` helper;
- stable, `SECURITY DEFINER`, empty search path;
- explicit `auth.uid()` check;
- private schema;
- execute granted only where the authenticated policy requires it.

After the fix, the full isolation test passed.

---

## 11. TRANSACTIONAL PROOF

A synthetic test was executed inside:

`BEGIN → synthetic rows → role/JWT simulation → assertions → ROLLBACK`

No synthetic Alpha records were retained.

The proof simulated:

- 2 creators;
- 2 Worlds;
- creator-scoped My Weakness / preferences;
- pseudonymous and private demand;
- WANT/PLEDGE/COMMIT;
- WTP;
- creator-scoped offers;
- repeat purchase;
- fulfillment and unfulfilled purchase;
- deterministic Next Best Action.

Verified assertions:

1. Creator A can read own creator account.
2. Creator A cannot read Creator B private creator account.
3. Creator A can read own CRM relationship.
4. Creator A cannot read Creator B CRM.
5. Creator A sees own creator-scoped declared preference.
6. Creator A cannot see Creator B scoped preference.
7. Creator A sees non-private demand participant but not private raw participant.
8. Private participant still contributes to aggregate counts.
9. WANT/PLEDGE/COMMIT ladder aggregation is correct for the synthetic case.
10. Creator customer summary derives repeat purchase correctly.
11. Pending paid fulfillment produces `fulfill` as Next Best Action.
12. Customer can read own preferences/history.
13. Customer cannot read creator CRM relationship rows.

Final result:

# `PASS`

---

## 12. ADVISORS

### Security

No new database security advisor issue was introduced by this work.

Existing account-level warning remains:

- **Leaked Password Protection Disabled**.

This setting was not silently changed because it affects Auth configuration beyond the schema migration scope.

### Performance

Initial advisor pass identified:

- new foreign keys without covering indexes;
- multiple permissive policies for the same role/action.

Both categories were fixed in the hardening migration.

Final performance advisor output contains only `unused_index` informational notices. This is expected immediately after creating a new schema on a tiny/mostly-empty dataset and is not a reason to remove the planned query/RLS indexes before real usage exists.

---

## 13. LIVE MIGRATION HISTORY

Applied to the connected Supabase project:

1. `20260908132539_mara_private_alpha_backend_foundation`
2. `20260908132703_mara_private_demand_privacy_fix`
3. `20260908132901_mara_demand_rls_recursion_fix`
4. `20260908133058_mara_private_alpha_rls_performance_hardening`

Matching SQL is retained under `web/supabase/migrations/` on the working branch.

---

## 14. TYPES

Current TypeScript types were regenerated from the live Supabase schema after the migrations.

The generated schema includes the new tables and views, including:

- creators;
- creator_worlds;
- creator_customer_relationships;
- user_declared_preferences;
- demand_requests;
- demand_signals;
- demand_request_metrics;
- creator_customer_summary;
- creator_demand_opportunities;
- creator_next_best_actions;
- user_activity_history;
- creator/world extensions on commerce.

---

## 15. WHAT IS STILL NOT WIRED

The database foundation is ahead of the product UI/API.

Current meaningful launch work still required:

1. creator onboarding/provisioning flow that creates an authorized `creators` row;
2. Creator World manager wired to `creator_worlds`;
3. consumer World route reading real Creator World data;
4. broaden `/api/preferences` from launch-only pose choice into creator/world-scoped Taste Games where appropriate;
5. add a user-controlled My Weakness / declared preference API and UI;
6. replace synthetic Demand Marketplace state with `demand_requests` + `demand_signals` reads/writes;
7. replace synthetic Creator OS CRM data with the new CRM views;
8. wire creator offer creation to scoped `commerce_offers`;
9. define operational fulfillment write path without granting unsafe browser writes;
10. confirm real payment/payout provider eligibility before live commerce activation.

The next useful engineering slice should therefore be **application wiring**, not another schema redesign.

---

## 16. NON-ACTIONS / BOUNDARIES

This work did NOT:

- merge any PR;
- deploy production;
- activate real payments;
- activate payouts;
- create a paid Supabase branch/project;
- delete existing user data;
- drop existing production tables;
- disable RLS;
- insert persistent synthetic customer data;
- create Hosts/IRL/loyalty/ML infrastructure.

---

# FINAL STATUS

The live database can now support the core private-alpha data model.

The main bottleneck has moved from:

> **“Does the backend architecture exist?”**

to:

> **“Wire the existing UI/API labs to this real backend and put the first creator through the loop.”**

**NO MERGE unless Ignacio explicitly writes `mergea`.**
