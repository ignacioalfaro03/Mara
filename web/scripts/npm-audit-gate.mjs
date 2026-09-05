import { spawnSync } from "node:child_process";

const ATTEMPTS = 2;
const ATTEMPT_TIMEOUT_MS = 45_000;
const auditCommand =
  process.platform === "win32"
    ? {
        command: process.env.ComSpec || "cmd.exe",
        args: ["/d", "/s", "/c", "npm audit --omit=dev --audit-level=high --json"],
      }
    : {
        command: "npm",
        args: ["audit", "--omit=dev", "--audit-level=high", "--json"],
      };

const SERVICE_ERROR_PATTERNS = [
  /endpoint returned an error/i,
  /endpoint is being retired/i,
  /audit.*bad response/i,
  /invalid json response body/i,
  /bad request/i,
  /internal server error/i,
  /service unavailable/i,
  /too many requests/i,
  /econnreset/i,
  /econnrefused/i,
  /etimedout/i,
  /eai_again/i,
  /enotfound/i,
  /socket hang up/i,
];

function parseAuditJson(stdout) {
  if (!stdout?.trim()) return null;
  try {
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

function hasHighOrCriticalVulnerabilities(report) {
  const vulnerabilities = report?.metadata?.vulnerabilities;
  if (!vulnerabilities || typeof vulnerabilities !== "object") return false;
  return Number(vulnerabilities.high ?? 0) > 0 || Number(vulnerabilities.critical ?? 0) > 0;
}

function looksLikeAuditServiceFailure(text, errorCode) {
  if (errorCode === "ETIMEDOUT") return true;
  return SERVICE_ERROR_PATTERNS.some((pattern) => pattern.test(text));
}

function classify({ status, stdout = "", stderr = "", errorCode }) {
  const report = parseAuditJson(stdout);
  if (hasHighOrCriticalVulnerabilities(report)) return "fail";
  if (status === 0) return "pass";

  const combined = `${stdout}\n${stderr}`;
  if (looksLikeAuditServiceFailure(combined, errorCode)) return "degraded";
  return "fail";
}

function selfTest() {
  const cases = [
    {
      name: "clean audit passes",
      expected: "pass",
      input: { status: 0, stdout: JSON.stringify({ metadata: { vulnerabilities: { high: 0, critical: 0 } } }) },
    },
    {
      name: "high vulnerability fails",
      expected: "fail",
      input: { status: 1, stdout: JSON.stringify({ metadata: { vulnerabilities: { high: 1, critical: 0 } } }) },
    },
    {
      name: "retired endpoint degrades",
      expected: "degraded",
      input: { status: 1, stderr: "npm error audit endpoint returned an error: This endpoint is being retired" },
    },
    {
      name: "timeout degrades",
      expected: "degraded",
      input: { status: null, errorCode: "ETIMEDOUT", stderr: "audit timed out" },
    },
    {
      name: "unknown audit failure remains fatal",
      expected: "fail",
      input: { status: 1, stderr: "unexpected local package graph failure" },
    },
  ];

  for (const testCase of cases) {
    const actual = classify(testCase.input);
    if (actual !== testCase.expected) {
      throw new Error(`${testCase.name}: expected ${testCase.expected}, got ${actual}`);
    }
  }
  console.log("MARA_NPM_AUDIT_GATE_SELFTEST PASS");
}

if (process.argv.includes("--self-test")) {
  selfTest();
  process.exit(0);
}

let lastServiceFailure = "";
for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
  console.log(`MARA_NPM_AUDIT attempt ${attempt}/${ATTEMPTS}`);
  const result = spawnSync(
    auditCommand.command,
    auditCommand.args,
    {
      encoding: "utf8",
      timeout: ATTEMPT_TIMEOUT_MS,
      maxBuffer: 4 * 1024 * 1024,
    },
  );

  const outcome = classify({
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    errorCode: result.error?.code,
  });

  if (outcome === "pass") {
    const report = parseAuditJson(result.stdout);
    const vulnerabilities = report?.metadata?.vulnerabilities ?? {};
    console.log(
      `MARA_NPM_AUDIT PASS high=${Number(vulnerabilities.high ?? 0)} critical=${Number(vulnerabilities.critical ?? 0)}`,
    );
    process.exit(0);
  }

  if (outcome === "fail") {
    process.stderr.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    console.error("MARA_NPM_AUDIT FAIL: npm returned a real/unknown audit failure; refusing to degrade it.");
    process.exit(result.status || 1);
  }

  lastServiceFailure = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim().slice(0, 800);
  console.warn(`MARA_NPM_AUDIT service unavailable on attempt ${attempt}.`);
}

console.log(
  "::warning title=Mara npm audit degraded::The npm registry audit service did not return a usable report after bounded retries. No vulnerability finding was suppressed, but this run could not independently re-audit the unchanged production dependency tree. Typecheck, build and mobile smoke will continue.",
);
if (lastServiceFailure) console.warn(lastServiceFailure);
console.log("MARA_NPM_AUDIT DEGRADED");
