# Mara Creator OS

Status: implemented surface on the product-realization branch. Persistence-dependent modules remain feature-flagged until their migrations are activated and verified.

## Job to be done

Creator OS answers four questions: what happened, who needs attention, what should I sell, and what must I deliver. It is deliberately separate from the intimate consumer UI.

## Implemented today

`/creator` reads the existing authenticated creator, Worlds, customer summary, purchases, offers, demand opportunities and deterministic Next Best Action. It shows revenue/GMV context, repeat customers, pending fulfillment, the strongest demand opportunity, customer rows and the next recommended action.

The same surface now supports creation of a World/profile and universal commerce offers using the existing `commerce_offers` model. It also includes a content composer and recent-content list behind `MARA_CONTENT_SYSTEM_ENABLED`, plus a request queue behind `MARA_REQUESTS_SYSTEM_ENABLED`.

Request operations support accept, counter, decline, start, deliver and complete. Accept/counter creates or reuses a canonical `commerce_offer`; payment therefore stays on the existing checkout/purchase backbone. Delivery uses the existing creator fulfillment RPC after validating a succeeded purchase.

## Customer intelligence

`/creator/customers/[userId]` is scoped to the owning creator. It combines creator-specific GMV/purchase history, lifecycle stage, visible user preferences, permissible demand context, deterministic Next Best Action, creator-private Debilidad and creator-private notes.

Debilidad in Creator OS is a creator-authored commercial/context note. It is intentionally separate from the older user-declared `weakness` preference. The customer never sees creator-private Debilidad or notes.

## Next Best Action

The current engine remains deterministic and evidence-based. It prioritizes unfulfilled paid value, protects recent buyers from immediate pressure, follows up first buyers, reactivates dormant relationships with value, suggests related offers to repeat buyers, and otherwise asks for more signal. No opaque ML is required for the first commercial loop.

## Not yet active

Recurring billing, payouts, advanced revenue accounting, bulk campaigns, creator-side media upload orchestration, admin moderation and sophisticated segmentation are not represented as active capabilities. They must be added only after the core sell → deliver → learn loop is proven.