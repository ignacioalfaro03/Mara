# MARA — CREATOR REVENUE CRM + CUSTOMER INTELLIGENCE V1

Status: **SPECIALIST PRODUCT STRATEGY**  
Parent authority: `MARA_FOUNDER_CONSTITUTION_V2.md`  
Product home: Creator OS across Demand + Commerce + World/Memory  
Effective: 2026-09-08

> **MARA SHOULD HELP THE CREATOR MAKE MORE MONEY PER CUSTOMER WITHOUT NEEDING TO BECOME A CRM EXPERT.**

This document consolidates Creator OS / Fan Intelligence into a practical **Revenue CRM**. It does not create a fifth platform engine. It exists to turn Customer Memory, Demand, commerce history and lightweight preference discovery into better creator decisions.

---

# 1. BUSINESS JOB

The CRM must help a creator answer:

- **WHO SHOULD I SELL TO?**
- **WHAT SHOULD I SELL THEM?**
- **HOW SHOULD I SELL IT?**
- **WHEN SHOULD I SELL IT?**
- **AT WHAT PRICE / FORMAT?**
- **WHAT EXPERIENCE WILL MAKE THEM WANT TO RETURN?**

Economic loop:

`BETTER CUSTOMER UNDERSTANDING → BETTER EXPERIENCE → BETTER OFFER → HIGHER CONVERSION → MORE REPEAT PURCHASE → HIGHER CUSTOMER LTV → HIGHER CREATOR EARNINGS → HIGHER MARA REVENUE`

The CRM does not optimize engagement for its own sake. It optimizes **creator earnings + customer satisfaction + repeat purchase**.

---

# 2. PRODUCT PRINCIPLE — NEXT BEST ACTION

Creators should not need dashboards full of charts.

Mara should translate context into action.

Bad output:

> You have 427 users.

Better output:

> 18 previous audio buyers are showing interest in personalized audio. This may be a good moment to test a limited offer.

Core output:

# NEXT BEST ACTION

The product should reduce guessing, not create more work.

---

# 3. CUSTOMER MEMORY

Mara should build a persistent, creator-scoped commercial understanding of each customer from legitimate, consented signals.

Customer Memory may include:

## Relationship context
- Mara user ID / alias;
- creator relationship age;
- first and latest meaningful interaction;
- first and latest purchase;
- membership state;
- creator-specific history.

## Purchase behavior
- products/categories purchased;
- prices paid;
- purchase frequency;
- AOV;
- creator-specific cumulative GMV;
- repeat interval;
- bundles/personalized products/memberships;
- cancellations/refunds;
- source attribution.

## Demand behavior
- WANTs;
- PLEDGEs;
- COMMITs;
- requests created/joined;
- WTP;
- desired formats;
- unfulfilled/unlocked/fulfilled demand.

## Preference behavior
- declared format/style preferences;
- lightweight taste-game choices;
- repeated observed choices;
- purchase-supported preferences;
- timing preferences where legitimately declared;
- language and interaction format preferences.

## Experience history
- what the user unlocked;
- what they joined;
- what they helped make happen;
- what they bought;
- what was fulfilled;
- what they abandoned;
- what brought them back.

Customer Memory is not a surveillance dossier.

---

# 4. SIGNAL PROVENANCE

Every meaningful preference or commercial signal must preserve provenance.

Canonical classes:

- **DECLARED** — user explicitly said/chose it;
- **OBSERVED** — literal event/transaction happened;
- **DERIVED** — transparent rule created a suggestion from evidence.

Every derived signal should include:

- source;
- confidence;
- scope;
- created_at;
- last_confirmed_at where useful;
- user editability where applicable;
- creator visibility rule.

Permanent rule:

`USER SAID THIS != MARA INFERRED THIS`.

Do not silently turn weak behavior into psychological certainty.

---

# 5. “MY WEAKNESS” — USER-DECLARED PREFERENCE

Mara may provide an optional free-text field branded as **My Weakness** or a softer equivalent such as:

- What gets you?
- What always works on you?
- What are you into lately?
- Tell Mara what you can't resist.

Example:

> **What's your weakness?**
> Tell Mara in your own words. You can change or delete this later.

This is a user-declared preference signal, not a vulnerability score.

Conceptual contract:

### UserDeclaredPreference
- user_id;
- creator_id nullable;
- scope: NETWORK | CREATOR_WORLD;
- source: FREE_TEXT;
- raw_text;
- normalized non-sensitive tags;
- created_at;
- updated_at;
- user_editable;
- user_deletable.

Mara may use it to improve relevance, offer fit and discovery.

---

# 6. IMPORTANT “WEAKNESS” BOUNDARY

“Weakness” is brand language only.

It is **not** authorization to exploit vulnerability.

Do not target or optimize based on inferred:

- loneliness;
- emotional distress;
- mental-health state;
- addiction;
- compulsive spending;
- financial desperation;
- dependency;
- fear of abandonment;
- sexual vulnerability inferred from private behavior.

Allowed logic:

`PREFERENCE → RELEVANCE → BETTER EXPERIENCE`.

Forbidden logic:

`VULNERABILITY → PRESSURE → PURCHASE`.

Revenue should come from **relevance + value + timing + trust**.

---

# 7. MARA TASTE GAMES

Mara should learn progressively through lightweight, optional choices rather than long onboarding questionnaires.

Primary mechanic:

# CHOOSE BETWEEN TWO OPTIONS

Examples:

## Image vs image
> Which one is more you?

## Situation vs situation
> Pick one.

## Format vs format
> Audio or photos?

## Experience vs experience
> Something personalized or a limited drop?

## Style vs style
> Playful or direct?

## Timing
> Day or night?

Only ask questions relevant to the consented product experience.

The interaction should feel like **Mara getting to know the user**, not like market research.

Possible copy:

- Quick one. Pick without thinking too much.
- Mara wants to know something.
- Which one wins?
- Okay… interesting.
- I think I'm starting to understand you.

---

# 8. PROGRESSIVE PROFILING

Do not ask 30 questions at signup.

Learn slowly:

`ENTER → ONE OPTIONAL CHOICE → BEHAVIOR → ANOTHER SMALL CHOICE → PURCHASE/DEMAND EVENT → RELEVANT FOLLOW-UP → BETTER CONTEXT`

Permanent rule:

> **ONE SMALL QUESTION CAN BE MORE VALUABLE THAN ONE GIANT FORM.**

Every question must answer:

> How will this signal improve the user's experience or the creator's decision?

If there is no clear answer, do not ask it.

---

# 9. TASTE GRAPH

Over time Mara may maintain a lightweight Taste Graph.

Example:

`USER → prefers AUDIO → tends toward PERSONALIZED → prefers ASYNC → responds to LIMITED DROPS → usually buys around RANGE X → repeatedly chooses STYLE A`

This graph exists to improve product relevance.

Do not expose pseudo-scientific psychological scores.

Creator-facing translation should be practical:

> This customer tends to prefer personalized audio and has purchased similar offers twice.

Not:

> Psychological profile: 84/100.

---

# 10. CREATOR CUSTOMER 360

The creator should see synthesized commercial context, not every raw signal.

Customer 360 should answer:

## WHO IS THIS CUSTOMER?
Commercial relationship/history.

## WHAT DO THEY TEND TO VALUE?
Declared + observed preferences with provenance.

## WHAT HAVE THEY BOUGHT?
Purchase history.

## WHAT HAVE THEY WANTED BUT NOT BOUGHT?
Demand/conversion gaps.

## HOW OFTEN DO THEY RETURN?
Purchase cadence.

## WHAT MAY BE THE NEXT RELEVANT OFFER?
Opportunity.

## WHAT SHOULD THE CREATOR DO NEXT?
Action.

Example creator view:

### What they like
- personalized audio;
- shorter formats;
- limited releases.

### What they told us
> “I love when something feels made specifically for me.”

### What behavior supports
- 3 audio purchases;
- 2 personalized requests;
- joined 4 similar demand objects.

### Possible next offer
Personalized short-form audio.

### Recommended timing
Not now — customer purchased yesterday.

---

# 11. AUTOMATIC SEGMENTATION

Initial dynamic segments:

## Lifecycle
- NEW;
- PROSPECT;
- FIRST_BUYER;
- REPEAT_BUYER;
- HIGH_VALUE;
- MEMBER;
- DORMANT;
- REACTIVATED;
- CHURN_RISK;
- RETURNED.

## Commercial behavior
- audio buyers;
- personalized-product buyers;
- membership candidates;
- premium buyers;
- bundle buyers;
- demand-heavy / purchase-light;
- low-price buyers;
- high-WTP users.

## Intent
- interested;
- pledged;
- committed;
- abandoned;
- waiting for unlock;
- recently fulfilled;
- likely ready for another relevant offer.

Segments update automatically. Do not require spreadsheet-style manual tagging as the default.

---

# 12. FOUR QUESTIONS THE CRM MUST ANSWER

## WHAT SHOULD I SELL?
Use demand + purchase history + preference fit + WTP + inventory + fulfillment cost.

## WHO SHOULD I SELL IT TO?
Identify best-fit customers/segments rather than broadcasting to everyone.

## WHEN SHOULD I SELL IT?
Use recency, purchase cadence, demand momentum, recent fulfillment and creator activity.

## HOW SHOULD I SELL IT?
Recommend one-time offer, bundle, personalized offer, membership, demand threshold, early access, creator message or World-native placement.

Important:

`PRODUCT FIT != TIMING FIT`.

A strong product match may still be a bad moment to sell.

---

# 13. NEXT BEST ACTION ENGINE

Potential actions:

- wait / no offer yet;
- welcome;
- introduce first paid product;
- offer related product;
- bundle;
- upsell;
- cross-sell;
- invite to membership;
- offer personalization;
- reactivate;
- follow up after fulfillment;
- test pricing hypothesis;
- launch requested format;
- ask one preference question;
- create demand rather than supply.

Recommendations should be explainable and evidence-backed.

Do not spam users because they are commercially valuable.

---

# 14. REVENUE OPPORTUNITY ENGINE

Conceptual prioritization:

`OPPORTUNITY_SCORE = INTENT × PRODUCT_FIT × TIMING_FIT × WTP × REPEAT_PROPENSITY × FULFILLMENT_FEASIBILITY`

This is a prioritization signal, not certainty.

Possible output:

> 27 repeat buyers who purchased the last audio are showing demand for personalized content. Estimated opportunity: X–Y. **Test offer**.

Mara should communicate confidence/uncertainty where appropriate.

---

# 15. TASTE → DEMAND → OFFER

Preference discovery should feed the Demand Engine.

Example:

- 20 users repeatedly choose PERSONALIZED AUDIO;
- 12 explicitly request something similar;
- 8 provide meaningful WTP.

Mara may detect a demand cluster and show:

> **Your World may have an opportunity.**
> 20 people prefer this format. 12 requested something similar. 8 indicated willingness to pay.
> **Test offer**

The system should connect passive taste discovery to economic opportunity without pretending that preference equals purchase intent.

---

# 16. CREATOR HOME — TODAY

Default creator home should remain simple.

## 1. BEST OPPORTUNITY
One commercially meaningful action.

## 2. CUSTOMERS TO PAY ATTENTION TO
Small number of meaningful segments/customers.

## 3. WHAT YOUR WORLD WANTS
Top emerging demand.

## 4. WHAT IS WORKING
One or two useful insights.

## 5. NEXT ACTION
One clear CTA.

Mara acts as a lightweight advisor, not a heavy chatbot.

Examples:

> Mara noticed something.

> There may be money here.

> Do this next.

Goal:

# FEWER DECISIONS FOR THE CREATOR.

---

# 17. USER CONTROL

Users must be able to:

- skip preference questions;
- avoid taste games;
- view relevant declared preferences;
- edit them;
- delete/reset them where appropriate;
- change their mind.

A preference is not a permanent identity label.

Mara should support:

> **That's not me anymore.**

---

# 18. CREATOR-SCOPED VS NETWORK-SCOPED MEMORY

## Creator-scoped CRM
Creator A may see legitimate context about the user's relationship with Creator A.

Creator A does not automatically see:

- purchases with Creator B;
- private conversations with Creator B;
- unrelated demand;
- legal identity;
- protected location;
- raw network-level intimate preference history.

## Mara network intelligence
Mara may use appropriately governed aggregate/network information for:

- recommendations;
- discovery;
- merchandising;
- fraud prevention;
- demand aggregation;
- cross-World experience.

Do not expose raw cross-creator histories to individual creators.

---

# 19. FREE VS PRO

## MARA FREE
Must be genuinely useful enough to start and grow:

- customer history;
- basic demand;
- returning-customer identification;
- simple automatic segments;
- basic opportunities;
- basic Next Best Action;
- basic sales analytics;
- first-offer guidance;
- basic preference insights.

Promise:

> **FREE HELPS YOU BUILD THE BUSINESS.**

## MARA PRO
Optimizes sales, intelligence and automation:

- advanced segmentation;
- advanced Next Best Action;
- LTV analysis;
- churn/reactivation signals;
- automated lifecycle campaigns;
- advanced pricing hypotheses;
- demand forecasting;
- bundle recommendations;
- merchandising;
- deeper attribution;
- advanced geographic demand;
- scheduled automation;
- advanced customer journeys;
- richer Taste Graph / preference synthesis where lawful and useful.

Promise:

> **PRO HELPS YOU OPTIMIZE IT.**

Do not make basic privacy controls or essential customer rights paid-only.

---

# 20. MVP CRM

The first useful slice should prove only:

## A. CUSTOMER HISTORY
Who bought, wanted, pledged, committed and returned.

## B. SIMPLE SEGMENTS
New / first buyer / repeat / high intent / dormant.

## C. DECLARED PREFERENCE
One optional free-text or lightweight choice signal with provenance.

## D. OPPORTUNITY
One understandable revenue opportunity.

## E. NEXT BEST ACTION
One recommended creator action.

## F. RESULT
Did it create sale, repeat sale, fulfillment or return?

No advanced ML is required. Begin with deterministic, explainable rules.

---

# 21. METRICS

Primary economics:

- GMV / active creator;
- creator net earnings;
- creator earnings / creator hour;
- second-purchase rate;
- repeat purchase rate;
- purchase frequency;
- AOV;
- creator-specific customer LTV;
- demand → purchase conversion;
- fulfilled-demand GMV;
- creator retention.

CRM-specific:

- recommendation acceptance;
- Next Best Action conversion;
- incremental GMV attributable to CRM guidance;
- reactivation conversion;
- membership/bundle conversion;
- creator time saved;
- creator-reported usefulness.

Taste discovery metrics:

- optional answer rate;
- preference edit/reset rate;
- recommendation relevance improvement;
- preference → demand correlation;
- preference → purchase correlation.

Do not optimize number of questions asked or number of recommendations generated.

---

# 22. WHAT NOT TO BUILD EARLY

- giant BI dashboards;
- hundreds of metrics;
- Salesforce-style pipelines;
- dozens of manual tags;
- invasive dossiers;
- black-box psychological scores;
- endless quizzes;
- forced intimate disclosures;
- autonomous spam;
- vulnerability targeting;
- advanced ML before sufficient transaction data;
- separate CRM/taste labs when existing Creator OS / demand labs can test the hypothesis.

---

# 23. BUILD FILTER

For every CRM/taste feature ask:

> **WILL THIS HELP THE CREATOR MAKE A BETTER DECISION THAT IMPROVES CUSTOMER EXPERIENCE OR CREATOR REVENUE?**

If no: do not build it.

And for every user question ask:

> **HOW WILL THIS SIGNAL IMPROVE THE USER'S EXPERIENCE OR THE CREATOR'S DECISION?**

If unclear: do not ask it.

---

# 24. FINAL PRODUCT EXPERIENCE

A creator should open Mara and immediately understand:

> **THIS IS WHAT MY CUSTOMERS WANT.**

> **THIS IS WHO IS MOST LIKELY TO CARE.**

> **THIS IS WHAT I SHOULD SELL.**

> **THIS IS WHEN I SHOULD SELL IT.**

> **THIS IS HOW I SHOULD PACKAGE IT.**

> **THIS IS WHAT HAPPENED LAST TIME.**

> **THIS IS HOW I CAN MAKE MORE MONEY WHILE GIVING THEM A BETTER EXPERIENCE.**

Canonical principle:

`DECLARED PREFERENCE + LIGHTWEIGHT CHOICES + OBSERVED BEHAVIOR + DEMAND + PURCHASE HISTORY + FULFILLMENT HISTORY → CUSTOMER CONTEXT → NEXT BEST ACTION → BETTER OFFER → BETTER EXPERIENCE → REPEAT PURCHASE`

> **KNOW MORE → GUESS LESS → SERVE BETTER → SELL BETTER → EARN THE NEXT PURCHASE.**

**NO MERGE unless Ignacio explicitly writes `mergea`.**
