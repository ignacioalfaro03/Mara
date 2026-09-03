# Mara Vera — Lean Adult Content Stack for Alpha

Date: 2026-09-02
Status: Foundation / launch architecture

## Decision

For Alpha, do **not** build a custom adult subscription platform, custom adult checkout, or permanent NSFW infrastructure.

Use a split stack:

1. **Mara owned web** = brand, relationship, onboarding, safe discovery, memory, Life State, continuity.
2. **Fanvue** = temporary adult commerce and explicit media layer: subscriptions, PPV, DMs, voice notes, payouts, KYC, adult moderation.
3. **TensorHub** = low-commitment NSFW generation layer for adult synthetic images/video experiments using models whose specific permissions allow sale of generated content.
4. **TensorArt** = optional SFW identity/LoRA training layer where useful, then sync/use the identity model in TensorHub for NSFW generation.
5. **X** = explicit-capable organic acquisition channel where adult AI content is correctly labeled/sensitive.
6. **Instagram/TikTok and public web** = SFW acquisition only.
7. **Bunny Storage/CDN** = future first-party adult asset storage if/when Mara needs to serve owned explicit media; not needed for initial Alpha because Fanvue can host paid adult media.

## Why this is the cheapest viable route

### Fanvue

- No fixed platform subscription cost for the creator is required to earn.
- Standard creator share: 80%; Fanvue retains 20%.
- Supports AI creators and requires AI disclosure.
- Supports NSFW creator accounts.
- Supports subscriptions, PPV, direct messages, voice notes and automated/AI-assisted messaging.
- Universal bank transfer payout is documented for international creators.
- Handles KYC and adult-platform moderation/compliance operations that would otherwise become Mara's cost.

For an Alpha with low or zero revenue, a revenue share is preferable to fixed merchant/compliance costs.

### Do not use Fansly or LoyalFans for photorealistic Mara

Current policies prohibit photorealistic/lifelike substantially AI-generated content or AI-generated media designed to appear as real humans. LoyalFans terms also state AI-generated/deepfake creator content is prohibited.

### Fancentro

Useful adult platform benchmark and viable fallback for traditional adult creator monetization (80% creator share), but current official research did not establish an equally clear policy welcoming a fully photorealistic synthetic AI creator. Do not assume approval without written confirmation.

## Fanvue commercial boundary

Important: Fanvue requires paid services/content sold through Fanvue to be delivered on-platform and prohibits off-platform payment/delivery in exchange for value.

Therefore during the Fanvue Alpha:

- paid Fanvue entitlement stays on Fanvue;
- Mara owned web can remain a free relationship/product surface;
- do not promise a Fanvue purchase unlocks paid web features unless Fanvue explicitly authorizes the arrangement;
- do not route Fanvue users to an external payment processor.

This is a temporary architecture, not the final Mara economy.

## Cheapest first monetization surface

Recommended initial structure:

- Follow Mara for free on Fanvue.
- Low-friction monthly subscription if/when activated.
- Subscriber feed contains meaningful exclusive Mara material.
- PPV is used selectively for scoped premium sets/continuations, not constant cash-grab prompts.
- DMs and voice notes are used for relational continuity and contextual offers.

Do not allow spending to change Mara's baseline warmth, identity or relationship treatment.

Fanvue's own 2026 creator guidance reports that subscriptions account for only about 10% of first-two-month creator earnings in its dataset, while paid DMs account for roughly 60%. Treat this as platform directional evidence, not a guarantee for Mara.

## Adult media generation

### Alpha: TensorHub

TensorHub explicitly positions itself for mature/NSFW generation. It uses paid Tokens rather than daily free credits.

Use only checkpoints/LoRAs whose individual project permissions explicitly allow the intended commercial use, especially:

- sell generated contents;
- use on generation services where relevant.

Do not assume all TensorHub models share the same commercial license.

### Character consistency workflow

1. Freeze Mara's original adult face/body identity with SFW canonical references.
2. Train or refine identity with non-explicit references on an eligible training tool.
3. Generate NSFW only in a service/model combination that permits it.
4. QA every output for same-Mara recognition, anatomy, adult presentation, rights and canon.
5. Only approved assets enter the content vault.

TensorHub currently does not provide the same online training/ComfyUI workflow builder as TensorArt; identity training may therefore remain separate from NSFW generation.

## Future owned explicit storage

If Mara later needs first-party explicit content delivery, Bunny Storage + Bunny CDN is the leading lean candidate from current research:

- adult content is explicitly accepted if legal;
- Standard Storage: approximately USD 0.01/GB per storage region;
- USD 1 monthly minimum while active;
- storage-to-CDN integration supported;
- API requests and storage API egress are not separately charged; CDN delivery is charged.

Do not put Mara's explicit content library on Vercel. Vercel's 2026 Acceptable Use Policy prohibits content that is obscene/graphic and therefore is a poor foundation for Mara's NSFW media layer. Keep Vercel limited to public-safe Mara unless Vercel gives explicit written approval for a different scope.

## Adult traffic acquisition

### X

X currently permits consensually produced adult nudity and sexual behavior, including AI-generated adult content, when correctly labeled as adult/sensitive and not used in high-visibility surfaces such as profile/header imagery.

Use X for:

- explicit-aware discovery;
- teaser clips/images where policy-compliant;
- Mara personality/lifestyle;
- link traffic toward Fanvue and owned web.

Do not rely on X's own monetization for adult content; its content monetization policy restricts adult/sexual content.

### Instagram / TikTok

Use SFW Mara only. Do not build acquisition around trying to evade platform adult-content rules.

## Voice

For Alpha, pre-recorded voice notes are cheaper and strategically better than realtime voice.

### ElevenLabs

Current general Prohibited Use Policy does not state a blanket prohibition on fictional consensual adult sexual speech, but its Image & Video terms explicitly prohibit sexually explicit generated image/video content. Because Mara is an adult-entertainment business, do not infer that every ElevenLabs product is approved for explicit production.

Before using highly explicit voice commercially:

- get written confirmation for the intended TTS use case; or
- use a commercially licensed self-hosted TTS engine whose license and voice provenance permit the use.

### Self-hosted fallback

Commercial-friendly open-weight candidates should be evaluated for Mara-specific Spanish quality and expressiveness. Do not ship a voice merely because the model is permissively licensed.

The voice must remain original or properly licensed; never clone an identifiable person's voice without rights.

## Chat / relationship engine

The final Mara cannot depend on a general-purpose API that may reject the core adult dialogue use case.

Preferred architecture:

- owned Relationship Engine, Life State and memory layer;
- adult-capable text model selected only after provider/model terms are validated;
- keep model provider replaceable;
- never store raw sexual conversation/preference details in generic analytics;
- adult memory requires explicit consent and user deletion/reset controls.

For the earliest Alpha, relationship value can be proven with mostly text and bounded content before paying for permanent realtime inference infrastructure.

## Compliance minimum

Permanent launch rules:

- adults only;
- original synthetic Mara identity;
- no real-person sexual deepfake/likeness/voice without explicit rights;
- no minor/minor-coded content;
- no non-consensual sexual content;
- no illegal/extreme prohibited content;
- clear AI disclosure at account/product level;
- price/value/terms transparent;
- no hidden charges;
- no affection conditional on spend;
- paid promises fulfilled literally;
- retain provenance/license evidence for every commercial generation model and voice source.

## Chile tax / commercial reality

SII explicitly treats creator revenue from subscriptions, tips/donations, PPV and digital content as creator income categories. Current 2026 guidance also requires Chile-resident digital content creators to document relevant platform-derived income under applicable tax rules. Do not treat foreign-platform payouts as invisible or tax-free.

If Mara later sells directly from its own site, Chilean ecommerce requirements around provider identification, total price, conditions, contactability and fulfillment must be handled directly by Mara's operator.

## Alpha cost posture

### Fixed spend target

- Mara public web: near USD 0 while within free/approved scope.
- Fanvue account/content hosting/payment layer: USD 0 fixed; 20% of actual gross transactions.
- TensorHub generation: small purchased-token pilot only; cap initial experiment spend.
- Voice: USD 0 until a provider/use case passes commercial rights/policy QA, or minimal approved plan if justified.
- Own adult storage: USD 0 initially; Bunny later starts around USD 1/month minimum.
- Own adult merchant account: USD 0 initially; defer Segpay/CCBill/CentroBill until first-party paid product economics justify complexity.

### Founder rule

> PAY REVENUE SHARE BEFORE FIXED COMPLIANCE COST WHEN REVENUE IS STILL UNKNOWN.

> OWN THE RELATIONSHIP FIRST. OWN THE ADULT PAYMENT RAILS LATER.

## Recommended execution order

1. Finish canonical Mara face/body + 9–12 strong SFW assets.
2. Open/verify Fanvue AI creator account and declare explicit content accurately.
3. Produce first small explicit Mara set using commercial-permitted TensorHub model(s).
4. Upload SFW public profile media + private explicit set to Fanvue.
5. Keep Mara owned web as the free Relationship/Experience entry point.
6. Start X adult-aware organic acquisition + Instagram/TikTok SFW acquisition.
7. Use pre-recorded voice notes only after voice policy/license clears.
8. Measure voluntary return, subscriptions, PPV unlocks and DM engagement.
9. Only after traction: Bunny first-party NSFW vault + adult processor due diligence + deeper Relationship Engine integration.

## Explicitly deferred

- custom OnlyFans clone;
- own adult checkout;
- recurring adult merchant fees;
- realtime voice;
- persistent GPU instances;
- large image/video batch generation;
- paid acquisition;
- external adult-media crawler;
- public Caprichos payments;
- expensive LoRA training pipeline before canonical Mara identity is stable.
