# MARA CREATOR ALPHA — SECURITY / RELEASE AUDIT

Date: 2026-09-10
Release line: `release/mara-creator-alpha-20260909`
Scope: pre-launch Creator Alpha safety review. No production cutover, no live payment activation, no schema mutation performed by this audit.

## Result

**PASS for the current Creator Alpha boundary, subject to the separate canonical-image integrity blocker.**

This review was intentionally focused on launch-critical authorization, privacy, proof tooling and payment boundaries rather than broad feature expansion.

## 1. Supabase exposed-table RLS

Live project inspection confirmed RLS is enabled on every current table in the `public` schema, including:

- creators / creator_worlds;
- creator_customer_relationships;
- user_declared_preferences / preference_events;
- demand_requests / demand_signals / demand_request_metrics;
- commerce_offers / checkout_intents / purchases / entitlements / contributions / webhook_events;
- profiles / relationship_state / user_world_knowledge;
- launch_events.

No public table was found with RLS disabled.

`FORCE ROW LEVEL SECURITY` is not enabled. That is acceptable for this Alpha because privileged server/service-role execution is intentionally used for narrow backend operations and browser access remains governed by RLS.

## 2. Security-invoker views

Live inspection confirmed all current public product projections use `security_invoker=true`:

- `creator_customer_summary`;
- `creator_demand_opportunities`;
- `creator_next_best_actions`;
- `user_activity_history`.

This prevents the views from silently bypassing the underlying caller's RLS context.

## 3. Private demand boundary

Verified live:

- a user may see their own demand signal;
- a creator may see non-private signals related to their own demand objects;
- a creator does **not** receive raw `privacy_mode = 'private'` demand signals;
- private signals still contribute to aggregate demand metrics;
- `private.touch_mara_creator_customer_from_demand()` explicitly returns without creating an identifiable creator/customer CRM relationship when `privacy_mode = 'private'`.

Therefore private commitment contributes to opportunity-level demand without exposing the committing identity through the CRM trigger.

## 4. Declared preference / My Weakness boundary

Verified policy shape:

- users own insert/update/delete of their declared preferences;
- creators can only select creator-world-scoped preferences where `creator_visible = true` and the creator owns that scope;
- network-scoped user preferences are not exposed to creators through this policy.

The commercial product must continue treating `weakness` as user-declared preference/context, never as permission to exploit vulnerability.

## 5. Creator purchase / fulfillment authorization

Verified live function and policy shape:

- purchase rows are readable by the buyer or the owning creator only;
- `complete_mara_creator_fulfillment(uuid)` requires an authenticated user;
- the function joins the purchase to the creator and requires `creators.user_id = auth.uid()`;
- it rejects unauthorized purchases;
- manual creator offers remain paid-but-unfulfilled until creator completion;
- entitlement is granted only after manual fulfillment for the relevant fixed-unlock flow.

Cross-creator fulfillment denial is also covered by the hosted Creator Alpha commercial E2E.

## 6. Privileged functions

Live inspection found the expected `SECURITY DEFINER` functions.

Browser-callable privileged functions are narrowly scoped:

- `private.is_mara_demand_participant(uuid)` -> `authenticated`, reads only whether the current `auth.uid()` participates;
- `public.complete_mara_creator_fulfillment(uuid)` -> `authenticated`, explicitly checks creator ownership;
- checkout/refund truth functions -> `service_role` only.

Trigger/internal functions are not executable by `anon` or `authenticated` unless explicitly required.

All reviewed privileged functions use an empty fixed `search_path` and schema-qualified object references.

## 7. Signed-test payment boundary

The repository runtime supports only:

- disabled payment runtime; or
- `signed_test` proof flow.

In a Vercel production environment, signed-test is enabled only when all isolated-proof conditions match:

- `MARA_SIGNED_TEST_PROOF=true`;
- proof QA token exists;
- exact isolated proof Vercel project ID matches;
- deployment hostname has the isolated proof prefix.

Canonical production therefore does not become payment-enabled simply because signed-test secrets exist elsewhere.

No Stripe, Mercado Pago, Flow, Transbank, PayPal or other live provider is enabled by this release line.

## 8. QA administration boundary

`/api/internal/qa-user` is inert without `MARA_QA_PROOF_TOKEN` and is explicitly blocked on the canonical production Vercel project ID.

Additional protections:

- constant-time token comparison;
- QA identities restricted to `mara.qa.*@example.com`;
- delete verifies the target is a QA identity before admin deletion;
- cleanup removes creator-scoped QA offers before deleting the QA creator account.

## 9. Operator endpoint

`/api/internal/launch` remains hidden when `MARA_OPERATOR_TOKEN` is absent and requires the operator token when configured.

The release candidate hardens token comparison with `timingSafeEqual`.

The endpoint returns anonymous aggregate event summaries only and explicitly does not claim unique-user conversion, retention, LTV, churn or payment reconciliation.

## 10. Automated release safety contract

`web/scripts/release-safety-contract.mjs` is wired into Web Launch CI and fails the release validation if critical safety invariants drift, including:

- signed-test production isolation removed;
- canonical production QA guard removed;
- QA token/signature protection removed;
- a server service key is introduced as `NEXT_PUBLIC_*`;
- a live payment provider is silently introduced into the Alpha payment runtime.

## 11. Hosted/runtime evidence

Prior and current hosted Creator Alpha proof runs cover:

- exact release SHA deployment to isolated proof project;
- backend environment shape;
- telemetry persistence;
- auth/session and cross-device memory;
- World P0;
- demand aggregation and private-signal isolation;
- signed-test purchase;
- pending manual fulfillment;
- cross-creator fulfillment denial;
- owner fulfillment;
- entitlement / History / post-purchase action state.

Canonical production has not been moved by this work.

## 12. Residual launch blockers / boundaries

### Blocking

- restore the exact approved intact canonical Mara JPEG and make `canonical-integrity` PASS.

### Still intentionally OFF

- live payment provider;
- creator payouts;
- real-money creator offers;
- autonomous production cutover.

### Founder control

**NO MERGE. NO CANONICAL PRODUCTION CUTOVER. NO LIVE PAYMENT/PAYOUT ACTIVATION unless Ignacio explicitly authorizes the corresponding action.**
