import { SOFI_FOUND_FOOTAGE, type SofiWorldKnowledge } from "@/lib/world-canon";

const LOCAL_KEY = "mara_world_knowledge_v1";

type LocalKnowledge = Record<string, string>;

type WorldPayload = {
  knowledge?: {
    discovered?: boolean;
    discoveredAt?: string | null;
  };
};

function readLocal(): LocalKnowledge {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as LocalKnowledge) : {};
  } catch {
    return {};
  }
}

function writeLocal(next: LocalKnowledge) {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
  } catch {
    // Local world continuity is best-effort. Authenticated knowledge is server-backed.
  }
}

function localKnowledge(): SofiWorldKnowledge {
  const discoveredAt = readLocal()[SOFI_FOUND_FOOTAGE.factKey] ?? null;
  return {
    discovered: Boolean(discoveredAt),
    discoveredAt,
    source: discoveredAt ? "local" : "none",
  };
}

export async function loadSofiWorldKnowledge(): Promise<SofiWorldKnowledge> {
  const local = localKnowledge();

  try {
    const response = await fetch("/api/world/sofi", {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!response.ok) return local;

    const payload = (await response.json()) as WorldPayload;
    if (!payload.knowledge?.discovered) return local;

    const discoveredAt = payload.knowledge.discoveredAt ?? new Date().toISOString();
    writeLocal({ ...readLocal(), [SOFI_FOUND_FOOTAGE.factKey]: discoveredAt });
    return { discovered: true, discoveredAt, source: "server" };
  } catch {
    return local;
  }
}

export async function discoverSofiFoundFootage(): Promise<SofiWorldKnowledge> {
  const discoveredAt = localKnowledge().discoveredAt ?? new Date().toISOString();
  writeLocal({ ...readLocal(), [SOFI_FOUND_FOOTAGE.factKey]: discoveredAt });

  try {
    const response = await fetch("/api/world/sofi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ action: "discover_found_footage" }),
    });
    if (!response.ok) return { discovered: true, discoveredAt, source: "local" };

    const payload = (await response.json()) as WorldPayload;
    const remoteAt = payload.knowledge?.discoveredAt ?? discoveredAt;
    writeLocal({ ...readLocal(), [SOFI_FOUND_FOOTAGE.factKey]: remoteAt });
    return { discovered: true, discoveredAt: remoteAt, source: "server" };
  } catch {
    return { discovered: true, discoveredAt, source: "local" };
  }
}
