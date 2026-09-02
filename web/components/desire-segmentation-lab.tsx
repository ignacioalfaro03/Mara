"use client";

import { useMemo, useState } from "react";
import { caprichos } from "@/data/caprichos";
import { desireRoutes } from "@/data/desire-routes";
import { track } from "@/lib/analytics";
import { formatUsdCents } from "@/lib/p0/caprichos";
import { writeP0DesireRoute, type DesireRouteId } from "@/lib/p0/desire-routing";

export function DesireSegmentationLab() {
  const [routeId, setRouteId] = useState<DesireRouteId>("D01");
  const [status, setStatus] = useState("");

  const route = useMemo(
    () => desireRoutes.find((candidate) => candidate.id === routeId) ?? desireRoutes[0],
    [routeId],
  );

  const featuredCaprichos = route.featuredCaprichoIds
    .map((id) => caprichos.find((item) => item.id === id))
    .filter((item): item is (typeof caprichos)[number] => Boolean(item));

  function chooseRoute(next: DesireRouteId) {
    setRouteId(next);
    writeP0DesireRoute(next);
    track("desire_route_selected", {
      route_id: next,
      prototype_only: true,
      sensitive_label_logged: false,
    });
    track("desire_surface_plan_viewed", {
      route_id: next,
      prototype_only: true,
    });
    setStatus("DEV route changed. Same Mara; surface plan changed.");
  }

  function markFit(fit: "fits" | "wrong") {
    track(fit === "fits" ? "desire_route_fit" : "desire_route_correction", {
      route_id: route.id,
      prototype_only: true,
    });
    setStatus(fit === "fits" ? "Fit signal recorded." : "Correction recorded. Route is not a permanent identity label.");
  }

  return (
    <section className="livingStage livingQuestion">
      <div className="livingCopy">
        <p className="eyebrow">DEV · DESIRE SEGMENTATION LAB</p>
        <h1>One Mara. Different doors into her world.</h1>
        <p className="livingLead">
          Pick a temporary desire route and inspect how the same Mara changes across entry copy, visual direction,
          first scenario, Caprichos ranking and commercial emphasis. No real adult preference is persisted by this lab.
        </p>

        <div className="livingChoices">
          {desireRoutes.map((candidate) => (
            <button
              type="button"
              className="livingChoice"
              key={candidate.id}
              aria-pressed={candidate.id === route.id}
              onClick={() => chooseRoute(candidate.id)}
            >
              <strong>{candidate.id}</strong>
              <span>{candidate.testerDescription}</span>
            </button>
          ))}
        </div>

        <div className="premiumIntentCard">
          <span>{route.heroEyebrow}</span>
          <strong>{route.heroTitle}</strong>
          <p>{route.heroLead}</p>
          <p className="livingMemory">Visual direction: {route.visualDirection}</p>
          <button type="button">{route.primaryCta}</button>
        </div>

        <div className="lifeMoment">
          <span>FIRST EXPERIENCE</span>
          <p>{route.firstScenario}</p>
          <p className="livingMemory">Mara energy: {route.maraEnergy} · preferred format: {route.preferredFormat}</p>
        </div>

        <div className="lifeMoment">
          <span>CAPRICHOS ORDERING</span>
          {featuredCaprichos.map((goal, index) => (
            <p key={goal.id}>
              {index + 1}. <strong>{goal.title}</strong> · {formatUsdCents(goal.targetCents)} hypothetical future target · terms unchanged by route
            </p>
          ))}
          <p className="livingMemory">Routing can reorder eligible Goals. It cannot secretly change their target, scarcity or fulfillment promise.</p>
        </div>

        <div className="lifeMoment">
          <span>COMMERCIAL SURFACE</span>
          <p>{route.commercialSurface}</p>
          <p className="livingMemory">{route.privacyNote}</p>
        </div>

        <div className="correctionRow">
          <button type="button" onClick={() => markFit("fits")}>This feels more relevant</button>
          <button type="button" onClick={() => markFit("wrong")}>Wrong direction</button>
        </div>

        <p className="livingDisclosure" aria-live="polite">{status}</p>
        <p className="livingDisclosure">
          DEV only. Route IDs are opaque in analytics. Sensitive lane labels, raw fantasy text, vulnerability states and real payment behavior are not logged here.
        </p>
      </div>
    </section>
  );
}
