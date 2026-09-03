"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

const PUBLIC_SURFACES = new Set(["/", "/experience", "/meet-mara", "/legal"]);

export function PublicPageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!PUBLIC_SURFACES.has(pathname)) return;
    track("page_view", { surface: pathname });
  }, [pathname]);

  return null;
}
