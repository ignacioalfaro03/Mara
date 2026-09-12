import Link from "next/link";

export default function HomePage() {
  return (
    <main className="publicEntry">
      <section className="publicEntryHero">
        <div className="publicEntryCopy">
          <p className="publicEntryKicker">MARA · CREATOR REVENUE OS</p>
          <h1>Convierte seguidores en clientes recurrentes.</h1>
          <p>
            Mara reúne ventas, clientes, ofertas y oportunidades comerciales para que sepas quién compra, qué está funcionando y cuál es la siguiente mejor acción para hacer crecer tus ingresos.
          </p>
          <div className="publicEntryActions">
            <Link className="publicEntryPrimary" href="/creators">Quiero vender con Mara</Link>
            <Link className="publicEntrySecondary" href="/creator">Entrar al Creator OS</Link>
          </div>
          <div className="publicEntryPromise" aria-label="Qué hace Mara">
            <span>Commerce</span>
            <span>CRM</span>
            <span>Oportunidades</span>
            <span>Automatización</span>
            <span>Revenue Intelligence</span>
          </div>
        </div>

        <div className="publicEntryArt" aria-label="Cómo funciona Mara">
          <div className="publicEntryBadge">
            <strong>Audience → Customers → Intelligence → Revenue</strong><br />
            Tus seguidores llegan desde las redes. Mara los convierte en relaciones comerciales que puedes entender, atender y hacer crecer.
          </div>
        </div>
      </section>
    </main>
  );
}
