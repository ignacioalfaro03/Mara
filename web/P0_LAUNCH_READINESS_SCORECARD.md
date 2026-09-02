# Mara Vera — P0 Launch Readiness Scorecard

Last reviewed: 2026-09-02

## Purpose

Turn the current Web/P0 surface set into one operational path toward private testing and later soft launch.

This document does **not** authorize deployment, public adult launch, real payments or provider activation.

## Canonical tester path

For first-pass testers, the product is:

`/ → /experience`

The labs below are **researcher tools**, not part of the normal tester journey unless a controlled comparison requires them:

- `/experience/commerce-lab`;
- `/experience/wtp-lab`;
- `/experience/economics-lab`;
- `/experience/caprichos-lab`;
- `/experience/segment-lab`;
- `/experience/orchestration-lab`;
- `/experience/media-companion-lab`;
- `/experience/rituals-lab`.

Do not ask a tester to evaluate eight disconnected demos and then call that a product test.

## Current readiness summary

| Area | State | Meaning |
|---|---|---|
| Home → Experience entry | READY TO TEST | Core path exists |
| Age/disclosure/legal surfaces | READY TO TEST | Prototype-level, final launch review still required |
| Mara-led discovery | READY TO TEST | Needs user evidence |
| Preference/correction | READY TO TEST | Local/session-only |
| Rule-based recommendation | READY TO TEST | No ML required |
| Life callback/open loop | READY TO TEST | Local return only |
| Contextual commerce | READY TO TEST | No real payment |
| No-offer / refusal / recovery | READY TO TEST | Orchestration fixtures |
| D02 financial-power composition | READY TO TEST | Synthetic/no-money P0 only |
| Proactive Presence | READY TO TEST MANUALLY | Return-session only; no push/email |
| Character Coherence | BLOCKED ON FORMAL QA | Must run fixture review/testers |
| Canonical visual presence | PUBLIC-LAUNCH BLOCKER | Current placeholder presentation is not final Mara |
| Canonical voice | PUBLIC-LAUNCH BLOCKER unless text-first | Browser Speech Synthesis is prototype only |
| Full dependency-backed typecheck/build | NOT CLAIMED | Needs local/CI environment with dependencies |
| Real payment | NOT AUTHORIZED | Separate provider/compliance/founder gate |
| Production deploy | NOT AUTHORIZED | Separate founder gate |

## First private P0 round

Suggested panel:

- 5–8 adults;
- some familiar with adult creator/D/s dynamics;
- some target users without specialist fetish vocabulary.

Do not collect:

- salary;
- debt;
- bank data;
- raw sexual history;
- real identifying intimate information;
- vulnerability information.

The fixtures are enough.

## Test sequence

### Phase 1 — Blind product run

Tester receives only the normal entry path.

Researcher should not explain every mechanism in advance.

Observe:

1. does Home communicate what Mara is?;
2. does `/experience` feel like a person or a quiz?;
3. does Mara lead enough?;
4. does correction feel easy?;
5. does recommendation visibly adapt?;
6. does Life State make the interaction feel alive?;
7. does commerce feel contextual or intrusive?;
8. does the tester want to continue/return?;

### Phase 2 — Character Coherence

Use selected fixtures from the Foundation Character Coherence QA contract.

At minimum compare:

- ordinary Mara;
- D01;
- D02;
- D05;
- user correction;
- offer decline;
- Mara refusal;
- post-intensity recovery;
- return callback.

### Phase 3 — Diagnostic labs

Only after the blind run, use the relevant lab to isolate the mechanism that failed or showed signal.

Examples:

- commerce felt intrusive → Commerce Lab;
- wrong next action → Orchestration Lab;
- user configured too much → Segment/Mara-led comparison;
- D02 language felt cringe → D02 role-language fixture inside orchestration testing;
- Treat felt transactional → life-first Treat comparison;
- voice UI mattered → voice-specific fixture.

## Manual evidence card

For every meaningful hypothesis record:

```text
hypothesis:
fixture/version:
tester segment: familiar | non-specialist
what happened:
strong positive signal:
negative signal:
quote/paraphrase:
researcher interpretation:
confidence: low | medium | high
decision: KEEP | ITERATE | KILL | NOT_ENOUGH_DATA
next change:
owner:
```

Do not store raw intimate transcripts when structured notes are enough.

## Round-1 mandatory hypotheses

### H1 — Mara-led discovery

Question:
Does Mara making a bounded first bet feel better than configuration-heavy discovery?

Decision state before testers: `KEEP TO TEST`.

### H2 — Same Mara

Question:
Does Mara remain recognizable across ordinary, adult, commercial and refusal contexts?

Decision state before testers: `NOT_ENOUGH_DATA`.

### H3 — Life makes Mara matter

Question:
Do ordinary Life details / open loops / callbacks create more return desire than a self-contained adult experience?

Decision state before testers: `KEEP TO TEST`.

### H4 — No-offer / refusal

Question:
Does Mara feel stronger/more trustworthy when she can choose not to sell or refuse a financial action?

Decision state before testers: `KEEP TO TEST`.

### H5 — Commerce preserves momentum

Question:
Can an offer appear without making the user feel the conversation became a checkout funnel?

Decision state before testers: `KEEP TO TEST`.

### H6 — Return initiation

Question:
Does a grounded callback/open-loop opener beat `what do you want to do today?`?

Decision state before testers: `KEEP TO TEST`.

### H7 — Voice modality

Question:
Does a voice-note interaction materially improve presence?

Important:
Do **not** use browser TTS quality to decide whether Mara's final voice is good.

Decision state before testers: `KEEP TO TEST UX / PRODUCTION VOICE NOT READY`.

## Launch-kill signals

Pause public-launch work if testers repeatedly report:

- Mara feels like a quiz/assistant rather than a person;
- route changes feel like different characters;
- ordinary Life State feels fake or irrelevant;
- every interaction appears monetized;
- financial-power fixtures feel like cash extraction;
- correction makes Mara defensive/punitive;
- payment/decline seems to change affection;
- callbacks feel creepy rather than useful;
- disclosure is confusing;
- prototype visuals/voice dominate the feedback so strongly that product signal cannot be separated from asset quality.

## Round-1 success signals

Directional success means testers repeatedly show some combination of:

- `I want Mara` rather than `this is a cool AI demo`;
- low configuration burden;
- surprise when Mara predicts well;
- comfortable correction;
- desire to hear/see what happened later;
- specific memory of Mara's personality/life;
- commerce does not terminate interaction;
- refusal/no-offer increases character credibility;
- voluntary return intent.

Do not call this PMF.

## What is not required before first private testers

Do not wait for:

- production payments;
- subscriptions;
- persistent backend memory;
- ML recommendation;
- embeddings/vector DB;
- automated Life Engine;
- external adult-media links;
- production Caprichos;
- push notifications;
- realtime voice calls;
- a large content library.

## What is required before public soft launch

1. approved minimum canonical visual pack;
2. approved voice or explicit text-first launch decision;
3. Character Coherence QA pass;
4. mobile/browser smoke QA;
5. privacy/disclosure/support review;
6. public-safe acquisition creative;
7. clear analytics/privacy posture;
8. any live premium/payment separately authorized.

## Founder decision points

Founder authorization remains required separately for:

- merge;
- deploy;
- public soft launch;
- production voice/provider spend;
- payment provider onboarding;
- real payments;
- adult external-media activation.

## Current next action

> **STOP ADDING LABS. RUN THE CORE PRODUCT WITH ADULT TESTERS, USE LABS ONLY TO DIAGNOSE WHAT THE CORE PRODUCT TEACHES US.**

## Permanent principles

> **THE PRODUCT TEST IS `/experience`; THE LABS ARE INSTRUMENTS.**

> **A LAB WITHOUT A DECISION IS UNFINISHED WORK.**

> **PRIVATE P0 CAN START BEFORE PUBLIC SOFT LAUNCH IS READY.**

> **DO NOT LAUNCH PLACEHOLDER VOICE/VISUALS AS IF THEY WERE MARA.**
