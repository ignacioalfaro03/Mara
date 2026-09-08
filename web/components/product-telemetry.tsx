"use client";

import { useEffect } from "react";
import type { ProductEvent } from "@/lib/product-telemetry";

type Props = {
  event: ProductEvent;
  surface: string;
  target?: string;
  placement?: string;
  offerSlug?: string;
  offerType?: string;
  preferenceGroup?: string;
  currency?: string;
};

export function ProductTelemetry({ event, surface, target, placement, offerSlug, offerType, preferenceGroup, currency }: Props) {
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
          ...(placement ? { placement } : {}),
          ...(offerSlug ? { offer_slug: offerSlug } : {}),
          ...(offerType ? { offer_type: offerType } : {}),
          ...(preferenceGroup ? { preference_group: preferenceGroup } : {}),
          ...(currency ? { currency } : {}),
        },
      }),
      keepalive: true,
    }).catch(() => undefined);
  }, [event, surface, target, placement, offerSlug, offerType, preferenceGroup, currency]);

  return null;
}
