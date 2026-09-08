"use client";

import { useEffect } from "react";
import type { ProductEvent } from "@/lib/product-telemetry";

type Props = {
  event: ProductEvent;
  surface: string;
  target?: string;
  offerSlug?: string;
  preferenceGroup?: string;
};

export function ProductTelemetry({ event, surface, target, offerSlug, preferenceGroup }: Props) {
  useEffect(() => {
    void fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        properties: {
          surface,
          ...(target ? { target } : {}),
          ...(offerSlug ? { offer_slug: offerSlug } : {}),
          ...(preferenceGroup ? { preference_group: preferenceGroup } : {}),
        },
      }),
      keepalive: true,
    }).catch(() => undefined);
  }, [event, surface, target, offerSlug, preferenceGroup]);

  return null;
}
