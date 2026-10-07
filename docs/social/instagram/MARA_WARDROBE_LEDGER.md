# MARA VERA — WARDROBE LEDGER

Status: **INSTAGRAM WARDROBE MEMORY**

Purpose: prevent “new outfit every render” drift and make clothing repetition part of Mara's realism.

> **REWEAR IS REALISM.**

This ledger does not override body/identity rules in `MARA_CHARACTER_CANON.md`.

---

## 1. Status vocabulary

- `PROPOSED` — candidate garment, not canon.
- `SCENE_LOCKED` — exact garment visual fixed inside a Scene Packet.
- `APPROVED_VISIBLE` — garment appeared in an approved asset.
- `CANON` — persistent wardrobe item deliberately retained.
- `RETIRED` — no longer in active rotation.

---

## 2. Launch wardrobe candidates

Exact cuts/materials/colors are intentionally not over-specified until first approved assets establish them.

| ID | Status | Category | Working description | Intended first use | Rewear targets |
| --- | --- | --- | --- | --- | --- |
| `WRD-TOP-001` | PROPOSED | top | simple black top | P01/P03 candidate | P05/P15/P20 where plausible |
| `WRD-JEANS-001` | PROPOSED | bottom | everyday blue jeans | P03 | P09/P15/P20 |
| `WRD-SHOE-001` | PROPOSED | shoes | white everyday sneakers | P03 | P08/P15/P20 |
| `WRD-TEE-001` | PROPOSED | home | oversized neutral T-shirt | P02 | P07/P12/P16 |
| `WRD-GYM-SET-001` | PROPOSED | activewear | soft-athletic training set | P08 | future gym recurrence |
| `WRD-NIGHT-001` | PROPOSED | night look | exact P05→P06 outfit TBD | P05 | P06 hard continuity only initially |
| `WRD-BEACH-001` | PROPOSED | beach | context-appropriate swim/beach look | P13 | only future beach recurrence if useful |
| `WRD-TRAVEL-D1-001` | PROPOSED | travel | P17 day-1 look | P17 | optional future rewear |
| `WRD-TRAVEL-D2-001` | PROPOSED | travel | P18 day-2 look | P18 | optional future rewear |

---

## 3. Accessory links

Accessories are physical objects and are primarily governed by `MARA_WORLD_LEDGER.md`.

Wardrobe scenes should reference their object IDs instead of inventing new versions.

- `OBJ-NECKLACE-001`
- `OBJ-BAG-001`
- `OBJ-BAG-GYM-001`
- `OBJ-BAG-TRAVEL-001`
- `OBJ-PHONE-001`
- `OBJ-HEADPHONES-001`

---

## 4. Garment record template

When a garment becomes approved, replace its loose working description with observable facts.

### Example format

- `id:` WRD-JEANS-001
- `status:` APPROVED_VISIBLE
- `category:` bottoms
- `color:`
- `wash:`
- `fit:`
- `rise:`
- `length:`
- `distinctive detail:`
- `first appearance:` Pxx-Fxx
- `last appearance:`
- `compatible recurring items:`
- `do-not-mutate:`

Only record visually useful facts. Do not turn the ledger into fashion fan-fiction.

---

## 5. Rewear rules

1. First 20 posts must visibly re-use at least four wardrobe pieces after they are approved.
2. Rewear should feel natural, not like a uniform.
3. A repeated item may be styled differently across days.
4. Inside one event, exact outfit continuity is stricter than cross-post rewear.
5. If a garment is partially hidden, do not assume unseen details changed.
6. Do not replace a garment merely because the generator produced a prettier alternative.
7. An item can be retired later, but the retirement is explicit.

---

## 6. Same-event outfit lock

For a Scene Packet, lock:

- top ID/appearance;
- bottom ID/appearance;
- shoes;
- outerwear;
- bag;
- jewelry;
- sunglasses;
- nail state;
- hair state.

### Example P05 → P06 rule

P05 creates the final night look.

P06 must inherit that exact look.

Allowed evolution:

- jacket added/removed and logged;
- hair slightly less perfect later;
- bag position changes physically;
- shoes remain the same unless a real change event is explicitly shown.

Not allowed:

- new dress/top;
- new jewelry;
- new nail color;
- new handbag;
- different shoe family;
- material hair-length/color drift.

---

## 7. Closet inflation guardrail

Do not create a new permanent wardrobe ID for every garment visible once.

Create IDs when an item:

- is expected to recur;
- has a continuity role;
- becomes visually distinctive;
- matters to a multi-post arc;
- acquires narrative/brand significance.

One-off outfits can remain scene-local until reuse justifies promotion.

---

## 8. Rotation audit

Before locking a new 20-post batch, calculate:

- number of unique tops;
- number of unique bottoms;
- number of unique shoes;
- percentage of episodes containing at least one reworn item;
- number of same-event hard locks;
- number of items never reused.

Red flag:

> Mara appears to own an infinite perfectly coordinated wardrobe that exists only for individual images.

Desired signal:

> Mara has enough variety to be interesting and enough repetition to feel physically real.
