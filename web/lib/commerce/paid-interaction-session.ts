export type PaidInteractionSessionStatus = "purchased" | "active" | "ended" | "cancelled" | "refunded";

export type PaidInteractionSession = {
  id: string;
  creatorId: string;
  userId: string;
  threadId: string;
  purchaseId: string;
  offerId: string;
  durationMinutes: number;
  status: PaidInteractionSessionStatus;
  purchasedAt: string;
  startedAt: string | null;
  endsAt: string | null;
};

export type PaidInteractionAccessDecision = {
  allowed: boolean;
  effectiveStatus: PaidInteractionSessionStatus;
  remainingSeconds: number;
  reason: string;
};

function parseTime(value: string | null) {
  if (!value) return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

function assertDuration(minutes: number) {
  if (!Number.isInteger(minutes) || minutes < 5 || minutes > 240) {
    throw new Error("invalid_paid_interaction_duration");
  }
}

export function startPaidInteractionSession(
  session: PaidInteractionSession,
  now = new Date(),
): PaidInteractionSession {
  assertDuration(session.durationMinutes);
  if (session.status !== "purchased") throw new Error("paid_interaction_session_not_startable");
  const purchasedAt = parseTime(session.purchasedAt);
  if (purchasedAt === null || now.getTime() < purchasedAt) throw new Error("paid_interaction_purchase_time_invalid");

  const startedAt = now.toISOString();
  const endsAt = new Date(now.getTime() + session.durationMinutes * 60_000).toISOString();
  return { ...session, status: "active", startedAt, endsAt };
}

export function paidInteractionAccess(
  session: PaidInteractionSession,
  now = new Date(),
): PaidInteractionAccessDecision {
  if (session.status === "cancelled") {
    return { allowed: false, effectiveStatus: "cancelled", remainingSeconds: 0, reason: "Session was cancelled." };
  }
  if (session.status === "refunded") {
    return { allowed: false, effectiveStatus: "refunded", remainingSeconds: 0, reason: "Purchase was refunded." };
  }
  if (session.status === "ended") {
    return { allowed: false, effectiveStatus: "ended", remainingSeconds: 0, reason: "Paid interaction window has ended." };
  }
  if (session.status === "purchased") {
    return { allowed: false, effectiveStatus: "purchased", remainingSeconds: 0, reason: "Session is purchased but has not started." };
  }

  const startedAt = parseTime(session.startedAt);
  const endsAt = parseTime(session.endsAt);
  if (startedAt === null || endsAt === null || endsAt <= startedAt) {
    return { allowed: false, effectiveStatus: "ended", remainingSeconds: 0, reason: "Session timing is invalid." };
  }
  if (now.getTime() < startedAt) {
    return { allowed: false, effectiveStatus: "active", remainingSeconds: Math.ceil((endsAt - startedAt) / 1000), reason: "Session has not reached its start time." };
  }
  if (now.getTime() >= endsAt) {
    return { allowed: false, effectiveStatus: "ended", remainingSeconds: 0, reason: "Paid interaction window has ended." };
  }

  return {
    allowed: true,
    effectiveStatus: "active",
    remainingSeconds: Math.max(0, Math.ceil((endsAt - now.getTime()) / 1000)),
    reason: "Paid interaction window is active.",
  };
}
