# Mara Vera — Private Alpha Signal Scorecard

## Purpose

This is the founder decision sheet for a **small 20–50 adult Private Alpha**. It converts Mara's privacy-safe first-party telemetry plus a tiny manual invite roster into a launch decision.

It is deliberately not a growth dashboard and must not be used to pretend event counts are unique-user retention.

## Evidence boundary

`MARA_TELEMETRY` is intentionally anonymous. Runtime logs can answer which public entry surfaces produce action, whether users progress through the ritual / continuity / Private Moment / offer sequence, whether people continue after declining an offer, and whether checkout intent appears.

Runtime event aggregates **cannot** prove unique users, true D1 / D3 / D7 retention, cohort retention, churn, LTV or per-user purchase propensity.

Do not add user IDs, emails, conversation text, fantasies, inferred arousal, loneliness, dependency or vulnerability just to make this scorecard easier.

## Telemetry purpose rule

Every public event must satisfy:

> **event → active product producer → report → founder decision**

If any link is missing, the event does not belong in public launch telemetry. Historical/dev-lab event names may remain available inside development without being accepted by `/api/telemetry`.

## Two evidence layers

### A. Anonymous product telemetry

Generate with:

```bash
node web/scripts/alpha-signal-report.mjs mara-runtime.log
```

### B. Manual invited-cohort roster

For the first 20–50 adults, keep a separate minimal roster outside `MARA_TELEMETRY` with only:

- participant code (`A01`, `A02`, ...);
- invite date;
- activated? yes/no;
- account created after first value? yes/no;
- returned by Day 1 / Day 3 / Day 7? yes/no;
- reached second Private Moment? yes/no;
- saw a commercial offer? yes/no;
- started checkout? yes/no;
- optional one-line non-intimate product feedback.

Do not store fantasies, sexual conversation, psychological labels or vulnerability notes in this roster.

---

# Public surface jobs

## Home

**Job:** turn qualified curiosity into DM entry with a promise the DM actually fulfills.

Review:
- `landing_view`;
- `hero_cta_click` with `surface=home`;
- `home_cta_clicks_per_landing_view`.

If visitors see Home but do not choose the DM, fix the entry promise/CTA before adding more product or lore.

## Meet Mara

**Job:** convert the visitor who wants context before entering, using only behavior Mara can actually prove.

Review:
- `page_view` with `surface=/meet-mara`;
- `hero_cta_click` with `surface=meet_mara`;
- `meet_mara_cta_clicks_per_view`.

If `/meet-mara` gets real alpha traffic but does not contribute to DM entry, remove the route rather than expanding it.

## Premium

There is no active public Premium job in the current Alpha. `/premium` is intentionally parked/404. Paid value currently appears only as a concrete contextual entitlement inside the DM.

---

# Day 1 — Does Mara produce a meaningful first experience?

Review:
- public-surface ratios above;
- `launch_experience_started` as entry evidence only;
- `ritual_viewed`;
- `ritual_completed`;
- `ritual_skipped`;
- `hero_cta_click` with `surface=dm_continuity`;
- `continuity_cta_clicks_per_ritual_completion`;
- `experience_started` segmented by surface;
- `experience_completed` segmented by surface;
- `preference_selected`;
- signup events.

There is deliberately **no synthetic `launch_session_completed` KPI**. The current product already has concrete behavioral completions (`ritual_completed`, surface-segmented `experience_completed`), so manufacturing or preserving an obsolete aggregate would add noise.

The continuity CTA is deliberately post-value. A user must be able to receive Mara's first meaningful interaction without creating an account. After explicit ritual completion, Mara may ask whether the user wants that history preserved across devices. Ignoring or declining must not block anything.

Questions:
1. Are qualified visitors choosing to enter after seeing the truthful product promise?
2. Do they complete a real first interaction?
3. After receiving value, do some voluntarily choose account-backed continuity?
4. Do they understand the ritual without explanation?
5. Do explicit Private Moments start and complete?
6. Is the preference choice understandable?
7. Are obvious UX/error-state failures appearing?

### Day 1 decision

**GO** — people progress naturally through the core flow and at least some users voluntarily choose continuity after value.

**FIX ENTRY** — people see Home/Meet Mara but do not enter.

**FIX CONTINUITY CTA** — people complete the ritual but the post-value account invitation is consistently ignored or misunderstood. Revise or remove the prompt; do not move registration earlier.

**FIX CORE FLOW** — people enter but repeatedly stall at the same DM stage.

**STOP / rethink entry** — people consistently do not understand or value the core experience after usability issues are removed.

No revenue conclusion on Day 1.

---

# Day 3 — Does continuity create a reason to return?

Use the manual roster for actual returns and anonymous telemetry only as supporting product evidence.

Review:
- account-created-after-value status in the invited roster;
- `returning_user`;
- `launch_return_continued`;
- return-count buckets;
- return-latency buckets;
- repeat Private Moment activity;
- `preference_selected` relative to repeated Private Moment starts.

Questions:
1. Did activated participants return without being chased manually?
2. Did account-backed users visibly recover factual continuity on another device/session?
3. Did Mara visibly remember something factual?
4. Did the second interaction change because of memory?
5. Are people reaching a second Private Moment?
6. Do users perceive a continuing character rather than a one-shot demo?

### Day 3 decision

**GO** — clear voluntary return plus successful continuity callbacks.

**FIX MEMORY/PACING** — first experience is liked but continuity is weak or repetitive.

**STOP adding features** — if nobody wants to return, fix the relationship loop before World/voice/extra categories.

---

# Day 7 — Is there a credible business loop?

Review:
- manual D7 return status;
- second Private Moment reach;
- `commerce_offer_viewed`;
- `commercial_offer_dismissed`;
- `commercial_post_offer_continued`;
- `commerce_checkout_started`;
- `commerce_checkout_blocked`;
- `commerce_checkout_returned`;
- `commerce_entitlement_unlocked` when real payments exist.

Questions:
1. Are some users still returning after a week?
2. Does Mara preserve the relationship when an offer is declined?
3. Do offers appear only after enough context?
4. Does anyone voluntarily start checkout?
5. Is the offer wrong, or is relationship depth too weak to support payment?

### Day 7 decision

**GO TO FIRST-REVENUE WORK** when there is real voluntary return, perceptible continuity, repeat/private depth, relationship preservation after offers, and credible willingness-to-pay signal.

**FIX OFFER** when people return and deepen the relationship but consistently reject the current concrete unlock.

**FIX PRODUCT** when checkout intent is absent because people are not returning or reaching relationship depth.

Do not solve weak retention by increasing offer frequency.

---

# Launch-critical directional ratios

The report prints these as **event ratios only**:

- Home CTA clicks / landing views;
- Meet Mara CTA clicks / Meet Mara page views;
- ritual completions / ritual views;
- ritual skips / ritual views;
- continuity CTA clicks / ritual completions;
- Private Moment completions / Private Moment starts;
- explicit preference selections / Private Moment starts;
- signup completions / signup starts;
- return continuations / return events;
- offer dismissals / offer views;
- post-offer continuations / offer dismissals;
- checkout starts / offer views;
- checkout blocks / checkout starts;
- entitlements / checkout starts.

They detect broken stages and directional change. They are **not unique-user conversion rates**.

---

# Private Alpha founder readout

## Cohort
- invited:
- activated:
- account created after first value:
- D1 returned:
- D3 returned:
- D7 returned:
- second Private Moment reached:
- offer seen:
- checkout started:

## Public entry
- Home CTA directional ratio:
- Meet Mara CTA directional ratio:
- keep / fix / remove Meet Mara:

## Continuity activation
- continuity CTA clicks / ritual completions:
- account creation understood or confusing:
- keep / revise / remove continuity prompt:

## Strongest signal
One sentence.

## Biggest failure
One sentence.

## Decision
`GO` / `FIX` / `STOP`

## Next single intervention
One product change only.

---

# Doctrine

The Private Alpha exists to answer:

> **Do adults enter Mara, receive value before registration, choose continuity voluntarily, return, deepen the relationship and eventually show willingness to pay?**

Do not optimize the scorecard to make Mara look successful. Use it to find the truth quickly.