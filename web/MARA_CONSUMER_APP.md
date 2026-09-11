# Mara Consumer App

Status: implemented mobile-first shell on `codex/full-product-realization-v1`; no production cutover.

## Mental model

The consumer should feel that they opened Mara, not that they navigated an internal feature map. Primary navigation is `Inicio / Descubrir / Mensajes / Tú` on mobile and preserves the same model on desktop.

## Inicio

`/app` gives Mara Vera a privileged first-presence position without defining the entire marketplace. It then reads published creator Worlds, normalized creator content when enabled, and existing active commerce offers as truthful fallback inventory. Empty states explicitly refuse fake content, fake sales and fake creator activity.

## Descubrir

`/app/discover` shows Mara Vera first and then only real published creator Worlds. Creator profiles live at `/app/people/[slug]`. A profile can surface follow, message, request and commercial offers only when the corresponding real capability exists and its feature flag is enabled.

## Mensajes

`/app/messages` separates existing conversations from discovery. Mara Vera remains available through the existing Creator Zero experience. Creator conversations use real persisted threads only when messaging is enabled. `/app/messages/[slug]` uses server-owned thread/message APIs; the client cannot decide whether it is the creator or consumer sender.

## Tú

`/app/me` is the consumer ownership surface. It reads purchases from the canonical commerce tables, request state when enabled, and membership state when enabled. Counteroffers can be accepted from this surface; the next state is `payment_pending`, after which the consumer reviews and pays through the existing offer/checkout path.

## Interaction and commerce

Commerce is contextual. Creator profiles, feed content, conversations and requests may lead to a real `commerce_offer`. The global consumer navigation does not expose Shop, CRM, WTP or Demand Engine. Demand remains available contextually through existing routes and future recommendation surfaces.

## Mobile behavior

The shell uses `100dvh`, safe-area aware bottom navigation, touch targets designed around 44px+, portrait-first layouts and a bounded desktop app canvas. The release smoke covers 375×667, 390×844, 430×932, 768×1024 and 1440×900.

## Truthfulness boundary

No fake follower counters, fake threads, fake typing, fake purchases or fake messages are introduced. Missing persistence is represented by disabled capability flags and honest empty states.