# Mara Real App Wiring — Private Alpha E2E Proof

Date: 2026-09-08
Supabase project: Mara_vera
Execution branch: `execution/mara-real-app-wiring-v1`
PR: #62

## Safety boundary

- Signed-test commerce only. No real payment or payout was executed.
- No production alias or deployment was moved.
- No merge was performed.
- QA personas reused existing test-capable auth accounts only for the bounded proof; this document intentionally records no emails or auth user IDs.
- Cross-creator authorization was exercised under authenticated JWT/RLS context.
- All persistent QA fixture rows were deleted after evidence capture. Final QA fixture counts are zero.

## E2E path exercised

`Creator A -> World A -> Customer A preference/taste -> Demand -> Customer A COMMIT -> Customer B private COMMIT -> aggregate demand -> Creator A personalized offer -> signed-test checkout -> succeeded purchase -> Creator CRM -> Next Best Action FULFILL -> Creator fulfillment -> entitlement -> History -> Next Best Action WAIT`

Creator B was used as the negative isolation persona.

## Bug 1 found during E2E — PURCHASE was collapsing into FULFILLMENT

Before this run, every creator offer was represented as `fixed_unlock`, and `fulfill_mara_commerce_checkout` wrote `fulfilled_at = now()` immediately. For `personalized_digital` and `bounded_interaction`, this incorrectly collapsed PURCHASE and FULFILLMENT into one event, prevented the `FULFILL` Next Best Action from becoming reachable, and could grant entitlement before the creator delivered.

### Fix applied

Migration: `mara_creator_manual_fulfillment_contract`
Repository migration: `supabase/migrations/20260908160000_mara_creator_manual_fulfillment_contract.sql`

The contract now:

1. preserves `fulfilled_at = null` after payment for creator-manual offers;
2. blocks premature entitlement insertion;
3. exposes `complete_mara_creator_fulfillment(p_purchase_id)` to authenticated creators;
4. authorizes completion only for the owning creator;
5. grants the entitlement only after successful manual fulfillment;
6. records the creator action on the creator/customer relationship.

Creator offer creation now writes explicit `metadata.fulfillment_mode`:

- `creator_manual` for `personalized_digital` and `bounded_interaction`;
- `automatic` for other current creator offer families.

## Live E2E evidence

### Demand aggregation and privacy

Two COMMIT signals were persisted against the QA demand request.

- aggregate `commit_count`: **2**
- aggregate `commit_wtp_total_minor`: **3,300,000 CLP minor units**
- Creator A raw signal rows visible under RLS: **1**

The second COMMIT used `privacy_mode = private`, so it contributed to privacy-safe aggregate demand while remaining hidden as a raw customer signal from the creator.

### State immediately after signed-test purchase

- purchase status: **succeeded**
- pending fulfillment: **true**
- entitlement count: **0**
- Creator CRM purchase count: **1**
- Creator CRM fulfilled purchase count: **0**
- Next Best Action: **fulfill**
- NBA priority: **high**
- History `PURCHASE_COMPLETED`: **1**
- History `FULFILLMENT_COMPLETED`: **0**

This proves PURCHASE and FULFILLMENT are operationally distinct.

### Cross-creator isolation

Under Creator B authenticated context, queries against Creator A returned:

- Creator A CRM rows: **0**
- Creator A purchase rows: **0**
- Creator A declared preference rows: **0**
- Creator A raw demand signal rows: **0**

Creator B calling `complete_mara_creator_fulfillment` for Creator A's purchase returned the expected authorization failure:

`purchase_not_authorized`

The purchase remained unfulfilled after the rejected attempt.

### State after Creator A fulfillment

- fulfilled: **true**
- active entitlement count: **1**
- Creator CRM purchase count: **1**
- Creator CRM fulfilled purchase count: **1**
- Next Best Action: **wait**
- NBA priority: **low**
- History `PURCHASE_COMPLETED`: **1**
- History `FULFILLMENT_COMPLETED`: **1**
- creator action recorded: **true**

The state transition is therefore:

`PAID / NOT DELIVERED -> FULFILL HIGH -> CREATOR DELIVERS -> ENTITLEMENT + HISTORY -> WAIT LOW`

### Customer boundary

Under Customer A authenticated context:

- own creator-scoped history rows: **4**
- creator CRM rows visible: **0**
- own active entitlement rows for the QA purchase: **1**

## Bug 2 found during QA cleanup — demand metric cascade delete

The first fixture cleanup attempt exposed a referential-integrity defect: deleting a `demand_request` cascades into `demand_signals`, whose DELETE trigger attempted to recreate `demand_request_metrics` after the parent request no longer existed. The transaction failed safely and rolled back.

### Fix applied

Migration: `mara_demand_metrics_delete_cascade_guard`
Repository migration: `supabase/migrations/20260908165500_mara_demand_metrics_delete_cascade_guard.sql`

`private.refresh_mara_demand_request_metrics()` now exits without recreating metrics when the parent demand request no longer exists.

The same cleanup then completed successfully.

## QA cleanup result

After proof capture, all fixture rows were removed from the connected database:

- QA creators: **0**
- QA Worlds: **0**
- QA demand requests: **0**
- QA offers: **0**
- QA purchases: **0**
- QA webhook events: **0**

Only the product/database fixes remain.

## Regression protection

`web/scripts/real-app-wiring-contract-smoke.mjs` now asserts the manual-fulfillment contract, including:

- manual fulfillment families remain explicit;
- creator fulfillment uses `complete_mara_creator_fulfillment` rather than service-role direct patching;
- premature entitlement guard remains in the migration;
- the creator-scoped authorization error remains present;
- generated DB types include the fulfillment RPC.

The smoke is wired into `Web Launch CI` as `Verify Real App Wiring contract`.

## Result

The core Private Alpha commercial loop is proven against the live Supabase primitives using signed-test payment semantics:

`Demand -> Offer -> Purchase -> CRM -> NBA -> Fulfillment -> Entitlement -> History`

RLS preserves Creator A / Creator B isolation, private demand participates in aggregates without exposing raw private signals, and QA cleanup is now safe under cascade deletion.

## Remaining gates

1. Instrument all Alpha business event producers consistently.
2. Add a repeatable hosted/app-level E2E using real session cookies rather than SQL JWT simulation.
3. Keep the pre-existing canonical JPEG integrity issue tracked separately; it is not caused by this wiring branch.

Founder rule remains: **NO MERGE unless explicitly instructed with `mergea`.**
