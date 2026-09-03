# Mara Vera — Payment Provider Approval Packet

Status: provider due diligence package. No processor is approved or activated yet.

## 1. Product description

Mara Vera is an 18+ interactive entertainment product centered on a fictional adult virtual character.

Launch scope is intentionally closed-loop:

- curated Mara visual assets;
- scripted/branching interactive scenes;
- explicit 18+ age gate;
- optional account continuity;
- low-sensitivity preference memory;
- one-time paid unlocks tied to concrete experience value;
- optional contributions toward a visible in-world "Capricho" goal;
- no browser-side payment truth;
- no open image generation in the launch product;
- no user image/video uploads in the launch product;
- no user marketplace;
- no sale of affection, emotional priority, exclusivity or personality changes.

Mara may be sensual/adult. The business should be reviewed as adult/AI entertainment, not disguised as a general-audience product.

## 2. Launch commerce flow

Canonical launch loop:

`landing -> 18+ gate -> experience -> preference -> optional account -> offer -> provider checkout -> signed provider event -> server fulfillment -> Supabase purchase/entitlement -> return with continuity`

The browser can create a checkout intent but cannot mark itself paid.

Fulfillment requires a server-side signed provider event. Provider events are processed idempotently and persisted in a webhook ledger before purchase/entitlement state is exposed to the user.

## 3. Launch offers

### One-time unlock

- Offer: `private_after_scene_note_v1`
- Public title: `Nota privada de la noche`
- Price: USD 4.99
- Type: one-time digital experience unlock
- Fulfillment: persistent entitlement attached to the authenticated user

### Capricho contribution

- Offer: `black_bag_capricho_01`
- Goal: `black_bag_01`
- Public target: USD 420.00
- Type: optional contribution toward a disclosed in-world goal
- Participation is private by default
- Public progress is derived only from server-confirmed successful payments

A Capricho is not a promise of affection, exclusivity, direct access to a person, or preferential emotional treatment.

## 4. Identity, privacy and data posture

Launch account creation is optional until continuity has value.

Persisted relationship state is deliberately narrow. Current P0 continuity includes facts such as launch completion, return count, timestamps and literal visual choice.

Explicitly excluded from P0 persistence:

- inferred sexual orientation;
- inferred loneliness, distress, dependency or arousal;
- intimate free text;
- vulnerability-based commercial segmentation;
- browser fingerprints/contact graph.

Commerce rows are ownership-scoped and protected by Supabase RLS. Browser roles cannot insert payment truth.

## 5. Payment/security controls already implemented

- dedicated Mara Supabase project;
- commerce tables RLS-enabled;
- private commerce rows scoped to the authenticated owner;
- browser roles cannot create purchases, entitlements or contributions;
- checkout request idempotency;
- signed webhook verification;
- webhook replay/idempotency ledger;
- service-side fulfillment RPC;
- payment amount/currency verification against the stored checkout intent;
- production blocks the internal `signed_test` provider;
- QA signed-test checkout never moves real money.

## 6. Content/compliance posture for underwriting

Provider review should evaluate the exact live product, not hypothetical future features.

Launch controls to disclose clearly:

1. 18+ access gate.
2. Fictional/virtual AI character disclosure.
3. Curated content and bounded interaction at launch.
4. No open user-generated image/video uploads at launch.
5. No open-ended visual generation at launch.
6. No peer-to-peer creator marketplace at launch.
7. Clear prohibited-content policy.
8. Clear refund/cancellation policy for the applicable payment model.
9. Privacy policy and terms available from the public site.
10. Payment value is defined as digital experience/content access, not emotional dependency or guaranteed personal attention.

Any later expansion into open generation, uploads, live creators, marketplace behavior or materially different adult content requires a new processor/compliance review before activation.

## 7. Processor questions — obtain written answers before integration

Send the same product description to Segpay and CCBill and request explicit written confirmation for Mara's exact scope.

Required answers:

- Is this exact adult/sensual AI virtual-character product acceptable?
- Are scripted interactive adult experiences acceptable?
- Are one-time digital unlocks acceptable?
- Are user contributions toward a disclosed in-world digital goal acceptable?
- Are there prohibited AI/content categories beyond the processor's public policy?
- Is formal age verification/age assurance required beyond an 18+ gate, and in which jurisdictions?
- Which countries/regions must be blocked?
- Which card brands/acquirers are available for this scope?
- Sandbox availability and approval prerequisites.
- Hosted checkout options.
- Webhook/event signing method and replay behavior.
- Refund and chargeback API/events.
- Descriptor requirements.
- Rolling reserve requirements.
- Minimum processing volume or setup fees.
- Per-transaction, cross-border and currency fees.
- Settlement schedule and supported payout countries/currencies for the merchant entity.
- Chargeback thresholds and monitoring programs.
- Required legal pages, content moderation evidence and screenshots.
- Whether future open AI generation or user uploads would require re-underwriting.

Do not build a provider-specific production adapter until one provider answers the above and accepts the product scope in writing.

## 8. Preferred decision sequence

1. Segpay underwriting/due diligence first because it publishes specific guidance for adult AI sites.
2. CCBill in parallel as a second adult/high-risk candidate.
3. Compare written approval, reserve, effective take rate, settlement, chargeback treatment and technical integration.
4. Select one launch processor.
5. Implement only that processor adapter behind the existing server fulfillment contract.
6. Run sandbox E2E.
7. Re-run hosted payment proof.
8. Production activation remains a separate founder-authorized decision.

## 9. Known non-candidates under current public policy

Do not activate Stripe or PayPal for Mara's intended adult/sensual AI launch scope unless their applicable policies materially change and explicit written approval is obtained.

References:

- Stripe restricted businesses: https://stripe.com/legal/restricted-businesses
- PayPal Acceptable Use Policy: https://www.paypal.com/us/legalhub/paypal/acceptableuse-full
- PayPal sexually oriented goods/services policy: https://www.paypal.com/us/cshelp/article/what-is-paypal%E2%80%99s-policy-on-transactions-that-involve-sexually-oriented-goods-and-services-help384
- Segpay high-risk/adult: https://segpay.com/verticals/high-risk/
- Segpay adult AI approval roadmap: https://segpay.com/blog/your-roadmap-for-adult-ai-site-approval/
- CCBill adult businesses: https://ccbill.com/industries/adult-business
- CCBill webhooks: https://ccbill.com/doc/webhooks-overview

## 10. Current activation boundary

Provider due diligence is not provider approval.

No real payment method should be exposed publicly until:

- the provider explicitly accepts Mara's exact scope;
- merchant/entity onboarding is approved;
- sandbox credentials and webhook signing material are issued;
- fees/reserve/settlement terms are accepted;
- required compliance changes are implemented;
- the hosted sandbox loop passes;
- production deployment is separately authorized.
