# MARA VERA — INSTAGRAM SCENE PACKET TEMPLATE V2

Use one Scene Packet for every active Instagram episode.

The packet is the **continuity contract** between frames.

Once frame 1 is accepted, every visible fact introduced by that frame becomes authoritative for the episode unless an explicit causal transition changes it.

> **NO SCENE PACKET → NO CONTINUITY-SENSITIVE GENERATION.**

Copy this template into an episode-specific file when production begins.

---

## 0. Scene identity

- `post_id:` PXX
- `scene_id:` IG-YYYY-MM-DD-SHORTNAME-001
- `event_id:` EVT-YYYY-MM-DD-XXX
- `status:` PLANNED | SCENE_LOCKED | ACTIVE | COMPLETE | VOID
- `platform:` Instagram
- `format:` Carousel | Reel | Story-sequence | Mixed
- `episode_concept:`
- `primary_objective:` recognition | relatability | personality | routine | social | worldbuilding | discovery | profile-depth | other
- `secondary_objective:` optional
- `visual_mode:` NATURAL | COQUETA | FIT | POWER | BLEND
- `caption_direction:`
- `target_frame_count:` 5–9
- `hard_dependencies:`
- `world_ledger_facts_used:`
- `wardrobe_ids_used:`
- `social_person_ids_used:`

---

## 1. Before-state

What is true immediately before frame 1?

- Mara came from:
- Mara is about to:
- companion(s) came from:
- objects already with Mara:
- food/drink state before first visible frame:
- prior post/event callbacks:
- open narrative thread, if any:

Do not invent elaborate lore. Record only what is needed to make the event causal.

---

## 2. Identity lock

Inherited from `MARA_CHARACTER_CANON.md`.

- canonical face: LOCKED
- adult age read: 24, LOCKED
- honey/beige blonde hair + darker roots: LOCKED
- green/hazel eyes: LOCKED
- curvy-realistic soft-athletic body: LOCKED
- strong/full thighs and hips: LOCKED
- natural lower-abdomen softness when visible: LOCKED
- personality energy in this episode:
- `OBJ-NECKLACE-001` present? YES / NO / NOT VISIBLE

Any result that looks like another beautiful woman is REJECTED.

---

## 3. Location / scene lock

- `place_id:` existing ID or SCENE-LOCAL
- city / area:
- venue type:
- exact micro-location:
- indoor / outdoor:
- daypart:
- approximate time:
- weather:
- lighting source/direction:
- lighting temperature:
- background anchor 1:
- background anchor 2:
- floor material:
- wall material/color where visible:
- table / seat / room geometry:
- window/door orientation:
- crowd density:
- distinctive elements that must not mutate:

If a known recurring place is used, cite its ledger facts rather than redesigning it.

---

## 4. Wardrobe lock

Use wardrobe IDs where available.

- top:
- bottom:
- shoes:
- outerwear:
- bag:
- necklace:
- earrings:
- rings / bracelets:
- sunglasses:
- hairstyle:
- makeup:
- nails:
- other visible clothing facts:

### Allowed natural evolution

- outerwear added/removed if logged;
- hair becoming slightly messier;
- sleeves rolled;
- bag moved from chair to shoulder;
- clothing compression/folds changing naturally with posture.

### Not allowed without explicit transition

- garment identity/color change;
- shoes change;
- new jewelry;
- nail color change;
- haircut/hair-color change;
- bag redesign.

---

## 5. Prop / object lock

- phone / case ID + exact appearance:
- bag ID + exact appearance:
- headphones:
- tableware:
- cup / glass:
- cutlery:
- napkin:
- menu / book / object:
- flowers / decor:
- keys / ticket / receipt if visible:
- recurring foreground object:
- other objects that must persist:

Object positions may change only in ways a person could physically move them.

---

## 6. Food / drink state

- primary food:
- vessel / plate / bowl:
- garnish / visible ingredients:
- initial portion:
- primary drink:
- glass / cup type:
- initial fill level:
- refill possible? YES / NO
- planned progression:

Example:

`F1 pasta 95% → F2 same 90% → F3 65% → F4 40% → F5 near-empty → F6 outside, food N/A`

Do not reset consumed food or drink unless a refill/new serving is an explicit event.

---

## 7. Camera-origin plan

Every frame must have a plausible capture origin.

- primary device feel: premium smartphone
- base focal-length feel:
- front/back camera:
- flash allowed? YES / NO
- timer/support allowed? YES / NO
- primary photographer:
- secondary photographer/person POV:
- video-frame extraction allowed? YES / NO

| Frame | Photographer / origin | Mara awareness | Distance / angle | Camera notes |
| --- | --- | --- | --- | --- |
| F1 |  | aware / semi / candid |  |  |
| F2 |  | N/A / aware / candid |  |  |
| F3 |  |  |  |  |
| F4 |  |  |  |  |
| F5 |  |  |  |  |
| F6 |  |  |  |  |
| F7 |  |  |  |  |
| F8 |  |  |  |  |
| F9 |  |  |  |  |

Reject impossible floating-camera views unless the support/timer is plausible.

---

## 8. Companion lock

If no companion is present/visible, write `NONE`.

For each companion:

- `person_id:`
- status in social graph:
- identity/appearance anchors:
- visible clothing:
- initial position:
- seat / table relation:
- object(s) held:
- camera role:
- expected partial-presence cues:

Do not regenerate a companion as a materially different adult later in the episode.

---

## 9. Frame plan

Plan the whole sequence before generating F1.

| Frame | Role | Planned shot | New information allowed | Must preserve | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | Cover / hook |  | establishes scene facts | character canon | PLANNED |
| 2 | Context / object |  | small contextual detail | all F1 visible facts | PLANNED |
| 3 | Candid / social |  | state progression | scene locks | PLANNED |
| 4 | Detail / POV |  | state progression | scene locks | PLANNED |
| 5 | Full look / transition |  | only causal transition | identity/wardrobe unless logged | PLANNED |
| 6 | Closer |  | ending state | history of event | PLANNED |
| 7 | Optional |  |  |  | OPTIONAL |
| 8 | Optional |  |  |  | OPTIONAL |
| 9 | Optional |  |  |  | OPTIONAL |

The sequence should normally mix Mara, context, detail and imperfect/social frames.

---

## 10. Continuity matrix

Fill before generation with intended state; update after each approved frame with actual state.

| Element | F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8 | F9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| location/micro-zone |  |  |  |  |  |  |  |  |  |
| outfit |  |  |  |  |  |  |  |  |  |
| hair |  |  |  |  |  |  |  |  |  |
| jewelry |  |  |  |  |  |  |  |  |  |
| bag position |  |  |  |  |  |  |  |  |  |
| phone position |  |  |  |  |  |  |  |  |  |
| food state |  |  |  |  |  |  |  |  |  |
| drink state |  |  |  |  |  |  |  |  |  |
| companion position |  |  |  |  |  |  |  |  |  |
| light/time |  |  |  |  |  |  |  |  |  |
| photographer |  |  |  |  |  |  |  |  |  |

The matrix is not decoration. It is the quickest drift detector.

---

## 11. Accepted-frame state log

Update **immediately after each accepted image**.

### Frame F1

- asset ID:
- approval status:
- exact Mara position/posture:
- exact clothing appearance:
- exact hair state:
- exact jewelry visible:
- food appearance/state:
- drink appearance/state:
- table/floor/wall materials:
- chair/furniture:
- bag position:
- phone position:
- light direction:
- background architecture:
- companion visible facts:
- new durable-world candidate facts:
- generation anomalies to watch next frame:

### Frame F2

- asset ID:
- state changes since F1:
- newly authoritative facts:
- continuity checks passed:

### Frame F3+

Repeat this pattern. Record **changes and newly authoritative facts**, not a vague summary.

---

## 12. Transition log

Use only for intentional changes.

| Transition | Cause | Facts that stop applying | Facts that continue | New facts |
| --- | --- | --- | --- | --- |
| F4 → F5 |  |  |  |  |

Example:

`leaves restaurant → table/food state no longer visible; same outfit/bag/phone/hair continue; jacket added from chair; exterior now blue-hour.`

Never create a transition note after generation merely to excuse drift.

---

## 13. Reject log

| Asset/version | Frame | Failure class | Exact failure | Corrective instruction |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Failure classes:

- FACE_DRIFT
- BODY_DRIFT
- WARDROBE_DRIFT
- PROP_DRIFT
- FOOD_DRIFT
- LOCATION_DRIFT
- COMPANION_DRIFT
- TIME_LIGHT_DRIFT
- IMPOSSIBLE_CAMERA
- AI_ANATOMY
- AI_TEXT
- EXCESSIVE_POLISH
- DUPLICATE_POSE
- NARRATIVE_REDUNDANCY

Rejected assets never become evidence.

---

## 14. Before-generation gate for every frame

Before generating F2+, answer:

1. What is the Scene ID?
2. What is the frame number/job?
3. Which previous frames are approved?
4. What facts did those frames establish?
5. What is allowed to change now?
6. What must remain identical?
7. Who is taking this image?
8. Where is that photographer physically located?
9. What has happened to food/drink/time/props since prior frame?
10. Does this frame add a new beat rather than duplicate a pose?

If these answers are unavailable, stop and recover state first.

---

## 15. After-generation gate

### Identity

- [ ] Same Mara face.
- [ ] Same canonical adult age read.
- [ ] Same body canon.
- [ ] Hair/eyes inside canon.

### Continuity

- [ ] Outfit correct.
- [ ] Bag/phone/jewelry correct.
- [ ] Food/drink progression correct.
- [ ] Environment architecture/materials correct.
- [ ] Companion identity/position plausible.
- [ ] Time/light progression plausible.
- [ ] Camera origin plausible.

### Social realism

- [ ] Does not look like an unrelated campaign image.
- [ ] No AI anatomy/text/reflection defect.
- [ ] Adds a useful sequence beat.

Any critical failure = REJECT.

---

## 16. Final sequence QA

- [ ] Same Mara across all visible frames.
- [ ] All frames can physically belong to the same event.
- [ ] At least one useful context/object frame without Mara as primary subject.
- [ ] At least one candid/observational/socially plausible frame.
- [ ] Hero shots do not dominate every slide.
- [ ] Food/drink/object states evolve forward.
- [ ] Transitions are intentional.
- [ ] No repeated near-identical pose solely to fill carousel length.
- [ ] Sequence has an opening, progression and closer.
- [ ] Caption can stay light because imagery already carries context.

---

## 17. After-state / writeback

After carousel approval:

- `event outcome:`
- `objects worth promoting to World Ledger:`
- `wardrobe items worth promoting:`
- `place facts worth retaining:`
- `social graph facts worth retaining:`
- `timeline event to append:`
- `Story/Reel derivatives allowed:`
- `next-post continuity hooks:`

Do not promote every scene-local detail to global canon.
