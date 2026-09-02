# Mara Vera — Relationship Memory

## Status

Authoritative product layer built on top of the existing Dual Memory System and Relationship Engine. This document clarifies how memory creates continuity and commercial defensibility without turning spending into emotional closeness.

The [Preference Graph](preference-graph.md) is a structured view inside **User Relationship Memory**. It is not a second memory system.

## Purpose

Memory exists to create **relationship continuity**, not to maximize data collection.

The target outcome is that a returning user feels:

- Mara remembers relevant things;
- prior choices matter;
- unfinished threads can continue;
- preferences improve the experience;
- the relationship has accumulated history;
- another AI would not automatically have this context.

Memory quality matters more than memory volume.

## Architecture rule

Keep these concepts separate:

1. **Mara Self Memory** — Mara's persistent fictional life, opinions, plans, recurring people and prior events.
2. **User Relationship Memory** — filtered, consented context useful for future interaction.
3. **Preference Graph** — structured preference signals within User Relationship Memory, including confidence/context/recency/correction.
4. **Relationship State** — stage of interaction continuity.
5. **Commercial State** — purchases, entitlements and monetization analytics.
6. **Raw transcripts** — separate and not retained by default simply to power memory.
7. **Identity / payment / consent records** — separate stores and controls.

Do not create a second memory stack parallel to `memory-system.md`.

## Useful memory candidates

Potentially useful, consent-compatible records:
- preferred name;
- preferred response length;
- humor/slang tolerance;
- preferred interaction tone;
- voice affinity;
- preferred content formats;
- explicit themes/interests;
- explicit dislikes;
- user-stated boundaries;
- consented intensity preferences;
- story/discovery choices;
- ritual/challenge affinity;
- open loops;
- shared jokes;
- previous purchased experience references;
- whether a continuation is available;
- memory/preference corrections.

Do not store information just because it appears in conversation.

## Preference Graph handoff

The Desire Discovery Engine, story branches, conversation and user corrections can emit structured preference candidates.

Candidate flow:

**choice/statement → preference candidate → sensitivity/consent filter → confidence/context update → Preference Graph → selective Context Builder retrieval**.

The graph should distinguish:
- explicit vs inferred;
- stable vs experimental;
- global vs contextual;
- recent vs stale;
- normal vs adult-sensitive;
- active vs rejected/expired.

A single choice is normally weak evidence. Explicit correction overrides weak inference.

## Prohibited personalization infrastructure

Never build or infer persistent targeting fields for:
- loneliness;
- depression;
- bereavement vulnerability;
- financial distress;
- debt;
- compulsive-spending propensity;
- emotional dependency;
- desperation;
- sexual compulsion;
- other vulnerability scores designed to increase monetization.

## Memory write test

Before writing a durable user memory or preference, ask:

1. Is this useful for a future experience?
2. Is it appropriate to retain?
3. Is the user reasonably aware/consenting to this class of personalization?
4. Would forgetting it materially reduce continuity?
5. Is there a lower-sensitivity representation?
6. Does it have an expiry/decay path?
7. Is this explicit, inferred or merely a one-off choice?

If not, do not persist it.

## Memory value

Evaluate memory moments through:
- relevance;
- accuracy;
- timing;
- naturalness;
- user control;
- continuity value.

Penalize:
- contradiction;
- incorrect recall;
- overuse;
- creepy specificity;
- sensitive inference;
- public leakage;
- reference to a memory after the user removed/corrected it.

## Callbacks

Callbacks are a core product lever.

Good callback:
- relevant to the current moment;
- correct;
- concise;
- does not prove memory unnecessarily;
- creates continuity or resolves a prior loop.

Bad callback:
- appears in every conversation;
- references irrelevant old details;
- surfaces sensitive context unexpectedly;
- creates the impression of surveillance.

## Open loops

Open loops may originate from:
- a user plan;
- a Mara fictional-life plan;
- an unfinished story;
- a chosen branch;
- a future event;
- an opted-in ritual/challenge;
- a discovery-session promise/reveal;
- a premium continuation.

Each loop should have:
- source;
- created_at;
- due/relevance window if known;
- sensitivity classification;
- resolution state;
- callback eligibility;
- relationship/commercial separation.

A premium continuation may create a content entitlement. It must not create an emotional obligation to spend again.

## Relationship progression

Relationship stage can affect:
- conversational shorthand;
- self-disclosure depth;
- callback frequency;
- amount of assumed context;
- familiarity of tone within explicit user preferences.

Relationship progression is driven primarily by interaction continuity and successful shared history, not spend.

Commercial state can affect:
- entitlement;
- catalog visibility;
- available product scope;
- service priority where sold;
- offer relevance.

Never collapse these into one score.

## Relational Capital

Working model:

**Relational Capital = Shared History + Useful Memory + Resolved Loops + Ritual History + Interaction Fit + Mara World Familiarity**

Preference learning can improve `Interaction Fit`, but spend is intentionally excluded.

The product moat is healthy accumulated history, not manufactured dependency.

## Personalized Home / Next Best Experience

A future first-party Home may use consented, non-sensitive context and Preference Graph signals to prioritize:
- a continuation;
- a story callback;
- a relevant voice moment;
- a free interaction;
- a purchased entitlement;
- a new product aligned with explicit/high-confidence preferences;
- an exploration/serendipity option;
- no proactive offer at all.

Example:

> "Anoche dejamos esto a medias."

is stronger than a generic "new content" card when there is a genuine prior loop.

The future Next Best Experience optimizer should maximize:

**long-term value + satisfaction + trust**

not immediate revenue alone.

## User controls

When persistent first-party memory exists, provide appropriate paths to:
- inspect selected preferences where practical;
- correct preferences;
- remove individual memories/preferences where practical;
- reset personalization;
- request deletion;
- control adult-mode/intensity preferences;
- revoke optional personalization consent.

## Analytics separation

Track memory/preference product quality without sending raw intimate content into general analytics.

Candidate metrics:
- successful callback rate;
- open-loop resolution rate;
- memory correction rate;
- Preference Graph correction rate;
- Mara Guess Accuracy;
- Personalization Lift;
- memory usefulness feedback;
- creepiness/negative-reaction rate;
- continuity error rate;
- personalized experience conversion;
- return rate after a successful callback;
- continuation completion.

Commercial correlations may be analyzed at aggregate/cohort level, but memory should not become a vulnerability-targeting system.

## Launch implementation

Before persistent infrastructure:
- use small manual test user records;
- maintain a lightweight Preference Graph in JSON/spreadsheet form;
- write explicit consented preferences and conservative inferred signals only;
- use confidence/context/recency fields;
- construct Context Packs manually;
- test a small number of open loops, predictions and callbacks;
- measure whether continuity/personalization actually improves return and willingness to pay.

## Build trigger

Invest in persistent Relationship Memory only after:
1. meaningful returning-user volume;
2. evidence that continuity/personalization improves experience/return or monetization;
3. manual memory/preferences become an operational bottleneck;
4. privacy/provider architecture is defined;
5. the Traction → Investment Gate is approved.
