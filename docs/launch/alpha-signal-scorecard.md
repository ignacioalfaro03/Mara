# Mara Vera — Private Alpha Signal Scorecard

## Purpose

This is the founder decision sheet for a **small 20–50 adult Private Alpha**. It converts Mara's privacy-safe first-party telemetry plus a tiny manual invite roster into a launch decision.

It is deliberately not a growth dashboard and must not be used to pretend event counts are unique-user retention.

## Evidence boundary

`MARA_TELEMETRY` is intentionally anonymous. Runtime logs can answer which public entry surfaces produce action, whether users progress through the ritual / Private Moment / offer sequence, whether people continue after declining an offer, and whether checkout intent appears.

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
- `experience_started` segmented by surface;
- `experience_completed` segmented by surface;
- `preference_selected`;
- signup events.

There is deliberately **no synthetic `launch_session_completed` KPI**. The current product already has concrete behavioral completions (`ritual_completed`, surface-segmented `experience_completed`), so manufacturing or preserving an obsolete aggregate would add noise.

Questions:
1. Are qualified visitors choosing to enter after seeing the truthful product promise?
2. Do they complete a real first interaction?
3. Do they understand the ritual without explanation?
4. Do explicit Private Moments start and complete?
5. Is the preference choice understandable?
6. Are obvious UX/error-state failures appearing?

### Day 1 decision

**GO** — people progress naturally through the core flow and no severe usability issue dominates.

**FIX ENTRY** — people see Home/Meet Mara but do not enter.

**FIX CORE FLOW** — people enter but repeatedly stall at the same DM stage.

**STOP / rethink entry** — people consistently do not understand or value the core experience after usability issues are removed.

No revenue conclusion on Day 1.

---

# Day 3 — Does continuity create a reason to return?

Use the manual roster for actual returns and anonymous telemetry only as supporting product evidence.

Review:
- `returning_user`;
- `launch_return_continued`;
- return-count buckets;
- return-latency buckets;
- repeat Private Moment activity;
- `preference_selected` relative to repeated Private Moment starts.

Questions:
1. Did activated participants return without being chased manually?
2. Did Mara visibly remember something factual?
3. Did the second interaction change because of memory?
4. Are people reaching a second Private Moment?
5. Do users perceive a continuing character rather than a one-shot demo?

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

> **Do adults enter Mara, feel continuity, voluntarily return, deepen the relationship and eventually show willingness to pay?**

Do not optimize the scorecard to make Mara look successful. Use it to find the truth quickly.
