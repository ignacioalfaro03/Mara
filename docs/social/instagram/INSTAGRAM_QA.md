# MARA VERA — INSTAGRAM QA GATE

Status: **MANDATORY PRE-PUBLISH QUALITY GATE**

> **A BEAUTIFUL FRAME THAT BREAKS CONTINUITY IS A FAILED FRAME.**

QA runs at three levels:

1. Asset QA.
2. Sequence QA.
3. Profile/Grid QA.

All critical checks must pass.

---

# A. ASSET QA

## A1. Identity

- [ ] Same recognizable Mara face.
- [ ] Unmistakably adult, canonical 24-year-old read.
- [ ] Honey/beige blonde hair + darker roots remain inside canon.
- [ ] Green/hazel eyes remain inside canon when visible.
- [ ] Curvy-realistic soft-athletic silhouette remains inside canon.
- [ ] Strong/full thighs and hips remain believable when visible.
- [ ] Natural abdomen signature remains believable when visible.
- [ ] Skin is realistic, not wax/plastic/CGI.

Any face/body identity drift = **REJECT**.

## A2. Anatomy / rendering

- [ ] Hands/fingers plausible.
- [ ] Feet/toes plausible if visible.
- [ ] Teeth/eyes/ears plausible.
- [ ] No duplicated limbs/objects.
- [ ] No warped jewelry.
- [ ] No impossible reflections.
- [ ] No meaningless prominent text/signage.
- [ ] Fabric behaves physically.
- [ ] Furniture/body contact looks plausible.

AI defect is not “controlled imperfection.”

## A3. Scene continuity

Compare with Scene Packet and previous accepted frame(s):

- [ ] Location/micro-zone correct.
- [ ] Architecture/materials correct.
- [ ] Outfit correct.
- [ ] Shoes correct.
- [ ] Jewelry correct.
- [ ] Nails correct if visible.
- [ ] Phone/case correct.
- [ ] Bag correct.
- [ ] Food vessel/identity correct.
- [ ] Drink vessel/identity correct.
- [ ] Prop positions physically plausible.
- [ ] Companion identity/position plausible.
- [ ] Light/time progression plausible.

Any unjustified mismatch = **WORLD DRIFT → REJECT**.

## A4. Camera origin

- [ ] Someone/something could physically have captured this angle.
- [ ] Lens/perspective is plausible for intended phone/camera.
- [ ] Mara's awareness of camera matches the frame plan.
- [ ] No impossible floating cinematic camera in a casual scene.

## A5. Frame job

- [ ] Frame performs its planned role.
- [ ] It adds information/feeling rather than duplicating a previous pose.
- [ ] It belongs to this event.
- [ ] It is good enough for its role even if it is intentionally imperfect.

---

# B. SEQUENCE QA

Review all frames in order, not one at a time.

## B1. Causal continuity

- [ ] All frames can physically belong to the same event.
- [ ] Food progresses forward.
- [ ] Drink progresses forward or refill is logged.
- [ ] Light/time progresses forward.
- [ ] Bag/phone/props move causally.
- [ ] Outfit changes only at logged transitions.
- [ ] Companion positions/camera roles are plausible.
- [ ] No scene resets after later-state frames.

## B2. Carousel rhythm

- [ ] Cover earns stop/swipe.
- [ ] Sequence contains context.
- [ ] Sequence contains at least one observational/candid beat.
- [ ] Sequence contains at least one useful object/environment beat.
- [ ] Sequence does not contain only Mara portraits.
- [ ] Sequence does not contain several near-identical poses.
- [ ] Final slide feels like a closer/after-state rather than random leftover.

## B3. Realism

- [ ] At least one frame could plausibly be described as “camera-roll” rather than “campaign.”
- [ ] Imperfection varies naturally; it is not one repeated fake filter.
- [ ] Not every frame is maximum attractiveness.
- [ ] Ordinary context is visible.
- [ ] Another person's presence/POV is plausible where intended.

## B4. Narrative economy

- [ ] The post introduces only a manageable amount of new world information.
- [ ] No unnecessary new car/home/friend/hobby/luxury setting invented.
- [ ] Existing anchors are reused where natural.
- [ ] Caption does not need to explain contradictions.

---

# C. PROFILE / GRID QA

Audit the rolling 9, 12 and 20-post view.

## C1. AI Portfolio Syndrome detector

Fail if the grid shows too much of any pattern:

- same face crop;
- same mirror angle;
- same body pose;
- same color palette;
- same direct gaze;
- same depth of field;
- new outfit every post;
- luxury-only spaces;
- Mara in every cover/frame;
- no objects/food/streets/people/weather;
- no repeated places;
- no ordinary life.

## C2. World-memory audit

By P20, subject to approved production facts:

- [ ] At least 5 recurring objects/cues are visible across posts.
- [ ] At least 4 wardrobe pieces are actually reworn.
- [ ] At least 3 recurring places are recognizable.
- [ ] At least 2 recurring adult social identities/POVs exist where rollout permits.
- [ ] At least 2 multi-post arcs remain visually consistent.
- [ ] A follower could recognize at least one place/object without caption assistance.

## C3. Content balance

Across the rolling 20-post inventory:

- [ ] Mara is not the primary subject in at least ~20% of total carousel frames.
- [ ] Deliberately imperfect-but-valid captures exist.
- [ ] Day/night/indoor/outdoor have adequate range.
- [ ] Home/routine content exists between aspirational content.
- [ ] Body-led posts are not consecutive enough to flatten personality.
- [ ] Social-world evidence exists.
- [ ] No more than two consecutive covers use materially similar pose/crop grammar.

Treat thresholds as guardrails, not a mechanical visual algorithm.

---

# D. PRE-PUBLISH TRUTH / COMPLIANCE QA

- [ ] Mara remains truthfully positioned as an AI-generated fictional adult character at account/product disclosure level.
- [ ] No invented real-world brand partnership/endorsement.
- [ ] No false claim of a real identifiable person's friendship/relationship.
- [ ] No age ambiguity.
- [ ] No public content relies on deceptive biological-human claims.
- [ ] Caption and replies do not contradict world truth.

---

# E. FAILURE CLASSES

Use these codes in `ASSET_REGISTER.md` / Scene Packet reject log:

- `FACE_DRIFT`
- `BODY_DRIFT`
- `WARDROBE_DRIFT`
- `PROP_DRIFT`
- `FOOD_DRIFT`
- `LOCATION_DRIFT`
- `COMPANION_DRIFT`
- `TIME_LIGHT_DRIFT`
- `IMPOSSIBLE_CAMERA`
- `AI_ANATOMY`
- `AI_TEXT`
- `AI_REFLECTION`
- `EXCESSIVE_POLISH`
- `DUPLICATE_POSE`
- `NARRATIVE_REDUNDANCY`
- `GRID_REPETITION`
- `LORE_INFLATION`

---

# F. FINAL HUMAN-ACCOUNT TEST

Before approval, ask:

> **If we ignored that Mara is synthetic and judged only the social grammar, could an actual creator plausibly have posted this exact sequence from one real event?**

Then ask:

> **Does it still look unmistakably like Mara rather than a generic creator?**

Both answers must be YES.

And finally:

> **Does this post make the next post easier to believe, or does it create random facts we will regret maintaining?**

If it creates avoidable continuity debt, revise before publishing.
