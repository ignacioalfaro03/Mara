# MARA VERA — INSTAGRAM GENERATION PROMPT STACK V1.1

Status: **PRODUCTION PROMPT ARCHITECTURE**

Purpose: prevent ad-hoc prompt writing from becoming a second source of truth.

> **PROMPTS CONSUME CANON. PROMPTS DO NOT CREATE CANON BY THEMSELVES.**

Mandatory visual execution source:

- [`MARA_VISUAL_POST_LOCK.md`](./MARA_VISUAL_POST_LOCK.md) — Mara-native social feel, typography and pose-variation rules.

---

## 1. Stack order

Every continuity-sensitive Instagram generation should conceptually assemble these layers in order:

1. `MARA_IDENTITY_LOCK_V1`
2. `GLOBAL_WORLD_STATE_V1`
3. `SCENE_STATE_V1`
4. `FRAME_REQUIREMENT_V1`
5. `CONTINUITY_CONSTRAINTS_V1`
6. `POSE_VARIATION_LOCK_V1`
7. `CAMERA_ORIGIN_V1`
8. `SOCIAL_REALISM_V1`
9. `MARA_NATIVE_POST_V1`
10. `TYPOGRAPHY_LOCK_V1` — only when overlay text is used
11. `REJECT_CONSTRAINTS_V1`

A later layer cannot contradict an earlier layer.

---

## 2. `MARA_IDENTITY_LOCK_V1`

Source: `MARA_CHARACTER_CANON.md`.

Must preserve:

- same canonical fictional adult Mara;
- 24-year-old adult read;
- stable face/bone-structure family;
- green/hazel eyes;
- honey/beige blonde hair with darker roots;
- curvy-realistic soft-athletic body;
- fuller hips/strong thighs;
- natural lower-abdomen softness when visible;
- natural skin texture;
- Mara's playful/confident/quietly dominant energy.

Do not rewrite this layer scene by scene.

---

## 3. `GLOBAL_WORLD_STATE_V1`

Sources:

- `MARA_WORLD_LEDGER.md`
- `MARA_WARDROBE_LEDGER.md`
- `MARA_SOCIAL_GRAPH.md`
- `MARA_TIMELINE.md`

Include only facts relevant to the current scene.

Example categories:

- recurring phone/case;
- known necklace/bag;
- approved garment IDs;
- known home geometry;
- known café/gym;
- approved companion identity;
- timeline dependencies.

Do not inject every world fact into every prompt.

---

## 4. `SCENE_STATE_V1`

Source: active Scene Packet.

Must include exact current state:

- location/micro-zone;
- time/daypart;
- weather/light;
- outfit;
- hair/makeup/nails;
- jewelry;
- phone/bag/props;
- food/drink state;
- companion positions;
- relevant architecture;
- event progression.

This is the primary anti-drift layer.

---

## 5. `FRAME_REQUIREMENT_V1`

Defines only what this next frame must accomplish.

Example:

```text
FRAME: F02
ROLE: context / food detail
JOB: show the exact meal already visible in F01 from a plausible closer phone-camera angle.
NEW INFORMATION ALLOWED: garnish texture, plate edge, table detail already compatible with F01.
DO NOT INTRODUCE: new food, new glassware, new bag, new table, new venue.
```

A frame requirement should be narrow.

Do not ask the generator to “make it more interesting” by changing the world.

---

## 6. `CONTINUITY_CONSTRAINTS_V1`

Use direct constraints derived from previous accepted assets.

Example:

```text
CONTINUITY LOCK:
- same Mara identity as approved F01;
- same black top;
- same delicate gold necklace;
- same wood table;
- same white ceramic pasta plate;
- same water glass;
- same cream phone case;
- food is slightly more disturbed than F01, never reset or replaced;
- late-afternoon light remains from the same direction.
```

This layer should become more specific as the scene progresses.

---

## 7. `POSE_VARIATION_LOCK_V1`

Source: `MARA_VISUAL_POST_LOCK.md`.

Identity continuity must be preserved while the **face/head/gaze/body grammar changes**.

For every Mara-visible frame define:

```text
POSE VARIATION LOCK:
HEAD_YAW: left | center | right | profile
HEAD_TILT: left | neutral | right
CHIN: up | neutral | down
GAZE_TARGET: lens | mirror | person | object | phone | off-frame-left | off-frame-right | down
EXPRESSION: neutral | warm-smile | laugh | smirk | serious | curious | surprised | concentrated
BODY_ACTION: walking | sitting | leaning | fixing-hair | eating | reading | dressing | holding-phone | turning | reaching | resting
CAMERA_AWARENESS: aware | semi-aware | candid
```

The tuple must differ meaningfully from the previous Mara frame.

Hard reject pattern if repeated within the same carousel:

```text
head angled toward Mara's right + sideways glance toward Mara's right + chin slightly down + restrained smirk
```

Changing the outfit, room or hands does **not** count as pose variation when the face/head/gaze tuple is materially the same.

If the user asks `que mire al otro lado`, the new head/gaze direction must visibly invert at thumbnail size.

---

## 8. `CAMERA_ORIGIN_V1`

Specify who/what physically captures the frame.

Example:

```text
CAMERA ORIGIN:
Captured by the adult friend seated across the same table using a premium smartphone rear camera at natural seated eye level. Handheld, approximately 35mm-equivalent feel. Mara is semi-aware of the camera.
```

Alternative valid origins:

- Mara front-camera selfie;
- mirror;
- phone on plausible support/timer;
- Sofi POV;
- video still;
- companion walking behind/beside Mara.

Do not use impossible floating-camera perspectives in ordinary social scenes.

---

## 9. `SOCIAL_REALISM_V1`

Default social photography layer:

```text
SOCIAL REALISM:
Premium smartphone realism rather than campaign photography. Believable exposure and white balance, natural skin texture, ordinary environmental detail, slight framing imperfection where appropriate, realistic fabric folds and object contact, no unnecessary cinematic bokeh, no CGI gloss, no extreme HDR. The image should look captured inside a real sequence of events, not designed as a standalone poster.
```

Controlled imperfection may include:

- off-center crop;
- natural motion blur;
- direct flash at night;
- partial foreground obstruction;
- imperfect posture;
- realistic clutter.

Never request anatomical/rendering defects as realism.

---

## 10. `MARA_NATIVE_POST_V1`

Source: `MARA_VISUAL_POST_LOCK.md`.

Use this on every Instagram still/carousel:

```text
MARA NATIVE POST:
The result must feel like Mara's own social post, not advertising about Mara. The photograph is primary. The moment must remain believable if all overlay text disappears. Preserve Mara's playful self-awareness, intimacy, restrained flirtation, quiet authority and lived-in world. Avoid campaign-poster composition, landing-page hero treatment, banner boxes, buttons, feature explanations and repeated CTA structure. Mara is a character living a moment, not a model presenting marketing copy.
```

For interaction posts, the mechanic must feel conversational:

- Mara asks;
- Mara reacts;
- Mara remembers;
- Mara follows through later.

Do not make the frame look like a growth-team survey.

---

## 11. `TYPOGRAPHY_LOCK_V1`

Use only when overlay text is actually necessary.

```text
TYPOGRAPHY LOCK:
Use the canonical Mara social overlay family: Montserrat ExtraBold/Black visual grammar for the large Spanish headline, uppercase, clean heavy sans-serif. Use white as the main headline color with one meaningful word/letter/choice in Mara pink (#F58BB5 approximate; scene-adaptive within the same family). English translation is smaller, clean white sans-serif, regular/medium weight. Keep hierarchy simple and legible.

Do not use handwritten, bubble, scrapbook, sticker, kawaii/childlike, serif editorial or cursive/script fonts unless an explicit one-off creative exception has been approved.
```

Text-density default:

- 1–2 strong-text frames maximum in a normal 5-slide carousel;
- 1 minimal interaction marker if needed;
- 2–3 frames should normally remain clean photography.

`Post X/5` is not mandatory public artwork.

---

## 12. `REJECT_CONSTRAINTS_V1`

Default reject layer:

```text
REJECT IF:
- Mara looks like a different woman;
- age read becomes ambiguous/younger;
- face/body/hair/eyes drift from canon;
- outfit or accessories change without logged transition;
- phone, bag, tableware, food, furniture or architecture mutate;
- food/drink state moves backward;
- companion identity changes;
- camera angle is physically implausible;
- hands, reflections, text or anatomy contain obvious AI artifacts;
- image becomes a glossy standalone influencer campaign instead of a social-native continuation;
- the asset feels like an advertisement rather than Mara's post;
- typography drifts away from the canonical heavy clean sans-serif pink/white system without explicit exception;
- head direction + gaze + chin + expression repeat the previous Mara frame;
- the recurring Mara-right sideways-glance/chin-down smirk pose is reused in the same carousel.
```

Add scene-specific reject constraints when a failure repeats.

---

## 13. Prompt assembly template

```text
[MARA_IDENTITY_LOCK_V1]

[GLOBAL_WORLD_STATE_V1 — relevant facts only]

[SCENE_STATE_V1 — exact active state]

[FRAME_REQUIREMENT_V1]

[CONTINUITY_CONSTRAINTS_V1 — inherited accepted facts]

[POSE_VARIATION_LOCK_V1]

[CAMERA_ORIGIN_V1]

[SOCIAL_REALISM_V1]

[MARA_NATIVE_POST_V1]

[TYPOGRAPHY_LOCK_V1 — only if text is needed]

[REJECT_CONSTRAINTS_V1]
```

Do not replace this stack with a single improvised sentence for F2+.

---

## 14. Versioning rules

Create a new version only when production evidence shows a repeatable improvement.

Examples:

- `SOCIAL_REALISM_V1 → V1.1` for minor camera-language adjustment.
- `CONTINUITY_CONSTRAINTS_V1 → V2` if the inheritance mechanism materially changes.

A version change should record:

- what changed;
- why;
- failure pattern addressed;
- expected benefit;
- whether old approved assets remain valid.

Do not version purely for wording changes that do not alter behavior.

---

## 15. Reference-image rule

When an approved prior frame can be supplied to the generation system, use it as continuity evidence when technically appropriate.

Reference priority:

1. canonical Mara reference assets;
2. previous approved frame(s) from same scene;
3. approved recurring place/object references;
4. textual ledger facts.

Do not use rejected generations as references.

A reference image is evidence for identity/world continuity, **not permission to copy its facial pose**. Pose variation rules still apply.

---

## 16. Drift-correction rule

When a generation fails:

1. classify failure in `ASSET_REGISTER.md`;
2. identify which layer failed to constrain it;
3. strengthen only the relevant layer;
4. regenerate;
5. avoid compensating by adding unrelated decorative instructions.

Example:

Repeated plate mutation → strengthen `CONTINUITY_CONSTRAINTS`, not `MARA_IDENTITY_LOCK`.

Repeated plastic skin → strengthen `SOCIAL_REALISM`, not Scene State.

Repeated right-side facial pose → strengthen `POSE_VARIATION_LOCK`, not wardrobe/background prompts.

Repeated ad/poster feeling → strengthen `MARA_NATIVE_POST`, reduce text density and remove graphic UI.

This keeps prompts understandable and debuggable.

---

## 17. Minimal continuation contract

When the user asks only “dame la segunda”:

The production agent must recover:

- current active Scene Packet;
- F1 accepted asset facts;
- F2 planned role;
- continuity matrix;
- previous Mara face/head/gaze tuple;
- next frame's deliberately different pose tuple;
- camera origin;
- relevant prompt layers;
- whether overlay text is actually necessary.

Then generate F2 as a **continuation**.

The user should not need to manually restate the table, meal, clothes, bag, phone, light, room, typography or pose-diversity rule merely because the generation system lacks memory.
