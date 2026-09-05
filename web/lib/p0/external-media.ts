export type ExternalMediaReaction =
  | "worked"
  | "partly"
  | "not_for_me"
  | "too_much"
  | "too_soft"
  | "wrong_dynamic"
  | "wrong_visual"
  | "surprised_me";

export type ExternalMediaCandidate = {
  id: string;
  routeId: "D01" | "D02" | "D03" | "D04" | "D05";
  title: string;
  maraFrame: string;
  descriptor: string;
  learningFocus: string;
  nextIfPositive: string;
  nextIfNegative: string;
  prototypeOnly: true;
};

export type P0ExternalMediaSession = {
  candidateId: string;
  stage: "recommended" | "would_watch" | "returned" | "reacted";
  reaction: ExternalMediaReaction | null;
  createdAt: string;
};

export const P0_EXTERNAL_MEDIA_SESSION_KEY = "mara_p0_external_media_session";

export function readP0ExternalMediaSession(): P0ExternalMediaSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(P0_EXTERNAL_MEDIA_SESSION_KEY);
    return raw ? (JSON.parse(raw) as P0ExternalMediaSession) : null;
  } catch {
    return null;
  }
}

export function writeP0ExternalMediaSession(session: P0ExternalMediaSession) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(P0_EXTERNAL_MEDIA_SESSION_KEY, JSON.stringify(session));
}

export function clearP0ExternalMediaSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(P0_EXTERNAL_MEDIA_SESSION_KEY);
}
