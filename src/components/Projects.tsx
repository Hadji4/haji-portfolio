import { Reveal } from "./Reveal";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";

export function Projects({ projects }: { projects: ProjectCardData[] }) {
  return (
    <section id="projects" className="scroll-mt-24 py-16">
      <Reveal>
        <h2 className="section-heading">Featured Projects</h2>
      </Reveal>
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={0.05 * (i + 1)}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
