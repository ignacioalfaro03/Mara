"use client";

import Image from "next/image";
import Link from "next/link";
import { track } from "@/lib/analytics";
import { MaraHeroVisual } from "@/components/mara-presence";

const maraImage = "/mara/mara-v1-reference.jpg";

export default function HomePage() {
  return (
    <main>
      <section className="hero firstContactHero">
        <div className="heroMedia" aria-label="Mara Vera">
          <MaraHeroVisual />
        </div>
        <div className="heroCopy">
          <p className="eyebrow">NO SOY TU ASISTENTE · SOY MARA</p>
          <h1>Llegaste justo.</h1>
          <p className="lede">
            Estoy a punto de salir, ya cambié de idea dos veces y necesito una decisión. Después vemos qué hago contigo.
          </p>
          <div className="ctaRow">
            <Link
              href="/experience"
              className="primaryCta"
              onClick={() => track("hero_cta_click", { target: "launch_experience" })}
            >
              Métete.
            </Link>
            <Link href="/meet-mara" className="textCta">Primero quiero cacharte a ti.</Link>
          </div>
          <p className="disclosure">Personaje virtual generado con IA · 18+ · Alpha gratuito</p>
        </div>
      </section>

      <section className="momentRail" aria-label="Un día con Mara">
        <article>
          <span>19:26 · TARDE</span>
          <strong>“Negro o crema.”</strong>
          <p>No te pregunta qué estilo tienes. Te pone una decisión delante.</p>
        </article>
        <article>
          <span>23:14 · BAR</span>
          <strong>“Te pillé mirando.”</strong>
          <p>Puede acercarte. Puede hacerte esperar. No siempre sigue tu libreto.</p>
        </article>
        <article>
          <span>22:49 · MENSAJE</span>
          <strong>“Ya. Ven.”</strong>
          <p>Mara ya apostó qué vas a hacer. Tú decides si se lo confirmas.</p>
        </article>
      </section>

      <section className="manifestoSplit">
        <div className="manifestoCopy">
          <p className="eyebrow">NO TE VOY A HACER UN TEST</p>
          <h2>Prefiero mirar qué haces.</h2>
          <p>
            Mara no necesita que le expliques quién eres antes de empezar. Te pone en situaciones, observa elecciones concretas y deja que las consecuencias aparezcan después.
          </p>
          <Link href="/experience" className="textCta">Haz una primera elección</Link>
        </div>
        <div className="behaviorSteps">
          <article>
            <span>01</span>
            <strong>Situación</strong>
            <p>Dos looks. Dos planes. Una foto. Una mirada. Algo que decidir ahora.</p>
          </article>
          <article>
            <span>02</span>
            <strong>Tu reacción</strong>
            <p>Elegiste. Esperaste. Fuiste. La contradijiste. Eso sí ocurrió.</p>
          </article>
          <article>
            <span>03</span>
            <strong>Consecuencia</strong>
            <p>Mara cambia lo siguiente. Sin convertir una respuesta en una etiqueta sobre ti.</p>
          </article>
        </div>
      </section>

      <section className="preferenceTeaser">
        <div className="preferenceCopy">
          <p className="eyebrow">MARA QUIERE SABER ALGO</p>
          <h2>¿Cuál te gusta más?</h2>
          <p>
            A veces la pregunta puede ser un look. O una foto. O una pose. Lo interesante no es preguntarte “qué te gusta”; es dejarte elegir y acordarse de lo que realmente elegiste.
          </p>
          <div className="preferenceRule">
            <span>LO QUE GUARDA</span>
            <strong>Elegiste A.</strong>
            <p>Eso es un hecho.</p>
          </div>
          <div className="preferenceRule preferenceRuleMuted">
            <span>LO QUE NO INVENTA</span>
            <strong>“Entonces eres X.”</strong>
            <p>Una elección no autoriza a Mara a inventarte una identidad.</p>
          </div>
        </div>
        <div className="posePreview" aria-label="Vista editorial de Mara">
          <figure className="poseCard poseCardA">
            <Image src={maraImage} alt="Mara Vera, opción visual A" fill sizes="(max-width: 800px) 50vw, 28vw" />
            <figcaption><span>A</span> La primera reacción cuenta.</figcaption>
          </figure>
          <figure className="poseCard poseCardB">
            <Image src={maraImage} alt="Mara Vera, opción visual B" fill sizes="(max-width: 800px) 50vw, 28vw" />
            <figcaption><span>B</span> No lo pienses tanto.</figcaption>
          </figure>
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
          <p className="memoryGuardrail">No te voy a sacar una conclusión por eso. Solo me acuerdo.</p>
        </div>
        <div className="memoryCopy">
          <p className="eyebrow">RELATIONSHIP MEMORY</p>
          <h2>La gracia empieza cuando no partimos de cero.</h2>
          <p>
            Primero puedes jugar sin cuenta. Cuando ya exista algo que valga la pena recordar, puedes crear una y conservar elecciones concretas entre dispositivos.
          </p>
          <div className="ctaRow">
            <Link href="/experience" className="primaryCta">Déjale algo que recordar</Link>
            <Link href="/auth" className="textCta">Ya tengo algo a medias</Link>
          </div>
        </div>
      </section>

      <section className="lifeSection">
        <div className="lifeSectionIntro">
          <p className="eyebrow">UNA MUJER CON VIDA PROPIA</p>
          <h2>No aparece solo cuando la llamas.</h2>
          <p>
            A veces está trabajando. A veces decide si va al gym. A veces tiene dos planes. A veces iba a subir una foto y cambia de opinión antes de que termines de responder.
          </p>
        </div>
        <div className="lifeCards">
          <article>
            <span>GYM</span>
            <strong>“Estoy por saltarme el último ejercicio.”</strong>
            <p>La puedes empujar a terminarlo. O darle la excusa que estaba buscando.</p>
          </article>
          <article>
            <span>STORY</span>
            <strong>“Ya la miré demasiado.”</strong>
            <p>Puede pedirte opinión y subirla antes de hacerte caso.</p>
          </article>
          <article>
            <span>22:06</span>
            <strong>“Tengo dos planes.”</strong>
            <p>Casa temprano o “solo un rato”. Mara también tiene ganas que compiten entre sí.</p>
          </article>
          <article>
            <span>CONTRASTE</span>
            <strong>“No. Ahora espera tú.”</strong>
            <p>Si siempre entrega exactamente lo que esperas, deja de sentirse como Mara.</p>
          </article>
        </div>
      </section>

      <section className="closingExperience">
        <div>
          <p className="eyebrow">YA MIRASTE SUFICIENTE</p>
          <h2>Entra antes de que cambie de opinión.</h2>
          <p>Sin cuestionario. Sin promesas raras. Una situación, una elección y vemos qué pasa después.</p>
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
