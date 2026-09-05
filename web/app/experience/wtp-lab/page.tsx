import { notFound } from "next/navigation";
import { P0DebugPanel } from "@/components/p0-debug-panel";
import { WtpLab } from "@/components/wtp-lab";

export default function WtpLabPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="pageShell">
      <header className="editorialHeader">
        <p className="eyebrow">DEV · P0 WTP LAB</p>
        <h1>Mismo producto. Un precio por persona.</h1>
        <p className="lede">
          Este laboratorio mide intención declarada, no ventas. P1/P2/P3 usan el mismo producto y contexto;
          solo cambia el precio mostrado. Correr después de elegir el tratamiento comercial A/B/C a mantener.
        </p>
      </header>

      <WtpLab />

      <p className="legalNote">
        P0 only · no checkout · no charge · no entitlement real · no individualized pricing. No usar estos clicks como revenue/conversion.
      </p>

      <P0DebugPanel />
    </main>
  );
}
