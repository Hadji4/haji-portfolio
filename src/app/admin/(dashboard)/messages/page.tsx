import { prisma } from "@/lib/prisma";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { ToggleReadButton } from "@/components/admin/ToggleReadButton";
import { markMessageRead, deleteMessage } from "./actions";

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Contact Messages</h1>

      <div className="mt-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`admin-card ${message.read ? "" : "border-violet-500/50"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-foreground">
                  {message.name} <span className="font-normal text-muted">&lt;{message.email}&gt;</span>
                </p>
                {message.subject ? <p className="text-sm text-muted">{message.subject}</p> : null}
              </div>
              <p className="text-xs text-muted">{message.createdAt.toLocaleString()}</p>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm">{message.message}</p>
            <div className="mt-3 flex items-center gap-1 border-t border-white/5 pt-3">
              <ToggleReadButton read={message.read} action={markMessageRead.bind(null, message.id, !message.read)} />
              <ConfirmDeleteButton action={deleteMessage.bind(null, message.id)} />
            </div>
          </div>
        ))}
        {messages.length === 0 ? <p className="text-muted">No messages yet.</p> : null}
      </div>
    </div>
  );
}
