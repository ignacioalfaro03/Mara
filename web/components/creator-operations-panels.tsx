import Link from "next/link";
import type { OfferRow, WorldRow } from "@/lib/mara-real-data";
import { formatMoney } from "@/lib/mara-real-data";
import { productCapability, type CreatorContentRow } from "@/lib/product-realization";
import { userRest } from "@/lib/supabase/server-rest";
import styles from "@/app/real-product.module.css";

type RequestRow = {
  id: string;
  creator_id: string;
  world_id: string;
  user_id: string;
  status: string;
  category: string;
  description: string;
  budget_minor: number | null;
  counter_amount_minor: number | null;
  currency: string;
  turnaround_days: number | null;
  offer_id: string | null;
  purchase_id: string | null;
  fulfillment_notes: string | null;
  delivered_at: string | null;
  completed_at: string | null;
  created_at: string;
};

type Props = {
  accessToken: string;
  creatorId: string;
  worlds: WorldRow[];
  offers: OfferRow[];
};

function labelStatus(status: string) {
  const labels: Record<string, string> = {
    requested: "Nueva",
    reviewing: "En revisión",
    countered: "Contraoferta enviada",
    payment_pending: "Esperando pago",
    paid: "Pagada",
    in_progress: "En preparación",
    delivered: "Entregada",
    completed: "Completada",
    declined: "Rechazada",
    cancelled: "Cancelada",
    refunded: "Reembolsada",
  };
  return labels[status] ?? status;
}

export async function CreatorOperationsPanels({ accessToken, creatorId, worlds, offers }: Props) {
  const contentEnabled = productCapability("content");
  const requestsEnabled = productCapability("requests");
  const [contentResult, requestResult] = await Promise.all([
    contentEnabled
      ? userRest<CreatorContentRow[]>(accessToken, `creator_content?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&order=updated_at.desc&limit=30`)
      : Promise.resolve({ ok: true as const, data: [] as CreatorContentRow[], status: 200 }),
    requestsEnabled
      ? userRest<RequestRow[]>(accessToken, `creator_requests?select=*&creator_id=eq.${encodeURIComponent(creatorId)}&order=created_at.desc&limit=50`)
      : Promise.resolve({ ok: true as const, data: [] as RequestRow[], status: 200 }),
  ]);
  const content = contentResult.ok ? contentResult.data : [];
  const requests = requestResult.ok ? requestResult.data : [];
  const actionableRequests = requests.filter((item) => !["completed", "declined", "cancelled", "refunded"].includes(item.status));

  return (
    <>
      <h2 className={styles.sectionTitle}>Publica y vende</h2>
      <section className={styles.grid}>
        <article className={styles.card}>
          <p className={styles.eyebrow}>CONTENT</p>
          <h2>Publica sin salir de Mara.</h2>
          {!contentEnabled ? (
            <p className={styles.empty}>Contenido normalizado está preparado pero permanece oculto hasta activar su migración y el flag del entorno.</p>
          ) : worlds.length === 0 ? (
            <p className={styles.empty}>Crea primero un World.</p>
          ) : (
            <form className={styles.form} method="post" action="/api/creator/content">
              <input type="hidden" name="returnTo" value="/creator" />
              <label>World<select name="worldId" required>{worlds.map((world) => <option key={world.id} value={world.id}>{world.display_name}</option>)}</select></label>
              <div className={styles.twoCol}>
                <label>Formato<select name="type" defaultValue="text"><option value="text">Texto</option><option value="photo">Foto</option><option value="video">Video</option><option value="audio">Audio</option><option value="gallery">Galería</option><option value="announcement">Anuncio</option><option value="experience">Experiencia</option><option value="event">Evento</option></select></label>
                <label>Visibilidad<select name="visibility" defaultValue="public"><option value="public">Público</option><option value="followers">Seguidores</option><option value="paid_unlock">Desbloqueo pagado</option><option value="unlisted">No listado</option><option value="private">Privado</option></select></label>
              </div>
              <label>Título<input name="title" maxLength={180} placeholder="Qué estás publicando" /></label>
              <label>Texto<textarea name="caption" maxLength={5000} placeholder="Dilo en pocas palabras." /></label>
              <label>Oferta asociada<select name="offerId" defaultValue=""><option value="">Ninguna</option>{offers.filter((offer) => offer.status === "active").map((offer) => <option key={offer.id} value={offer.id}>{offer.title}</option>)}</select></label>
              <label>Estado<select name="status" defaultValue="published"><option value="published">Publicar ahora</option><option value="draft">Guardar borrador</option></select></label>
              <p className={styles.muted}>Si eliges “Desbloqueo pagado”, debes asociar una oferta real. El precio nunca vive en el post.</p>
              <button className={styles.button} type="submit">Publicar</button>
            </form>
          )}
        </article>

        <article className={styles.card}>
          <p className={styles.eyebrow}>RECENT CONTENT</p>
          <h2>{content.length ? `${content.length} piezas recientes` : "Todavía sin contenido"}</h2>
          {content.length ? (
            <ul className={styles.list}>{content.slice(0, 8).map((item) => <li className={styles.item} key={item.id}><div className={styles.row}><div><strong>{item.title || item.caption.slice(0, 70) || "Sin título"}</strong><p className={styles.muted}>{item.type} · {item.visibility}</p></div><span className={styles.pill}>{item.status}</span></div></li>)}</ul>
          ) : (
            <p className={styles.empty}>Cuando publiques una pieza real, aparece aquí. No fabricamos un feed para que el dashboard se vea lleno.</p>
          )}
        </article>
      </section>

      <h2 className={styles.sectionTitle}>Solicitudes</h2>
      <section className={styles.grid}>
        <article className={`${styles.card} ${styles.wide}`}>
          {!requestsEnabled ? (
            <p className={styles.empty}>Solicitudes personalizadas permanecen desactivadas hasta aplicar y validar su capa persistente.</p>
          ) : actionableRequests.length === 0 ? (
            <p className={styles.empty}>No hay solicitudes que necesiten atención.</p>
          ) : (
            <ul className={styles.list}>
              {actionableRequests.map((request) => (
                <li className={styles.item} key={request.id}>
                  <div className={styles.row}>
                    <div>
                      <strong>{request.description}</strong>
                      <p className={styles.muted}>{request.category} · {labelStatus(request.status)} · {new Date(request.created_at).toLocaleDateString("es-CL")}</p>
                      {request.budget_minor ? <p className={styles.small}>Presupuesto indicado: {formatMoney(request.budget_minor, request.currency)}</p> : null}
                      {request.counter_amount_minor ? <p className={styles.small}>Precio propuesto: {formatMoney(request.counter_amount_minor, request.currency)}</p> : null}
                      <p><Link className={styles.customerLink} href={`/creator/customers/${request.user_id}`}>Ver cliente</Link></p>
                    </div>
                    <div className={styles.actions}>
                      {["requested", "reviewing", "countered"].includes(request.status) ? (
                        <>
                          <form className={styles.form} method="post" action="/api/creator/requests">
                            <input type="hidden" name="requestId" value={request.id} />
                            <input type="hidden" name="action" value="accept" />
                            <input type="hidden" name="returnTo" value="/creator" />
                            <label>Precio CLP<input name="amount" type="number" min="1" step="1" defaultValue={request.budget_minor ? Math.round(request.budget_minor / 100) : undefined} required /></label>
                            <button className={styles.button} type="submit">Aceptar y cobrar</button>
                          </form>
                          <form className={styles.form} method="post" action="/api/creator/requests">
                            <input type="hidden" name="requestId" value={request.id} />
                            <input type="hidden" name="action" value="counter" />
                            <input type="hidden" name="returnTo" value="/creator" />
                            <label>Contraoferta CLP<input name="amount" type="number" min="1" step="1" required /></label>
                            <button className={styles.secondary} type="submit">Contraofertar</button>
                          </form>
                          <form method="post" action="/api/creator/requests">
                            <input type="hidden" name="requestId" value={request.id} />
                            <input type="hidden" name="action" value="decline" />
                            <input type="hidden" name="returnTo" value="/creator" />
                            <button className={styles.secondary} type="submit">Rechazar</button>
                          </form>
                        </>
                      ) : null}
                      {request.status === "paid" ? (
                        <form method="post" action="/api/creator/requests"><input type="hidden" name="requestId" value={request.id} /><input type="hidden" name="action" value="start" /><input type="hidden" name="returnTo" value="/creator" /><button className={styles.button} type="submit">Empezar entrega</button></form>
                      ) : null}
                      {["paid", "in_progress"].includes(request.status) ? (
                        <form className={styles.form} method="post" action="/api/creator/requests"><input type="hidden" name="requestId" value={request.id} /><input type="hidden" name="action" value="deliver" /><input type="hidden" name="returnTo" value="/creator" /><label>Nota de entrega<textarea name="fulfillmentNotes" maxLength={4000} placeholder="Qué entregaste / dónde encontrarlo" /></label><button className={styles.button} type="submit">Marcar entregada</button></form>
                      ) : null}
                      {request.status === "delivered" ? (
                        <form method="post" action="/api/creator/requests"><input type="hidden" name="requestId" value={request.id} /><input type="hidden" name="action" value="complete" /><input type="hidden" name="returnTo" value="/creator" /><button className={styles.secondary} type="submit">Cerrar solicitud</button></form>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </>
  );
}
