# MARA CREATOR ALPHA — LAUNCH CONTROL

Updated: 2026-09-10
Release line: `release/mara-creator-alpha-20260909`
Decision PR: `#63`

## Objective

Cut a controlled Mara Creator Alpha from the current real-app execution line without reopening product strategy, weakening privacy, activating unsupported payments, or moving canonical production before release gates are satisfied.

## Product thesis for this release

Mara is a privacy-first creator commerce and demand network presented as connected Creator Worlds.

The Alpha proves this smallest useful loop:

`CREATOR -> WORLD -> AUDIENCE -> WANT/PLEDGE/COMMIT -> AGGREGATED DEMAND -> OFFER -> SIGNED-TEST PURCHASE -> CREATOR FULFILLMENT -> ENTITLEMENT/HISTORY -> RETURN`

This is a controlled product/creator-demand Alpha. It is not yet a marketplace-scale launch and it is not a promise of live payouts.

## Current release status

### Product / backend — PASS

Proven end to end with persistent Supabase truth:

- controlled Creator Alpha activation;
- creator World creation;
- dynamic `/world/[slug]`;
- preference/taste persistence;
- scoped `My Weakness` CRUD;
- demand creation;
- WANT / PLEDGE / COMMIT transitions;
- privacy-safe aggregate creator opportunity;
- creator-scoped customer CRM;
- creator offer creation;
- demand -> offer;
- signed-test checkout;
- paid-but-unfulfilled creator-manual purchase state;
- creator fulfillment;
- entitlement after fulfillment;
- customer History;
- Creator Next Best Action;
- cross-creator RLS isolation.

### Automated Creator Alpha acceptance — PASS

The hosted Creator Alpha commercial E2E now proves the complete multi-session loop on the isolated Vercel proof project, including:

1. creator activation;
2. Creator World creation;
3. customer preference / Weakness;
4. demand creation;
5. isolated demand commitments;
6. aggregate opportunity visibility;
7. private commitment identity protection;
8. demand -> offer;
9. signed-test purchase;
10. paid-but-pending manual fulfillment;
11. second-creator isolation and unauthorized fulfillment rejection;
12. owner fulfillment;
13. entitlement / History;
14. Creator OS post-purchase WAIT state.

Screenshot artifacts were reviewed after the passing run. This caught and led to fixes for two UI contract bugs before release freeze:

- lowercase database Next Best Action values versus uppercase UI assumptions;
- History event names falling back to generic copy.

Both were corrected and the complete commercial E2E passed again on the corrected line.

### Security / privacy audit — PASS

See `MARA_CREATOR_ALPHA_SECURITY_AUDIT_2026-09-10.md`.

Live Supabase inspection confirmed:

- all current `public` tables have RLS enabled;
- all four public product views use `security_invoker=true`;
- creator-visible Weakness/preferences are creator-world scoped and require `creator_visible=true`;
- raw private demand signals are hidden from creators while still contributing to aggregate metrics;
- a private demand signal does not create an identifiable creator/customer CRM relationship;
- manual fulfillment checks creator ownership;
- payment/refund truth functions are service-role only;
- QA administration is token-gated and explicitly blocked on canonical production.

No schema mutation was needed from this audit.

### Release safety automation — PASS / ENFORCED

Web Launch CI now includes `release-safety:contract`.

It guards against accidental launch-boundary drift such as:

- signed-test becoming generally available in production;
- removing the canonical production QA block;
- removing signed-test signature/QA-token protections;
- exposing a service credential through `NEXT_PUBLIC_*`;
- silently introducing a live payment provider into the Alpha runtime.

The launch-operator token comparison was also hardened with constant-time comparison.

### Hosted proof — PASS

The release line is deployed and tested only on the isolated Vercel proof project.

Validated repeatedly on exact release heads:

- remote build/deployment;
- backend environment shape;
- telemetry persistence;
- Playwright runtime;
- browser auth/session/cross-device memory;
- World P0;
- full Creator Alpha commercial loop.

Canonical `mara-vera.vercel.app` remains untouched.

Canonical production runtime error inspection found no runtime error groups in the prior seven-day window at the time of the audit.

## Only known technical release blocker

### Restore the exact approved canonical Mara JPEG

Current path:

`web/public/mara/mara-v1-reference.jpg`

The repository blob is the historical expected blob but is physically truncated and missing JPEG EOI. The independent `canonical-integrity` job correctly rejects it.

Required:

- recover the exact intact approved source image;
- visually confirm it is the approved Mara identity;
- replace the binary without changing identity;
- update the canonical blob lock only after source review;
- rerun canonical integrity + full Web Launch CI + hosted proof on the new exact SHA.

Do **not** bypass the gate, append bytes, or silently generate a replacement face.

Repository history, previous deployment artifacts and available project files have not yielded an intact copy so far.

## Human acceptance boundary

The automated multi-session acceptance and screenshot review now satisfy the **technical** Creator Alpha journey gate.

Before intentionally inviting public Alpha traffic, a short founder/operator spot-check is still recommended for subjective product feel:

- open Home / Creator OS on mobile;
- inspect one World;
- confirm wording and visual identity feel acceptable;
- confirm no obviously broken navigation.

This is a product GO/NO-GO judgment, not a substitute for the already-passing functional E2E.

## Public Alpha payment boundary

For this release candidate:

- live payment provider: **OFF**;
- creator payouts: **OFF**;
- real-money creator offers: **OFF**;
- signed-test checkout: isolated proof mechanism only.

Live money requires a separate provider/compliance decision and explicit authorization.

## Production cutover sequence

Only after the canonical image gate is green and founder authorization is explicit:

1. freeze the exact release SHA;
2. require Web Launch CI green, including `canonical-integrity` and `release-safety:contract`;
3. require Hosted Activation Preview green on the same SHA;
4. require Creator Alpha Commercial E2E green on the same SHA;
5. verify canonical Vercel production config shape;
6. verify QA-only proof token/flags are absent from canonical production;
7. record current canonical deployment as rollback target;
8. merge only with explicit founder instruction `mergea`;
9. deploy/promote only the resulting approved exact `main` SHA to canonical `mara-vera`;
10. verify `/api/health` returns the expected release SHA;
11. verify Auth, World, History, telemetry persistence and mobile smoke;
12. verify lab/QA/proof-only routes remain unavailable on canonical production;
13. verify payments remain disabled;
14. inspect runtime errors immediately after cutover.

## Rollback triggers

Restore the prior known-good canonical web deployment if any of the following appears after cutover:

- Auth/session failure;
- server-backed memory failure;
- Creator World core-route failure;
- creator/customer RLS leakage;
- demand/offer/fulfillment state corruption;
- telemetry persistence failure;
- DEV lab or QA proof-route exposure;
- unexpected payment activation;
- sustained new 5xx on core Alpha paths;
- release SHA mismatch.

Do not roll back Supabase migrations blindly. Restore the prior known-good web deployment first and investigate data/state compatibility.

## Next business gate after Alpha is stable

Do not expand feature scope first. Validate:

- creator willingness to onboard;
- creator ability to create a World and offer without founder assistance;
- user willingness to create/join demand;
- demand -> offer conversion;
- fulfillment workload per creator;
- repeat intent / History return behavior;
- actual payment-provider/payout eligibility for the creator-content model;
- contribution economics before live-money activation.

## Founder boundary

**NO MERGE. NO CANONICAL PRODUCTION CUTOVER. NO LIVE PAYMENT/PAYOUT ACTIVATION unless Ignacio explicitly authorizes the corresponding action.**
