# MARA VERA — MONETIZATION EXECUTION RUNBOOK V1

Status: operational companion to [`../MARA_MONETIZATION_OS.md`](../MARA_MONETIZATION_OS.md).

Purpose: convert the monetization doctrine into an ordered execution plan with explicit gates. This is not a brainstorm backlog.

---

## 1. Current verified launch state

Known launch-readiness line:

- PR #49: `Launch readiness: account-safe continuity and causal World return`;
- base main SHA when PR #49 was created: `cf232013a28bef1e4e43e6d69ee2f71c4514f9aa`;
- PR #49 verified head: `3475c426e2301153041d7e8c7b3add2dc8e444d4`;
- hosted E2E passed for the verified product head;
- known founder blocker: approved canonical Mara JPEG is truncated/corrupted and must be restored from an intact approved source;
- no merge authorized.

A later Codex session also created an interrupted local Monetized Alpha workspace with approximately 25 modified files and work covering catalog, prepaid allowance, cost reservations, simulated payments, refund/chargeback, Vault, media authorization, Story Pass, cost ledger, provider overrun guard and Instagram attribution.

That local workspace is not replaced by this documentation branch.

---

## 2. Execution doctrine

Every decision must end in this chain:

`PRODUCT CONTRACT → DATA CONTRACT → UX → SERVER AUTHORITY → PAYMENT/COST CONTRACT → QA → METRIC → LAUNCH GATE`

If a feature cannot be described through that chain, it is not ready to enter implementation.

Priority order:

1. protect existing work;
2. finish current commercial kernel;
3. prove unit-economics guardrails;
4. push/open Monetized Alpha PR;
5. build Caprichos/Reward Engine as a separate stacked slice;
6. resolve external launch gates;
7. onboard tiny cohorts;
8. measure real behavior;
9. only then expand.

---

# PHASE A — RECOVER AND CLOSE MONETIZED ALPHA

## A1. Workspace recovery

When Codex credits/session resume:

Run first:

```bash
git status
git branch --show-current
git rev-parse HEAD
git diff --stat
git diff --name-only
```

Expected interrupted work includes files equivalent to:

- `lib/alpha/catalog.ts`;
- `lib/alpha/content.ts`;
- `lib/alpha/payments.ts`;
- `lib/alpha/state.ts`;
- `lib/alpha/actions.ts`;
- `lib/alpha/conversation.ts`;
- `lib/alpha/metrics.ts`;
- `lib/alpha/store.ts`;
- `lib/alpha/viewer.ts`;
- Alpha API routes;
- Vault page;
- Alpha commerce/browser smoke scripts;
- prepaid guardrail migration.

If the local changes are missing, stop. Do not reconstruct them blindly from memory.

## A2. Diff review

Classify every modification:

- REQUIRED;
- SAFE SUPPORT;
- REDUNDANT;
- RISKY;
- REMOVE.

Review especially:

- balance mutation;
- reservation/settlement;
- entitlement grant/revoke;
- refund/chargeback;
- provider kill switch;
- cost ledger;
- cross-user authorization;
- media authorization;
- server catalog truth;
- Vault ownership.

## A3. Compile/build gate

Required:

```bash
npm run typecheck
npm run build
```

No commercial branch is pushed as complete until both pass.

## A4. Commercial test matrix

Must prove at minimum:

### Catalog

- one server-authoritative source;
- CLP prices consistent;
- active/inactive SKU control;
- no duplicate price truth in UI.

### Allowance

- Free allowance configurable;
- pack allowance issued only from valid product state;
- reservation before costly call;
- settlement after call;
- no negative balance;
- concurrency does not overspend;
- retry/idempotency safe;
- provider never called if allowance is insufficient.

### Cost protection

- per-request budget;
- provider cost overrun detection;
- provider kill switch;
- global spend ceiling configuration;
- cost ledger stores metadata, not raw conversation.

### Payments

- signed/mock provider only;
- simulated purchase;
- duplicate webhook idempotency;
- refund;
- chargeback;
- chargeback during fulfillment blocks revoked delivery;
- no browser success string can mint entitlement.

### Entitlements

- permanent media;
- permanent audio;
- chat allowance;
- time-limited Story Pass;
- cross-user isolation;
- expired pass fails cleanly.

### Vault

- owned content visible;
- unowned protected content blocked;
- replay only when entitlement allows;
- no fake ownership.

### Attribution

Support safe source/arc data such as:

`?source=instagram&arc=sofi_friday_01`

No fingerprinting requirement.

## A5. Branch/PR gate

Expected branch:

`release/mara-monetized-alpha`

Do not merge.

Because PR #49 is not merged, keep the commercial PR stacked cleanly on the verified launch-readiness line if necessary.

PR must clearly report:

- exact base;
- active SKUs;
- free allowance hypothesis;
- no-negative-balance evidence;
- payment simulation evidence;
- cost controls;
- Vault;
- entitlements;
- refund/chargeback;
- external hosting/payment gates;
- production untouched.

STOP after PR exists and tests are documented.

---

# PHASE B — CAPRICHOS + REWARD ENGINE

Only begin after Monetized Alpha is safely remote and reviewable.

Expected branch:

`feature/caprichos-reward-engine-v1`

Base it on the verified Monetized Alpha head to avoid duplicating commerce infrastructure.

## B1. Audit/reuse existing Caprichos

Read:

- `web/P0_CAPRICHOS_TEST_PLAN.md`;
- `web/LAUNCH_REVENUE_LOOP.md`;
- existing commerce migrations/models;
- `web/P0_COMMERCE_TEST_PLAN.md`.

Reuse existing goal/contribution primitives instead of creating parallel tables where possible.

## B2. Goal model

Must support:

- `black_bag_01`;
- `camera_01`;
- new `macbook_01` fixture/contract;
- `car_01` only as later Big Goal concept.

Goal fields must support:

- id;
- category;
- title;
- description;
- currency;
- authoritative target amount;
- verified target source;
- cleared-funded amount;
- state;
- active/version;
- World Asset mapping;
- reward program.

## B3. MacBook implementation contract

Do not hard-code an invented purchase price.

DEV may use clearly labeled fixture numbers only.

Production activation requires:

1. real model/item choice;
2. real acquisition price source;
3. real target definition;
4. processor/product approval;
5. founder activation.

The goal can only say the MacBook was acquired after authoritative `ACQUIRED` state.

## B4. Contribution contract

Support:

- suggested amounts;
- custom amount;
- risk limits independent from marketing UI;
- cleared-fund progress;
- refund/chargeback adjustments according to policy;
- duplicate webhook idempotency;
- account ownership isolation.

Suggested initial UX amount fixtures can be configurable equivalents of:

- 2,990;
- 4,990;
- 9,990;
- 24,990;
- 49,990 CLP;
- Custom.

## B5. Large contribution controls

No conceptual commercial ceiling, but server must support:

- max provider transaction limit;
- manual review threshold;
- daily risk threshold;
- suspicious-new-account/high-amount state;
- rapid repeat transaction checks where provider data supports it;
- `PENDING_REVIEW` path.

Large spend never overrides product/consent limits.

## B6. Capricho state machine

Support equivalents of:

`DRAFT → READY_FOR_TEST → ACTIVE → FUNDED_PENDING_CLEARANCE → FUNDED → ACQUISITION_PENDING → ACQUIRED → WORLD_ASSET_REVEALED → CLOSED`

Also support:

- `PAUSED`;
- `CANCELED`.

Claims must be state-authoritative.

## B7. Reward Engine

Reward Engine is deterministic and server-authoritative.

Potential types:

- text reaction;
- voice reaction;
- image/video reveal;
- private audio;
- adult roleplay reaction;
- collection unlock;
- contributor callback;
- milestone reward;
- completion reward.

No paid randomness.

Every media reward maps to a registered content asset.

## B8. Adult reward eligibility

Adult reward routing requires:

1. confirmed adult access;
2. category enabled;
3. explicit user opt-in/preferences;
4. valid reward definition;
5. valid asset/entitlement;
6. server authorization.

Example style families:

- SOFT;
- PLAYFUL;
- DIRECT;
- DOMINANT;
- DOMINANT_HUMILIATION;
- ADULT_INTIMATE.

A phrase/tone like `gracias, cerdito` is only eligible inside the explicitly opted-in dominant-humiliation roleplay lane. Payment itself is not category consent.

## B9. Reward stacking

For a valid contribution, test the full stack:

`CONFIRMED PAYMENT → IMMEDIATE REACTION → VAULT OWNERSHIP → GOAL PROGRESS → FUTURE WORLD CONSEQUENCE`

This is the core Caprichos monetization advantage.

## B10. World Asset lifecycle

DEV simulation must prove:

- before funding: no World Asset claim;
- funding complete but not acquired: still no acquisition claim;
- acquisition simulated/authorized: World Asset can be created;
- reveal visible;
- Mara/Sofi callback can reference it;
- contributor callback is grounded in actual session/user participation state.

## B11. Vault/history integration

Add sections/metadata equivalent to:

- Caprichos I helped with;
- World Assets I helped create.

Do not make contribution amount public by default.

## B12. LLM boundary

The model may propose:

- offer Capricho;
- show goal;
- show progress;
- acknowledge contribution;
- deliver eligible reward;
- reveal World Asset.

The model may never create:

- payment truth;
- goal target;
- progress;
- entitlement;
- physical-acquisition state;
- reward asset;
- unsafe/intensity override.

## B13. Caprichos QA matrix

Must prove:

- public goal read permissions;
- private contribution ownership;
- intent != cleared money;
- custom amount validation;
- risk-review state;
- concurrent contributions;
- duplicate webhook;
- progress recalculation;
- refund;
- chargeback;
- reward grant once;
- reward cross-user isolation;
- non-opted user cannot receive intense humiliation reward;
- opted-in user can receive configured reward;
- Vault ownership;
- World Asset blocked before acquisition;
- World Asset visible after valid simulated fulfillment;
- LLM cannot invent goal/progress/reward;
- analytics privacy;
- decline does not degrade relationship.

## B14. DEV lab

Extend, do not replace:

`/experience/caprichos-lab`

Fixtures:

- Black Bag;
- Camera;
- MacBook;
- Car concept.

Every simulation must be visibly labeled DEV / NOT REAL MONEY.

STOP after stacked Caprichos PR exists and evidence is documented.

---

# PHASE C — EXTERNAL LAUNCH GATES

These are not reasons to keep coding indefinitely.

## C1. Canonical Mara asset

Founder must supply an intact approved Mara source matching the canonical identity. Do not substitute a new generated face merely to turn CI green.

## C2. Payment processor

Need explicit approval for the actual adult virtual-character business model.

Required before real launch:

- merchant approval;
- category/product approval;
- sandbox credentials;
- webhook signing details;
- fees/reserves;
- refund/chargeback terms;
- any age/content compliance obligations.

Real payment activation is founder-controlled.

## C3. Hosting

Confirm in writing or by explicit provider terms that intended commercial adult content/use is supported.

Do not spend on migration before the decision is needed.

## C4. LLM/inference

Do not turn on a 24/7 GPU for Alpha.

Before real conversational expansion:

1. benchmark candidate provider/model;
2. simulate representative Mara sessions;
3. measure input/output tokens and latency;
4. calculate P50/P95 session cost;
5. set Free/S/M allowances from economics;
6. configure kill switches;
7. only then enable real variable-cost traffic.

---

# PHASE D — FIRST INVENTORY

Do not wait for hundreds of assets.

Target one coherent story arc first.

Working arc:

`SOFI_FRIDAY_01`

Story grammar:

1. Sofi posts/records something odd about Mara.
2. Mara minimizes it.
3. New evidence contradicts the public version.
4. Sofi knows a piece Mara does not want public.
5. Public tension increases.
6. Evidence appears without full resolution.
7. Mara refuses to resolve everything publicly and routes curiosity into the web/DM.

Minimum inventory should be enough for:

- seven social beats;
- story clues;
- free web assets;
- several audios;
- one Private Drop;
- one Story Pass package;
- one or two short premium videos;
- callbacks.

The exact count is secondary to coherence and reusability.

Every asset must receive content-library metadata before real commercial use.

---

# PHASE E — COHORT LAUNCH

## Cohort 0

Founder/internal QA.

Goal:

- no broken product truth;
- no payment-state bugs;
- no privacy leakage;
- no obvious copy/store feel.

## Cohort 1

5–10 trusted adult testers.

Goal:

- understand Mara without explanation;
- complete first value;
- return;
- understand offers;
- observe willingness to pay / payment path when authorized.

## Cohort 2

20–50 Alpha users.

Only after Cohort 1 passes.

Never open variable-cost access broadly before allowances and kill switches work.

---

# PHASE F — FOUNDER DASHBOARD

Do not build a large BI system.

The founder must be able to answer these questions:

1. Are social visitors entering the DM?
2. Do they reach first value?
3. Do they return D1/D3/D7?
4. Do eligible users make a first purchase?
5. Do buyers purchase again?
6. What is AOV / ARPPU?
7. What is variable AI cost per active/paying user?
8. What is contribution margin?
9. Which story arcs/SKUs produce revenue?
10. Do Caprichos produce repeated participation and World callback value?

Initial internal hypotheses remain editable, not universal benchmarks:

- DM activation target ~40%+;
- D3 return target ~15%+;
- paid conversion among genuinely eligible users ~5%+;
- contribution margin target ~70%+.

Decisions:

`KEEP / FIX / KILL`

---

# PHASE G — STOP RULES

Stop adding launch features when:

- core journey works;
- returning journey works;
- server memory/isolation works;
- prepaid cost guardrails work;
- commerce simulation works;
- Vault/entitlements work;
- Caprichos truth/reward lifecycle works in QA;
- external blockers are accurately identified.

At that point the next job is **real users**, not more architecture.

---

## Final execution commandment

> **DO NOT CONFUSE MORE SOFTWARE WITH MORE PRODUCT.**
>
> **FINISH THE COMMERCIAL KERNEL. PROVE THE REWARD/GOAL LOOP. RESOLVE EXTERNAL GATES. PUT REAL USERS THROUGH IT. MEASURE. THEN DECIDE WHAT DESERVES MORE CODE.**

No merge is authorized by this runbook. The founder rule remains: **NO MERGE without Ignacio saying exactly `mergea`.**