import { DmExperience } from "@/components/dm-experience";
import { DeviceMemoryBoundary } from "@/components/device-memory-boundary";

export default function ExperiencePage() {
  return (
    <main>
      <DeviceMemoryBoundary><DmExperience /></DeviceMemoryBoundary>
    </main>
  );
}
