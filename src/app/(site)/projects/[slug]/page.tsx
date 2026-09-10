import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Layers, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ACCENT_CLASSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getProject(slug: string) {
  return prisma.project.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/projects/${project.slug}`,
      type: "article",
    },
  };
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const techStack = project.techStack as string[];
  const features = project.features as string[];
  const gradient = ACCENT_CLASSES[project.accent] ?? ACCENT_CLASSES.violet;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
        <ArrowLeft size={16} /> Back to portfolio
      </Link>

      <span className={`mt-8 inline-block w-fit rounded-full bg-gradient-to-r ${gradient} px-3 py-1 text-xs font-semibold tracking-wide text-white/90 uppercase`}>
        {project.category}
      </span>
      <h1 className="font-display mt-4 text-3xl font-bold text-foreground lg:text-4xl">
        {project.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg font-light">{project.summary}</p>

      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-violet"
        >
          Visit live site <ExternalLink size={14} />
        </a>
      ) : null}

      <div className="mt-10 whitespace-pre-line leading-loose font-light">
        {project.description}
      </div>

      <h2 className="subheading">
        <Sparkles className="text-accent-violet" size={20} /> Key Features
      </h2>
      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature} className="relative pl-5 font-light">
            <span className="absolute left-0 text-accent-violet">▹</span>
            {feature}
          </li>
        ))}
      </ul>

      <h2 className="subheading">
        <Layers className="text-accent-violet" size={20} /> Tech Stack
      </h2>
      <div className="flex flex-wrap gap-3">
        {techStack.map((tech) => (
          <span key={tech} className="skill-tag">
            {tech}
          </span>
        ))}
      </div>

      {project.scale ? (
        <p className="mt-8 text-sm text-muted">
          <span className="font-medium text-foreground">Scale: </span>
          {project.scale}
        </p>
      ) : null}
      {project.repoNote ? <p className="mt-2 text-sm text-muted">{project.repoNote}</p> : null}
    </main>
  );
}
