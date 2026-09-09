# MARA CREATOR ALPHA — LAUNCH CONTROL

Date: 2026-09-09
Release line: `release/mara-creator-alpha-20260909`
Source product head: `32a4538b7f385164c83ce3e31d2368e5b8569a9c`

## Objective

Cut a controlled Mara Creator Alpha from the current real-app execution line without reopening product strategy, weakening privacy, activating unsupported payments, or moving production before the release gates are satisfied.

## Product thesis for this release

Mara is a privacy-first creator commerce and demand network presented as connected Creator Worlds.

This Alpha must prove the smallest useful loop:

`CREATOR -> WORLD -> AUDIENCE -> WANT/PLEDGE/COMMIT -> AGGREGATED DEMAND -> OFFER -> SIGNED-TEST PURCHASE -> CREATOR FULFILLMENT -> ENTITLEMENT/HISTORY -> RETURN`

The release is not a marketplace-scale launch and is not a promise of live payouts.

## Proven on the source execution line

### Real Supabase product wiring

Proven end to end with persistent backend truth:

- controlled Creator Alpha activation;
- creator World creation;
- dynamic `/world/[slug]`;
- preference/taste persistence;
- `My Weakness` CRUD with scoped storage;
- demand creation;
- WANT / PLEDGE / COMMIT transitions;
- aggregate creator opportunity;
- creator-scoped customer CRM;
- creator offer creation;
- demand -> offer;
- signed-test checkout;
- creator-manual fulfillment;
- entitlement after fulfillment;
- customer History;
- creator Next Best Action;
- cross-creator RLS isolation.

Detailed proof remains in `REAL_APP_WIRING_E2E_PROOF_2026-09-08.md`.

### CI

On exact source head:

- production dependency audit: PASS;
- Alpha report parser: PASS;
- Real App Wiring contract: PASS;
- DEV labs production block: PASS;
- Typecheck: PASS;
- Next.js production build: PASS;
- production mobile smoke: PASS.

The only failing Web Launch CI job is the independent canonical-image integrity gate.

### Hosted proof

The exact source head was built and proven on the isolated Vercel proof project.

- remote build/deployment: PASS;
- hosted health/memory: PASS;
- telemetry persistence probe: PASS;
- Playwright runtime: PASS;
- browser auth/session/cross-device memory: PASS;
- hosted World smoke: PASS;
- canonical `mara-vera.vercel.app`: UNTOUCHED.

## P0 — blocks release cut

### 1. Restore the exact approved canonical Mara JPEG

Current file:

`web/public/mara/mara-v1-reference.jpg`

The repository blob is the expected canonical blob but is physically truncated and missing JPEG EOI.

Required action:

- recover the exact intact approved source image;
- visually confirm identity against the approved Mara canon;
- replace the truncated binary without changing Mara identity;
- update the canonical blob lock only after the intact source is reviewed;
- rerun `canonical-integrity` and the full Web Launch CI.

Do not bypass the gate and do not repair the file by appending bytes.

## P0 — Alpha acceptance before production cutover

### 2. Human Creator Alpha UI journey

Run one real human operator through the hosted release candidate using a controlled Alpha creator account:

1. activate creator;
2. create Creator World;
3. open World as a customer;
4. save one declared preference / Weakness;
5. create demand;
6. produce at least two demand commitments from isolated customer identities;
7. confirm creator sees aggregate opportunity but no unauthorized private raw data;
8. create offer from demand;
9. complete signed-test purchase;
10. confirm purchase remains unfulfilled;
11. creator completes fulfillment;
12. confirm entitlement and customer History;
13. confirm Creator OS moves from FULFILL to WAIT;
14. repeat critical checks on a second creator identity to prove isolation.

Acceptance evidence:

- screenshots or recorded QA notes for the complete journey;
- no cross-creator leakage;
- no unexpected 5xx;
- no production business telemetry contamination from proof/preview environments.

## Public Alpha payment boundary

For this release candidate:

- live payment provider: OFF;
- creator payouts: OFF;
- real-money creator offers: OFF unless separately approved after provider/compliance diligence;
- signed-test checkout remains the commercial-flow proof mechanism.

This means the initial cut is a product/creator-demand Alpha, not the final monetized marketplace launch.

## Production cutover gate

Only after P0 gates are green and founder authorization is explicit:

1. freeze exact release SHA;
2. require Web Launch CI green, including canonical integrity;
3. require hosted release proof green on the same SHA;
4. verify canonical Vercel project has required production Supabase public config and server-only backend credential shape;
5. verify QA-only secrets/tokens are absent from canonical production;
6. merge only with explicit founder instruction `mergea`;
7. deploy the resulting exact `main` SHA to canonical `mara-vera`;
8. verify `/api/health`, memory health, telemetry persistence, Auth, Creator World, History and production mobile smoke;
9. verify DEV/lab routes remain unavailable in production;
10. verify payments remain disabled unless separately authorized.

## Rollback triggers

Rollback the canonical deployment if any of the following appears after cutover:

- Auth/session failure;
- server-backed memory failure;
- Creator World core route failure;
- creator/customer RLS leakage;
- demand/offer/fulfillment state corruption;
- telemetry persistence failure;
- DEV lab exposure;
- unexpected payment activation;
- sustained new 5xx on core Alpha paths.

Do not roll back Supabase migrations blindly. Restore the prior known-good web deployment first and investigate data/state compatibility.

## Next commercial gate after Alpha is stable

Do not expand feature scope first. Validate:

- creator willingness to onboard;
- creator ability to create a World and offer without founder assistance;
- user willingness to create/join demand;
- demand -> offer conversion;
- fulfillment workload per creator;
- repeat intent / History return behavior;
- payment-provider and payout eligibility for the actual creator-content model;
- contribution economics before live money activation.

## Founder boundary

**NO MERGE. NO CANONICAL PRODUCTION CUTOVER. NO LIVE PAYMENT/PAYOUT ACTIVATION unless Ignacio explicitly authorizes the corresponding action.**
