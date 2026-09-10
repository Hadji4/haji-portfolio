import { Video } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { GalleryUploadForm } from "@/components/admin/GalleryUploadForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteGalleryItem } from "./actions";

export const revalidate = 0;

export default async function AdminGalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Gallery</h1>

      <div className="mt-6">
        <GalleryUploadForm />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="admin-card group overflow-hidden p-0 transition-all hover:border-violet-500"
          >
            <div className="relative aspect-square">
              {item.mediaType === "video" ? (
                <video src={item.imageUrl} muted className="h-full w-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.caption ?? ""}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              {item.mediaType === "video" ? (
                <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                  <Video size={12} /> Video
                </span>
              ) : null}
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-white/5 p-3">
              <p className="truncate text-xs text-muted">{item.caption || "—"}</p>
              <ConfirmDeleteButton action={deleteGalleryItem.bind(null, item.id)} iconOnly />
            </div>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="col-span-full text-muted">No photos yet — add your first one above.</p>
        ) : null}
      </div>
    </div>
  );
}
