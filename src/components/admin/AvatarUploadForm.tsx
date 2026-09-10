"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Camera, Loader2, User } from "lucide-react";
import { updateAvatar, type ActionState } from "@/app/admin/(dashboard)/profile/actions";

function SubmitOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
      <Loader2 size={22} className="animate-spin text-white" />
    </div>
  );
}

export function AvatarUploadForm({
  currentAvatarUrl,
  name,
}: {
  currentAvatarUrl: string | null;
  name: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateAvatar, {});
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) toast.success(state.success);
    if (state.error) toast.error(state.error);
  }, [state]);

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const displaySrc = preview ?? currentAvatarUrl;

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex items-center gap-5"
      onChange={() => formRef.current?.requestSubmit()}
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-violet-500/40 bg-white/5"
          aria-label="Change profile picture"
        >
          {displaySrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displaySrc} alt={name} className="h-full w-full object-cover" />
          ) : initials ? (
            <span className="font-display text-xl font-semibold text-foreground">{initials}</span>
          ) : (
            <User className="text-muted" size={28} />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/50">
            <Camera size={18} className="text-white opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <SubmitOverlay />
        </button>
      </div>
      <div>
        <p className="font-medium text-foreground">Profile picture</p>
        <p className="text-sm text-muted">JPEG, PNG, WebP or GIF, up to 2MB.</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 text-sm font-medium text-accent-violet hover:underline"
        >
          Choose a new photo
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        name="avatar"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setPreview(URL.createObjectURL(file));
        }}
      />
    </form>
  );
}
