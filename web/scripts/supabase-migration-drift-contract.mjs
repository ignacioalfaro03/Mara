import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const migrationsDir = path.join(root, "supabase", "migrations");
const snapshotPath = path.join(root, "supabase", "migration-reconciliation.snapshot.json");

function fail(message) {
  console.error(`MARA_SUPABASE_MIGRATION_DRIFT FAIL: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(snapshotPath)) fail("missing migration-reconciliation.snapshot.json");
if (!fs.existsSync(migrationsDir)) fail("missing supabase/migrations directory");

const snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"));
const repoFiles = fs.readdirSync(migrationsDir).filter((file) => file.endsWith(".sql")).sort();
const entries = [...(snapshot.repositoryMigrations ?? [])];
const allowedStates = new Set([
  "remote_history_exact",
  "remote_history_alias",
  "schema_present_history_missing",
  "not_applied",
]);

if (snapshot.productionMutationAuthorized !== false) {
  fail("snapshot must never imply production mutation authorization");
}

const entryByFile = new Map();
for (const entry of entries) {
  if (!entry.file || entryByFile.has(entry.file)) fail(`duplicate or missing repository migration entry: ${entry.file ?? "<missing>"}`);
  if (!allowedStates.has(entry.state)) fail(`unsupported state ${entry.state} for ${entry.file}`);
  entryByFile.set(entry.file, entry);
}

const missingFromSnapshot = repoFiles.filter((file) => !entryByFile.has(file));
if (missingFromSnapshot.length) fail(`untracked repository migrations: ${missingFromSnapshot.join(", ")}`);

const missingFromRepo = [...entryByFile.keys()].filter((file) => !repoFiles.includes(file));
if (missingFromRepo.length) fail(`snapshot references missing files: ${missingFromRepo.join(", ")}`);

const remoteHistory = snapshot.remoteHistory ?? [];
const remoteByVersion = new Map();
for (const row of remoteHistory) {
  if (!row.version || !row.name) fail("remote history row missing version/name");
  if (remoteByVersion.has(row.version)) fail(`duplicate remote migration version ${row.version}`);
  remoteByVersion.set(row.version, row);
}

for (const entry of entries) {
  if (entry.state === "remote_history_exact" || entry.state === "remote_history_alias") {
    if (!entry.remoteVersion || !entry.remoteName) fail(`history-backed entry missing remote mapping: ${entry.file}`);
    const remote = remoteByVersion.get(entry.remoteVersion);
    if (!remote) fail(`mapped remote migration missing from snapshot: ${entry.file} -> ${entry.remoteVersion}`);
    if (remote.name !== entry.remoteName) {
      fail(`remote migration name mismatch for ${entry.file}: expected ${entry.remoteName}, observed ${remote.name}`);
    }
  } else {
    if (!entry.evidence || typeof entry.evidence !== "string") fail(`non-history entry missing evidence: ${entry.file}`);
    if (entry.remoteVersion || entry.remoteName) fail(`non-history entry must not claim remote history mapping: ${entry.file}`);
  }
}

const mappedRemoteVersions = new Set(
  entries.filter((entry) => entry.remoteVersion).map((entry) => entry.remoteVersion),
);
const remoteWithoutRepoMapping = remoteHistory.filter((row) => !mappedRemoteVersions.has(row.version));
if (remoteWithoutRepoMapping.length) {
  fail(`remote history entries without repository mapping: ${remoteWithoutRepoMapping.map((row) => row.version).join(", ")}`);
}

const counts = entries.reduce((acc, entry) => {
  acc[entry.state] = (acc[entry.state] ?? 0) + 1;
  return acc;
}, {});
const historyMissing = entries.filter((entry) => entry.state === "schema_present_history_missing");
const notApplied = entries.filter((entry) => entry.state === "not_applied");

console.log("MARA_SUPABASE_MIGRATION_DRIFT PASS");
console.log(`repo_migrations=${repoFiles.length}`);
console.log(`remote_history_rows=${remoteHistory.length}`);
for (const state of [...allowedStates]) console.log(`${state}=${counts[state] ?? 0}`);
console.log(`db_push_safe=${historyMissing.length === 0 ? "yes" : "no"}`);
console.log(`history_repair_requires_founder_authorization=${historyMissing.length > 0 ? "yes" : "no"}`);
if (historyMissing.length) {
  console.log(`history_missing=${historyMissing.map((entry) => entry.file).join(",")}`);
}
if (notApplied.length) {
  console.log(`intentionally_not_applied=${notApplied.map((entry) => entry.file).join(",")}`);
}
