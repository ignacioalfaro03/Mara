# Mara Vera Web MVP

Owned first-party web for brand, conversion, analytics and compliance.

## Local development

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run typecheck
npm run build
```

## Premium handoff

Real payment/provider activation is intentionally disabled by default.

To configure an authorized external premium destination:

```bash
NEXT_PUBLIC_PREMIUM_URL=https://authorized-provider.example/path
```

Do not populate this variable with a real provider until founder authorization and provider/compliance review are complete.

## Routes

- `/` — conversion-first Home
- `/meet-mara` — character/brand introduction
- `/premium` — premium value and configurable handoff
- `/legal` — AI disclosure, adult-only, consent, privacy and reporting requirements

## Analytics

The MVP dispatches provider-agnostic browser events through `lib/analytics.ts`. No analytics vendor is connected in this branch.

Sensitive conversation content, payment data and identity documents must never be sent through the generic analytics event layer.
