import { notFound } from "next/navigation";
import { DesireSegmentationLab } from "@/components/desire-segmentation-lab";
import { P0DebugPanel } from "@/components/p0-debug-panel";

export default function SegmentLabPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="pageShell">
      <header className="editorialHeader">
        <p className="eyebrow">DEV · P0 DESIRE ROUTING</p>
        <h1>Segment the experience. Keep Mara coherent.</h1>
        <p className="lede">
          This fixture compares temporary desire routes across page framing, first experience, Caprichos and commerce.
          It does not create public profiles, hidden individualized prices or permanent fetish labels.
        </p>
      </header>

      <DesireSegmentationLab />
      <P0DebugPanel />
    </main>
  );
}
