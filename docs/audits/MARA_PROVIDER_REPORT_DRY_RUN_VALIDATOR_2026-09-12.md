# Mara provider report dry-run validator — 2026-09-12

## Objective

Reduce activation risk by validating Mercado Pago Account Money CSV evidence before any database import exists.

## Provider facts preserved

- Account Money reports are CSV and expose transaction-level evidence including `SOURCE_ID`, `EXTERNAL_REFERENCE`, `TRANSACTION_TYPE`, `TRANSACTION_AMOUNT`, `FEE_AMOUNT`, `SETTLEMENT_NET_AMOUNT`, `REAL_AMOUNT`, currencies and dates.
- `SETTLEMENT_NET_AMOUNT` represents the net balance impact.
- `FEE_AMOUNT` may aggregate processing, shipping, financing, coupon and tax effects. Mara therefore preserves it as provider total-fee evidence and does not reinterpret it as pure processor fee.

## Validator behavior

`web/scripts/mercado-pago-account-money-dry-run.mjs`:

- is dry-run only;
- performs no database/provider writes;
- accepts semicolon-delimited UTF-8 CSV, including quoted fields;
- requires the core Account Money headers used by Mara reconciliation;
- V1 fails closed on non-CLP evidence;
- treats CLP as integral pesos and rejects fractional CLP values;
- rejects malformed numeric values, missing source IDs, currency mismatch and malformed row widths;
- classifies SETTLEMENT, REFUND, CHARGEBACK and DISPUTE as payment lifecycle evidence;
- keeps unrelated movements such as WITHDRAWAL reviewable as warnings rather than payment rows;
- outputs normalized dry-run JSON suitable for future isolated import wiring.

## Contract fixtures

CI proves:

1. valid CLP settlement passes;
2. fractional CLP fails closed;
3. non-CLP fails closed in V1;
4. unrelated account movement remains visible as a warning and is not counted as payment evidence;
5. fee semantics remain explicitly non-processor-specific.

## Deliberate non-actions

No Supabase writes, no report import, no migration conversion, no migration repair, no provider API calls, no payout logic, no production activation and no merge.
