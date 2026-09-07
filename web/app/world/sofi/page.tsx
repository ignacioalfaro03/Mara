import { SofiExperience } from "./sofi-experience";
import { DeviceMemoryBoundary } from "@/components/device-memory-boundary";

export default function SofiWorldPage() {
  return <DeviceMemoryBoundary><SofiExperience /></DeviceMemoryBoundary>;
}
