import Link from "next/link";
import { readDemandMetrics, readPublicDemand, readPublicWorlds } from "@/lib/mara-real-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [worlds, demands] = await Promise.all([
    readPublicWorlds(6),
    readPublicDemand(8),
  ]);
  const metrics = await readDemandMetrics(demands.map((item) => item.id));
  const metricByDemand = new Map(metrics.map((item) => [item.demand_request_id, item]));
  const strongestDemand = demands
    .map((demand) => ({ demand, metric: metricByDemand.get(demand.id) }))
    .sort((a, b) => (b.metric?.commit_count ?? 0) - (a.metric?.commit_count ?? 0))[0];

  return (
    <main className="platformHome">
      <section className="platformHero">
        <div className="platformHeroInner">
          <p className="platformKicker">MARA · CREATOR WORLDS</p>
          <h1>Lo que quieres puede empezar aquí.</h1>
          <p className="platformHeroLead">
            Entra a Worlds, deja una señal y mira qué empieza a moverse. Mara conecta lo que una comunidad quiere con lo que una creadora puede convertir en algo real.
          </p>
          <div className="platformHeroActions">
            <Link className="platformPrimary" href="/make-it-happen">Haz que pase <span aria-hidden="true">↘</span></Link>
            <Link className="platformSecondary" href="/experience">Entrar a Creator Zero</Link>
          </div>
        </div>
      </section>

      <section className="platformSignal" aria-label="Cómo se mueve una idea en Mara">
        <div className="platformSignalIntro">
          <p className="platformKicker">NO ES UN FEED</p>
          <strong>Tu participación deja una consecuencia.</strong>
          <p>Una idea puede empezar pequeña, concentrar demanda, convertirse en una oferta y volver después como algo que ayudaste a hacer posible.</p>
        </div>
        <div className="platformSignalTrack">
          <div><span>01</span><strong>Quieres</strong></div>
          <div><span>02</span><strong>Te sumas</strong></div>
          <div><span>03</span><strong>Se concentra</strong></div>
          <div><span>04</span><strong>Se desbloquea</strong></div>
          <div><span>05</span><strong>Queda en tu historia</strong></div>
        </div>
      </section>

      <section className="platformSection">
        <div className="sectionIntro">
          <div>
            <p className="platformKicker">AHORA</p>
            <h2>Entras a un World. No a un perfil.</h2>
          </div>
          <p>
            Mara es la capa que conecta los Worlds. Cada creadora define su identidad, sus límites y lo que está dispuesta a convertir en oferta. Mara Vera es solo el primer laboratorio vivo de ese sistema.
          </p>
        </div>

        <article className="worldFeature">
          <div className="worldFeatureCopy">
            <p className="worldIndex">WORLD 00 · CREATOR ZERO</p>
            <h3>Mara Vera</h3>
            <div className="worldMeta">
              <span>18+</span>
              <span>Virtual</span>
              <span>Private experience</span>
            </div>
            <p className="worldVoice">“No vine a explicarte demasiado. Entra. Después decides si te quedas.”</p>
            <p className="worldRoleNote">
              Creator Zero demuestra cómo identidad, deseo, memoria y acceso pueden convivir dentro de un World. No define el tono de todas las futuras creadoras.
            </p>
            <Link className="worldEnter" href="/experience">Entrar al World</Link>
          </div>
          <div className="worldFeatureArt" aria-label="Mara Vera, referencia de identidad">
            <img src="/mara/mara-v2-reference.webp" alt="Mara Vera, Creator Zero" width="384" height="576" />
            <span className="worldFeatureScrim" aria-hidden="true" />
          </div>
        </article>

        <div className="networkGrid">
          <Link className="networkTile networkTileAccent" href="/make-it-happen">
            <div>
              <p className="tileKicker">DEMAND</p>
              <h3>¿Qué quieres que pase?</h3>
            </div>
            <div>
              <p>{strongestDemand ? `Hay una señal real moviéndose ahora: ${strongestDemand.demand.title}.` : "Una frase basta para empezar. Mara intenta concentrarla antes de crear oferta de más."}</p>
              <span className="tileAction">Haz que pase</span>
            </div>
          </Link>

          <Link className="networkTile" href="/activity">
            <div>
              <p className="tileKicker">MEMORY</p>
              <h3>Lo que moviste no desaparece.</h3>
            </div>
            <div>
              <p>Lo que quisiste, prometiste, compraste o ayudaste a desbloquear vuelve contigo.</p>
              <span className="tileAction">Ver mi actividad</span>
            </div>
          </Link>

          <Link className="networkTile" href="/creators">
            <div>
              <p className="tileKicker">CREATORS</p>
              <h3>Construye un World sin convertir tu identidad real en el producto.</h3>
            </div>
            <div>
              <p>{worlds.length > 0 ? `${worlds.length} World${worlds.length === 1 ? "" : "s"} públicos ya conectados a la capa de Mara.` : "El piloto abre la primera capa de oferta: identidad, privacidad, demanda y comercio en un mismo lugar."}</p>
              <span className="tileAction">Conocer el piloto</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="platformManifesto">
        <p>
          La creadora pone la gravedad. La comunidad pone la actividad. <em>Mara conecta lo que quieren con lo que puede ocurrir.</em>
        </p>
      </section>
    </main>
  );
}