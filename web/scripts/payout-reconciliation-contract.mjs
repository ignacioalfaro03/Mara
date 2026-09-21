import fs from "node:fs";
import path from "node:path";
const root=path.resolve(import.meta.dirname,"..");
const read=(f)=>fs.readFileSync(path.join(root,"supabase","migrations",f),"utf8").replace(/^\uFEFF/,"");
const lifecycle=read("20260921010945_payout_lifecycle_accounting.sql");
const trigger=read("20260921011528_payout_transition_trigger_fix.sql");
const recon=read("20260921012140_reconciliation_classification_hardening.sql");
const checks=[
 ["service-role payout transition",/service_role_required/.test(lifecycle)],
 ["terminal payout protection",/payout_terminal_state/.test(lifecycle)],
 ["paid journal account",/creator_payout_paid/.test(lifecycle)],
 ["failed payout releases reserve",/payout_release:/.test(lifecycle)&&/creator_available/.test(lifecycle)],
 ["failed payout absorbs recovery",/recovery_absorbed_minor/.test(lifecycle)&&/creator_recovery/.test(lifecycle)],
 ["paid requires paid ledger",/payout_paid_entry_missing/.test(trigger)],
 ["pre-paid requires reservation",/payout_reservation_not_fully_backed/.test(trigger)],
 ["recovery blocks payout",/payout_blocked_by_creator_recovery/.test(trigger)],
 ["reconciliation exact match",/'matched'/.test(recon)],
 ["reconciliation amount mismatch",/'amount_mismatch'/.test(recon)],
 ["reconciliation currency mismatch",/'currency_mismatch'/.test(recon)],
 ["reconciliation missing internal",/'missing_internal'/.test(recon)],
 ["reconciliation missing provider",/'missing_provider'/.test(recon)],
 ["reconciliation server only",/record_mara_reconciliation[\s\S]*service_role_required/.test(recon)],
];
const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks) console.log(ok?"PASS":"FAIL",name);
if(failed.length) process.exit(1);
console.log("payout-reconciliation-contract: PASS");

