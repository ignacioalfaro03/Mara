# MARA VERA — INSTAGRAM QA GATE

Status: **MANDATORY PRE-PUBLISH QUALITY GATE**

> **A BEAUTIFUL FRAME THAT BREAKS CONTINUITY IS A FAILED FRAME.**
>
> **A BEAUTIFUL FRAME THAT FEELS LIKE AN AD INSTEAD OF MARA IS ALSO A FAILED FRAME.**

QA runs at three levels:

1. Asset QA.
2. Sequence QA.
3. Profile/Grid QA.

All critical checks must pass.

Mandatory companion source:

- [`MARA_VISUAL_POST_LOCK.md`](./MARA_VISUAL_POST_LOCK.md)

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

## A6. Mara-native / anti-advertising test

- [ ] If all overlay text vanished, the image would still feel like a believable Mara post.
- [ ] The frame feels like Mara living/posting, not a brand presenting Mara.
- [ ] Photo remains primary; graphic treatment is secondary.
- [ ] No unnecessary banner boxes, buttons, badges or campaign-like layout.
- [ ] No feature-copy/product-explanation language unless this is explicitly a commercial post.
- [ ] Any interaction cue sounds like Mara asking/reacting, not a growth-team survey.
- [ ] `Post X/5` is not treated as mandatory public artwork.

If the frame reads first as a paid-social creative, landing-page hero or campaign poster = **`AD_FEEL` → REJECT**.

## A7. Typography lock — when overlay text exists

- [ ] Large Spanish headline uses the canonical heavy clean sans-serif family: Montserrat ExtraBold/Black visual grammar or approved equivalent.
- [ ] Headline is uppercase where intended.
- [ ] White is the dominant headline color; pink accent highlights one meaningful word/letter/choice when useful.
- [ ] English translation is smaller, clean sans-serif, usually white.
- [ ] No random handwritten/bubble/scrapbook/sticker/kawaii/cursive/serif typography without explicit one-off approval.
- [ ] No font-family drift between slides.
- [ ] Text is legible at phone-feed size.
- [ ] Typography does not overpower Mara or the lived scene.

Unexpected font-family/style drift = **`TYPOGRAPHY_DRIFT` → REJECT**.

## A8. Pose grammar

Record and compare the planned tuple:

- [ ] `HEAD_YAW` differs meaningfully where required.
- [ ] `HEAD_TILT` is not mechanically reused.
- [ ] `CHIN` position is not mechanically reused.
- [ ] `GAZE_TARGET` differs meaningfully from previous Mara frame.
- [ ] `EXPRESSION` is not the same restrained smirk by default.
- [ ] `BODY_ACTION` creates a genuinely different moment, not only a different hand placement.
- [ ] Camera awareness varies where the sequence plan requires it.

Recurring failure pattern to reject when repeated:

> head angled toward Mara's right + sideways glance toward Mara's right + chin slightly down + restrained smirk

A new outfit/background with the same face/head/gaze tuple still counts as **duplicate pose grammar**.

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

## B3. Pose-direction balance

For carousels with 3+ Mara-visible frames:

- [ ] At least one frame uses a clearly different head direction from the cover.
- [ ] Direct/front, left-looking, right-looking, down/object-focused and candid/partial-profile options have been considered.
- [ ] Adjacent Mara frames do not repeat the same head direction + gaze target.
- [ ] The recurring Mara-right sideways-glance/chin-down smirk pose appears at most once.
- [ ] At least one Mara frame is action-led or candid rather than pose-led.
- [ ] Changing clothes/location has not been used to disguise repeated facial grammar.

If the carousel looks like five wardrobe changes performed by the same face pose = **`POSE_GRAMMAR_REPEAT` → REJECT**.

## B4. Text-density / visual hierarchy

Default 5-slide social-native target:

- [ ] 1–2 slides maximum carry strong overlay text unless the post is explicitly graphic/editorial.
- [ ] At least 2 slides are normally allowed to breathe as clean photography.
- [ ] A/B markers are minimal when used.
- [ ] Headline/subheadline/footer structure is not mechanically repeated on every slide.
- [ ] The carousel still feels like Mara's camera roll/life, not a designed ad sequence.

## B5. Realism

- [ ] At least one frame could plausibly be described as “camera-roll” rather than “campaign.”
- [ ] Imperfection varies naturally; it is not one repeated fake filter.
- [ ] Not every frame is maximum attractiveness.
- [ ] Ordinary context is visible.
- [ ] Another person's presence/POV is plausible where intended.

## B6. Narrative economy

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

Additional 2026-09-06 detector:

- repeated Mara-right head angle / sideways gaze / chin-down smirk across covers;
- typography that changes personality every post;
- every cover designed like a promo poster;
- every carousel using the same headline/subheadline/footer template.

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
- [ ] No single face direction becomes Mara's default across the rolling grid.
- [ ] Overlay typography, when used, remains recognizably one system.
- [ ] Graphic-heavy posts do not dominate enough to make the profile feel commercial.

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
- `POSE_GRAMMAR_REPEAT`
- `TYPOGRAPHY_DRIFT`
- `AD_FEEL`
- `NARRATIVE_REDUNDANCY`
- `GRID_REPETITION`
- `LORE_INFLATION`

---

# F. FINAL HUMAN-ACCOUNT TEST

Before approval, ask:

> **If we ignored that Mara is synthetic and judged only the social grammar, could an actual creator plausibly have posted this exact sequence from one real event?**

Then ask:

> **Does it still look unmistakably like Mara rather than a generic creator?**

Then ask:

> **Does it feel like Mara posted this, or like a marketing team made an ad using Mara?**

Then ask:

> **If I hide the clothes and background, have I actually changed Mara's face/head/gaze grammar from the last frame?**

All answers must support approval.

And finally:

> **Does this post make the next post easier to believe, or does it create random facts we will regret maintaining?**

If it creates avoidable continuity debt, revise before publishing.
