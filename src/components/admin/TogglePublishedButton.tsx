"use client";

import { useTransition } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function TogglePublishedButton({
  published,
  action,
}: {
  published: boolean;
  action: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          try {
            await action();
          } catch {
            toast.error("Failed to update");
          }
        })
      }
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors disabled:opacity-50 ${
        published
          ? "text-emerald-400 hover:bg-emerald-500/10"
          : "text-muted hover:bg-white/5 hover:text-foreground"
      }`}
    >
      {isPending ? (
        <Loader2 size={15} className="animate-spin" />
      ) : published ? (
        <Eye size={15} />
      ) : (
        <EyeOff size={15} />
      )}
      {published ? "Published" : "Private"}
    </button>
  );
}
