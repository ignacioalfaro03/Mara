import type { Metadata } from "next";
import CreatorSitePage from "@/app/world/[slug]/page";
import { readWorld } from "@/lib/mara-real-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ creator: string }> }): Promise<Metadata> {
  const { creator } = await params;
  const site = await readWorld(creator);
  if (!site) return { title: "Mara" };

  const description = site.description || `El sitio de ${site.display_name} en Mara.`;
  return {
    title: `${site.display_name} | Mara`,
    description,
    alternates: { canonical: `/${site.slug}` },
    openGraph: {
      title: `${site.display_name} | Mara`,
      description,
      type: "profile",
      url: `/${site.slug}`,
    },
  };
}

export default async function PublicCreatorSite({ params }: { params: Promise<{ creator: string }> }) {
  const { creator } = await params;
  return CreatorSitePage({
    params: Promise.resolve({ slug: creator }),
    canonicalPath: `/${creator}`,
  });
}
