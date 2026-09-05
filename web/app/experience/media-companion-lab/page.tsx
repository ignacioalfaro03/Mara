import { notFound } from "next/navigation";
import { ExternalMediaCompanionLab } from "@/components/external-media-companion-lab";

export default function ExternalMediaCompanionLabPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <ExternalMediaCompanionLab />;
}
