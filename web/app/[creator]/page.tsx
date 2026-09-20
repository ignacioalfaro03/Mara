import type { Metadata } from "next";
import CreatorSitePage from "@/components/creator-site-page";
import { creatorSiteConfig } from "@/lib/creator-site";
import { readWorld } from "@/lib/mara-real-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ creator: string }> }): Promise<Metadata> {
  const { creator } = await params;
  const site = await readWorld(creator);

  if (!site) {
    return {
      title: "Mara",
      robots: { index: false, follow: false },
    };
  }

  const config = creatorSiteConfig(site);
  const description = site.description || `El sitio de ${site.display_name} en Mara.`;
  const image = config.coverUrl ?? config.avatarUrl ?? undefined;

  return {
    title: `${site.display_name} | Mara`,
    description,
    alternates: { canonical: `/${site.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${site.display_name} | Mara`,
      description,
      type: "profile",
      url: `/${site.slug}`,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `${site.display_name} | Mara`,
      description,
      ...(image ? { images: [image] } : {}),
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
