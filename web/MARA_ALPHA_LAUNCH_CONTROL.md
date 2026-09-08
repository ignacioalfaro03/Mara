# MARA ALPHA LAUNCH CONTROL

Status: execution control for the first monetizable Alpha. This file does not authorize merge, production deployment, real payments, external spend or database changes.

## Objective

Get Mara from current engineering state to a small real-user Alpha with the fewest possible moving parts, minimum founder cash exposure and clean commercial learning.

The operating sequence is:

`LAUNCH READINESS -> MONETIZED ALPHA -> EXTERNAL GATES -> CONTENT BATCH 1 -> COHORT 1 -> COHORT 2`

No parallel feature expansion should be allowed to delay this sequence.

## Current known state

### Launch Readiness

- PR #49 exists and is the current launch-readiness branch.
- Core return/memory/World flow has hosted proof.
- Remaining founder-blocked P0: restore the intact approved canonical Mara asset.

### Monetized Alpha

An interrupted Codex workspace contains the commercial implementation in progress, including prepaid balance, cost reservation, catalog, simulated payments, entitlements, Vault, media authorization, Story Pass, cost ledger, provider overrun protection and Instagram attribution.

Do not recreate this work from scratch. Recover and finish it when Codex becomes available.

### Monetization doctrine

See root `MARA_MONETIZATION_OS.md`.

Core economic rule:

> Variable cost must sit behind prepaid entitlement wherever practical.

## Launch board

| Lane | Deliverable | Owner | Status | Exit criterion |
|---|---|---|---|---|
| A | Launch Readiness PR #49 | Engineering | AMBER | Canonical asset restored + engineering P0 = 0 |
| B | Monetized Alpha PR | Codex | IN PROGRESS LOCAL | Typecheck/build/smokes PASS + remote PR |
| C | Monetization OS docs | ChatGPT/founder | READY IN PR #50 | Doctrine frozen and reviewable |
| D | First commercial story arc | Content | SPEC READY | Batch 1 assets approved |
| E | Chat provider benchmark | Engineering/finance | NOT STARTED | P50/P95 cost known |
| F | Payment processor approval | Founder/external | NOT STARTED | Written approval + sandbox path |
| G | Hosting commercial approval | Founder/external | NOT STARTED | Adult/commercial scope explicitly allowed |
| H | Cohort 1 | Founder | BLOCKED | A-G minimum gates pass |

## Non-negotiable launch scope

Alpha launches with a deliberately narrow product surface:

- Free Intro;
- prepaid conversation;
- one paid audio SKU;
- one Private Drop;
- one Story Pass;
- one coherent Instagram -> DM -> World story arc;
- Vault for ownership/replay;
- Caprichos may remain DEV/prototype until payment/legal/fulfillment gate is cleared.

Explicitly defer:

- subscriptions;
- native mobile apps;
- runtime image generation;
- runtime video generation;
- custom per-user media;
- live streaming;
- broad multi-character catalog;
- large paid acquisition budget.

## 72-hour execution plan once Codex is available

### Block 1 — Recover and close commercial engineering

1. Recover current local `release/mara-monetized-alpha` workspace.
2. Verify diff exists.
3. Run typecheck.
4. Run build.
5. Run alpha commerce smoke.
6. Run browser smoke.
7. Verify no-negative-balance.
8. Verify refund/chargeback.
9. Verify Vault ownership/isolation.
10. Verify provider guardrails.
11. Fix only real blockers.
12. Commit/push.
13. Open Monetized Alpha PR.
14. Stop feature expansion.

### Block 2 — External gates in parallel

Run provider due diligence using `MARA_EXTERNAL_LAUNCH_GATES.md`.

No paid commitment is authorized by this document.

### Block 3 — Content Batch 1

Use `MARA_ALPHA_COMMERCIAL_CONTENT_V1.md`.

Produce only enough to prove the arc before producing the full inventory.

Batch 1 target:

- 2 Instagram/Reel hooks;
- 2 Story clues;
- 2 Mara free/private bridge images;
- 2 voice assets;
- 1 premium image set;
- 1 short premium clip if production pipeline supports it.

Batch 1 is a style/narrative QA gate, not launch inventory.

If Batch 1 feels generic, ad-like, visually inconsistent or not recognizably Mara, stop production and fix the system before scaling to the remaining assets.

## Founder actions that are actually blocking

### P0 — Canonical visual asset

Provide the intact approved Mara source matching Character Canon.

Do not substitute a different face.

### External approval

Founder may need to:

- identify the merchant/legal entity used for payments;
- answer payment-provider underwriting questions;
- accept provider/hosting fees only after approval and review;
- approve first real-payment activation;
- approve canonical production deployment.

Everything else should remain an engineering/operator task.

## First chat-provider benchmark protocol

The purpose is not to find the most powerful model. It is to find the lowest-cost model that preserves Mara sufficiently well.

Benchmark at least 200 simulated conversations across these scenarios:

1. new user;
2. returning user;
3. explicit preference callback;
4. Sofi/World question;
5. refusal/decline of offer;
6. contextual premium offer;
7. long session;
8. Spanish slang;
9. English conversation;
10. structured Action Engine output.

Measure per conversation:

- input tokens;
- output tokens;
- latency;
- estimated cost;
- invalid structured-action rate;
- contradiction rate;
- unsupported World fact rate;
- Mara voice quality score;
- safety/category routing correctness.

Founder report must include:

- cost per 100 turns P50;
- cost per 100 turns P95;
- cost per session P50;
- cost per session P95;
- recommended Free allowance;
- recommended Chat Pack S allowance;
- recommended Chat Pack M allowance;
- contribution margin under each pack.

Do not lock 12/60/200 turns until this benchmark exists.

## Unit-economics launch contract

Before Cohort 1 with real variable inference, require:

`expected prepaid revenue per allowance > expected P95 variable cost / target variable-cost ratio`

Initial internal decision hypothesis:

- contribution margin target >= 70%;
- no negative balance;
- no provider call without valid allowance;
- global spend kill switch configured;
- per-user protection configured.

If economics do not work, change allowance/model/context/output before increasing founder spend.

## Content economics

Every commercial asset should map to:

- `asset_id`;
- story arc;
- free/paid visibility;
- SKU/entitlement;
- production cost estimate;
- attributable offer exposure;
- attributable paid unlock where measurable.

Do not create a large content library without learning which asset families actually produce return and payment.

## Cohort 1 contract

Size:

5-10 trusted adults.

Purpose:

Find broken product/commercial behavior, not statistically prove PMF.

Required before invite:

- age gate works;
- account isolation works;
- return memory works;
- World callback works;
- prices are explicit;
- no negative balance;
- simulated/real payment path appropriate for the cohort;
- refund/support path defined;
- spend ceiling defined;
- analytics separate QA from user behavior.

Measure:

- DM activation;
- first value completion;
- return within 72h;
- first purchase intent/payment when enabled;
- post-offer continuation;
- confusion/support issues;
- variable cost per user;
- qualitative `felt like Mara vs felt like store`.

Stop immediately for:

- cross-user data leakage;
- balance/entitlement bug;
- unexpected spend runaway;
- payment truth mismatch;
- critical adult-content gating error.

## Cohort 2 contract

Size:

20-50 adults.

Only enter if Cohort 1 has no unresolved P0.

Primary questions:

- Do users return?
- Do eligible users pay?
- Do buyers buy again?
- Does media monetize better than pure chat?
- Does story attribution identify stronger arcs?
- Are unit economics acceptable?

Do not scale paid traffic before these are answerable.

## Founder scorecard

Keep the initial scorecard intentionally small:

1. Instagram -> web CTR.
2. Web -> DM activation.
3. First value completion.
4. D1/D3/D7 return.
5. Free -> first purchase.
6. AOV.
7. 7-day repurchase.
8. ARPPU.
9. Variable cost / active user.
10. Contribution margin.

Caprichos add separately:

- average contribution;
- median contribution;
- P95 contribution;
- goal completion rate;
- repeat contribution;
- revenue concentration.

## Launch gates

### GREEN — Cohort 1 allowed

- engineering P0 = 0;
- canonical asset restored;
- commercial tests pass;
- payment path valid for cohort;
- hosting path approved for intended use;
- variable-cost ceiling enforced;
- content Batch 1 approved.

### AMBER — continue preparation

One or more external/founder gates remain, but no reason to restart product design.

### RED — do not launch

Any of:

- data isolation failure;
- payment truth failure;
- uncontrolled variable cost;
- provider/host explicitly rejects intended use;
- legal/commercial blocker;
- canonical identity failure that makes Mara inconsistent.

## Permanent anti-drift rule

Every future request should be tested against the launch bottleneck.

Ask:

> Does this remove the next blocker to a real user paying and returning?

If no, it is probably not P0.

## Founder merge rule

NO MERGE unless Ignacio explicitly says exactly:

`mergea`
