import { ACCENT_OPTIONS } from "@/lib/constants";
import { SubmitButton } from "./SubmitButton";

export type ProjectFormValues = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  techStack: string[];
  features: string[];
  scale: string | null;
  liveUrl: string | null;
  repoNote: string | null;
  accent: string;
  featured: boolean;
  order: number;
};

export function ProjectForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: Partial<ProjectFormValues>;
}) {
  return (
    <form action={action} className="admin-card max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="admin-label">Title</label>
          <input name="title" required defaultValue={defaultValues?.title} className="admin-input" />
        </div>
        <div>
          <label className="admin-label">Slug (url-safe)</label>
          <input name="slug" required defaultValue={defaultValues?.slug} className="admin-input" placeholder="e.g. horoo-mart" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="admin-label">Category</label>
          <input name="category" required defaultValue={defaultValues?.category} className="admin-input" placeholder="e.g. Hospital ERP" />
        </div>
        <div>
          <label className="admin-label">Accent color</label>
          <select name="accent" defaultValue={defaultValues?.accent ?? "violet"} className="admin-input">
            {ACCENT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="admin-label">Summary (shown on the card, max 300 chars)</label>
        <textarea name="summary" required rows={2} defaultValue={defaultValues?.summary} className="admin-input" />
      </div>

      <div>
        <label className="admin-label">Full description (case study page)</label>
        <textarea name="description" required rows={6} defaultValue={defaultValues?.description} className="admin-input" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="admin-label">Tech stack (one per line)</label>
          <textarea
            name="techStack"
            required
            rows={5}
            defaultValue={defaultValues?.techStack?.join("\n")}
            className="admin-input"
            placeholder={"Laravel\nMySQL\nReact"}
          />
        </div>
        <div>
          <label className="admin-label">Key features (one per line)</label>
          <textarea
            name="features"
            required
            rows={5}
            defaultValue={defaultValues?.features?.join("\n")}
            className="admin-input"
            placeholder={"Role-based access control\nInventory management"}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="admin-label">Scale note (optional)</label>
          <input name="scale" defaultValue={defaultValues?.scale ?? ""} className="admin-input" placeholder="e.g. 58+ controllers" />
        </div>
        <div>
          <label className="admin-label">Live URL (optional)</label>
          <input name="liveUrl" defaultValue={defaultValues?.liveUrl ?? ""} className="admin-input" placeholder="https://..." />
        </div>
      </div>

      <div>
        <label className="admin-label">Repo note (optional)</label>
        <input name="repoNote" defaultValue={defaultValues?.repoNote ?? ""} className="admin-input" placeholder="e.g. Private client codebase" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="admin-label">Display order</label>
          <input type="number" name="order" defaultValue={defaultValues?.order ?? 0} className="admin-input" />
        </div>
        <label className="flex items-center gap-2 self-end pb-2.5 text-sm font-medium text-foreground">
          <input type="checkbox" name="featured" defaultChecked={defaultValues?.featured} className="h-4 w-4 accent-violet-500" />
          Featured project
        </label>
      </div>

      <SubmitButton label={defaultValues ? "Update Project" : "Create Project"} />
    </form>
  );
}
