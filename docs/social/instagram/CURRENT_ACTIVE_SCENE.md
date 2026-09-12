# MARA VERA — CURRENT ACTIVE INSTAGRAM SCENE

Status: **OPERATIONAL POINTER**

This file exists so a future production agent can continue the current Instagram scene without relying on chat memory.

---

## Active state

- `active_scene:` P01-LATE-LUNCH
- `post_id:` P01
- `scene_id:` IG-2026-09-04-LATE-LUNCH-001
- `scene_packet_path:` docs/social/instagram/scenes/IG-2026-09-04-LATE-LUNCH-001.md
- `last_accepted_frame:` NONE
- `next_planned_frame:` F01 — cover / hero across-table late-lunch portrait
- `last_updated:` 2026-09-04

## Highest-risk continuity facts

- same canonical Mara identity and body
- WRD-TOP-001 fitted black sleeveless top
- WRD-JEANS-001 blue jeans
- OBJ-NECKLACE-001 delicate gold necklace
- OBJ-BAG-001 compact black shoulder bag
- OBJ-PHONE-001 dark smartphone with warm-cream case
- medium warm oak table
- off-white shallow ceramic bowl
- tagliatelle-style creamy mushroom/parmesan pasta
- clear sparkling-water tumbler
- muted sage-green wall + street-facing window
- late-afternoon soft window light from Mara's left

## Current production rule

Frame 1 is being generated now. It is not canon until explicitly accepted.

After acceptance:

1. inspect the accepted image;
2. write exact visible facts into the Scene Packet Accepted-frame state log;
3. assign an asset ID in ASSET_REGISTER.md;
4. update `last_accepted_frame` here;
5. point `next_planned_frame` to F02 — exact meal close-up;
6. preserve every visible frame-1 fact when generating F02.

---

## Continuation contract

If the user says:

- “dame la segunda”;
- “ahora la tercera”;
- “otra del mismo carrusel”;
- “sigue con el post”;

then:

1. read this file;
2. read the referenced Scene Packet;
3. read prior approved-frame facts;
4. generate only the next planned beat;
5. preserve all locked facts;
6. update Scene Packet and this pointer after acceptance.
