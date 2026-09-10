# MARA VERA — IMMERSIVE SCENES CATALOG V1

Status: commercial/content contract only. No produced audio, payment activation, deployment, provider activation or spend is implied.

## Product class

`IMMERSIVE_SCENE` = 6–12 minute first-person Mara audio experience designed for headphones, private replay and repeat purchase.

Working Alpha ladder:

- Audio Single: CLP 1,990
- Immersive Scene: CLP 3,990
- 3-Scene Collection: CLP 8,990
- Private Drop: CLP 4,990
- Story Pass: CLP 6,990

All prices are hypotheses and must remain server-configurable.

Commercial loop:

`FREE PREVIEW → CONTEXTUAL OFFER → CONFIRMED PURCHASE → ENTITLEMENT → IMMEDIATE SCENE RESUME → VAULT → CALLBACK → NEXT-SCENE OFFER → SECOND PURCHASE`

Permanent rules:

- adult fictional participants only;
- explicit opt-in for `JEALOUSY_PLAY`, `DOMINANT_HUMILIATION`, `ORGASM_CONTROL` and high-intensity `ADULT_INTIMATE`;
- payment never creates consent;
- fantasy does not silently become World canon;
- backend owns product, payment, entitlement and World truth;
- no custom per-user media production in Alpha;
- created once, sold/rewarded many times;
- no fake urgency, no affection-for-payment framing;
- no audio is considered produced until voice QA passes and the asset is registered.

## 12 candidate scenes

| ID | Working title | Collection | Core grammar | World mode | Score /55 |
|---|---|---|---|---|---:|
| mara_scene_001 | Al otro lado de la puerta | MARA: AL OTRO LADO | jealousy + uncertainty + control | FANTASY_ONLY | 52 |
| mara_scene_002 | Una sola regla | MARA: OBEDECE | permission + obedience + controlled escalation | FANTASY_ONLY | 50 |
| mara_scene_003 | Dignidad en la puerta | MARA: CERDITO | private humiliation + status inversion | FANTASY_ONLY | 49 |
| mara_scene_004 | Después de medianoche | MARA: DESPUÉS DE MEDIANOCHE | secrecy + private voice-note intimacy | WORLD_ADJACENT | 51 |
| mara_scene_005 | La mañana después | MARA: AL OTRO LADO | incomplete answer + jealousy callback | FANTASY_ONLY | 47 |
| mara_scene_006 | No preguntes dos veces | MARA: OBEDECE | rules + silence + delayed permission | FANTASY_ONLY | 46 |
| mara_scene_007 | El apodo | MARA: CERDITO | nickname ritual + humiliation callback | FANTASY_ONLY | 45 |
| mara_scene_008 | No te voy a contar todo | MARA: NO TE VOY A CONTAR TODO | World clue + incomplete truth | WORLD_CANON | 48 |
| mara_scene_009 | Sofi ya sabe | MARA: NO TE VOY A CONTAR TODO | Sofi contradiction + private continuation | WORLD_CANON | 47 |
| mara_scene_010 | Quédate en línea | MARA: DESPUÉS DE MEDIANOCHE | late-night control + silence | WORLD_ADJACENT | 46 |
| mara_scene_011 | Pídelo bien | MARA: OBEDECE | confession + permission | FANTASY_ONLY | 45 |
| mara_scene_012 | Todavía te acuerdas | MARA: AL OTRO LADO | weeks-later callback + memory | FANTASY_ONLY | 48 |

Score dimensions: Mara identity, first-30-second hook, immersion, erotic tension, psychological power, narrative arc, voice suitability, memorable ending, replay value, series potential, commercial differentiation. Minimum default production threshold: 44/55.

## Top 4 selected for prototype production

### 1. mara_scene_001 — AL OTRO LADO DE LA PUERTA

- collection_id: `other_side_v1`
- episode_number: 1
- duration_target: 08:30–09:30
- categories: `JEALOUSY_PLAY`, `DOMINANT_HUMILIATION`
- intensity: I5
- required_preferences: both categories explicit opt-in
- world_mode: `FANTASY_ONLY`
- visibility: `PAID`
- working sku: `immersive_scene_other_side_01`
- price_candidate_clp: 3990
- preview_asset_id: `mara_scene_001_preview`
- full_audio_asset_id: `mara_scene_001_full`
- cover_asset_id: `mara_scene_001_cover`
- vault_enabled: true
- replay_enabled: true
- next_scene_id: `mara_scene_005`
- reward_eligible: false initially

Commercial hypothesis: strongest first-purchase candidate because it combines a simple visual setup, immediate curiosity and an obvious cliffhanger.

### 2. mara_scene_002 — UNA SOLA REGLA

- collection_id: `obey_v1`
- episode_number: 1
- duration_target: 08:00–09:00
- categories: `FEMDOM`, `PERMISSION_CONTROL`
- intensity: I4
- required_preferences: `DOMINANT`
- world_mode: `FANTASY_ONLY`
- visibility: `PAID`
- working sku: `immersive_scene_obey_01`
- price_candidate_clp: 3990
- preview_asset_id: `mara_scene_002_preview`
- full_audio_asset_id: `mara_scene_002_full`
- cover_asset_id: `mara_scene_002_cover`
- vault_enabled: true
- replay_enabled: true
- next_scene_id: `mara_scene_006`

Commercial hypothesis: tests whether direct control/obedience converts better than jealousy without needing third-party setup.

### 3. mara_scene_003 — DIGNIDAD EN LA PUERTA

- collection_id: `cerdito_v1`
- episode_number: 1
- duration_target: 08:00–09:00
- categories: `DOMINANT_HUMILIATION`, `PRIVATE_SECRET`
- intensity: I5
- required_preferences: `DOMINANT_HUMILIATION`
- world_mode: `FANTASY_ONLY`
- visibility: `PAID`
- working sku: `immersive_scene_cerdito_01`
- price_candidate_clp: 3990
- preview_asset_id: `mara_scene_003_preview`
- full_audio_asset_id: `mara_scene_003_full`
- cover_asset_id: `mara_scene_003_cover`
- vault_enabled: true
- replay_enabled: true
- next_scene_id: `mara_scene_007`

Commercial hypothesis: tests the signature `CERDITO` ritual as a repeatable Mara-specific paid grammar rather than generic humiliation.

### 4. mara_scene_004 — DESPUÉS DE MEDIANOCHE

- collection_id: `after_midnight_v1`
- episode_number: 1
- duration_target: 08:00–09:00
- categories: `PRIVATE_SECRET`, `ADULT_INTIMATE`
- intensity: I4
- required_preferences: high-intensity adult/private opt-in
- world_mode: `WORLD_ADJACENT`
- visibility: `PAID`
- working sku: `immersive_scene_after_midnight_01`
- price_candidate_clp: 3990
- preview_asset_id: `mara_scene_004_preview`
- full_audio_asset_id: `mara_scene_004_full`
- cover_asset_id: `mara_scene_004_cover`
- vault_enabled: true
- replay_enabled: true
- next_scene_id: `mara_scene_010`

Commercial hypothesis: tests whether intimacy/secrecy can monetize without relying on overt humiliation or jealousy.

## Product card contract

Minimal card only:

- title;
- one-line hook;
- duration;
- category;
- price;
- headphones recommendation;
- owned/unowned state;
- one primary CTA;
- one decline action.

Example for scene 001:

> Te quedaste afuera de la puerta. Ahora decide si quieres escuchar el resto.
>
> 9 min · Private scene · Headphones recommended
>
> CLP 3,990
>
> `Seguir` / `Ahora no`

No fake timer, no countdown, no generic ecommerce feature grid.

## Preview contract

Each preview is 30–60 seconds and must end before the core escalation. It should demonstrate Mara voice, setting and the first moment of control.

The paid experience resumes directly from the preview cliffhanger after confirmed entitlement. No generic thank-you page.

## Vault contract

Section: `PRIVATE SCENES`

Each owned entry shows:

- cover;
- title;
- collection;
- duration;
- owned state;
- replay;
- last played;
- one eligible next-scene CTA.

Locked follow-ups may be shown only as real catalog items, not fake progress.

## Measurement contract

Per scene:

- `scene_preview_started`
- `scene_preview_completed`
- `scene_offer_viewed`
- `scene_checkout_started`
- `scene_purchased`
- `scene_started`
- `scene_25`
- `scene_50`
- `scene_75`
- `scene_completed`
- `scene_replayed`
- `scene_vault_revisited`
- `next_scene_offer_viewed`
- `next_scene_purchased`
- `second_purchase`
- `refund`
- `chargeback`

Business outputs:

- revenue per scene;
- revenue per collection;
- AOV;
- ARPPU;
- repeat purchase;
- contribution margin;
- Scene 1 → Scene 2 purchase rate.

Do not store inferred arousal, orgasm, loneliness, vulnerability or raw intimate user responses in generic analytics.

## Production experiment

1. Write 12 candidates — DONE.
2. Select top 4 — DONE.
3. Create full scripts/product contracts — companion files.
4. Generate only 3–5 voice proofs first.
5. If Mara voice identity passes, produce the four prototypes.
6. Compare preview→purchase, completion, replay and second-purchase intent.
7. Pick one winning grammar.
8. Only then produce episodes 2–3 for that collection.

The objective is not catalog size. It is to prove that one immersive scene can create demand for the next.

## Current gate state

- SCRIPT CANDIDATES: PASS
- TOP 4 SELECTION: PASS
- PRODUCT METADATA: PASS
- PRICE: hypothesis only
- PREVIEWS: specified in companion files
- FULL SCRIPTS: specified in companion files
- VAULT CONTRACT: PASS
- ENTITLEMENT CONTRACT: PASS at design level; runtime implementation belongs to Monetized Alpha
- VOICE PRODUCTION: NOT ACTIVATED
- REAL PAYMENTS: NOT ACTIVATED
- PRODUCTION: UNTOUCHED
- NO MERGE
