import { prisma } from "@/lib/prisma";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { createExperience, deleteExperience } from "./actions";

export const revalidate = 0;

export default async function AdminExperiencePage() {
  const experience = await prisma.experience.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Professional Experience</h1>

      <form action={createExperience} className="admin-card mt-6 max-w-2xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label">Role</label>
            <input name="role" required className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Organization</label>
            <input name="organization" required className="admin-input" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <div>
            <label className="admin-label">Period (optional)</label>
            <input name="period" className="admin-input" placeholder="e.g. 2021 - Present" />
          </div>
          <div>
            <label className="admin-label">Order</label>
            <input type="number" name="order" defaultValue={0} className="admin-input" />
          </div>
        </div>
        <div>
          <label className="admin-label">Description</label>
          <textarea name="description" required rows={2} className="admin-input" />
        </div>
        <SubmitButton label="Add Experience" />
      </form>

      <div className="mt-8 space-y-3">
        {experience.map((item) => (
          <div key={item.id} className="admin-card flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">
                {item.role} — {item.organization} {item.period ? `(${item.period})` : ""}
              </p>
              <p className="mt-1 text-sm text-muted">{item.description}</p>
            </div>
            <ConfirmDeleteButton action={deleteExperience.bind(null, item.id)} />
          </div>
        ))}
        {experience.length === 0 ? <p className="text-muted">No experience entries yet.</p> : null}
      </div>
    </div>
  );
}
