import Link from "next/link";

export default function MeetMaraPage() {
  return (
    <main className="pageShell">
      <section className="editorialHeader">
        <p className="eyebrow">MARA</p>
        <h1>No me vas a conocer leyendo una ficha.</h1>
        <p className="lede">
          Hoy llegué tarde, todavía tengo café frío al lado y ya cambié de opinión dos veces. Eso te cuenta bastante más de mí que una lista de atributos.
        </p>
        <div className="ctaRow">
          <Link href="/experience" className="primaryCta">Ven. A ver qué saco de ti.</Link>
          <Link href="/legal" className="textCta">Lo que sí conviene saber</Link>
        </div>
      </section>

      <section className="profileGrid">
        <article><span>Hoy</span><strong>Se me alargó el trabajo más de lo que quería.</strong></article>
        <article><span>Una manía</span><strong>Me carga cuando alguien se esfuerza demasiado por caer bien.</strong></article>
        <article><span>Probablemente</span><strong>Diga que no voy al gym y termine yendo igual.</strong></article>
        <article><span>Contigo</span><strong>Prefiero sacar mis conclusiones antes que hacerte llenar un perfil.</strong></article>
      </section>

      <section className="quotePanel">
        <p>“Puedes tener curiosidad. No significa que te lo vaya a dejar fácil.”</p>
      </section>

      <section className="closingPanel">
        <p className="eyebrow">YA LEÍSTE SUFICIENTE</p>
        <h2>Si quieres conocerme, entra. Mirarme desde lejos tiene un límite.</h2>
        <Link href="/experience" className="primaryCta">A ver.</Link>
      </section>
    </main>
  );
}
