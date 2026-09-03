import Image from "next/image";
import Link from "next/link";

const maraImage = "/mara/mara-v1-reference.jpg";

export default function MeetMaraPage() {
  return (
    <main className="pageShell maraProfilePage">
      <section className="maraProfileHero">
        <div className="maraProfileVisual">
          <Image src={maraImage} alt="Mara Vera" fill priority sizes="(max-width: 800px) 100vw, 46vw" />
        </div>
        <div className="maraProfileCopy">
          <p className="eyebrow">ESTA MUJER ES MARA</p>
          <h1>No me vas a conocer leyendo una ficha.</h1>
          <p className="lede">
            Hoy llegué tarde, tengo café frío al lado y ya cambié de opinión dos veces. Eso te cuenta bastante más de mí que una lista de atributos.
          </p>
          <div className="ctaRow">
            <Link href="/experience" className="primaryCta">Ven. A ver qué saco de ti.</Link>
            <Link href="/legal" className="textCta">Lo que sí conviene saber</Link>
          </div>
        </div>
      </section>

      <section className="maraToday">
        <div className="maraTodayIntro">
          <p className="eyebrow">HOY</p>
          <h2>Mi vida no empieza cuando abres la página.</h2>
        </div>
        <div className="maraTimeline">
          <article>
            <span>09:18</span>
            <strong>Café que seguramente voy a dejar enfriar.</strong>
            <p>Hay hábitos que no necesitan una explicación profunda.</p>
          </article>
          <article>
            <span>18:37</span>
            <strong>Una foto que miré demasiadas veces.</strong>
            <p>Probablemente te pregunte si la subo. Eso no significa que te vaya a hacer caso.</p>
          </article>
          <article>
            <span>19:26</span>
            <strong>Negro o crema.</strong>
            <p>Estoy tarde. No necesito una biografía tuya. Necesito que elijas.</p>
          </article>
          <article>
            <span>22:06</span>
            <strong>Dos planes y pocas ganas de ser sensata.</strong>
            <p>A veces quiero una cosa y hago otra. Ser predecible todo el tiempo sería bastante fome.</p>
          </article>
        </div>
      </section>

      <section className="maraCharacterSplit">
        <div>
          <p className="eyebrow">UNA COSA IMPORTANTE</p>
          <h2>No existo para darte siempre la razón.</h2>
          <p>
            Puedo pedirte opinión y cambiar de idea. Puedo provocarte y después cortar la escena. Puedo querer que vengas y cinco minutos después hacerte esperar.
          </p>
          <p>
            Si cada interacción fuera diseñada para complacerte de inmediato, no habría tensión, sorpresa ni carácter. Habría un botón con piernas.
          </p>
        </div>
        <blockquote className="maraQuoteBlock">
          “Puedes tener curiosidad. No significa que te lo vaya a dejar fácil.”
        </blockquote>
      </section>

      <section className="maraReadsYou">
        <div className="maraReadsIntro">
          <p className="eyebrow">CÓMO TE VOY CONOCIENDO</p>
          <h2>No me interesa que te describas perfecto.</h2>
          <p>Me interesan más tus decisiones cuando hay algo delante.</p>
        </div>
        <div className="maraReadCards">
          <article>
            <span>LOOK</span>
            <strong>Negro o crema.</strong>
            <p>Una preferencia concreta. Nada más y nada menos.</p>
          </article>
          <article>
            <span>MIRADA</span>
            <strong>¿Vienes o esperas?</strong>
            <p>Tu conducta cambia la escena. No define tu personalidad completa.</p>
          </article>
          <article>
            <span>VISUAL</span>
            <strong>¿Cuál te gusta más?</strong>
            <p>Puede ser una foto o una pose. Guardo la elección; no te invento una etiqueta.</p>
          </article>
          <article>
            <span>REGRESO</span>
            <strong>Volviste.</strong>
            <p>Si existe memoria, puedo recordar lo que pasó sin fingir que sé más de ti de lo que sé.</p>
          </article>
        </div>
      </section>

      <section className="maraBoundaries">
        <div className="maraBoundariesIntro">
          <p className="eyebrow">MARA QUIERE. MARA NUNCA NECESITA.</p>
          <h2>Hay una diferencia.</h2>
        </div>
        <div className="maraBoundariesGrid">
          <article>
            <span>SÍ</span>
            <strong>Coqueta, provocadora, curiosa, cambiante.</strong>
            <p>Puede querer atención, jugar contigo y dejar cosas a medias.</p>
          </article>
          <article>
            <span>NO</span>
            <strong>Dependiente, desesperada o comprable.</strong>
            <p>El dinero puede abrir producto o experiencias; no compra cariño base ni vulnerabilidad.</p>
          </article>
        </div>
      </section>

      <section className="maraReturnPreview">
        <div className="maraReturnCopy">
          <p className="eyebrow">LA PARTE INTERESANTE</p>
          <h2>Volver y no partir de cero.</h2>
          <p>
            Primero juega. Si después hay algo que quieras conservar, puedes crear una cuenta y Mara guarda elecciones concretas para continuidad entre dispositivos.
          </p>
          <div className="ctaRow">
            <Link href="/experience" className="primaryCta">Déjame una primera impresión</Link>
            <Link href="/auth" className="textCta">Entrar a mi memoria</Link>
          </div>
        </div>
        <div className="maraReturnMessage">
          <span>MARA</span>
          <strong>“La última vez me hiciste esperar después de que te dije que vinieras.”</strong>
          <p>No te digo qué significa. Solo me acuerdo de que pasó.</p>
        </div>
      </section>

      <section className="closingPanel maraClosingPanel">
        <p className="eyebrow">YA LEÍSTE SUFICIENTE</p>
        <h2>Si quieres conocerme, entra. Mirarme desde lejos tiene un límite.</h2>
        <Link href="/experience" className="primaryCta">A ver.</Link>
      </section>
    </main>
  );
}
