# MARA — PRODUCT ARCHITECTURE V2

Status: **CANONICAL PRODUCT ARCHITECTURE**
Parent authority: `MARA_FOUNDER_CONSTITUTION_V3.md`
Effective: 2026-09-20
Supersedes: `MARA_PRODUCT_ARCHITECTURE_V1.md`

# 1. ARCHITECTURE IN ONE VIEW

`CREATOR IDENTITY & SITE`
+
`DEMAND INTELLIGENCE`
+
`COMMERCE & FULFILLMENT`
+
`AUDIENCE MEMORY & RETENTION`

→ `CREATOR SITE`
→ `FULFILLED DEMAND GMV + RETURN`

The Creator Site is the public container. Mara is the shared operating and intelligence layer.

# 2. PUBLIC INFORMATION ARCHITECTURE

Target:
- `/` — Mara network home;
- `/<creator>` — canonical Creator Site;
- creator-site modules for offers, demand, experiences and history as evidence requires;
- `/creator` — Creator OS;
- `/me/history` — account activity/history.

Legacy `/world/<slug>` may remain temporarily as a compatibility route but is not canonical.

# 3. CREATOR SITE CONTRACT

The site must answer immediately:
- who is this creator;
- what can I do here;
- why should I stay;
- what is the primary action.
A Creator Site is modular, not a fixed profile template.

Possible modules:
- identity / bio / links;
- featured offer;
- catalog;
- experiences;
- audience requests;
- active demand;
- membership;
- drops;
- community proof;
- personal history.

Fan-facing UX must not look like enterprise software.

# 4. CREATOR OS

Creator OS is the business operating surface.

Primary sections:
- Sales;
- Demand;
- Customers;
- Offers;
- Fulfillment;
- Site;
- Next Best Action.

The default question is not “what chart can we show?”
It is “what should the creator do next and why?”

# 5. DOMAIN MODEL

Canonical business terms:
- Creator;
- Creator Site;
- Audience Member;
- Preference Signal;
- Demand Request;
- Demand Cluster;
- WANT / PLEDGE / COMMIT;
- Offer;
- Purchase;
- Entitlement;
- Fulfillment;
- History Event.

Legacy internal `world_id`, `worlds`, `creator_world_*` identifiers are compatibility debt, not product language.
# 6. PUBLIC VS PRIVATE CREATOR

One product, configurable exposure.

PUBLIC CREATOR:
- public name and image;
- links/socials;
- recognized existing audience.

PRIVACY-PROTECTED CREATOR:
- pseudonym/alias;
- controlled media/voice;
- geography and exposure limits.

Do not fork the architecture.

# 7. SEO / DISTRIBUTION

Creator Sites should support:
- creator-specific metadata;
- title and description;
- OpenGraph;
- canonical URLs;
- shareability;
- structured data where appropriate;
- fast mobile rendering.

# 8. NETWORK LAYER

Cross-creator discovery is allowed only when relevant.
Mara may eventually use audience overlap, demand similarity, transaction outcomes and creator collaborations to improve discovery.

Do not turn this into a generic infinite feed.

# 9. COMMERCE CLARITY

When money moves, show:
- exact item;
- price;
- seller/fulfillment responsibility;
- delivery expectation;
- material rules;
- cancellation/refund terms where applicable.

# 10. MIGRATION PRINCIPLE

Prefer semantic migration before database rewrite.
Public UX and docs move to Creator Site now.
Internal World-named primitives may be renamed later through explicit migrations after launch-critical risk is lower.

# 11. ARCHITECTURAL TEST

Public:
`I OPEN A CREATOR'S SITE → I SEE VALUE → I PARTICIPATE/BUY/REQUEST → MARA REMEMBERS → I RETURN`

Business:
`AUDIENCE → DEMAND → OFFER → PURCHASE → FULFILLMENT → MEMORY → NEXT BEST ACTION`

**NO MERGE unless Ignacio explicitly writes `mergea`.**
