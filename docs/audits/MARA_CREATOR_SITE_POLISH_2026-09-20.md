# MARA — CREATOR SITE PRODUCT POLISH / PILOT READINESS

Date: 2026-09-20
Parent: Founder Constitution V3
Stacked on: PR #88

## Journey diagnosis
The core product loop existed, but the creator-facing surface still exposed implementation language and looked closer to an operator console than a creator product. Fan demand semantics were correct but the visible wording was too system-oriented. Mobile coverage was concentrated on one viewport.

## Changes
- added three bounded Creator Site visual presets: Clean, Bold, Dark;
- persisted preset in existing site settings without new storage architecture;
- changed Creator OS language from SALES/FULFILLMENT/DEMAND and other internal English to creator-facing Spanish;
- changed media labels from Avatar URL / Cover URL to Foto de perfil / Portada while retaining URL input as temporary MVP fallback;
- added explicit four-step onboarding path: identity → personalize → preview → share;
- simplified fan demand wording while preserving WANT/PLEDGE/COMMIT backend semantics;
- improved empty-state language;
- kept WTP internal concept out of fan-facing copy;
- added mobile viewport smoke coverage at 360x800, 390x844 and 430x932;
- updated Creator Site contracts to require visual preset control.

## Architecture preserved
No new commerce, demand, CRM, storage or database subsystem was created. Themes live in existing Creator Site settings. Legacy world identifiers remain internal compatibility debt.

## Prepared migrations
The prepared Creator Site hardening and Creator Intake V2 SQL remain PREPARED ONLY. They were not applied.

## Validation
- git diff --check: PASS
- founder thesis contract: PASS
- Creator Site contract: PASS
- TypeScript: PASS
- production build: PASS
- full production smoke: PASS
- 360x800: PASS
- 390x844: PASS
- 430x932: PASS

## Remaining pilot blockers
- production DB hardening/telemetry migration not applied;
- Creator Intake V2 not applied;
- image upload is still URL-backed fallback rather than creator-friendly storage upload;
- real payment/payout provider gate remains external;
- no real creator has yet completed publish → share → audience → demand → offer → fulfillment → return.

## Product decision
Do not expand into a drag-and-drop builder, custom CSS, custom domains or additional themes before real creator evidence. The next meaningful proof is live creator behavior.
