# MARA — BLUSH-CLASS CONSUMER FRONTEND TEARDOWN

Status: implementation benchmark note  
Scope: consumer web only  
Authority: subordinate to `MARA_FOUNDER_CONSTITUTION_V2.md`

This document separates public benchmark evidence from product inference and Mara-specific decisions. Blush is used as a UX/product-pattern benchmark only; no proprietary source, assets, copy or pixel-level design are copied.

## Sources reviewed

- Apple App Store public listing for **Blush: AI Dating Simulator** (Endura LLC), reviewed 2026-09-10.
- Current Mara repository strategy, routes, relationship, commerce, demand, creator, world, preference and telemetry contracts.

## 1. Discovery and relationship entry

**OBSERVED BENCHMARK**  
Blush publicly describes a product built around meeting AI-created potential matches, each with a backstory and distinct dating behavior. It positions exploration of multiple storylines and private one-to-one interaction as core value.

**PRODUCT INFERENCE**  
A consumer can understand a character-first product faster when the first meaningful object is a person, not a feature taxonomy. Discovery should therefore prioritize portrait, identity, one line of context and one obvious action.

**MARA DECISION**  
Mara keeps its company thesis underneath, but the consumer shell becomes person-first. Mara Vera is structurally privileged as the guaranteed first connection, while additional existing Worlds can appear through discovery. The user should not need to learn terms such as Demand Engine, WTP, Creator OS or orchestration.

## 2. Navigation

**OBSERVED BENCHMARK**  
The benchmark is positioned as an iPhone-native dating/companion product rather than a marketplace or SaaS tool.

**PRODUCT INFERENCE**  
A small persistent navigation model is better suited to repeated personal interaction than exposing every underlying business subsystem.

**MARA DECISION**  
Consumer navigation becomes four destinations:

- `Descubrir`
- `Chats`
- `Mara`
- `Tú`

Creator/operator surfaces remain separate. Shop and Demand are no longer primary consumer tabs. Commerce and demand are surfaced contextually.

## 3. Chat as a consumer surface

**OBSERVED BENCHMARK**  
Blush publicly centers character conversation and has shipped conversation organization features.

**PRODUCT INFERENCE**  
Conversation should feel like a primary product surface, not a lab or side experiment. A user expects a recognizable chat header, readable thread, composer and media/invitation cards.

**MARA DECISION**  
Mara promotes the existing relationship experience into a production-quality consumer chat shell without creating an unlimited AI-chat dependency. Existing relationship memory, stop boundaries, preference capture and contextual commerce remain the source of truth.

## 4. Media and monetization

**OBSERVED BENCHMARK**  
The App Store listing documents in-app purchases and later product capabilities such as custom photos, custom videos, VIP gifts and subscription tiers.

**PRODUCT INFERENCE**  
Premium value is easier to understand when it appears in relationship context rather than forcing the user into a separate generic store.

**MARA DECISION**  
Mara keeps its real commerce contracts. Locked media/experience primitives become reusable consumer components, but unsupported media generation is never faked. Current paid or reference-price content can appear inside the relationship flow only when the backend says it exists. Checkout must always state what is received, price and status clearly.

## 5. Personalization and memory

**OBSERVED BENCHMARK**  
The benchmark publicly presents characters as distinct and personalized, and later versions add customization and notification controls.

**PRODUCT INFERENCE**  
Personalization is strongest when users experience continuity rather than seeing scores or configuration machinery.

**MARA DECISION**  
Mara's existing preference and relationship infrastructure remains intact. Consumer language becomes simple: `Más así`, `Menos así`, `Me interesa`, `¿Seguimos?`. Database-style scores, CRM language and WTP terminology remain invisible.

## 6. Demand

**OBSERVED BENCHMARK**  
No public benchmark evidence reviewed establishes Mara-style aggregated demand as a core Blush concept.

**PRODUCT INFERENCE**  
This is a Mara differentiator, not something to imitate from the benchmark.

**MARA DECISION**  
Demand remains strategically central but becomes invisible infrastructure in the consumer shell. Internal WANT/PLEDGE/COMMIT semantics remain truthful. Consumer surfaces translate them into understandable actions such as `Me interesa`, `Yo pagaría` and `Quiero que pase`, while preserving the distinction at commercial boundaries.

## 7. Real creators and Worlds

**OBSERVED BENCHMARK**  
The reviewed public Blush listing focuses on AI-created characters.

**PRODUCT INFERENCE**  
A direct clone would erase Mara's supply-side advantage.

**MARA DECISION**  
Mara's long-term differentiation remains real adult creator participation, privacy-controlled identity, contextual commerce, demand aggregation and fulfillment. The consumer shell may look as simple as a dating/companion product while still routing into Creator Worlds and real offers underneath.

## 8. Paywall lesson

**OBSERVED BENCHMARK**  
The App Store listing confirms subscriptions and consumable in-app purchases. Public user commentary on companion products frequently discusses paywall timing, but individual complaints are not treated as representative product fact.

**PRODUCT INFERENCE**  
A hard paywall before a user experiences meaningful value increases confusion and weakens trust.

**MARA DECISION**  
The first session must deliver real free interaction before a premium moment. Monetization follows `FREE VALUE → INTEREST → CONTEXT → PREMIUM OFFER`. No fake countdowns, fake scarcity or fabricated messages.

## 9. Reconciliation with Mara's Founder Constitution

The Founder Constitution says Mara is not primarily an AI girlfriend, not primarily a chatbot, and should not depend on deep relationship-state engineering. This refoundation does **not** replace that thesis.

The reconciliation is:

`SIMPLE PERSON-FIRST CONSUMER SHELL`

on top of

`CREATOR WORLDS + PRIVACY + DEMAND + COMMERCE + FULFILLMENT + MEMORY`.

Chat is a high-clarity interaction surface. It is not the company moat.

Mara Vera is the guaranteed first consumer connection. She is not the conceptual template for every creator and does not replace the platform's network role.

## 10. Implementation principles

1. Person before feature.
2. Four consumer destinations maximum.
3. Mara first, other Worlds later.
4. Chat looks production-grade but reuses existing relationship contracts.
5. Commerce appears in context and stays explicit at checkout.
6. Demand semantics stay accurate but consumer wording stays human.
7. Creator/admin UX remains professional and separate.
8. No unsupported capability is represented as live.
9. Mobile browser is the primary design target.
10. Desktop remains an app shell, not a stretched marketing site.
