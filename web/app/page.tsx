import Link from "next/link";

export default function HomePage() {
  return (
    <main className="publicEntry">
      <section className="publicEntryHero">
        <div className="publicEntryCopy">
          <p className="publicEntryKicker">MARA · 18+</p>
          <h1>Abre Mara.</h1>
          <p>
            Sigue creadoras. Recibe contenido e interacciones. Desbloquea lo que quieras comprar. Pide algo cuando una creadora lo permita. Mara recuerda la relación para que todo tenga continuidad.
          </p>
          <div className="publicEntryActions">
            <Link className="publicEntryPrimary" href="/app">Entrar</Link>
            <Link className="publicEntrySecondary" href="/creators">Quiero vender con Mara</Link>
          </div>
          <div className="publicEntryPromise" aria-label="Qué hace Mara">
            <span>Contenido</span>
            <span>Mensajes</span>
            <span>Solicitudes</span>
            <span>Desbloqueos</span>
            <span>Experiencias</span>
          </div>
        </div>

        <div className="publicEntryArt" aria-label="Mara Vera, primera presencia de Mara">
          <img src="/mara/mara-v2-reference.webp" alt="Mara Vera" width="384" height="576" fetchPriority="high" />
          <div className="publicEntryBadge">
            <strong>Mara Vera</strong><br />
            Primera presencia virtual de Mara. La plataforma también está diseñada para creadoras reales, públicas, seudónimas o avatar-led.
          </div>
        </div>
      </section>
    </main>
  );
}
