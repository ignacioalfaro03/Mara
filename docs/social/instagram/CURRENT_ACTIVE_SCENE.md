# MARA VERA — CURRENT ACTIVE INSTAGRAM SCENE

Status: **OPERATIONAL POINTER**

This file exists so a future production agent can continue the current Instagram scene without relying on chat memory.

---

## Active state

- `active_scene:` NONE
- `post_id:` NONE
- `scene_id:` NONE
- `scene_packet_path:` NONE
- `last_accepted_frame:` NONE
- `next_planned_frame:` NONE
- `last_updated:` 2026-09-04

No Instagram production scene is currently locked in this branch.

The launch arc recommends beginning with `P01 — Late Lunch`, but recommendation is **not** an active scene and does not create canon.

---

## When production starts

Replace `NONE` with:

- post ID;
- Scene ID;
- exact Scene Packet path;
- last accepted asset ID;
- next frame number/job;
- highest-risk continuity facts;
- unresolved decisions;
- last updated timestamp/date.

Example shape:

```text
active_scene: P01-LATE-LUNCH
post_id: P01
scene_id: IG-2026-09-XX-LATE-LUNCH-001
scene_packet_path: docs/social/instagram/scenes/IG-...md
last_accepted_frame: IG-P01-F01-V2
next_planned_frame: F02 — exact meal close-up
highest_risk_continuity_facts:
  - exact pasta/plate
  - wood table
  - water glass
  - black top
  - OBJ-NECKLACE-001
  - OBJ-PHONE-001 case visual
unresolved:
  - none
```

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

If `active_scene: NONE`, do **not** hallucinate which prior scene the user meant. Recover an explicitly identified approved scene or ask only if repository state truly cannot resolve it.
