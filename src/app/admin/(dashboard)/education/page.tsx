import { prisma } from "@/lib/prisma";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { createEducation, deleteEducation } from "./actions";

export const revalidate = 0;

export default async function AdminEducationPage() {
  const education = await prisma.education.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Education</h1>

      <form action={createEducation} className="admin-card mt-6 max-w-2xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-[2fr_2fr_1fr]">
          <div>
            <label className="admin-label">Title</label>
            <input name="title" required className="admin-input" placeholder="e.g. Master's in Computer Science" />
          </div>
          <div>
            <label className="admin-label">Institution (optional)</label>
            <input name="institution" className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Order</label>
            <input type="number" name="order" defaultValue={0} className="admin-input" />
          </div>
        </div>
        <SubmitButton label="Add Education" />
      </form>

      <div className="mt-8 space-y-3">
        {education.map((item) => (
          <div key={item.id} className="admin-card flex items-center justify-between gap-4">
            <p className="font-medium text-foreground">
              {item.title}
              {item.institution ? ` — ${item.institution}` : ""}
            </p>
            <ConfirmDeleteButton action={deleteEducation.bind(null, item.id)} />
          </div>
        ))}
        {education.length === 0 ? <p className="text-muted">No education entries yet.</p> : null}
      </div>
    </div>
  );
}
