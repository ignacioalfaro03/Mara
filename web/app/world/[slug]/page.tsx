import { notFound, permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LegacyWorldRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9][a-z0-9_-]{1,80}$/.test(slug)) notFound();
  permanentRedirect(`/${slug}`);
}
