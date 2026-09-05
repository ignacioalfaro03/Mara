import { notFound } from "next/navigation";
import { SessionOrchestrationLab } from "@/components/session-orchestration-lab";

export default function OrchestrationLabPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="pageShell">
      <header className="editorialHeader">
        <p className="eyebrow">DEV · P0 NEXT BEST ACTION</p>
        <h1>Coordinate the experience, not just the recommendation.</h1>
        <p className="lede">
          This lab tests whether Mara can choose among talk, voice, ritual, external-media handoff, Capricho,
          paid continuation, recovery and open-loop continuity without turning every good moment into an offer.
        </p>
      </header>

      <SessionOrchestrationLab />
    </main>
  );
}
