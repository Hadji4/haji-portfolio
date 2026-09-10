"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Video } from "lucide-react";
import { addGalleryItem } from "@/app/admin/(dashboard)/gallery/actions";
import type { ActionState } from "@/lib/action-state";
import { SubmitButton } from "./SubmitButton";

export function GalleryUploadForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(addGalleryItem, {});
  const [preview, setPreview] = useState<{ url: string; isVideo: boolean } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the preview the moment a new successful state arrives — done here
  // (during render, React's documented pattern for reacting to a changed
  // value) rather than in the effect below, so the effect only performs the
  // toast/DOM side effects it's meant for.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.success) setPreview(null);
  }

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      formRef.current?.reset();
    }
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="admin-card flex flex-col gap-4 sm:flex-row sm:items-end">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-violet-500/40 bg-white/5 hover:border-violet-500"
        aria-label="Choose a photo or video"
      >
        {preview ? (
          preview.isVideo ? (
            <video src={preview.url} muted className="h-full w-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview.url} alt="Preview" className="h-full w-full object-cover" />
          )
        ) : (
          <ImagePlus className="text-muted" size={24} />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        name="photo"
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setPreview(file ? { url: URL.createObjectURL(file), isVideo: file.type.startsWith("video/") } : null);
        }}
      />
      <div className="flex-1">
        <label className="admin-label">Caption (optional)</label>
        <input name="caption" className="admin-input" placeholder="e.g. IHRS deployment at Gambo Hospital" />
      </div>
      <div>
        <label className="admin-label">Order</label>
        <input type="number" name="order" defaultValue={0} className="admin-input w-24" />
      </div>
      <div className="flex flex-col gap-1">
        <SubmitButton label="Add Media" />
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <ImagePlus size={13} /> Photos to 10MB <Video size={13} className="ml-1" /> Videos to 50MB
        </span>
      </div>
    </form>
  );
}
