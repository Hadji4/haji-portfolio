import type { Metadata } from "next";
import { FileText, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const name = settings?.heroName ?? "Haji Omer Sheno";
  return {
    // Not "Documents | {name}" — the root layout's title template already
    // appends "| {name}", so doing it here too would duplicate it.
    title: "Documents",
    description: `Certificates, credentials and public documents from ${name}.`,
    alternates: { canonical: "/documents" },
    openGraph: {
      title: `Documents | ${name}`,
      description: `Certificates, credentials and public documents from ${name}.`,
      url: "/documents",
      type: "website",
    },
  };
}

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    where: { published: true },
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
  const grouped = documents.reduce<Record<string, typeof documents>>((acc, doc) => {
    (acc[doc.category] ??= []).push(doc);
    return acc;
  }, {});

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
      <h1 className="section-heading">Documents</h1>
      <p className="mb-10 max-w-2xl">
        Certificates, credentials and reference documents, organized by category.
      </p>

      <div className="space-y-10">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h2 className="subheading">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="card-surface flex items-center gap-4 rounded-xl p-5"
                >
                  <FileText className="shrink-0 text-accent-violet" size={28} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{doc.title}</p>
                    <p className="text-xs text-muted uppercase">{doc.fileType}</p>
                  </div>
                  <Download className="shrink-0 text-muted" size={18} />
                </a>
              ))}
            </div>
          </div>
        ))}
        {documents.length === 0 ? <p className="text-muted">No documents published yet.</p> : null}
      </div>
    </main>
  );
}
