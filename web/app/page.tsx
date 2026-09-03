"use client";

import Link from "next/link";
import { MaraDailyMoments } from "@/components/mara-daily-moments";
import { MaraMediaStage } from "@/components/mara-media-stage";
import { MaraSubscriptionIntent } from "@/components/mara-subscription-intent";
import { track } from "@/lib/analytics";
import { maraHeroVideo } from "@/lib/mara-media-content";

export default function HomePage() {
  return (
    <main>
      <section className="hero firstContactHero mediaFirstHero">
        <div className="heroMedia" aria-label="Mara Vera">
          <MaraMediaStage videoSrc={maraHeroVideo} />
        </div>
        <div className="heroCopy">
          <p className="eyebrow">NO SOY TU ASISTENTE · SOY MARA</p>
          <h1>Llegaste justo.</h1>
          <p className="lede">
            Estoy a punto de salir. Dejé un café a medias, todavía no sé qué me voy a poner y ya cambié de plan dos veces. Métete antes de que cambie otra vez.
          </p>
          <div className="ctaRow">
            <Link
              href="/experience"
              className="primaryCta"
              onClick={() => track("hero_cta_click", { target: "launch_experience" })}
            >
              Ver qué está haciendo
            </Link>
            <Link href="/meet-mara" className="textCta">Primero quiero cacharte a ti.</Link>
          </div>
          <p className="disclosure">Personaje virtual generado con IA · 18+ · Alpha gratuito</p>
        </div>
      </section>

      <MaraDailyMoments />

      <section className="manifestoSplit">
        <div className="manifestoCopy">
          <p className="eyebrow">NO TE VOY A HACER UN TEST</p>
          <h2>Prefiero mirar qué haces.</h2>
          <p>
            Mara no necesita que completes un perfil antes de empezar. Te encuentra en situaciones pequeñas, ve elecciones concretas y deja que lo siguiente cambie por lo que ocurrió de verdad.
          </p>
          <Link href="/experience" className="textCta">Métete en una situación</Link>
        </div>
        <div className="behaviorSteps">
          <article>
            <span>01</span>
            <strong>Llegas en medio de algo</strong>
            <p>Un café. Una salida. El gym. Una Story. Una nota de voz que todavía no manda.</p>
          </article>
          <article>
            <span>02</span>
            <strong>Haces algo</strong>
            <p>Elegiste. Esperaste. La contradijiste. Fuiste. Eso sí ocurrió.</p>
          </article>
          <article>
            <span>03</span>
            <strong>Mara sigue</strong>
            <p>La próxima escena puede cambiar sin convertir una respuesta en una etiqueta sobre ti.</p>
          </article>
        </div>
      </section>

      <section className="mediaFormatsSection">
        <div className="mediaFormatsIntro">
          <p className="eyebrow">NO TODO DEBERÍA SER TEXTO</p>
          <h2>Mara se mueve. Habla. A veces no te explica nada.</h2>
          <p>
            Estamos construyendo la experiencia para que cada momento use el formato que le queda mejor: un clip corto, una foto, una nota de voz o una decisión de dos segundos.
          </p>
        </div>
        <div className="mediaFormatGrid">
          <article className="mediaFormatCard">
            <div className="mediaFormatIcon">▶</div>
            <span>CLIPS</span>
            <strong>Momentos cotidianos en movimiento.</strong>
            <p>Café, espejo, gym, salir, volver, cambiarse de ropa. El video no es un extra: es presencia.</p>
          </article>
          <article className="mediaFormatCard">
            <div className="mediaFormatIcon">⌁</div>
            <span>VOICE NOTES</span>
            <strong>Hay frases que deberían escucharse.</strong>
            <p>La voz entra cuando suma emoción, timing o cercanía. No para llenar cada pantalla de audio.</p>
          </article>
          <article className="mediaFormatCard">
            <div className="mediaFormatIcon">↳</div>
            <span>MICRO-DECISIONES</span>
            <strong>Dos segundos también pueden contar.</strong>
            <p>“¿La subo?”, “¿voy?”, “¿te mando audio?”. La respuesta puede cambiar lo que ocurre después.</p>
          </article>
        </div>
      </section>

      <section className="memorySection">
        <div className="memoryScene">
          <p className="eyebrow">OTRO DÍA</p>
          <h2>Volviste.</h2>
          <div className="memoryMessage">
            <span>MARA</span>
            <p>“La última vez te dije ‘ven’ y viniste sin pedirme otra explicación.”</p>
          </div>
          <p className="memoryGuardrail">No te voy a inventar una personalidad por eso. Solo me acuerdo de lo que pasó.</p>
        </div>
        <div className="memoryCopy">
          <p className="eyebrow">RELATIONSHIP MEMORY</p>
          <h2>La gracia empieza cuando no partimos de cero.</h2>
          <p>
            Primero juega. Cuando ya exista algo que valga la pena recordar, crea una cuenta y deja que esa continuidad sobreviva al navegador y al dispositivo.
          </p>
          <div className="ctaRow">
            <Link href="/experience" className="primaryCta">Déjale algo que recordar</Link>
            <Link href="/auth" className="textCta">Haz que se acuerde</Link>
          </div>
        </div>
      </section>

      <section className="lifeSection">
        <div className="lifeSectionIntro">
          <p className="eyebrow">SERIALIDAD</p>
          <h2>Mañana no debería ser la misma Mara de hoy.</h2>
          <p>
            Su día avanza, aparecen otros momentos y algunas cosas quedan a medias. La razón para volver no puede ser un botón de “chatear”; tiene que ser querer saber qué pasó después.
          </p>
        </div>
        <div className="lifeCards">
          <article>
            <span>MAÑANA</span>
            <strong>“Al final sí subí la Story.”</strong>
            <p>Una decisión pequeña puede reaparecer como callback.</p>
          </article>
          <article>
            <span>OTRO MOMENTO</span>
            <strong>“Hoy no te voy a preguntar lo mismo.”</strong>
            <p>El contenido rota; la relación acumula continuidad.</p>
          </article>
          <article>
            <span>MÁS CERCA</span>
            <strong>Clips, audios y escenas pueden aparecer con más profundidad.</strong>
            <p>Eso crea el terreno para una futura capa pagada sin cobrar antes de demostrar valor.</p>
          </article>
          <article>
            <span>CONTRASTE</span>
            <strong>“No. Ahora espera tú.”</strong>
            <p>Si Mara siempre obedece exactamente lo que quieres, deja de sentirse viva.</p>
          </article>
        </div>
      </section>

      <MaraSubscriptionIntent />

      <section className="closingExperience">
        <div>
          <p className="eyebrow">YA MIRASTE SUFICIENTE</p>
          <h2>Entra antes de que cambie de opinión.</h2>
          <p>Sin cuestionario. Sin pago ahora. Una situación, una reacción y algo que puede continuar cuando vuelvas.</p>
        </div>
        <Link
          href="/experience"
          className="primaryCta"
          onClick={() => track("hero_cta_click", { target: "closing_experience" })}
        >
          Métete.
        </Link>
      </section>
    </main>
  );
}
