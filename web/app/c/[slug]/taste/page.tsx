import Link from "next/link";
import { notFound } from "next/navigation";
import { getVerifiedSession } from "@/lib/auth-session";
import { readWorld } from "@/lib/mara-real-data";
import styles from "@/app/real-product.module.css";

export const dynamic = "force-dynamic";

type Choice = {
  group: string;
  question: string;
  left: { id: string; label: string };
  right: { id: string; label: string };
};

const choices: readonly Choice[] = [
  {
    group: "creator_format_v1",
    question: "¿Qué formato elegirías ahora?",
    left: { id: "audio", label: "Audio" },
    right: { id: "video", label: "Video" },
  },
  {
    group: "creator_personalization_v1",
    question: "¿Qué te atrae más al comprar?",
    left: { id: "personalized", label: "Hecho para mí" },
    right: { id: "premade", label: "Listo para desbloquear" },
  },
  {
    group: "creator_length_v1",
    question: "¿Qué prefieres normalmente?",
    left: { id: "short", label: "Corto y directo" },
    right: { id: "longer", label: "Más completo" },
  },
  {
    group: "creator_offer_style_v1",
    question: "Si algo te gusta mucho, ¿cómo preferirías pagarlo?",
    left: { id: "one_off", label: "Una vez" },
    right: { id: "membership", label: "Membresía" },
  },
];

function ChoiceButton({
  choice,
  selected,
  alternative,
  creatorId,
  worldId,
  surface,
  returnTo,
}: {
  choice: Choice;
  selected: Choice["left"];
  alternative: Choice["right"];
  creatorId: string;
  worldId: string;
  surface: string;
  returnTo: string;
}) {
  return (
    <form method="post" action="/api/preferences">
      <input type="hidden" name="clientEventId" value={crypto.randomUUID()} />
      <input type="hidden" name="eventType" value="taste_choice" />
      <input type="hidden" name="choiceGroup" value={choice.group} />
      <input type="hidden" name="selectedOption" value={selected.id} />
      <input type="hidden" name="alternativeOption" value={alternative.id} />
      <input type="hidden" name="surface" value={surface} />
      <input type="hidden" name="contextVersion" value="creator-taste-v1" />
      <input type="hidden" name="signalScope" value="creator_world" />
      <input type="hidden" name="creatorId" value={creatorId} />
      <input type="hidden" name="worldId" value={worldId} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <button className={styles.button} type="submit">{selected.label}</button>
    </form>
  );
}

export default async function CreatorTastePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getVerifiedSession();
  const profile = await readWorld(slug, session.ok ? session.accessToken : undefined);
  if (!profile || profile.status !== "active" || profile.visibility !== "public") notFound();

  const surface = `/c/${profile.slug}/taste`;

  if (!session.ok || !session.user.id) {
    return (
      <main className={styles.shell}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <Link href={`/c/${profile.slug}`}>{profile.display_name}</Link>
            <Link className={styles.secondary} href="/auth">Cuenta</Link>
          </nav>
          <header className={styles.hero}>
            <p className={styles.eyebrow}>TASTE ENGINE</p>
            <h1>Elige rápido. Haz que tu experiencia mejore.</h1>
            <p>Son elecciones simples sobre formatos y ofertas. No son un test psicológico y no generan ningún cobro.</p>
            <Link className={styles.button} href={`/auth?returnTo=${encodeURIComponent(surface)}`}>Entrar para elegir</Link>
          </header>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.shell}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href={`/c/${profile.slug}`}>{profile.display_name}</Link>
          <Link className={styles.secondary} href="/auth">Cuenta</Link>
        </nav>

        <header className={styles.hero}>
          <p className={styles.eyebrow}>TASTE ENGINE · {profile.display_name}</p>
          <h1>Esto o esto. Sin formularios eternos.</h1>
          <p>Toca lo que prefieres. Mara guarda estas elecciones como preferencias declaradas de tu relación con esta creadora para mejorar lo que ves y las recomendaciones futuras.</p>
        </header>

        <section className={styles.grid}>
          {choices.map((choice) => (
            <article className={`${styles.card} ${styles.wide}`} key={choice.group}>
              <p className={styles.eyebrow}>ELECCIÓN RÁPIDA</p>
              <h2>{choice.question}</h2>
              <div className={styles.actions}>
                <ChoiceButton
                  choice={choice}
                  selected={choice.left}
                  alternative={choice.right}
                  creatorId={profile.creator_id}
                  worldId={profile.id}
                  surface={surface}
                  returnTo={surface}
                />
                <ChoiceButton
                  choice={choice}
                  selected={choice.right}
                  alternative={choice.left}
                  creatorId={profile.creator_id}
                  worldId={profile.id}
                  surface={surface}
                  returnTo={surface}
                />
              </div>
            </article>
          ))}
        </section>

        <section className={styles.grid}>
          <article className={`${styles.card} ${styles.wide}`}>
            <p className={styles.eyebrow}>PRIVACIDAD</p>
            <h2>Preferencias, no vulnerabilidades.</h2>
            <p className={styles.muted}>Mara registra lo que elegiste y el contexto de la elección. Este sistema no autoriza inferir debilidades psicológicas, rasgos sensibles ni cambiar precios para explotar vulnerabilidad.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
