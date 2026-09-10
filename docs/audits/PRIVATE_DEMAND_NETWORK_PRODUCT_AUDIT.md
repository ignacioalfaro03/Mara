# MARA — PRIVATE DEMAND NETWORK PRODUCT AUDIT

Date: 2026-09-08  
Branch audited: `strategy/mara-demand-to-experience-marketplace-v1`  
Audit purpose: evaluate the current demand-marketplace line against the founder's broader Private Demand Network thesis.

## Executive conclusion

The existing PR #59 already proves important marketplace mechanics:

- public demand discovery;
- join;
- willingness to pay;
- synthetic commitment;
- duplicate detection;
- visible unlock progress;
- Host Wanted state;
- synthetic Host interest;
- Demand GMV concepts;
- DEV-only fail-closed behavior.

The main strategic gap is not technical quality. It is product scope.

The current implementation still frames demand primarily as demand for **experiences / events**. The new founder direction requires demand to become a general primitive for:

- digital products;
- creator content;
- collective requests;
- memberships;
- drops;
- collaborations;
- merchandise;
- digital / physical / hybrid experiences;
- future roles / hosts / services.

Therefore this branch should extend, not replace, PR #59.

---

## Reusable pieces

### Demand model
Reuse:

- `DemandIdea`;
- `DemandStage`;
- WTP buckets;
- demand metrics;
- duplicate detection;
- city-aware similarity;
- seeded synthetic demand;
- aggregate marketplace summary.

### UX
Reuse:

- mobile-first lab;
- `ME SUMO` join action;
- WTP selection;
- synthetic COMMIT;
- progress bar;
- duplicate suggestion;
- Host Wanted card;
- synthetic/no-money disclosure.

### CI contract
Reuse:

- DEV-only route;
- fail-closed production test;
- contract smoke structure;
- strategy-token assertions.

### Strategic doctrine
Reuse:

- `DEMAND FIRST. SUPPLY SECOND` direction;
- Demand Graph;
- Host / Creator / Operator separation;
- `MARA ORCHESTRATES. HOSTS EXECUTE.`;
- provider/legal gating before real marketplace money;
- privacy-safe aggregated demand intelligence.

---

## Gaps to close now

### 1. Experience-only framing
Current objects use `ExperienceType`, proposal CTA says `PROPONER EXPERIENCIA`, and most seeded examples are events.

Required change:

- make the primitive general demand;
- support digital products and memberships in the same engine;
- keep physical experiences as one fulfillment family, not the whole product.

### 2. WANT / PLEDGE / COMMIT separation
Current lab has join and COMMIT, while WTP selection is embedded inside the commit box.

Required change:

- WANT = join;
- PLEDGE = record WTP without claiming purchase;
- COMMIT = stronger synthetic signal;
- surface these as distinct steps.

### 3. Creator World context
Current cards can show a Creator label, but there is no persistent World framing.

Required change:

- add World label / context to demand objects;
- show a minimal Creator opportunity view such as `WHAT YOUR WORLD WANTS`;
- do not build a full creator dashboard yet.

### 4. Retention / history
Current local actions disappear conceptually after interaction.

Required change:

- add local `MY HISTORY` proof;
- record create / join / pledge / commit events;
- demonstrate that participation leaves a trace.

### 5. Privacy model
Current marketplace strategy includes visibility and privacy-safe Host data, but the consumer demand object does not visibly model privacy preference.

Required change:

- add a simple privacy mode to synthetic demand;
- demonstrate PUBLIC / PSEUDONYMOUS / PRIVATE semantics;
- keep real identity verification future-gated.

### 6. VIP, Roles, Hosts and IRL sequencing
These are strategically valuable but should not expand MVP complexity.

Required change:

- document them as future monetization / fulfillment layers;
- do not build production Host marketplace, venue marketplace, QR, ticketing or roles in this slice.

---

## Do not touch in this slice

- production payment activation;
- payout activation;
- production database migrations;
- private creator identity / KYC material;
- premium asset security architecture;
- production deployment / alias movement;
- live venue contracts;
- live Host contracts;
- real IRL fulfillment;
- full social feed;
- complex embedding infrastructure;
- wallet;
- ticket resale;
- global VIP implementation.

---

## Recommended implementation slice

1. Add highest-priority Private Demand Network founder amendment.
2. Add V2 product strategy covering Creator Worlds, community, privacy, VIP and future IRL.
3. Evolve the existing DEV-only Demand Marketplace Lab rather than creating a second competing lab.
4. Broaden seeded demand into digital product + membership + collaboration + physical examples.
5. Add PLEDGE as a separate state from COMMIT.
6. Add privacy mode.
7. Add minimal World opportunity section.
8. Add `MY HISTORY` local retention proof.
9. Strengthen contract smoke.
10. Preserve production fail-closed behavior.

---

## Product test after this slice

A first-time user should understand:

> **I can say what I want, even if it does not exist yet. Other people can join. When enough real demand forms, Mara can make it happen.**

A Creator should understand:

> **My World shows me what my community already wants, instead of forcing me to guess what to produce.**

The founder should be able to evaluate the thesis without operating a real event marketplace.

---

## Hard strategic constraint

If the next feature does not materially improve **DEMAND, FULFILLMENT, RETENTION or GMV**, it should remain outside MVP.

**NO MERGE unless Ignacio explicitly writes `mergea`.**
