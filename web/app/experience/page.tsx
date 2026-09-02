import { FirstLivingExperience } from "@/components/first-living-experience";
import { P0DebugPanel } from "@/components/p0-debug-panel";

export default function ExperiencePage() {
  return (
    <main className="livingShell">
      <FirstLivingExperience />
      <P0DebugPanel />
    </main>
  );
}
