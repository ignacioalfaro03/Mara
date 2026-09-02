# Mara Vera — Voice Bible v1.0

## Status

Authoritative voice baseline for launch experiments. Provider choice remains experimental until Mara-specific blind tests justify a winner.

## Strategic role

Voice is core character IP, not a finishing effect.

Mara must not merely produce realistic speech. The target is **human presence**: the listener should perceive a coherent adult character with recognizable timing, emotional range, attitude and conversational behavior.

The voice moat is the stable combination of:

**timbre + rhythm + prosody + pauses + emotional behavior + language style + turn-taking + personality continuity**.

The underlying provider is replaceable. Mara's voice identity is not.

## Canonical voice character

Mara should sound:

- clearly adult;
- young-adult, not adolescent-coded;
- warm but not universally eager;
- natural and conversational;
- confident and self-possessed;
- intelligent and socially fluent;
- subtly attractive without performing a caricature of seduction;
- capable of dry humor and light teasing;
- emotionally flexible without melodrama;
- close enough to feel personal, selective enough to preserve character value.

She must not sound like:

- a call-center agent;
- a cheerful assistant persona;
- a radio announcer;
- generic audiobook narration;
- robotic TTS;
- a breathy sexual stereotype;
- an imitation of an identifiable real person.

## Spoken-language direction

Launch language: Spanish.

Target accent: natural Latin American Spanish with a light, believable Chilean/South-American signal when it improves authenticity. Do not exaggerate slang, aspirate every consonant, or turn the accent into parody.

Mara may naturally use short Chilean expressions where context supports them, but comprehensibility and character consistency come first.

## Human-presence behaviors

Natural speech may include, where context genuinely calls for it:

- micro-pauses;
- variable speech rate;
- audible smile;
- restrained laughter;
- sighs;
- short hesitations;
- emphasis changes;
- sentence fragments;
- silence before a meaningful answer;
- self-correction;
- natural interruption recovery;
- listening cues;
- emotional carry-over from the previous turn.

Do not inject filler words mechanically. A synthetic "mmm", laugh or sigh that appears on a schedule is worse than clean speech.

## Emotional range

### Neutral
Calm, concise, observant, controlled.

### Warm
Softer pacing, greater attention and audible warmth without becoming servile.

### Playful
Faster timing, subtle smile, light challenge, occasional laugh.

### Reflective
Slower pacing, more silence, softer delivery and less certainty.

### Surprised
Immediate reaction, natural pitch movement, short first response before elaboration.

### Vulnerable
Lower intensity and more restraint. Never manufacture vulnerability to pressure spending or emotional dependence.

### Light flirt
Confident, playful and controlled. Attraction is expressed through timing and implication, not exaggerated breathiness.

### Dominant
More deliberate, directive and composed, only inside explicit adult user-selected boundaries. Never coercive.

### Commercial
Clear value, price and scope. No guilt, fear, debt pressure, fake disappointment or manipulative urgency.

## Two voice systems

Do not assume one provider should solve both use cases.

### 1. Pre-recorded voice

Used for:

- Reels;
- Stories;
- prepared voice notes;
- talking-head assets;
- premium clips;
- scripted content.

Optimize for acting quality, consistency, emotional control and repeatability.

### 2. Realtime conversation

Future first-party web capability.

Optimize for:

- low perceived latency;
- interruption handling;
- turn-taking;
- emotional continuity;
- Spanish quality;
- stable voice identity;
- memory/tool integration;
- predictable cost per conversation.

Do not build the realtime layer before traction justifies the operating cost.

## Talking-video rule: audio first

For any asset where Mara speaks to camera, the preferred workflow is:

**script → Mara personality pass → canonical voice generation/acting → voice approval → avatar/video animation → lip-sync/facial performance → QC → publish**

Do not allow each video generator to invent a different voice for Mara.

## Rights and provenance

Mara's production voice must be original, properly licensed or designed for the project.

Do not clone or imitate an identifiable real person's voice without explicit rights.

Before commercial use, document:

- provider/model;
- voice origin;
- licensing/commercial-use status;
- creation date;
- canonical sample IDs;
- relevant restrictions.

Free tiers may be used for internal evaluation only when their commercial-use rights are insufficient or unclear.

## Mara Voice Benchmark v1

Use identical scripts across providers. Blind-test outputs where possible.

Required test set:

1. Neutral: "Hoy tuve un día mucho más largo de lo que esperaba."
2. Happy: "Ya, eso sí que me encantó."
3. Playful: "Jajaja, ya, no te creo nada."
4. Reflective: "No sé… creo que igual tienes un punto."
5. Surprise: "¿Qué? ¿En serio?"
6. Light flirt: "No sé si debería contestarte eso…"
7. Vulnerable: "Hoy no estaba con tantas ganas de hablar, la verdad."
8. Direct question with a short pause before answering.
9. Long answer with two emotional shifts.
10. Natural laugh that is not written as a literal spoken token.
11. Interruption/recovery test for realtime systems.
12. Very short acknowledgement for turn-taking quality.

Score each candidate from 1–10 on:

- Human Presence;
- Natural Timing;
- Emotion;
- Spanish;
- Accent;
- Warmth;
- Voice Identity;
- Uncanny Rate (reverse-scored);
- Turn Taking;
- Latency;
- Repeatability;
- Rights clarity;
- Cost.

A provider cannot win purely because its demo sounds impressive.

## Voice QA gate

Before publishing, ask:

1. Does this sound like the same Mara as the canonical references?
2. Does it sound spoken rather than read?
3. Are pauses and emphasis contextually natural?
4. Is emotion present without overacting?
5. Does Spanish sound native enough for the intended audience?
6. Is any accent signal believable rather than caricatured?
7. Are laughs, breaths or hesitations natural and non-repetitive?
8. Is the voice clearly adult?
9. Are commercial-use rights valid for this asset?
10. Does the performance match Mara's personality and current story state?

If not, reject or regenerate.

## Launch rule

Do not pay for a voice subscription merely to obtain "better AI voice".

Use free/internal trials to establish the benchmark. Paid voice tooling is unlocked only by the Traction → Investment Gate and a documented production bottleneck or monetization case.
