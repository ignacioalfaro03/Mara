# MARA — CREATOR SITES REALIGNMENT AUDIT
Date: 2026-09-20

# Decision

Mara Vera is discarded from the company/product thesis.
Creator World / World is discarded as product language.
The canonical public unit is **Creator Site**: “tu sitio en Mara”.

# What remains valuable

- creator accounts and Creator OS;
- demand primitives;
- commerce and fulfillment;
- audience preferences/history;
- privacy controls;
- Supabase/RLS foundations;
- current `world` database/API primitives as temporary internal compatibility.

# Current contradictions found

- V2 constitution defines connected Creator Worlds;
- README makes Mara Vera an allowed product asset;
- Web README calls the product “Mara Vera Web MVP”;
- Home is centered on Mara Vera;
- metadata/footer identify Mara Vera as the first character;
- Creator OS says World throughout;
- canonical creator route is `/world/[slug]`.
# Migration approach

1. V3 becomes sole strategic authority.
2. Product Architecture V2 and Roadmap V2 become canonical.
3. Public copy moves to Creator Site immediately.
4. Add canonical root creator route `/<creator>`.
5. Keep `/world/[slug]` and internal world identifiers temporarily for backward compatibility.
6. Rename database/API primitives only through a later explicit migration.

# Launch-critical gap after this pass

Technical alignment is not market validation.

The next evidence must come from:
- real creators;
- real shared Creator Site URLs;
- real audience traffic;
- real demand;
- provider-compatible commerce;
- real fulfillment and repeat behavior.

# Governance

Historical documents remain useful only as history or specialist evidence.
No historical mention of Mara Vera or Worlds can override V3.

No merge, production deployment, live payment activation or production migration is authorized by this audit.
