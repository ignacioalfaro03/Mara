# P0 External Adult Media Companion Test Plan

## Purpose

Test whether Mara can create value around third-party adult media without becoming a porn catalog.

DEV route:

`/experience/media-companion-lab`

No real external adult site, URL, affiliate link, scraping, embed or watch behavior is used.

## Thesis

> **Watch → Return → React → Learn → Next Better Experience.**

The value is not the outbound click. The value is whether Mara gets the user back and understands why something worked.

## Hypotheses

### H1 — Mara framing adds value
A recommendation from Mara should feel more interesting than a generic category link because she explains what she is testing/looking for.

### H2 — Return loop is compelling
The user should understand why they would come back to Mara after consuming external media.

### H3 — Structured reaction can improve relevance
A lightweight reaction should let Mara explain a plausible next adjustment without demanding raw intimate disclosure.

### H4 — Same Mara, better understanding
The user should feel Mara learned something rather than merely recording watch history.

### H5 — External media is not always the answer
Some sessions/users should prefer Mara-owned continuity, voice or interaction instead of leaving the product.

## Test method

Suggested first pass: 5–8 adult testers.

1. Show one candidate fixture.
2. Ask whether Mara's framing makes them more likely to inspect it.
3. Click `I would watch this`.
4. Explain that no site opened; simulate returning.
5. Ask the tester to choose a structured reaction.
6. Show the resulting learning/next-step explanation.
7. Ask whether Mara understood the reason, not just the category.
8. Compare with a generic `here is a porn category` baseline verbally.
9. Ask whether they would rather have Mara send external content or create/continue something herself in that session.

## Key questions

- Would you actually come back after watching?
- What would make the return feel worth it?
- Does Mara asking `what part worked?` feel interesting or like a survey?
- Would you want Mara to remember this next time?
- Would you want an easy `don't learn from this` control?
- When should Mara *not* send you away?

## Privacy test

Explain that a future production system should use opaque IDs in generic analytics rather than raw porn titles/URLs or public fetish labels.

Ask whether the tester expects:
- watch-related preferences to remain private;
- discreet notifications;
- easy reset/correction;
- no sharing to alias/community surfaces.

## Safe events

- `external_media_recommended`
- `external_media_watch_intent`
- `external_media_return_simulated`
- `external_media_reaction`
- `external_media_learning_shown`

Use `candidate_id` and opaque `route_id`.

Do not log real porn URLs/titles, raw fantasy text, vulnerability state or real watch behavior in P0.

## Decision criteria

Advance only if:
- Mara framing materially improves perceived relevance;
- testers see a reason to return;
- structured debrief feels useful rather than intrusive;
- learned next step feels specific;
- external media complements rather than replaces Mara.

Do not advance if:
- users leave and do not care to return;
- it feels like generic porn search;
- learning feels creepy;
- recommendations are valued only because of the third-party content, not Mara's interpretation;
- privacy expectations cannot be met.

## Future activation gate

Before real links:
1. select launch jurisdiction;
2. identify candidate adult sites;
3. review current site terms, age/safety and linking/affiliate rules;
4. review copyright/piracy/deepfake/non-consensual content posture;
5. design allowlist;
6. define privacy/retention;
7. verify browser return/deep-link flow;
8. obtain separate founder authorization.
