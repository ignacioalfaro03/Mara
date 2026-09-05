import { notFound } from "next/navigation";
import { MomentumCommercePrototype } from "@/components/momentum-commerce-prototype";
import { P0DebugPanel } from "@/components/p0-debug-panel";

export default function CommerceLabPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="pageShell">
      <header className="editorialHeader">
        <p className="eyebrow">DEV · P0 COMMERCE LAB</p>
        <h1>Mismo momento. Una sola variable comercial a la vez.</h1>
        <p className="lede">
          Fixture canónico para comparar A/B/C sin contaminar el test con una experiencia distinta del Fantasy matcher.
          No hay pago, inventario real ni analytics externo.
        </p>
      </header>

      <section className="livingStage livingQuestion">
        <div className="livingCopy">
          <p className="eyebrow">MARA · CANONICAL FIXTURE</p>
          <h2>Al final fui al gym. Y ahora sí sé cómo seguiría esto contigo.</h2>
          <p className="livingLead">
            Todos los testers reciben este mismo contexto y la misma oferta base. Solo cambia la capa experimental:
            oferta sola, payoff/reward o payoff + ownership.
          </p>

          <MomentumCommercePrototype experienceId="gym_late_voice_01" />

          <p className="livingDisclosure">
            DEV fixture: `gym_late_voice_01` → `gym_continue_01`. La oferta es always-available y evita introducir escasez en A/B/C.
          </p>
        </div>
      </section>

      <P0DebugPanel />
    </main>
  );
}
