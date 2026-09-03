const PENDING_KEY = "mara_pending_preference_events_v1";

export type VisualPreferenceEvent = {
  clientEventId: string;
  eventType: "visual_choice";
  choiceGroup: "pose_pair_launch_v1";
  selectedOption: "pose_a" | "pose_b";
  alternativeOption: "pose_a" | "pose_b";
  surface: "launch_experience";
  contextVersion: "v1";
};

function readPending(): VisualPreferenceEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as VisualPreferenceEvent[]) : [];
  } catch {
    return [];
  }
}

function writePending(events: VisualPreferenceEvent[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PENDING_KEY, JSON.stringify(events.slice(-25)));
}

function queue(event: VisualPreferenceEvent) {
  const events = readPending();
  if (!events.some((item) => item.clientEventId === event.clientEventId)) {
    events.push(event);
    writePending(events);
  }
}

async function send(event: VisualPreferenceEvent) {
  return fetch("/api/preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
}

export async function recordVisualPreference(selectedOption: "pose_a" | "pose_b") {
  const event: VisualPreferenceEvent = {
    clientEventId: crypto.randomUUID(),
    eventType: "visual_choice",
    choiceGroup: "pose_pair_launch_v1",
    selectedOption,
    alternativeOption: selectedOption === "pose_a" ? "pose_b" : "pose_a",
    surface: "launch_experience",
    contextVersion: "v1",
  };

  try {
    const response = await send(event);
    if (!response.ok) queue(event);
  } catch {
    queue(event);
  }
}

export async function flushPendingPreferenceEvents() {
  const pending = readPending();
  if (!pending.length) return;

  const remaining: VisualPreferenceEvent[] = [];
  for (const event of pending) {
    try {
      const response = await send(event);
      if (!response.ok) remaining.push(event);
    } catch {
      remaining.push(event);
    }
  }
  writePending(remaining);
}
