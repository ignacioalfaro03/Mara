import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ts from "typescript";

const read = (relative) => fs.readFileSync(path.join(process.cwd(), relative), "utf8");
const source = read("lib/commerce/paid-interaction-session.ts");
const sql = read("supabase/drafts/mara_paid_interaction_sessions_v1.sql");

const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const engine = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

const purchased = {
  id: "session-1",
  creatorId: "creator-1",
  userId: "user-1",
  threadId: "thread-1",
  purchaseId: "purchase-1",
  offerId: "offer-1",
  durationMinutes: 30,
  status: "purchased",
  purchasedAt: "2026-09-12T15:00:00.000Z",
  startedAt: null,
  endsAt: null,
};

assert.equal(engine.paidInteractionAccess(purchased, new Date("2026-09-12T15:05:00.000Z")).allowed, false);
const active = engine.startPaidInteractionSession(purchased, new Date("2026-09-12T15:10:00.000Z"));
assert.equal(active.status, "active");
assert.equal(active.endsAt, "2026-09-12T15:40:00.000Z");
const inWindow = engine.paidInteractionAccess(active, new Date("2026-09-12T15:20:00.000Z"));
assert.equal(inWindow.allowed, true);
assert.equal(inWindow.remainingSeconds, 1200);
const expired = engine.paidInteractionAccess(active, new Date("2026-09-12T15:40:00.000Z"));
assert.equal(expired.allowed, false);
assert.equal(expired.effectiveStatus, "ended");
assert.throws(() => engine.startPaidInteractionSession({ ...purchased, durationMinutes: 3 }), /invalid_paid_interaction_duration/);

assert.match(sql, /DRAFT ONLY/);
assert.match(sql, /DO NOT APPLY DIRECTLY/);
assert.match(sql, /create table if not exists public\.creator_paid_interaction_sessions/);
assert.match(sql, /duration_minutes integer not null check \(duration_minutes between 5 and 240\)/);
assert.match(sql, /status in \('purchased', 'active', 'ended', 'cancelled', 'refunded'\)/);
assert.match(sql, /grant select on table public\.creator_paid_interaction_sessions to authenticated/);
assert.match(sql, /creator_paid_sessions_select_participants/);
assert.match(sql, /create or replace function public\.start_creator_paid_interaction_session_v1/);
assert.match(sql, /for update;/i);
assert.match(sql, /grant execute on function public\.start_creator_paid_interaction_session_v1[\s\S]*to service_role/i);
assert.doesNotMatch(sql, /grant execute on function public\.start_creator_paid_interaction_session_v1[\s\S]*to authenticated/i);

console.log("MARA_PAID_INTERACTION_SESSION_CONTRACT PASS");
