# Mara Vera — Private Alpha Signal Scorecard

## Purpose

This is the founder decision sheet for a **small 20–50 adult Private Alpha**. It converts Mara's privacy-safe first-party telemetry plus a tiny manual invite roster into a launch decision.

It is deliberately not a growth dashboard and must not be used to pretend event counts are unique-user retention.

## Evidence boundary

`MARA_TELEMETRY` is intentionally anonymous. Therefore runtime logs can answer questions such as:

- which events are happening;
- which acquisition sources produce activity;
- whether users progress through the ritual / Private Moment / offer sequence;
- whether people continue after declining an offer;
- whether checkout intent appears.

Runtime event aggregates **cannot** prove:

- unique users;
- true D1 / D3 / D7 retention;
- cohort retention;
- churn;
- LTV;
- per-user purchase propensity.

Do not add user IDs, emails, conversation text, fantasies, inferred arousal, loneliness, dependency or vulnerability to telemetry just to make this scorecard easier.

## Two evidence layers

### A. Anonymous product telemetry

Generate with:

```bash
node web/scripts/alpha-signal-report.mjs mara-runtime.log
```

This is the product-behaviour layer.

### B. Manual invited-cohort roster

For the first 20–50 adults, the founder may keep a **separate minimal operational roster** outside `MARA_TELEMETRY` with only:

- alpha participant code (`A01`, `A02`, ...);
- invite date;
- activated? yes/no;
- returned by Day 1 / Day 3 / Day 7? yes/no;
- reached second Private Moment? yes/no;
- saw a commercial offer? yes/no;
- started checkout? yes/no;
- optional one-line product feedback that is not intimate content.

Do **not** store fantasies, sexual conversation, psychological labels or vulnerability notes in this roster.

This manual roster is acceptable for a tiny alpha and is preferred over prematurely building identity-linked analytics.

---

# Day 1 — Does Mara produce a meaningful first experience?

Review:

- `launch_experience_started`
- `launch_session_completed`
- `ritual_viewed`
- `ritual_completed`
- `ritual_skipped`
- `experience_started` segmented by surface;
- `experience_completed` segmented by surface;
- `preference_selected`
- signup events.

`ritual_completed` is the meaningful ritual participation event. Do not treat ritual exposure as user intent.

Questions:

1. Are qualified visitors entering the experience?
2. Are they completing the first meaningful interaction?
3. Do they understand the ritual without explanation?
4. Do explicit Private Moments start and complete?
5. Is the preference choice understandable?
6. Are obvious UX/error-state failures appearing?

### Day 1 decision

**GO** — people progress naturally through the core flow and no severe usability issue dominates.

**FIX** — people enter but repeatedly stall at the same point; repair that point before adding product surface.

**STOP / rethink entry** — people consistently do not understand or value the core experience after obvious usability issues are removed.

No revenue conclusion on Day 1.

---

# Day 3 — Does continuity create a reason to return?

Use the manual invited-cohort roster for actual returns. Use anonymous telemetry only as supporting product evidence.

Review:

- `returning_user`
- `launch_return_continued`
- return-count buckets;
- return-latency buckets;
- repeat Private Moment activity;
- `preference_selected` relative to repeated Private Moment starts (a remembered preference should reduce redundant selection later).

Questions:

1. Did any activated participants return without being chased manually?
2. Did Mara visibly remember something factual?
3. Did the second interaction feel different because of memory?
4. Are people reaching a second Private Moment?
5. Do users describe Mara as a continuing character rather than a one-shot demo?

### Day 3 decision

**GO** — clear voluntary return signal plus successful continuity callbacks.

**FIX MEMORY/PACING** — first experience is liked but continuity is weak or repetitive.

**STOP adding features** — if nobody wants to return, do not respond by building World/voice/extra categories blindly. Fix the core relationship loop first.

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
- `commerce_entitlement_unlocked` when real payments eventually exist.

Questions:

1. Are some users still returning after a week?
2. Does Mara preserve the relationship when an offer is declined?
3. Do offers appear only after enough context rather than on every high-interest moment?
4. Does anyone voluntarily start checkout?
5. Is the offer itself wrong, or is the product relationship too weak to support payment?

### Day 7 decision

**GO TO FIRST-REVENUE WORK** when:

- there is real voluntary return from the invited cohort;
- continuity is perceptible;
- at least some users reach repeat/private depth;
- commercial offers do not destroy continuation;
- there is credible willingness-to-pay signal.

**FIX OFFER** when people return and deepen the relationship but consistently reject the current concrete unlock.

**FIX PRODUCT** when checkout intent is absent because people are not returning or reaching relationship depth.

Do not solve weak retention by increasing offer frequency.

---

# Launch-critical directional ratios

The report prints these as **event ratios only**:

- completion events / launch start events;
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

They are useful for detecting broken stages and major directional changes. They are **not unique-user conversion rates**.

---

# Private Alpha founder readout

At each checkpoint, write only:

## Cohort
- invited:
- activated:
- D1 returned:
- D3 returned:
- D7 returned:
- second Private Moment reached:
- offer seen:
- checkout started:

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

Do not optimize the scorecard to make Mara look successful.

Use it to find the truth quickly.