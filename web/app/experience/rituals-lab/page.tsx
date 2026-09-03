import { notFound } from "next/navigation";
import { RitualsLab } from "@/components/rituals-lab";

export default function RitualsLabPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <RitualsLab />;
}
