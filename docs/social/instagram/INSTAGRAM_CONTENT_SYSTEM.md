# MARA VERA — INSTAGRAM CONTENT SYSTEM V1

Status: **CANONICAL SOCIAL OPERATING SYSTEM — 2026-09-04**

Parent identity source of truth: [`MARA_CHARACTER_CANON.md`](../../../MARA_CHARACTER_CANON.md)

> **MARA HAS A LIFE, NOT A GALLERY OF AI RENDERS.**
>
> Instagram must feel like a coherent stream of lived moments. The unit of production is not an isolated image. The unit is an **episode** with a beginning, middle and end.

---

## 1. Purpose

This document defines how Mara Vera appears on Instagram.

The objective is to create a feed that is:

- immediately recognizable as Mara;
- social-native rather than synthetic-catalog-like;
- aspirational but believable;
- visually coherent across frames;
- varied enough to feel like a real person's account;
- commercially useful for discovery, profile visits, follows and conversion;
- reproducible across ChatGPT, image models, designers and future production tooling.

Instagram content must preserve Mara's canonical adult identity and public AI disclosure requirements. **Photographic realism does not mean pretending Mara is a biological human.**

---

## 2. The operating principle

### Bad production model

`Prompt → pretty image → publish → new prompt → unrelated pretty image`

This produces visual drift, broken props, impossible food changes, different rooms, changing clothes and a feed that feels generated.

### Required production model

`Episode concept → Scene Packet → frame plan → generate frame 1 → update state → frame 2 → update state → ... → QA → publish carousel`

Every carousel is treated like a tiny continuity-controlled film scene.

Permanent rule:

> **NO SECOND FRAME WITHOUT THE FIRST FRAME'S WORLD STATE.**

If the user asks “give me the second photo”, the second photo is not a new creative brief. It is the **next camera angle inside the already-open scene** unless the user explicitly requests a scene change.

---

## 3. Benchmark patterns — what high-reach human accounts get right

The system takes inspiration from recurring social-native patterns seen in major creator/celebrity Instagram accounts, including Dua Lipa, Hailey Bieber and Kylie Jenner. These are **pattern references only**. Mara must never imitate a real person's face, identity or exact creative property.

Useful patterns:

1. **The carousel tells a small story.** It is not ten hero photos.
2. **The cover earns the swipe.** Usually Mara or a strong human-scale moment.
3. **Not every slide contains the person.** Food, room, street, bag, shoes, landscape, table, mirror and small details create life around the subject.
4. **Editorial and ordinary coexist.** A polished outfit shot beside a phone photo, snack, convenience store, blurry candid or imperfect angle feels more human.
5. **The location has a role.** A trip, dinner, afternoon, morning or night-out gives the dump a reason to exist.
6. **People are not photographed only front-on.** Looking away, walking, sitting, laughing, being captured from across a table or seen in a mirror creates observational realism.
7. **The sequence has rhythm.** Face → environment → object → candid → full body → detail → closer is stronger than six nearly identical portraits.
8. **Captions are usually lighter than the imagery.** The images carry the story; the caption does not need to explain every frame.

Mara should adopt this grammar while preserving her own character signature: playful, close, self-confident, subtly challenging, quietly dominant and visually believable.

---

## 4. Default unit: the Mara Episode

A Mara Instagram episode is one coherent moment or mini-story.

Examples:

- late lunch in a small restaurant;
- coffee and errands in the city;
- getting ready before going out;
- Sunday morning at home;
- gym → smoothie → walk home;
- beach afternoon;
- hotel morning during a trip;
- bookstore / record store / market afternoon;
- dinner with a friend;
- rainy-day car ride and coffee;
- sunset walk;
- casual night out.

An episode can span multiple physical sub-locations only when the progression is narratively obvious, for example:

`apartment mirror → elevator → street → restaurant`

The transition must be intentional, not accidental generation drift.

---

## 5. Default carousel structure

Default target: **6–9 frames** per carousel.

This is not a rigid formula. Vary the order to avoid looking templated, but most strong Mara carousels should mix these shot classes:

| Shot class | Function | Typical example |
| --- | --- | --- |
| Hero / cover | stop scroll | Mara at table, mirror, street, car, beach |
| Establishing | establish world | restaurant interior, street, hotel view |
| Object / food | prove lived context | same pasta, coffee, bag, book, flowers |
| Candid Mara | humanize | looking away, fixing hair, laughing, walking |
| Full look | body/outfit context | full-body frame with natural perspective |
| POV / social | imply another person or observer | shot from across table, hand entering frame |
| Imperfect capture | break synthetic polish | slight motion blur, cropped edge, flash, reflection |
| Detail | memory cue | necklace, nails, shoes, phone, menu, table texture |
| Closer | end the moment | street at night, empty table, elevator mirror, sunset |

### Recommended rhythm example

1. Mara hero at the restaurant table.
2. Close-up of **the exact same meal** visible in frame 1.
3. Mara candid from across the same table.
4. Table detail: same drink, same napkin, same cutlery, same bag.
5. Full outfit in a nearby mirror or on the way out.
6. Exterior/night street or final small detail.

The important part is not this exact order. The important part is that all frames clearly belong to the **same episode**.

---

## 6. World State Lock — continuity is non-negotiable

Every active carousel must have a Scene Packet before frame 2 is generated.

The following state is locked unless the story explicitly advances it:

### Identity lock

Inherited directly from `MARA_CHARACTER_CANON.md`:

- same canonical face;
- same adult 24-year-old read;
- same hair family and length;
- same eye color;
- same body canon;
- same recurring gold-necklace anchor when present;
- same personality energy.

### Scene lock

- city / neighborhood if relevant;
- exact venue type;
- interior/exterior zone;
- table or seating position;
- time of day;
- weather;
- light direction and color temperature;
- visual background anchors;
- general crowd density.

### Wardrobe lock

- top;
- bottom;
- shoes;
- jacket/outerwear;
- bag;
- jewelry;
- sunglasses;
- hairstyle;
- makeup;
- nail color if visible.

A wardrobe change is allowed only after an explicit time/location transition.

### Prop lock

- phone model/case appearance;
- bag;
- glasses;
- menu;
- glass/cup;
- plate/bowl;
- cutlery;
- napkin;
- flowers/table objects;
- room furniture anchors.

### Food-state lock

Food must evolve physically through time.

Correct:

`untouched pasta → partly eaten pasta → empty/near-empty plate → dessert`

Wrong:

`pasta → sushi → full pasta again` with no narrative explanation.

If the first frame establishes a white ceramic bowl, silver fork and sparkling water glass, later close-ups must preserve those properties.

### Temporal lock

The scene must move forward plausibly.

- sun position may progress;
- food may be consumed;
- jacket may be added when leaving;
- makeup/hair may become slightly less perfect over time;
- lights may become warmer/darker later at night.

Do not reset the scene to frame-one conditions after the story has progressed.

---

## 7. Continuity failure conditions — automatic reject

Reject/regenerate a frame if any of these occur without an explicit story reason:

- plate or food changes identity;
- table material/color changes;
- glassware changes;
- outfit changes;
- bag changes;
- jewelry disappears/reappears inconsistently when clearly visible;
- phone/case changes;
- hair materially changes length/color/style;
- room architecture changes;
- daylight becomes night and then daylight again;
- background moves to a different venue;
- Mara's body or face drifts;
- a supposedly later food frame resets to untouched;
- the same companion changes physical identity;
- the same object appears in impossible positions;
- every photo looks like a professional campaign instead of one person's camera roll.

A beautiful frame that breaks continuity is **not publishable**.

---

## 8. Social realism: controlled imperfection

Mara should be attractive and intentional, but her Instagram must not look sterile.

Use controlled imperfection across the carousel:

- one slightly off-center crop;
- one frame with plausible motion blur;
- one candid with imperfect posture;
- ordinary clutter in a credible amount;
- natural skin texture;
- minor flyaway hair;
- reflections;
- phone flash in appropriate night scenes;
- partially blocked foreground objects;
- food already touched in later frames;
- fabric creasing and seat compression;
- natural lower-abdomen softness where anatomically visible, per character canon.

Do **not** manufacture defects randomly. Imperfection must make the moment more plausible, not lower the asset quality.

---

## 9. Mara's feed mix

The feed must not become “Mara posing in a different outfit every day.”

Target mix across a rolling 20-post window:

- **30–35% Mara-led lifestyle / hero episodes**;
- **15–20% candid / found-footage-feeling episodes**;
- **10–15% food / coffee / table / object-rich episodes**;
- **10–15% city / travel / environment episodes**;
- **10–15% outfit / getting-ready / mirror episodes**;
- **5–10% home / ordinary-life texture**;
- **5–10% social-world / friend POV / companion context**.

These are portfolio-level proportions, not quotas for each carousel.

The account should make viewers feel that Mara has:

- places she likes;
- routines;
- taste;
- habits;
- a social world;
- quiet moments;
- nights out;
- recurring objects;
- a recognizable personal aesthetic.

---

## 10. Recurrent anchors — make the world memorable

Repeated environmental and personal anchors increase recognition.

Examples to deliberately reuse over time:

- delicate gold necklace;
- one recognizable phone case family;
- recurring neutral/gold jewelry language;
- recurring apartment corners;
- same bedroom mirror;
- one or two recurring coffee-shop aesthetics;
- a recognizable tote or shoulder bag;
- recurring sunglasses;
- favorite coffee order / glass type / breakfast cues;
- recurring friend-camera POV style;
- warm Chilean/Latina urban visual cues without turning the world into stereotypes.

Repetition creates a world. Randomness creates AI slop.

---

## 11. Camera grammar

Default photographic language:

- premium smartphone realism;
- mostly 26–50 mm-equivalent visual feel;
- occasional 0.5x/wide camera only when contextually believable;
- handheld framing;
- natural or warm practical light;
- occasional direct flash at night;
- natural depth of field, not fake cinematic blur in every frame;
- consistent camera characteristics inside one episode unless a second camera/person is intentionally introduced.

### Human POV rule

Some frames should imply that another person took them.

Examples:

- shot from across the table;
- Mara walking two meters ahead;
- candid while she is talking;
- frame captured as she reaches for something;
- photo through a mirror;
- half-second-late laugh.

This is more believable than every shot being a perfectly centered tripod portrait.

---

## 12. Caption system

Captions should be concise, contemporary and consistent with Mara's personality.

Preferred modes:

- tiny observation;
- dry/playful line;
- one detail from the moment;
- subtle challenge;
- short emotional cue;
- occasional emoji, not emoji walls.

Avoid:

- explaining the whole carousel;
- constant sales copy;
- captions that sound like an AI assistant;
- fake claims of being a biological human;
- repeating the same flirt line every post.

The content should carry most of the narrative.

---

## 13. Public-content commercial rule

Instagram is primarily an **attention + identity + curiosity surface**.

Do not turn every post into a monetization CTA.

Recommended behavior:

- most posts: no hard sell;
- some posts: profile/bio curiosity cue;
- selected posts/stories: soft route to owned web or monetization surface;
- explicit commercial content only when it fits the episode and platform rules.

The public account should be worth following even for someone who never pays.

---

## 14. Default generation workflow

Whenever a new Instagram carousel is requested:

1. Read `MARA_CHARACTER_CANON.md`.
2. Decide the episode in one sentence.
3. Create/update a Scene Packet using `SCENE_PACKET_TEMPLATE.md`.
4. Define 6–9 frame roles before generating the first frame.
5. Generate frame 1 with identity + scene locks.
6. Record visible facts introduced by the generated frame.
7. Before frame 2, inherit those facts verbatim.
8. Generate each following frame as a **continuation**, not a new scene.
9. Update food/temporal/object progression after every accepted frame.
10. Run identity QA + continuity QA before publication.
11. Save the accepted episode state so Stories/Reels generated from the same event can reuse it.

### If the user asks only for “the second photo”

Do **not** invent a new concept.

Recover the active Scene Packet and generate the next planned frame using the same world state. If an actual accepted frame introduced a detail not present in the original packet, the accepted image becomes authoritative for that episode and the packet must be updated.

---

## 15. Default response contract for future social-production requests

Unless the user explicitly asks for only one isolated asset, any request such as:

- “make a post for Mara”;
- “give me a photo for Instagram”;
- “what should she post today?”;
- “make the next image”;

should be interpreted as part of the Instagram Content System.

Default planning output should include:

- episode concept;
- carousel frame plan;
- active visual mode (`NATURAL`, `COQUETA`, `FIT`, `POWER` or a controlled blend);
- continuity locks;
- proposed short caption;
- generation of frames one at a time while preserving the packet.

Do not over-explain this machinery to the audience. It is production infrastructure, not public-facing copy.

---

## 16. First-principles QA

Before accepting a carousel, answer YES to all:

### Identity

1. Is every visible Mara unequivocally the same Mara?
2. Does she remain unequivocally adult and canonical?
3. Are body, face, hair and eyes inside canon?

### World continuity

4. Could all frames physically belong to the same episode?
5. Are outfit and accessories consistent?
6. Are food and drink states plausible through time?
7. Do props, architecture and light remain coherent?
8. Are transitions deliberate rather than accidental?

### Social realism

9. Does the carousel contain more than posed portraits?
10. Does it feel like a camera roll from a lived moment?
11. Is there at least one context/detail image that would still make sense without Mara visible?
12. Is there enough imperfection to feel social-native without looking low quality?

### Brand

13. Is Mara's playful/confident/quietly dominant energy present somewhere?
14. Is the feed building a world rather than only displaying a body?
15. Would a viewer plausibly want to swipe before seeing a CTA?

Any critical NO means revise or regenerate.

---

## 17. Permanent Instagram principles

> **MARA HAS A LIFE, NOT A GALLERY OF AI RENDERS.**

> **THE CAROUSEL IS ONE EPISODE, NOT MANY UNRELATED IMAGES.**

> **NO SECOND FRAME WITHOUT THE FIRST FRAME'S WORLD STATE.**

> **A BEAUTIFUL IMAGE THAT BREAKS CONTINUITY IS A BAD IMAGE.**

> **FACE + WORLD + PERSONALITY CREATE RETURN; BODY ALONE CREATES ONLY A GLANCE.**

> **REALISM COMES FROM CAUSAL CONTINUITY, NOT ONLY FROM SKIN TEXTURE.**

> **REPETITION OF ANCHORS BUILDS A WORLD. RANDOMNESS BUILDS AI SLOP.**
