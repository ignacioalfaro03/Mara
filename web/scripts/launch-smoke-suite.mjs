import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scripts = [
  "launch-smoke.mjs",
  "account-operability-smoke.mjs",
  "ritual-telemetry-smoke.mjs",
  "telemetry-environment-smoke.mjs",
  "public-purpose-smoke.mjs",
  "continuity-cta-smoke.mjs",
  "world-sofi-smoke.mjs",
  "launch-loop-smoke.mjs",
  "creator-interest-smoke.mjs",
  "creator-os-contract-smoke.mjs",
  "revenue-engine-contract-smoke.mjs",
  "demand-marketplace-contract-smoke.mjs",
];

for (const script of scripts) {
  console.log(`RUN ${script}`);
  const scriptPath = fileURLToPath(new URL(script, import.meta.url));
  const result = spawnSync(process.execPath, [scriptPath], {
    stdio: "inherit",
    env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    console.error(`FAIL ${script}`);
    process.exit(result.status ?? 1);
  }
}

console.log("MARA_FULL_LOCAL_PRODUCTION_SMOKE PASS");
