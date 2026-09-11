import { notFound } from "next/navigation";
import { CreatorConversation } from "@/components/creator-conversation";
import { getVerifiedSession } from "@/lib/auth-session";
import { readWorld } from "@/lib/mara-real-data";

export const dynamic = "force-dynamic";

function portraitFrom(personaValue: unknown) {
  const persona = personaValue && typeof personaValue === "object" && !Array.isArray(personaValue)
    ? (personaValue as Record<string, unknown>)
    : {};
  for (const key of ["portrait_url", "image_url", "avatar_url", "cover_url"]) {
    const value = persona[key];
    if (typeof value === "string" && (value.startsWith("/") || value.startsWith("https://"))) return value;
  }
  return null;
}

export default async function CreatorConversationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getVerifiedSession();
  const world = await readWorld(slug, session.ok ? session.accessToken : undefined);
  if (!world || world.status !== "active" || world.visibility !== "public") notFound();

  return <CreatorConversation worldSlug={world.slug} displayName={world.display_name} portrait={portraitFrom(world.persona)} />;
}
