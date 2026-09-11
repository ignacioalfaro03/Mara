import Link from "next/link";
import { notFound } from "next/navigation";
import { RequestComposer } from "@/components/request-composer";
import { getVerifiedSession } from "@/lib/auth-session";
import { readWorld } from "@/lib/mara-real-data";
import { productCapability } from "@/lib/product-realization";

export const dynamic = "force-dynamic";

export default async function CreatorRequestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getVerifiedSession();
  const world = await readWorld(slug, session.ok ? session.accessToken : undefined);
  if (!world || world.status !== "active" || world.visibility !== "public") notFound();

  const enabled = productCapability("requests");
  return (
    <main className="consumerScreen">
      <p className="consumerKicker">PEDIR ALGO</p>
      <h1 className="consumerTitle">Díselo a {world.display_name}.</h1>
      <p className="consumerLead">Propón algo que te gustaría recibir. Ella decide si lo acepta, lo rechaza o te propone otro precio. Nada se cobra al enviar.</p>

      <section className="consumerSection">
        {enabled ? (
          <RequestComposer worldSlug={world.slug} creatorName={world.display_name} />
        ) : (
          <div className="emptyState">
            <strong>Solicitudes todavía no están activas.</strong>
            <p>La interfaz existe, pero Mara no muestra una acción que no tenga persistencia, revisión y comercio listos en este entorno.</p>
            <div className="consumerActions" style={{ marginTop: 14 }}><Link className="consumerSecondary" href={`/app/people/${world.slug}`}>Volver</Link></div>
          </div>
        )}
      </section>
    </main>
  );
}
