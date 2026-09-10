import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DocumentUploadForm } from "@/components/admin/DocumentUploadForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { TogglePublishedButton } from "@/components/admin/TogglePublishedButton";
import { togglePublished, deleteDocument } from "./actions";

export const revalidate = 0;

export default async function AdminDocumentsPage() {
  const documents = await prisma.document.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
  const grouped = documents.reduce<Record<string, typeof documents>>((acc, doc) => {
    (acc[doc.category] ??= []).push(doc);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Documents</h1>

      <div className="mt-6">
        <DocumentUploadForm />
      </div>

      <div className="mt-8 space-y-6">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="admin-card">
            <h2 className="mb-3 font-display text-lg font-semibold text-foreground">{category}</h2>
            <ul className="space-y-2">
              {items.map((doc) => (
                <li
                  key={doc.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/5 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText size={18} className="shrink-0 text-accent-violet" />
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate font-medium text-foreground hover:underline"
                    >
                      {doc.title}
                    </a>
                    <span className="shrink-0 text-xs text-muted uppercase">{doc.fileType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TogglePublishedButton
                      published={doc.published}
                      action={togglePublished.bind(null, doc.id, !doc.published)}
                    />
                    <ConfirmDeleteButton action={deleteDocument.bind(null, doc.id)} iconOnly />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {documents.length === 0 ? <p className="text-muted">No documents yet.</p> : null}
      </div>
    </div>
  );
}
