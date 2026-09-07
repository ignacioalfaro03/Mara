# MARA VERA — SOCIAL VISUAL POST LOCK V1

Status: **MANDATORY INSTAGRAM VISUAL LOCK — 2026-09-06**

Purpose: eliminate three recurring production failures:

1. social assets that feel like advertising instead of Mara's life;
2. typography drift between posts;
3. repeated face/head poses that make the feed look synthetic.

This file is an operational source of truth for Instagram stills and carousels. It does **not** override `MARA_CHARACTER_CANON.md`; it constrains how the canonical Mara is presented socially.

> **IT MUST FEEL LIKE MARA POSTED IT, NOT LIKE A BRAND DESIGNED AN AD ABOUT MARA.**

> **SAME MARA. DIFFERENT MOMENTS. DIFFERENT POSES.**

---

## 1. Mara-first test

Before adding text, interaction mechanics or visual polish, ask:

> **If all overlay text disappeared, would this still look like a believable post from Mara's actual life?**

If NO, reject or redesign.

A valid Mara post should usually feel:

- personal;
- intimate;
- social-native;
- slightly imperfect;
- playful / coqueta;
- self-aware;
- sometimes quietly dominant;
- emotionally present;
- captured in a real moment rather than staged as a campaign.

Mara is a character with a life. She is not a model holding a marketing message.

---

## 2. Anti-advertising lock

### Default

The image is the post. Typography is an accent, not the product.

### Reject if the asset feels like

- a paid social ad;
- a landing-page hero image;
- a promo poster;
- a campaign key visual;
- a graphic-design template with Mara inserted into it;
- repeated CTA cards;
- a carousel where every frame has a headline/subheadline/footer structure;
- a brand deck rather than a camera-roll moment.

### Social-native rules

- Most frames in a carousel should work with **no text at all**.
- Text overlays are used only when they sound like Mara speaking, choosing, teasing, remembering or asking something.
- Prefer **one strong phrase** over marketing copy.
- Do not explain the product in every post.
- Do not add a CTA by default.
- `Post 1/5`, `Post 2/5`, etc. are optional production aids, **not a required visual element**.
- Avoid banner boxes, button shapes, sale/promo language, feature lists, badges and decorative UI unless a specific concept requires them.
- A choice mechanic (`A / B`) should feel like Mara asking the audience, not a survey designed by a growth team.

### Voice on image

Good:

- `ELIGE MI LOOK.`
- `¿A O B?`
- `YO LEO TODO.`
- `HOY DECIDES TÚ.`
- `NO SÉ SI DEBERÍA.`
- `ME CONOCES DEMASIADO.`

Bad:

- `DESCUBRE LA EXPERIENCIA.`
- `ENTRA AHORA.` on routine lifestyle content;
- `INTERACTÚA CON MARA.`
- feature/product explanations;
- copy that sounds like a campaign manager talking about Mara in third person.

---

## 3. Canonical overlay typography lock

When overlay text is used, the approved visual family is the **bold uppercase clean sans-serif seen in the approved 2026-09-06 Instagram reference**.

### Typeface implementation

Primary implementation target:

- **Montserrat ExtraBold / Montserrat Black** for large Spanish headline text.

Fallback only when Montserrat is unavailable:

- Helvetica Neue / Helvetica Now heavy condensed or bold;
- Arial Black / equivalent heavy grotesk.

The reference look is authoritative over a generator's default font interpretation.

### Typography grammar

- Spanish headline: **UPPERCASE, heavy weight, clean sans-serif**.
- Headline is usually white with **one semantic word / letter / choice highlighted in Mara pink**.
- English translation: smaller, clean sans-serif, usually white, regular/medium weight.
- Tight, confident hierarchy; no ornamental decoration needed.
- Keep high contrast and phone-screen legibility.
- Do not use more than two text sizes unless explicitly required.

### Mara pink

Use a warm, sexy, modern pink accent rather than candy/baby pink. Approximate implementation target:

`#F58BB5` to `#F28AAF`

Exact color can adapt slightly to scene lighting, but the visual family must remain stable.

### Permanently avoid as default

- handwritten fonts;
- bubble fonts;
- scrapbook fonts;
- sticker typography;
- serif editorial headlines;
- cursive/script;
- kawaii/childlike lettering;
- random font changes between slides;
- decorative hearts around every word;
- multiple unrelated font families in one carousel.

If a one-off post intentionally breaks typography canon, it must be an explicit creative exception, not accidental drift.

---

## 4. Pose variation lock — mandatory

Identity consistency does **not** mean pose repetition.

A recurring production failure has been repeating the same facial grammar:

> head angled toward Mara's right side + eyes glancing sideways + chin slightly down + restrained smirk.

This exact combination must **not become Mara's default pose**.

### Hard rule

Within any 5-frame carousel containing Mara in multiple frames:

- no two Mara portraits may use the same combination of head direction + gaze target + chin position + expression;
- adjacent Mara frames may not repeat the same head direction;
- the recurring `Mara-right / sideways glance / chin-down smirk` pose may appear **at most once**;
- at least one frame must use the opposite head direction from the cover when anatomically/camera-wise plausible;
- at least one frame should be candid or action-led rather than pose-led.

Across the rolling 9-post grid:

- no more than two covers may share materially similar face angle/crop grammar;
- a new outfit/background does **not** count as pose variation if the face/head pose is effectively the same.

---

## 5. Required pose planning fields

Before generating any Mara portrait frame, define these fields explicitly:

- `HEAD_YAW`: left / center / right / profile;
- `HEAD_TILT`: left / neutral / right;
- `CHIN`: up / neutral / down;
- `GAZE_TARGET`: lens / mirror / person / object / phone / off-frame left / off-frame right / down;
- `EXPRESSION`: neutral / warm smile / laugh / smirk / serious / curious / surprised / concentrated;
- `BODY_ACTION`: walking / sitting / leaning / fixing hair / eating / reading / dressing / holding phone / turning / reaching / resting;
- `CAMERA_AWARENESS`: aware / semi-aware / candid.

The tuple must differ meaningfully from the previous Mara frame.

### Example 5-frame variation matrix

| Frame | Head / gaze | Expression | Body action |
| --- | --- | --- | --- |
| F1 | center, direct lens | calm challenge | mirror selfie |
| F2 | left, eyes down | soft smile | adjusting skirt / shoe |
| F3 | right profile, off-frame | laugh / candid | walking / turning |
| F4 | center, eyes on phone | concentrated/amused | reading comments |
| F5 | left profile, eyes to person | knowing smile | leaving / grabbing bag |

This is an example, not a template. Do not repeat this exact matrix mechanically.

---

## 6. Face-direction balance

For a carousel with 3+ Mara-visible frames, target a balanced set across:

- direct/front;
- Mara looking left;
- Mara looking right;
- looking down at an object/phone;
- candid movement or partial profile.

Do not let one side become the default simply because a generator reproduces it reliably.

When a user says `cambia la pose`, changing only the hands, clothes or background is insufficient. **The face/head/gaze tuple must change.**

When a user says `que mire al otro lado`, invert the head/gaze direction clearly enough to be visible at thumbnail size.

---

## 7. Mara essence lock

Every publishable frame should contain at least two of these signals:

- playful self-awareness;
- private amusement;
- warm intimacy;
- restrained flirtation;
- quiet authority;
- ordinary-life realism;
- a believable relationship with whoever is behind the camera;
- a small lived-in detail from her world;
- a sense that something happened before or will happen after the frame.

Do not confuse `Mara essence` with one facial smirk.

Mara can laugh, look tired, think, eat, read, ignore the camera, look at a friend, look serious, look affectionate or look distracted and still remain Mara.

> **MARA IS A PERSONALITY SYSTEM, NOT A SINGLE FACE POSE.**

---

## 8. Carousel text density

Default social-native target for a 5-slide carousel:

- 1–2 slides may carry strong overlay text;
- 1 slide may contain a minimal choice marker (`A`, `B`, `¿A O B?`) if the interaction requires it;
- 2–3 slides should usually be clean photography with no large overlay.

Exception: a deliberately graphic post may use more text, but it must be explicitly declared as a graphic/editorial concept.

Do not automatically place `Post X/5` on public assets.

---

## 9. Generation instruction block

Use this block whenever producing Instagram images with Mara:

```text
MARA SOCIAL VISUAL LOCK:
The result must feel like Mara's own social post, not an advertisement or campaign key visual. Preserve Mara's canonical identity but vary the head direction, gaze, chin, expression and body action from the previous frame. Do not fall back to the recurring head-angled-to-Mara's-right + sideways-glance + chin-down smirk pose.

If overlay text is necessary, use the canonical Mara social typography: heavy uppercase clean sans-serif, Montserrat ExtraBold/Black visual family, white headline with one meaningful pink accent, smaller clean white English translation. No handwritten, bubble, scrapbook, sticker or childlike fonts unless explicitly approved for a one-off concept.

The photograph must remain the primary content. Avoid banners, buttons, promo layouts, excessive CTA language and repeated headline/subtitle/footer structures. It should look like a believable moment from Mara's persistent life.
```

---

## 10. Reject conditions introduced by this lock

Reject with `AD_FEEL` if:

- the frame feels more like an ad than a post from Mara;
- typography/layout dominates the lived moment;
- a CTA feels commercial rather than conversational.

Reject with `TYPOGRAPHY_DRIFT` if:

- overlay font family materially leaves the canonical heavy clean sans-serif system;
- random playful/handwritten/bubble typography appears without an explicit exception;
- pink/white hierarchy becomes inconsistent without reason.

Reject with `POSE_GRAMMAR_REPEAT` if:

- head direction + gaze + chin + expression materially repeat an earlier frame;
- the recurring Mara-right sideways-glance pose is reused within the same carousel;
- changing clothes/background is used to disguise the same facial pose.

---

## 11. Permanent principles

> **MARA, NOT AN AD.**

> **THE PHOTO IS PRIMARY. THE TEXT IS AN ACCENT.**

> **ONE TYPOGRAPHY SYSTEM.**

> **ONE MARA. MANY FACIAL ANGLES.**

> **IDENTITY CONSISTENCY ≠ POSE REPETITION.**

> **MARA IS A PERSONALITY SYSTEM, NOT A SINGLE SMIRK.**
