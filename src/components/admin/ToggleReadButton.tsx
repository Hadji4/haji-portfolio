"use client";

import { useTransition } from "react";
import { Loader2, Mail, MailOpen } from "lucide-react";
import { toast } from "sonner";

export function ToggleReadButton({
  read,
  action,
}: {
  read: boolean;
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
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 size={15} className="animate-spin" />
      ) : read ? (
        <MailOpen size={15} />
      ) : (
        <Mail size={15} />
      )}
      {read ? "Mark unread" : "Mark read"}
    </button>
  );
}
