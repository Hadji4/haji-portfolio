import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteProject } from "./actions";

export const revalidate = 0;

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={16} /> New Project
        </Link>
      </div>

      <div className="admin-card mt-6 overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    {project.featured ? <Star size={14} className="text-amber-400" /> : null}
                    {project.title}
                  </div>
                </td>
                <td className="px-5 py-3">{project.category}</td>
                <td className="px-5 py-3">{project.order}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-accent-violet transition-colors hover:bg-violet-500/10"
                    >
                      <Pencil size={15} /> Edit
                    </Link>
                    <ConfirmDeleteButton action={deleteProject.bind(null, project.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-muted">
                  No projects yet — add your first one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
