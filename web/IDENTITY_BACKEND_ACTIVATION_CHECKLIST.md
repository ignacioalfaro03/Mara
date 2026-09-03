# Identity Backend Activation Checklist

This branch is intentionally backend-ready but not yet connected to a production database.

Before activation:

- create a **dedicated Mara Supabase project** (do not reuse Rivalia staging);
- apply `supabase/migrations/20260903_identity_preference_memory.sql`;
- run Supabase security + performance advisors and resolve findings;
- verify RLS with two separate test users;
- configure Auth Site URL / allowed redirect URLs for the Mara Vercel domain;
- decide email-confirmation posture and configure SMTP before meaningful public scale;
- set Vercel variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`;
- verify no secret/service-role key is present in Vercel public variables;
- configure two meaningfully distinct, same-canonical-Mara pose assets before interpreting visual preference results;
- run the P0 identity/preference smoke plan;
- inspect Auth/Postgres/API logs after the first real test accounts;
- only then authorize a deployment of this branch.

The existing Public Alpha should remain untouched until this activation checklist passes.

No merge without `mergea`.
