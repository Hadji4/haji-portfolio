import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { GalleryLightbox } from "@/components/GalleryLightbox";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const name = settings?.heroName ?? "Haji Omer Sheno";
  return {
    title: `Gallery | ${name}`,
    description: `Photos and videos from deployments, installations and projects by ${name}.`,
    alternates: { canonical: "/gallery" },
    openGraph: {
      title: `Gallery | ${name}`,
      description: `Photos and videos from deployments, installations and projects by ${name}.`,
      url: "/gallery",
      type: "website",
    },
  };
}

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
      <h1 className="section-heading">Gallery</h1>
      <p className="mb-10 max-w-2xl">
        Photos and videos from deployments, installations, and moments from building
        systems for hospitals, clinics, and pharmacies across Ethiopia. Click anything to
        view it full size.
      </p>

      {items.length > 0 ? (
        <GalleryLightbox items={items} />
      ) : (
        <p className="text-muted">Nothing here yet — check back soon.</p>
      )}
    </main>
  );
}
