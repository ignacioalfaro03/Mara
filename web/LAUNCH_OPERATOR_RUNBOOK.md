# Mara Vera Launch Operator Runbook

Status: implemented for anonymous funnel events; not a revenue or cohort-retention source of truth.

## Daily Read

Use `/api/internal/launch?hours=24` with `Authorization: Bearer $MARA_OPERATOR_TOKEN`.

Read:

- landing views;
- first interactions;
- ritual completions;
- continuity CTA clicks;
- memory recalls rendered and engaged;
- Private Moment starts/completions;
- offer views/clicks;
- checkout starts/blocks;
- purchase completions only when backed by server entitlement state.

## Decision Rule

Keep moving only when adults receive value before registration, voluntarily choose continuity, return, engage with remembered context, and show credible offer intent.

Stop or fix when the funnel shows visits without first interaction, ritual starts without completion, memory recall without engagement, offers without continuation, or checkout starts blocked by missing provider.

## Limits

`launch_events` is anonymous aggregate telemetry. It is not unique-user conversion, revenue truth, cohort retention, LTV, churn, ARPPU or payment reconciliation.

Payment truth remains in commerce purchase/entitlement/contribution tables. Identity and memory truth remains in Supabase Auth plus `relationship_state` and `preference_events`.
