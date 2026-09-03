# Mara Vera — Public Alpha Measurement Contract

## Purpose

Measure whether the free public Alpha creates voluntary return behavior without introducing an account system, persistent analytics identifier, sensitive-profile store or paid analytics dependency before traction exists.

Primary question:

> **DO PEOPLE VOLUNTARILY COME BACK TO MARA?**

This Alpha deliberately optimizes for a trustworthy directional answer before a full retention stack.

## Privacy posture

Public Alpha telemetry does not send:
- email;
- name;
- account ID;
- random persistent UUID;
- fingerprint;
- IP-derived identity;
- conversation text;
- intimate free text;
- fantasies;
- sexual history;
- porn URLs;
- payment data;
- salary/debt/bank data;
- inferred loneliness, distress, dependency or arousal state.

The browser keeps only the minimum first-party local state needed for Mara's continuity.

For return measurement, the server receives only coarse non-identifying buckets derived locally:
- `return_count_bucket`: `1`, `2`, `3-4`, `5+`;
- `days_since_first_bucket`: `same_day`, `1-2d`, `3-7d`, `8+d`, `unknown`.

The underlying local `firstSeenAt` timestamp is not transmitted as a telemetry property.

## What the return events mean

### `returning_user`

Emitted when a browser with a previously completed local Mara Alpha state opens `/experience` again.

This is evidence that a previously completed browser state came back.

It is **not** proof of a unique human user because there is intentionally no cross-event identifier.

### `launch_return_continued`

Emitted when the returning browser chooses to continue the relationship beat rather than merely landing on the return screen.

This is the stronger early engagement signal.

### Buckets

`return_count_bucket` describes the local depth of return activity for that browser state.

`days_since_first_bucket` describes the coarse elapsed-time band since the local Alpha state was first completed.

Both are intentionally lossy.

## Metrics we may report

Safe directional metrics:
- Alpha experience starts;
- Alpha session completions;
- returning-browser-state events;
- engaged return continuations;
- prediction hit/miss event counts;
- return-depth distribution by bucket;
- return-latency distribution by bucket;
- ratio of `launch_return_continued` events to `returning_user` events for the same aggregate observation window;
- social/profile acquisition event counts where instrumented.

Example language:

> "We observed 18 engaged return continuations, including 5 events from browser states already in the `3-4` return bucket."

## Metrics we must NOT claim from this Alpha telemetry

Do not call the current data:
- unique users;
- DAU/WAU/MAU;
- D1/D7/D30 retention;
- cohort retention;
- user-level LTV;
- payer retention;
- churn;
- per-user frequency;
- unique conversion rate.

Those require a defensible denominator and identity/cohort mechanism that this privacy-minimal Alpha intentionally does not have.

A count of `returning_user` events is not equivalent to a count of unique people who returned.

## Reading production telemetry

The first-party endpoint emits one structured server log line per accepted event:

`MARA_TELEMETRY {json}`

The JSON contains only:
- event name;
- allowlisted sanitized properties;
- event timestamp.

Once production runtime-log access exists, filter/search for `MARA_TELEMETRY` and aggregate the accepted event records.

Do not export or enrich those logs with fingerprinting or unrelated personal data just to manufacture a unique-user metric.

## First launch decision table

### Weak signal
- people start but rarely complete;
- almost no `returning_user` events;
- almost no `launch_return_continued` events.

Interpretation:
Mara may create curiosity but not enough unfinished relationship value.

Action:
fix first-session character value / open loop before monetization complexity.

### Interesting signal
- meaningful completions;
- recurring `returning_user` activity;
- some `launch_return_continued` events outside `same_day`;
- some browser states reach `2` or `3-4` return buckets.

Interpretation:
continuity may be creating voluntary pull.

Action:
improve Relationship Engine fidelity, voice quality and return variety before buying growth infrastructure.

### Strong early signal
- repeated engaged returns across several latency/depth buckets;
- organic acquisition keeps feeding starts;
- users voluntarily reference Mara's personality/continuity in feedback;
- product pull persists without payment pressure.

Interpretation:
there is evidence worth investing in stronger identity-safe measurement and deeper infrastructure.

Action:
propose the next measurement layer separately, including privacy purpose, retention policy, consent/disclosure and exact decision it enables.

## Gate for adding an anonymous identifier later

Do not add a persistent analytics UUID merely because it is technically easy.

Add one only when:
1. return signal is strong enough that unique/cohort retention will materially change a decision;
2. purpose is documented;
3. privacy disclosure is updated;
4. retention/deletion rules are defined;
5. sensitive adult preference data remains separated;
6. the identifier is not used for vulnerability targeting or hidden pricing;
7. the additional measurement value justifies the extra privacy surface.

Until then:

> **COARSE TRUTH > PRECISE-LOOKING SURVEILLANCE.**
