# MARA VERA — INSTAGRAM ASSET REGISTER

Status: **FRAME-LEVEL PRODUCTION LEDGER**

Every meaningful generated candidate gets an ID when it enters review.

Recommended ID format:

`IG-P{POST}-F{FRAME}-V{VERSION}`

Example:

`IG-P01-F02-V3`

---

## 1. Asset states

- `GENERATED`
- `REJECTED`
- `APPROVED_FRAME`
- `APPROVED_SEQUENCE`
- `PUBLISHED`
- `ARCHIVED`

A frame can be individually approved but still fail sequence-level QA.

---

## 2. Asset table

| Asset ID | Post | Scene ID | Frame | Version | Role | Source/generator | Prompt stack version | State | Failure code | Continuity facts introduced | Notes |
| --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — | — | — | — | — | — | — |

---

## 3. Prompt stack fields

When reproducibility matters, record:

- `identity_lock_version:`
- `global_world_state_version/date:`
- `scene_packet_version:`
- `frame_requirement_version:`
- `social_realism_layer_version:`
- `negative/reject_layer_version:`
- `reference_asset_ids:`

Do not store sensitive secrets/API keys.

---

## 4. Failure code vocabulary

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
- `OTHER`

For `OTHER`, write a precise reason.

---

## 5. Approval writeback

When a frame becomes `APPROVED_FRAME`:

1. write its visible facts into the active Scene Packet;
2. update the Continuity Matrix;
3. update `CURRENT_ACTIVE_SCENE.md` with the next frame;
4. promote only genuinely durable facts to world/wardrobe/social ledgers;
5. do not promote rejected alternate visual facts.

---

## 6. Rejection intelligence

Do not treat rejected generations as wasted work.

At the end of each production batch count failures by class.

Example:

| Failure class | Count | Pattern | Corrective action |
| --- | ---: | --- | --- |
| FOOD_DRIFT | 0 | — | — |
| FACE_DRIFT | 0 | — | — |
| EXCESSIVE_POLISH | 0 | — | — |

If one failure repeats, improve the relevant prompt layer or reference workflow rather than manually fighting it forever.

---

## 7. Asset evidence rule

Only `APPROVED_FRAME` / `APPROVED_SEQUENCE` assets are continuity evidence.

A rejected image must never be used later as justification for:

- Mara's face;
- outfit;
- room geometry;
- phone/bag;
- companion identity;
- food state;
- world history.

Rejected means **did not happen**.
