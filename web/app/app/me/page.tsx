import Link from "next/link";
import { RequestStatusActions } from "@/components/request-status-actions";
import { getVerifiedSession } from "@/lib/auth-session";
import { formatMoney, type OfferRow, type PurchaseRow } from "@/lib/mara-real-data";
import { productCapability } from "@/lib/product-realization";
import { userRest } from "@/lib/supabase/server-rest";

export const dynamic = "force-dynamic";

type RequestRow = {
  id: string;
  world_id: string;
  status: string;
  category: string;
  description: string;
  budget_minor: number | null;
  counter_amount_minor: number | null;
  currency: string;
  offer_id: string | null;
  purchase_id: string | null;
  delivered_at: string | null;
  fulfillment_notes: string | null;
  created_at: string;
};

type MembershipRow = {
  id: string;
  tier_id: string;
  creator_id: string;
  status: string;
  started_at: string;
  current_period_ends_at: string | null;
};

function requestStatusCopy(status: string) {
  const labels: Record<string, string> = {
    requested: "Enviada",
    reviewing: "En revisión",
    countered: "Te propusieron otro precio",
    payment_pending: "Lista para pagar",
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

export default async function ConsumerMePage() {
  const session = await getVerifiedSession();
  if (!session.ok || !session.user.id) {
    return (
      <main className="consumerScreen">
        <p className="consumerKicker">TÚ</p>
        <h1 className="consumerTitle">Todo lo tuyo, en tu cuenta.</h1>
        <p className="consumerLead">Compras, desbloqueos, solicitudes y continuidad no deberían depender de este teléfono.</p>
        <div className="consumerSection"><Link className="consumerPrimary" href="/auth">Entrar</Link></div>
      </main>
    );
  }

  const requestEnabled = productCapability("requests");
  const membershipEnabled = productCapability("memberships");
  const [purchaseResult, requestResult, membershipResult] = await Promise.all([
    userRest<PurchaseRow[]>(session.accessToken, `commerce_purchases?select=*&user_id=eq.${encodeURIComponent(session.user.id)}&order=created_at.desc&limit=50`),
    requestEnabled
      ? userRest<RequestRow[]>(session.accessToken, `creator_requests?select=*&user_id=eq.${encodeURIComponent(session.user.id)}&order=created_at.desc&limit=50`)
      : Promise.resolve({ ok: true as const, data: [] as RequestRow[], status: 200 }),
    membershipEnabled
      ? userRest<MembershipRow[]>(session.accessToken, `creator_memberships?select=*&user_id=eq.${encodeURIComponent(session.user.id)}&order=created_at.desc&limit=50`)
      : Promise.resolve({ ok: true as const, data: [] as MembershipRow[], status: 200 }),
  ]);
  const purchases = purchaseResult.ok ? purchaseResult.data : [];
  const requests = requestResult.ok ? requestResult.data : [];
  const memberships = membershipResult.ok ? membershipResult.data : [];
  const offerIds = [...new Set([...purchases.map((purchase) => purchase.offer_id), ...requests.map((request) => request.offer_id).filter((id): id is string => Boolean(id))])];
  const offerResult = offerIds.length
    ? await userRest<OfferRow[]>(session.accessToken, `commerce_offers?select=*&id=in.(${offerIds.map(encodeURIComponent).join(",")})`)
    : null;
  const offerById = new Map((offerResult?.ok ? offerResult.data : []).map((offer) => [offer.id, offer]));

  return (
    <main className="consumerScreen">
      <p className="consumerKicker">TÚ</p>
      <h1 className="consumerTitle">Lo que ya es tuyo.</h1>
      <p className="consumerLead">{session.user.email ?? "Tu cuenta"}. Mara guarda compras y relaciones como estado real, no como un botón desbloqueado en el navegador.</p>

      <section className="consumerSection">
        <div className="consumerSectionHeader"><h2>Compras</h2><Link href="/me/history">Historial completo</Link></div>
        {purchases.length ? (
          <div className="profileList">
            {purchases.map((purchase) => {
              const offer = offerById.get(purchase.offer_id);
              const href = offer?.slug ? `/shop/${offer.slug}` : "/me/history";
              return (
                <Link href={href} key={purchase.id}>
                  <span>{offer?.title ?? "Compra"}<small style={{ display: "block", marginTop: 3, color: "#796d71" }}>{purchase.status}{purchase.fulfilled_at ? " · entregado" : ""}</small></span>
                  <strong>{formatMoney(purchase.amount_minor, purchase.currency)}</strong>
                </Link>
              );
            })}
          </div>
        ) : <div className="emptyState"><strong>Aún no compraste nada.</strong><p>Cuando desbloquees algo, queda aquí para que no tengas que volver a encontrarlo.</p></div>}
      </section>

      <section className="consumerSection">
        <div className="consumerSectionHeader"><h2>Solicitudes</h2></div>
        {requests.length ? (
          <div style={{ display: "grid", gap: 8 }}>
            {requests.map((request) => {
              const offer = request.offer_id ? offerById.get(request.offer_id) : undefined;
              return (
                <div className="requestState" key={request.id}>
                  <strong>{request.description}</strong>
                  <p>{request.category} · {requestStatusCopy(request.status)}</p>
                  {request.counter_amount_minor ? <p>Precio propuesto: {formatMoney(request.counter_amount_minor, request.currency)}</p> : request.budget_minor ? <p>Tu presupuesto: {formatMoney(request.budget_minor, request.currency)}</p> : null}
                  {request.status === "countered" && offer ? <RequestStatusActions requestId={request.id} /> : null}
                  {request.status === "payment_pending" && offer ? <Link className="consumerPrimary" href={`/shop/${offer.slug}`}>Revisar y pagar</Link> : null}
                  {request.status === "delivered" && request.fulfillment_notes ? <p>Entrega: {request.fulfillment_notes}</p> : null}
                </div>
              );
            })}
          </div>
        ) : requestEnabled ? <div className="emptyState"><strong>Sin solicitudes abiertas.</strong><p>Puedes pedir algo desde el perfil de una creadora cuando esa capacidad esté habilitada.</p></div> : <div className="emptyState"><strong>Solicitudes todavía no activas.</strong><p>La capacidad permanece oculta hasta que el contrato de persistencia esté desplegado.</p></div>}
      </section>

      {membershipEnabled ? (
        <section className="consumerSection">
          <div className="consumerSectionHeader"><h2>Membresías</h2></div>
          {memberships.length ? <div className="profileList">{memberships.map((membership) => <div key={membership.id}><span>{membership.status}</span><strong>{membership.current_period_ends_at ? `hasta ${new Date(membership.current_period_ends_at).toLocaleDateString("es-CL")}` : "activa"}</strong></div>)}</div> : <div className="emptyState"><strong>Sin membresías activas.</strong><p>Solo aparecerán cuando exista una membresía real y un ciclo de cobro compatible.</p></div>}
        </section>
      ) : null}

      <section className="consumerSection">
        <div className="profileList">
          <Link href="/auth"><span>Cuenta y sesión</span><strong>›</strong></Link>
          <Link href="/legal"><span>Privacidad y términos</span><strong>›</strong></Link>
          <Link href="/app/discover"><span>Descubrir creadoras</span><strong>›</strong></Link>
        </div>
      </section>
    </main>
  );
}
