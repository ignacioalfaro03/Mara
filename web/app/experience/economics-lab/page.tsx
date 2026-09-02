import { notFound } from "next/navigation";
import { UnitEconomicsLab } from "@/components/unit-economics-lab";

export default function EconomicsLabPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="pageShell">
      <header className="editorialHeader">
        <p className="eyebrow">DEV · PAYMENT READINESS</p>
        <h1>WTP × unit economics.</h1>
        <p className="lede">
          Use the price buckets already tested in P0, then plug in real contracted variable costs when provider quotes exist. No checkout or provider integration lives here.
        </p>
      </header>
      <UnitEconomicsLab />
    </main>
  );
}
