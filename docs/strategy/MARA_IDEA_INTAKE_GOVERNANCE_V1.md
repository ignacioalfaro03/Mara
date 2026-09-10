# MARA — IDEA INTAKE GOVERNANCE V1

Status: **MANDATORY STRATEGY HYGIENE**  
Parent authority: `MARA_FOUNDER_CONSTITUTION_V2.md`  
Effective: 2026-09-08

Purpose: stop good ideas from becoming disconnected product commitments.

---

# 1. RULE

> **A CHAT IDEA IS NOT A ROADMAP ITEM.**

Every new idea must be evaluated before it becomes strategy, code, a new lab or a new founder document.

---

# 2. INTAKE FIELDS

Every meaningful idea must answer:

- **IDEA** — one sentence;
- **USER** — creator / buyer / Host / operator / internal;
- **PROBLEM** — what real problem it solves;
- **CORE ENGINE** — PRIVACY / DEMAND / COMMERCE / WORLD-RETENTION;
- **EXPECTED KPI IMPACT** — one measurable outcome;
- **MONETIZATION / RETENTION IMPACT** — what economic or return behavior changes;
- **COMPLEXITY** — LOW / MEDIUM / HIGH;
- **FOUNDER BURDEN** — LOW / MEDIUM / HIGH;
- **PHASE** — NOW / NEXT / LATER / NOT NOW;
- **DECISION** — ACCEPT / MERGE / DEFER / REJECT;
- **DESTINATION** — existing surface/doc/backlog item it belongs to.

If `CORE ENGINE` or `EXPECTED KPI IMPACT` is blank, the idea cannot enter the roadmap.

---

# 3. WORKFLOW

`INBOX → EVALUATED → ACCEPTED / MERGED / DEFERRED / REJECTED`

## ACCEPTED

Fits an existing engine, current phase and KPI.

## MERGED

Good idea, but it belongs inside an existing concept rather than becoming a new product family.

## DEFERRED

Strategically coherent but sequence is wrong.

## REJECTED

No material strategic value, duplicates another primitive, creates excess operational load or fails safety/economics constraints.

---

# 4. NEW LAB RULE

A new DEV lab requires all of:

1. the hypothesis cannot be cleanly tested in an existing lab;
2. it materially supports a NOW/NEXT gate;
3. its success/failure metric is explicit;
4. there is a plan to merge the learning back into canonical architecture;
5. it does not create a parallel ledger/business primitive.

Default answer: extend `demand-marketplace-lab` or an existing specialist lab.

---

# 5. NEW STRATEGY DOCUMENT RULE

Do not create another “Founder Amendment” for normal feature evolution.

Use:

- Constitution only for company-level replacement;
- Product Architecture for engine/surface changes;
- Roadmap for sequencing;
- specialist docs for detailed product contracts;
- backlog for unvalidated ideas.

Any future document that intends to replace the Constitution must explicitly:

- say what is being replaced;
- update README authority;
- update Product Architecture;
- update Roadmap;
- resolve conflicting historical docs.

---

# 6. DECISION TEMPLATE

```md
## IDEA
...

## USER / PROBLEM
...

## CORE ENGINE
PRIVACY | DEMAND | COMMERCE | WORLD-RETENTION

## KPI
...

## ECONOMIC / RETENTION EFFECT
...

## COMPLEXITY / FOUNDER BURDEN
...

## PHASE
NOW | NEXT | LATER | NOT NOW

## DECISION
ACCEPT | MERGE | DEFER | REJECT

## DESTINATION
Existing file/surface/backlog item
```

---

# 7. FOUNDER FILTER

Before accepting an idea ask:

> **Does this make creator supply safer, demand stronger, fulfillment more valuable, repeat behavior better, or operations materially more efficient?**

If not, do not build it.

If yes but it is not NOW, defer it explicitly.

---

# FINAL RULES

> **NO ORPHAN IDEAS.**

> **NO FEATURE WITHOUT A STRATEGIC HOME.**

> **NO ROADMAP ITEM WITHOUT A KPI.**

> **NO NEW LAB BY DEFAULT.**

> **CONSOLIDATE BEFORE EXPANDING.**

**NO MERGE unless Ignacio explicitly writes `mergea`.**
