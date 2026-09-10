import Link from "next/link";
import { readDemandMetrics, readPublicDemand, readPublicWorlds } from "@/lib/mara-real-data";

export const dynamic = "force-dynamic";

export default async function MakeItHappenPage() {
  const [worlds, demands] = await Promise.all([
    readPublicWorlds(16),
    readPublicDemand(16),
  ]);
  const metrics = await readDemandMetrics(demands.map((item) => item.id));
  const metricByDemand = new Map(metrics.map((item) => [item.demand_request_id, item]));
  const worldById = new Map(worlds.map((world) => [world.id, world]));

  return (
    <main className="demandPage">
      <header className="demandHero">
        <p className="demandKicker">MAKE IT HAPPEN</p>
        <h1>¿Qué quieres que pase?</h1>
        <p>
          No necesitas llegar con un producto armado. Empieza por la idea. Mara intenta encontrar si alguien ya pidió algo parecido, concentrar la señal y dejar que el World vea cuándo existe una oportunidad de verdad.
        </p>
      </header>

      <section className="demandComposer">
        <div className="demandComposerMain">
          <p className="demandKicker">EMPIEZA EN UN WORLD</p>
          <h2>Una frase. Después vemos si crece.</h2>
          <p>
            La demanda pertenece a un contexto. Elige el World al que quieres pedirle algo; adentro puedes decir qué quieres, cuánto pagarías si corresponde y qué nivel de privacidad prefieres.
          </p>

          <div className="worldChoiceList">
            {worlds.map((world) => (
              <Link href={`/world/${world.slug}#make-it-happen`} key={world.id}>{world.display_name} ↘</Link>
            ))}
            <Link href="/experience">Mara Vera · Creator Zero ↘</Link>
          </div>

          {worlds.length === 0 ? (
            <p>
              Todavía no hay Creator Worlds públicos persistidos en este entorno. No voy a inventarlos para llenar la pantalla: puedes entrar a Creator Zero o conocer el piloto de creadoras mientras se activa la primera oferta real.
            </p>
          ) : null}
        </div>

        <aside className="demandComposerSide">
          <p className="demandKicker">UNA IDEA NO VALE LO MISMO QUE UN COMPROMISO</p>
          <div className="demandFlow">
            <div><span>WANT</span><strong>Me gustaría que esto existiera.</strong></div>
            <div><span>PLEDGE</span><strong>Estoy dispuesto a pagar alrededor de X.</strong></div>
            <div><span>COMMIT</span><strong>Si se cumplen estas condiciones, voy en serio.</strong></div>
            <div><span>UNLOCK</span><strong>Ya hay suficiente señal para que alguien actúe.</strong></div>
          </div>
        </aside>
      </section>

      <section aria-labelledby="demand-now-title">
        <div className="demandSectionHeader">
          <div>
            <p className="demandKicker">LO QUE SE ESTÁ MOVIENDO</p>
            <h2 id="demand-now-title">Demanda real, no likes.</h2>
          </div>
          <p>Solo mostramos señales que existen. Sin números inventados, sin falsa urgencia y sin hacer pasar interés débil por compra.</p>
        </div>

        {demands.length > 0 ? (
          <div className="publicDemandGrid">
            {demands.map((demand) => {
              const metric = metricByDemand.get(demand.id);
              const world = worldById.get(demand.world_id);
              const remaining = Math.max(0, demand.target_commitments - (metric?.commit_count ?? 0));
              return (
                <article className="publicDemandCard" key={demand.id}>
                  <div>
                    <p className="demandKicker">{world?.display_name ?? "CREATOR WORLD"} · {demand.category}</p>
                    <h3>{demand.title}</h3>
                    <p>{demand.description || "La comunidad está midiendo si esta idea merece convertirse en algo real."}</p>
                  </div>
                  <div>
                    <div className="demandMetricLine">
                      <span>{metric?.want_count ?? 0} want</span>
                      <span>{metric?.pledge_count ?? 0} pledge</span>
                      <span>{metric?.commit_count ?? 0} commit</span>
                      <span>{remaining > 0 ? `${remaining} para el umbral` : "umbral alcanzado"}</span>
                    </div>
                    {world ? <Link className="demandAction" href={`/world/${world.slug}`}>Entrar al World</Link> : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="emptyNetwork">
            <h3>La red todavía está escuchando.</h3>
            <p>
              No hay demanda pública activa en este entorno. Eso es mejor que rellenar la interfaz con actividad ficticia. El primer objetivo del piloto es conseguir señales reales y ver si una comunidad efectivamente las concentra.
            </p>
            <div className="platformHeroActions">
              <Link className="platformPrimary" href="/creators">Quiero crear un World</Link>
              <Link className="platformSecondary" href="/experience">Entrar a Creator Zero</Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}