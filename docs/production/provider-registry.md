# Mara Vera — Provider Registry

Last reviewed: 2026-09-02

## Purpose

Maintain a replaceable, evidence-based view of the external AI providers that may support Mara Vera.

This is a benchmark registry, not a shopping list.

**Default financial rule: do not activate paid plans before the Traction → Investment Gate is satisfied and a specific bottleneck has been documented.**

Provider capabilities, free tiers, pricing and terms change quickly. Revalidate official sources immediately before any commercial activation.

## Evaluation dimensions

For every provider/model, score or document:

- use case;
- output quality;
- Mara identity consistency;
- world/video consistency;
- human-presence quality for voice;
- Spanish quality;
- latency where relevant;
- approval yield;
- API/automation availability;
- free-tier / trial availability;
- commercial-use rights;
- direct cost;
- vendor lock-in risk;
- last evaluated date.

## Current candidates

### Google — Nano Banana 2 / Nano Banana 2 Lite

**Category:** image generation and editing

**Why it matters:** Google's current Gemini image family emphasizes high-fidelity generation/editing, fast iteration and subject consistency. Nano Banana 2 Lite is positioned as the fastest and most cost-efficient option in the family.

**Mara use:** canonical-reference testing, edits, outfit/environment variations, high-volume iteration.

**Launch posture:** benchmark using free/available consumer or developer access only. Do not assume API use is free; verify account-level allowance before each test.

**Evidence:**
- https://deepmind.google/models/gemini-image/flash/
- https://deepmind.google/models/gemini-image/

### Google DeepMind — Veo 3.1

**Category:** generative video

**Why it matters:** supports reference images for scenes, characters and objects and explicitly targets cross-scene character consistency; current Veo generation also supports audio.

**Mara use:** premium lifestyle clips, motion tests, hero reels, continuity experiments.

**Launch posture:** benchmark only when free access/credits are available. Native generated audio must not redefine Mara's canonical voice.

**Evidence:**
- https://deepmind.google/models/veo/

### Higgsfield — Soul ID

**Category:** persistent character identity / image workflow

**Why it matters:** Soul ID is designed as a trained character-consistency layer. Higgsfield currently documents training one identity from 20+ photos and reusing that identity across Soul generations.

**Mara use:** test whether a canonical Mara reference pack can achieve stronger repeatability than prompt/reference-only workflows.

**Free posture:** Higgsfield documents a limited free tier. Use it for evaluation first. Soul generations may consume credits and model-specific restrictions apply.

**Lock-in note:** Soul ID is model-specific; do not let it become the only copy of Mara's identity.

**Evidence:**
- https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-create-and-use-a-soul-id-character
- https://higgsfield.ai/creator-hub/help-center/plans/how-do-higgsfield-plans-work

### ElevenLabs — Eleven v3

**Category:** pre-recorded text-to-speech

**Why it matters:** current v3 positioning emphasizes expressive delivery, emotional control and broad multilingual coverage.

**Mara use:** blind benchmark for scripted Reels, Stories, prepared voice notes and talking-video audio.

**Free posture:** current Free plan is $0 with 10k credits/month. Official pricing indicates commercial licensing is added at Starter, so free output should be treated as internal evaluation unless current terms explicitly permit the intended commercial use.

**Do not:** clone an identifiable real person's voice without rights.

**Evidence:**
- https://elevenlabs.io/pricing
- https://elevenlabs.io/pricing/api

### ElevenLabs — v3 Conversational / ElevenAgents

**Category:** low-latency conversational voice

**Why it matters:** v3 Conversational is positioned for lower-latency expressive realtime speech.

**Mara use:** future first-party relationship/voice benchmark, not launch dependency.

**Launch posture:** defer paid realtime use until traction. Internal free-tier evaluation is acceptable where terms allow.

**Evidence:**
- https://elevenlabs.io/pricing/api

### Hume — Octave 2

**Category:** expressive TTS

**Why it matters:** useful benchmark for emotionally controlled speech and voice-design workflows.

**Mara use:** direct blind comparison against ElevenLabs for Human Presence, emotional range and Spanish delivery.

**Free posture:** Hume currently lists a $0 Free tier with about 10 minutes of TTS/month. Commercial-use rights must be revalidated before publishing monetized output.

**Evidence:**
- https://www.hume.ai/pricing

### Hume — EVI

**Category:** speech-to-speech / realtime conversation

**Why it matters:** realtime emotional conversation is directly relevant to the post-validation Relationship Engine.

**Mara use:** future benchmark for interruption handling, emotional continuity and turn-taking.

**Free posture:** Hume currently includes a small amount of EVI usage on its Free tier. Treat this as prototype capacity, not production capacity.

**Evidence:**
- https://www.hume.ai/pricing

### OpenAI — GPT-Realtime-2

**Category:** realtime speech-to-speech reasoning and tool use

**Why it matters:** current OpenAI documentation positions GPT-Realtime-2 as its most capable realtime voice model, with speech-to-speech interaction, reasoning and stronger tool use.

**Mara use:** future first-party voice experience where conversation, tools and memory need to work together.

**Cost posture:** usage-based API. No recurring subscription is required to be architecturally compatible, but it is not a zero-cost production dependency. Do not activate paid usage before traction unless explicit founder approval is given for a bounded test.

**Current documented audio pricing:** $32 / 1M audio input tokens and $64 / 1M audio output tokens. Recheck before use.

**Evidence:**
- https://developers.openai.com/api/docs/models/gpt-realtime-2

### HeyGen — Avatar IV

**Category:** talking avatar / photo-to-video

**Why it matters:** useful for testing whether an approved Mara still + canonical audio can become a credible talking-head asset without full video generation.

**Mara use:** audio-first talking-video experiments.

**Free posture:** HeyGen currently advertises a $0 plan with 3 videos/month and access to Avatar IV, subject to current quotas/limitations. Watermark and commercial-use implications must be checked before publication.

**Evidence:**
- https://www.heygen.com/pricing
- https://help.heygen.com/en/articles/11269603-heygen-avatar-iv-complete-guide

### Runway — Gen-4 / Gen-4.5

**Category:** generative video

**Why it matters:** benchmark for controlled video generation and character/scene continuity.

**Mara use:** compare approval yield and controllability against Veo/Kling/Higgsfield when free credits or explicitly approved test budget exists.

**Launch posture:** not a default subscription. Runway's plan/credit structure changes over time; revalidate current plan availability before any activation.

**Evidence:**
- https://help.runwayml.com/hc/en-us/articles/21664961171475-Which-plan-is-right-for-me

## Provider-selection rule

A provider wins only when it improves Mara-specific economics or quality.

Decision hierarchy:

1. passes identity/voice quality gate;
2. has clear commercial rights;
3. materially improves Approval Yield or Human Presence;
4. reduces TPAA or unlocks a proven content format;
5. cost is justified by the Traction → Investment Gate;
6. implementation does not create unacceptable lock-in.

## Zero-cost shortlist for immediate internal benchmarking

Subject to account availability and current terms:

- Higgsfield free tier for identity experiments;
- ElevenLabs free tier for internal voice auditions;
- Hume free tier for internal TTS/realtime auditions;
- HeyGen free tier for limited talking-avatar experiments;
- Google consumer/developer free access where available for image tests.

Do not enter paid subscriptions simply to complete the benchmark.

## Deferred until traction or explicit bounded-test approval

- sustained OpenAI Realtime API usage;
- paid Veo generation;
- paid Runway plans;
- paid Higgsfield scale;
- paid HeyGen scale;
- paid ElevenLabs/Hume production tiers;
- any automation SaaS whose only benefit is convenience.

## Review cadence

Review this registry when any of the following occurs:

- a current provider materially changes pricing or terms;
- a new model could improve Mara's approval yield;
- a manual workflow becomes a measured bottleneck;
- the Traction → Investment Gate moves to GREEN;
- a commercial-rights question must be resolved before publication.

Do not chase every model release. Update the registry only when the change could alter a Mara decision.
