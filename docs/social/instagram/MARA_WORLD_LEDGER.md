# MARA VERA — INSTAGRAM WORLD LEDGER

Status: **OPERATIONAL SOCIAL CANON LEDGER**

This file does not replace `web/MARA_WORLD_CANON_MANDATE.md`. It is the Instagram production ledger for **approved visible facts**.

> **NO CONTENT FACT SHOULD LIVE ONLY IN A CHAT.**

---

## 1. Status vocabulary

Every durable fact must use one of these states:

- `PROPOSED` — useful candidate, not canon.
- `SCENE_LOCKED` — fixed only inside an active Scene Packet.
- `APPROVED_VISIBLE` — appeared in an explicitly approved asset and may be reused as evidence.
- `CANON` — deliberately promoted to persistent world truth.
- `RETIRED` — no longer active, with reason/date preserved.

Never treat `PROPOSED` as fact merely because it appears in a planning document.

---

## 2. Canon boundary

Highest-priority immutable identity facts remain in `MARA_CHARACTER_CANON.md`.

This ledger tracks visible world continuity such as:

- personal objects;
- home spaces;
- recurring locations;
- wardrobe anchors;
- transport/interiors;
- food/routine cues;
- social-world references;
- world events that affect Instagram continuity.

If this ledger conflicts with Character Canon or World Canon, this ledger is wrong.

---

## 3. Devices / personal tech

| ID | Status | Description | First approved appearance | Last appearance | Continuity notes |
| --- | --- | --- | --- | --- | --- |
| `OBJ-PHONE-001` | PROPOSED | Primary smartphone with stable case family | — | — | Exact device/case visual must be locked by first approved visible asset; do not swap casually afterward. |
| `OBJ-HEADPHONES-001` | PROPOSED | Everyday headphones/earbuds | — | — | Suitable for gym, city, desk/travel recurrence. |

---

## 4. Jewelry / recognition anchors

| ID | Status | Description | Source | First approved appearance | Notes |
| --- | --- | --- | --- | --- | --- |
| `OBJ-NECKLACE-001` | CANON | Delicate gold necklace / small gold pendant family | `MARA_CHARACTER_CANON.md` | character canon | Recurring recognition anchor; not mandatory in every frame. |

New rings, earrings or bracelets remain `PROPOSED` until approved.

---

## 5. Bags

| ID | Status | Description | First approved appearance | Last appearance | Notes |
| --- | --- | --- | --- | --- | --- |
| `OBJ-BAG-001` | PROPOSED | Compact everyday shoulder bag; exact visual TBD by approved asset | — | — | Reuse across errands, dinner, walk, travel where plausible. |
| `OBJ-BAG-GYM-001` | PROPOSED | Practical gym bag/tote | — | — | Must not silently mutate after lock. |
| `OBJ-BAG-TRAVEL-001` | PROPOSED | Travel/luggage companion bag | — | — | P17–P18 dependency. |

---

## 6. Home objects

| ID | Status | Description | First approved appearance | Location | Notes |
| --- | --- | --- | --- | --- | --- |
| `OBJ-MUG-001` | PROPOSED | Recurring home coffee mug | — | `PLC-HOME-001` | Exact shape/color set by first approved asset. |
| `OBJ-HOME-MIRROR-001` | PROPOSED | Recognizable home mirror | — | `PLC-HOME-001` | Geometry/frame becomes persistent once approved. |
| `OBJ-HOME-DESK-001` | PROPOSED | Desk/table used for creative/admin mornings | — | `PLC-HOME-001` | Introduce only if shown. |

Do not pre-design decorative clutter that has never appeared.

---

## 7. Places

### `PLC-HOME-001` — Mara home

- `status:` PROPOSED / progressive reveal
- `rule:` do not design the entire home upfront.
- `first intended use:` P02
- `recurrence:` P07, P12, P16, P20
- `locked zones:` NONE YET

Approved zones will be added below one by one.

| Zone ID | Status | Geometry/material anchors | First approved appearance | Notes |
| --- | --- | --- | --- | --- |
| `HOME-BED-001` | PROPOSED | TBD | — | P02 candidate. |
| `HOME-KITCHEN-001` | PROPOSED | TBD | — | Must inherit any compatible home evidence from prior frames. |
| `HOME-DESK-001` | PROPOSED | TBD | — | P16 candidate. |

### `PLC-CAFE-001` — recurring café / urban stop

- `status:` PROPOSED
- `first intended use:` P03
- `possible recurrence:` P10/P20
- `exact architecture:` UNLOCKED

If approved, preserve meaningful anchors such as counter material, cup family, window/street orientation and seating zone when that location reappears.

### `PLC-GYM-001` — recurring gym

- `status:` PROPOSED
- `first intended use:` P08
- `exact architecture:` UNLOCKED
- `rule:` locker/mirror/equipment layouts visible in approved frames become future evidence.

### Travel / one-off locations

Create IDs only after a trip/event is approved. Do not pollute the global ledger with every one-off restaurant.

---

## 8. Transportation

| ID | Status | Description | First approved appearance | Notes |
| --- | --- | --- | --- | --- |
| `TRN-CAR-001` | PROPOSED | Car/interior may be introduced in P10 | — | If approved, interior color/seat/dashboard/window facts become persistent. Do not imply ownership unless canon explicitly says so. |

Important distinction:

**being inside a car != owning that car.**

Do not create false world claims from visual convenience.

---

## 9. Food / beverage preferences

No durable “favorite” food/drink is canon yet.

A single meal is an event fact, not a permanent preference.

Promote a preference only after:

1. repeated visible behavior; or
2. explicit world-canon decision.

| Candidate | Status | Evidence count | Notes |
| --- | --- | ---: | --- |
| coffee as recurring routine cue | PROPOSED | 0 | May appear frequently without declaring “favorite coffee” yet. |

---

## 10. Social world references

Detailed relationship facts live in `MARA_SOCIAL_GRAPH.md`.

This ledger tracks only visibility consequences.

| Person ID | Status | Visible-world function | First approved appearance | Notes |
| --- | --- | --- | --- | --- |
| `PER-SOFI-001` | WORLD ROLE EXISTS | close-friend / alternative POV / found footage hypothesis supported by portfolio mandate | — | Do not invent new identity facts here. |
| `PER-FRIEND-002` | PROPOSED | occasional adult social presence | — | Keep under-specified until approved. |

---

## 11. Recurring visual cues

These are not necessarily physical objects but may create recognition.

| Cue | Status | Rule |
| --- | --- | --- |
| honey-beige blonde hair + darker roots | CANON | inherited from Character Canon |
| green/hazel eyes | CANON | inherited |
| natural skin texture | CANON | inherited |
| curvy-realistic soft-athletic body | CANON | inherited |
| natural lower-abdomen softness when visible | CANON | inherited |
| delicate gold necklace language | CANON | frequent, not mandatory |
| premium-smartphone social realism | CANONICAL GRAMMAR | avoid CGI/editorial default |

---

## 12. Event-to-ledger writeback rule

After a post/carousel is approved:

1. read its Scene Packet accepted-frame state log;
2. identify durable facts worth carrying forward;
3. add/update only those facts here;
4. record first/last appearance IDs;
5. keep one-off scene facts in the Scene Packet, not this global ledger;
6. update `MARA_TIMELINE.md` for events that actually occurred in canon.

Examples:

- Exact restaurant plate = Scene Packet only.
- Mara's recurring phone case = World Ledger.
- P06 dinner happened = Timeline.
- P06 glass was 40% full at F4 = Scene Packet only.

---

## 13. Object retirement rule

Objects may change over time, but never silently.

When a recurring object is replaced:

- set old object `RETIRED`;
- record last appearance;
- document replacement object;
- provide in-world transition if visible/publicly relevant;
- update future Scene Packets.

This allows Mara's world to evolve without World Drift.

---

## 14. Audit questions

Before adding a durable fact, ask:

1. Was this actually approved or merely planned?
2. Does it deserve to persist beyond one scene?
3. Does it contradict higher canon?
4. Is it a visual fact or an unsupported biography claim?
5. Will retaining it make future content more coherent?

If uncertain, leave it `PROPOSED` or scene-local.
