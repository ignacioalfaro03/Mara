import Link from "next/link";
import { getVerifiedSession } from "@/lib/auth-session";
import type { WorldRow } from "@/lib/mara-real-data";
import { productCapability } from "@/lib/product-realization";
import { userRest } from "@/lib/supabase/server-rest";

export const dynamic = "force-dynamic";

type ThreadRow = {
  id: string;
  creator_id: string;
  world_id: string;
  user_id: string;
  status: string;
  last_message_at: string | null;
  created_at: string;
};

type MessageRow = {
  id: string;
  thread_id: string;
  sender_kind: string;
  type: string;
  body: string;
  created_at: string;
};

function personaImage(world: WorldRow) {
  const persona = world.persona && typeof world.persona === "object" && !Array.isArray(world.persona)
    ? (world.persona as Record<string, unknown>)
    : {};
  for (const key of ["portrait_url", "image_url", "avatar_url"]) {
    const value = persona[key];
    if (typeof value === "string" && (value.startsWith("/") || value.startsWith("https://"))) return value;
  }
  return null;
}

function messagePreview(message: MessageRow | undefined) {
  if (!message) return "Abre la conversación.";
  if (message.type === "offer") return message.body || "Te dejó una oferta.";
  if (message.type === "audio") return "🎙️ Audio";
  if (message.type === "photo" || message.type === "paid_media") return "Foto";
  if (message.type === "video") return "Video";
  return message.body || "Nuevo mensaje";
}

export default async function MessagesPage() {
  const messagingEnabled = productCapability("messaging");
  const session = await getVerifiedSession();

  let threads: ThreadRow[] = [];
  let worlds: WorldRow[] = [];
  let messages: MessageRow[] = [];

  if (messagingEnabled && session.ok && session.user.id) {
    const threadResult = await userRest<ThreadRow[]>(
      session.accessToken,
      `creator_threads?select=*&user_id=eq.${encodeURIComponent(session.user.id)}&status=neq.blocked&order=last_message_at.desc.nullslast,created_at.desc&limit=100`,
    );
    threads = threadResult.ok ? threadResult.data : [];
    if (threads.length) {
      const worldIds = [...new Set(threads.map((thread) => thread.world_id))];
      const threadIds = threads.map((thread) => thread.id);
      const [worldResult, messageResult] = await Promise.all([
        userRest<WorldRow[]>(session.accessToken, `creator_worlds?select=*&id=in.(${worldIds.map(encodeURIComponent).join(",")})`),
        userRest<MessageRow[]>(session.accessToken, `creator_messages?select=id,thread_id,sender_kind,type,body,created_at&thread_id=in.(${threadIds.map(encodeURIComponent).join(",")})&order=created_at.desc&limit=250`),
      ]);
      worlds = worldResult.ok ? worldResult.data : [];
      messages = messageResult.ok ? messageResult.data : [];
    }
  }

  return (
    <main>
      <section className="consumerScreen">
        <p className="consumerKicker">MENSAJES</p>
        <h1 className="consumerTitle">Tus conversaciones.</h1>
        <p className="consumerLead">Mara sigue disponible aunque todavía no exista una bandeja de creadoras. No simulamos conversaciones que nadie envió.</p>
      </section>

      <section className="messageList" aria-label="Conversaciones">
        <Link className="messageRow" href="/experience">
          <img src="/mara/mara-v2-reference.webp" alt="Mara Vera" width="52" height="52" />
          <div><strong>Mara Vera</strong><p>Continuar donde lo dejaste.</p></div>
          <time>ahora</time>
        </Link>

        {threads.map((thread) => {
          const world = worlds.find((candidate) => candidate.id === thread.world_id);
          if (!world) return null;
          const latest = messages.find((message) => message.thread_id === thread.id);
          const image = personaImage(world);
          return (
            <Link className="messageRow" href={`/app/messages/${world.slug}`} key={thread.id}>
              {image ? <img src={image} alt={world.display_name} width="52" height="52" /> : <div className="feedAvatar" aria-hidden="true" />}
              <div><strong>{world.display_name}</strong><p>{messagePreview(latest)}</p></div>
              <time>{thread.last_message_at ? new Date(thread.last_message_at).toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit" }) : ""}</time>
            </Link>
          );
        })}
      </section>

      {!session.ok ? (
        <section className="consumerScreen">
          <div className="emptyState"><strong>Entra para guardar conversaciones.</strong><p>Tu historial y tus mensajes pertenecen a tu cuenta.</p><div className="consumerActions" style={{ marginTop: 14 }}><Link className="consumerPrimary" href="/auth">Entrar</Link></div></div>
        </section>
      ) : messagingEnabled && threads.length === 0 ? (
        <section className="consumerScreen">
          <div className="emptyState"><strong>Todavía no hablaste con una creadora.</strong><p>Descubre un perfil y abre una conversación cuando realmente te interese.</p><div className="consumerActions" style={{ marginTop: 14 }}><Link className="consumerSecondary" href="/app/discover">Descubrir</Link></div></div>
        </section>
      ) : !messagingEnabled ? (
        <section className="consumerScreen">
          <div className="emptyState"><strong>Mensajes de creadoras, todavía no.</strong><p>La interfaz está preparada, pero esta capacidad queda oculta hasta que su persistencia y moderación estén activadas en el entorno.</p></div>
        </section>
      ) : null}
    </main>
  );
}
