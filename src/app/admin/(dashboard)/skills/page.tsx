import { prisma } from "@/lib/prisma";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { createSkill, deleteSkill } from "./actions";

export const revalidate = 0;

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Skills</h1>

      <form action={createSkill} className="admin-card mt-6 grid max-w-2xl gap-4 sm:grid-cols-[1fr_1fr_100px_auto]">
        <div>
          <label className="admin-label">Category</label>
          <input name="category" required className="admin-input" placeholder="e.g. Backend & Database" />
        </div>
        <div>
          <label className="admin-label">Skill name</label>
          <input name="name" required className="admin-input" placeholder="e.g. Node.js" />
        </div>
        <div>
          <label className="admin-label">Order</label>
          <input type="number" name="order" defaultValue={0} className="admin-input" />
        </div>
        <div className="flex items-end">
          <SubmitButton label="Add" />
        </div>
      </form>

      <div className="mt-8 space-y-6">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="admin-card">
            <h2 className="mb-3 font-display text-lg font-semibold text-foreground">{category}</h2>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <span key={skill.id} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-4 pr-2 text-sm">
                  {skill.name}
                  <ConfirmDeleteButton action={deleteSkill.bind(null, skill.id)} confirmMessage={`Remove "${skill.name}"?`} iconOnly />
                </span>
              ))}
            </div>
          </div>
        ))}
        {skills.length === 0 ? <p className="text-muted">No skills added yet.</p> : null}
      </div>
    </div>
  );
}
