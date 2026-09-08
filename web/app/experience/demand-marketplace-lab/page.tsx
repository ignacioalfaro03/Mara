import { notFound } from "next/navigation";
import DemandMarketplaceLab from "./DemandMarketplaceLab";

export default function DemandMarketplaceLabPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <DemandMarketplaceLab />;
}
