# MARA VERA — INSTAGRAM POST REGISTER

Status: **OPERATIONAL CONTROL TABLE**

One row = one Instagram post/episode.

Lifecycle:

`IDEA → WORLD_CHECK → SCENE_LOCKED → GENERATING → ASSET_QA → SEQUENCE_QA → APPROVED → SCHEDULED → PUBLISHED → MEASURED → LEARNED`

A post may move to `VOID` before publication. Published history is not deleted.

---

## Launch register

| Post ID | Event | Primary objective | Format | Hard dependency | Key recurrence | Scene Packet | Status | Planned caption mode | Publish date | KPI snapshot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P01 | Late lunch | recognition | carousel | — | necklace/phone/bag candidate | TBD | IDEA | MICRO | — | — |
| P02 | Slow morning home | relatability | carousel | — | home/mug/tee | TBD | IDEA | MICRO | — | — |
| P03 | Coffee run + errands | routine | carousel | prior objects where natural | café/jeans/shoes | TBD | IDEA | OBSERVATIONAL | — | — |
| P04 | Camera roll / random things | anti-portfolio realism | carousel | approved prior world | objects/environment | TBD | IDEA | DEADPAN | — | — |
| P05 | Getting ready | personality/anticipation | carousel | home if used | exact P06 night state | TBD | IDEA | TEASING | — | — |
| P06 | Night out | social energy | carousel | **P05** | same look + social POV | TBD | IDEA | MICRO | — | — |
| P07 | Next morning | temporal credibility | carousel | **P06** | home/callback object | TBD | IDEA | AFTERMATH | — | — |
| P08 | Gym day | body/routine | carousel | — | gym/headphones/shoes | TBD | IDEA | MICRO | — | — |
| P09 | Bookstore/record store | personality/taste | carousel | — | bag/coffee/wardrobe | TBD | IDEA | OBSERVATIONAL | — | — |
| P10 | Rainy car + café | atmosphere | carousel | P03 soft | café/phone/bag | TBD | IDEA | CONTEXTUAL | — | — |
| P11 | Dinner with Sofi/friends | social graph | carousel | World/Sofi compatibility | Sofi POV | TBD | IDEA | MICRO | — | — |
| P12 | Cooking home | home depth | **P02 home facts** | home/mug/tee | TBD | IDEA | DEADPAN | — | — |
| P13 | Beach afternoon | aspiration/contrast | carousel | — | bag/phone | TBD | IDEA | MICRO | — | — |
| P14 | Sofi found footage | alternate POV | carousel/reel candidate | **P11 Sofi approval** | Sofi camera grammar | TBD | IDEA | TEASING | — | — |
| P15 | City evening walk | normality/style | carousel | wardrobe ledger | jeans/shoes/bag | TBD | IDEA | MICRO | — | — |
| P16 | Creative/admin morning | activity/home | carousel | **P02/P12 home facts** | home/mug/headphones | TBD | IDEA | DEADPAN | — | — |
| P17 | Mini trip day 1 | world expansion | carousel | — | luggage/hotel/travel bag | TBD | IDEA | CONTEXTUAL | — | — |
| P18 | Mini trip day 2 | continuity proof | carousel | **P17** | same trip/hotel | TBD | IDEA | MICRO | — | — |
| P19 | Bad photo dump | anti-AI stress test | carousel | accumulated world | repeated anchors | TBD | IDEA | MICRO | — | — |
| P20 | Mara world synthesis | recognition/world memory | carousel | accumulated approved canon | multiple callbacks | TBD | IDEA | MICRO/PLAYFUL | — | — |

---

## Per-post KPI fields

When published, capture when available:

- `reach:`
- `impressions:`
- `likes:`
- `comments:`
- `saves:`
- `shares:`
- `profile_visits:`
- `follows_attributed:`
- `follow_rate_per_profile_visit:`
- `web_clicks:`
- `web_ctr_from_profile:`
- `story_completion_if_linked:`
- `carousel_depth_if_available:`
- `downstream_conversion_if_attributable:`
- `notes:`

---

## Learning format

After a post has enough observation to justify a note:

### PXX — Learning

- `hypothesis before:`
- `result:`
- `signal:`
- `possible confounders:`
- `repeat test needed:` YES / NO
- `system change:` NONE / TEST / PROMOTE TO RULE

Never promote a one-post result directly into Character Canon.

---

## Register integrity rules

1. `APPROVED` means the whole sequence passed QA, not merely the cover.
2. `PUBLISHED` requires actual publication; scheduling is not publication.
3. `LEARNED` requires a written learning, not just metrics copied into a row.
4. Hard-dependency posts cannot advance to final approval while upstream visual facts are unresolved.
5. Scene Packet path must be added before `SCENE_LOCKED`.
6. If a post is abandoned, mark `VOID`; do not silently recycle its planned event as if it happened.
