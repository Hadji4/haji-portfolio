import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { updateProject } from "../actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  const boundUpdate = updateProject.bind(null, id);

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-bold text-foreground">Edit Project</h1>
      <ProjectForm
        action={boundUpdate}
        defaultValues={{
          title: project.title,
          slug: project.slug,
          category: project.category,
          summary: project.summary,
          description: project.description,
          techStack: project.techStack as string[],
          features: project.features as string[],
          scale: project.scale,
          liveUrl: project.liveUrl,
          repoNote: project.repoNote,
          accent: project.accent,
          featured: project.featured,
          order: project.order,
        }}
      />
    </div>
  );
}
