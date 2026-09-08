"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track, trackPublicSessionStarted } from "@/lib/analytics";

const PUBLIC_SURFACES = new Set(["/", "/experience", "/meet-mara", "/legal", "/shop"]);

function isPublicSurface(pathname: string) {
  return PUBLIC_SURFACES.has(pathname) || pathname.startsWith("/shop/");
}

export function PublicPageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isPublicSurface(pathname)) return;
    trackPublicSessionStarted(pathname);
    track("page_view", { surface: pathname });
    if (pathname === "/") track("landing_view", { surface: pathname });
    if (pathname === "/shop") track("offer_viewed", { surface: "storefront", offer_slug: "private_after_scene_note_v1", offer_type: "fixed_unlock" });
  }, [pathname]);

  return null;
}
