import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { ACCENT_CLASSES } from "@/lib/constants";

export type ProjectCardData = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  techStack: string[];
  liveUrl?: string | null;
  accent: string;
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const gradient = ACCENT_CLASSES[project.accent] ?? ACCENT_CLASSES.violet;

  return (
    <div className="card-surface group flex h-full flex-col rounded-2xl p-8">
      <span
        className={`mb-4 inline-block w-fit rounded-full bg-gradient-to-r ${gradient} px-3 py-1 text-xs font-semibold tracking-wide text-white/90 uppercase`}
      >
        {project.category}
      </span>
      <h3 className="font-display mb-3 text-xl font-semibold text-foreground">
        {project.title}
      </h3>
      <p className="mb-5 flex-1 text-sm leading-relaxed">{project.summary}</p>

      <div className="mb-5 flex flex-wrap gap-2 border-t border-dashed border-violet-500/20 pt-4 text-xs">
        {project.techStack.slice(0, 5).map((tech) => (
          <span key={tech} className="rounded-md bg-white/5 px-2 py-1 text-muted">
            {tech}
          </span>
        ))}
        {project.techStack.length > 5 ? (
          <span className="rounded-md bg-white/5 px-2 py-1 text-muted">
            +{project.techStack.length - 5}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-4 text-sm font-medium">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-accent-violet transition-transform group-hover:translate-x-0.5"
        >
          Case study <ArrowUpRight size={16} />
        </Link>
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-muted hover:text-foreground"
          >
            Live <ExternalLink size={14} />
          </a>
        ) : null}
      </div>
    </div>
  );
}
