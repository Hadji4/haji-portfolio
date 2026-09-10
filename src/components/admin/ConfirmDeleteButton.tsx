"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ConfirmDeleteButton({
  action,
  confirmMessage = "Delete this item? This cannot be undone.",
  iconOnly = false,
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
  iconOnly?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          try {
            await action();
          } catch {
            toast.error("Failed to delete");
          }
        });
      }}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-pink-400 transition-colors hover:bg-pink-500/10 disabled:opacity-50"
    >
      {isPending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
      {iconOnly ? null : "Delete"}
    </button>
  );
}
