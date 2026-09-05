"use client";

import { useEffect, useState } from "react";

export function BackendMemoryStatus() {
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/health-memory", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { configured?: boolean }) => setConfigured(Boolean(payload.configured)))
      .catch(() => setConfigured(false));
  }, []);

  if (configured === null) return null;
  return (
    <span style={{ fontSize: 12, opacity: .5 }}>
      {configured ? "Memoria de cuenta disponible" : "Memoria local"}
    </span>
  );
}
