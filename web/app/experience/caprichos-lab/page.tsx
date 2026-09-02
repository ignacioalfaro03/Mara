import { notFound } from "next/navigation";
import { CaprichosLab } from "@/components/caprichos-lab";
import { P0DebugPanel } from "@/components/p0-debug-panel";

export default function CaprichosLabPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="pageShell">
      <header className="editorialHeader">
        <p className="eyebrow">DEV · P0 CAPRICHOS LAB</p>
        <h1>Private participation. Public aggregate. Real-world consequence.</h1>
        <p className="lede">
          Prototype only: three Mara World goals, pseudonymous/private participation, one deterministic team race and a simulated World Asset completion. No money is collected.
        </p>
      </header>

      <CaprichosLab />
      <P0DebugPanel />
    </main>
  );
}
