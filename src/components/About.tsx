import { UserCircle2, Rocket, GraduationCap, Briefcase } from "lucide-react";
import { Reveal } from "./Reveal";

type ExperienceItem = { id: string; role: string; organization: string; period: string | null; description: string };
type EducationItem = { id: string; title: string; institution: string | null };

export function About({
  experience,
  education,
}: {
  experience: ExperienceItem[];
  education: EducationItem[];
}) {
  return (
    <section id="about" className="scroll-mt-24 py-16">
      <Reveal>
        <h2 className="section-heading">About Me</h2>
      </Reveal>

      <Reveal delay={0.05}>
        <h3 className="subheading">
          <UserCircle2 className="text-accent-violet" size={22} /> Who I Am
        </h3>
        <p className="max-w-3xl font-light leading-loose">
          My name is Haji Omer Sheno, and I&apos;m a full-stack web developer and digital
          health systems architect based in Shashemene, Ethiopia. I specialize in building
          real-world solutions for healthcare institutions, focusing on web applications,
          database systems, reporting tools, and system integrations — especially in
          under-resourced environments where efficiency, reliability, and scalability are
          critical.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <h3 className="subheading">
          <Rocket className="text-accent-violet" size={22} /> My Mission
        </h3>
        <p className="max-w-3xl font-light leading-loose">
          To modernize healthcare operations across Ethiopia and beyond through simple,
          smart, and secure technology. I believe in building systems that solve real
          problems, not just write code for the sake of it. My mission is rooted in
          service: helping healthcare professionals do their jobs better, faster, and with
          fewer manual processes.
        </p>
      </Reveal>

      {education.length > 0 && (
        <Reveal delay={0.15}>
          <h3 className="subheading">
            <GraduationCap className="text-accent-violet" size={22} /> Educational Background
          </h3>
          <ul className="space-y-3">
            {education.map((item) => (
              <li key={item.id} className="relative pl-6 font-light">
                <span className="absolute left-0 text-accent-violet">▹</span>
                {item.title}
                {item.institution ? ` — ${item.institution}` : ""}
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {experience.length > 0 && (
        <Reveal delay={0.2}>
          <h3 className="subheading">
            <Briefcase className="text-accent-violet" size={22} /> Professional Experience
          </h3>
          <ul className="space-y-3">
            {experience.map((item) => (
              <li key={item.id} className="relative pl-6 font-light">
                <span className="absolute left-0 text-accent-violet">▹</span>
                <span className="font-medium text-foreground">{item.role}</span>
                {" — "}
                {item.organization}
                {item.period ? ` (${item.period})` : ""}
                {item.description ? <span className="block text-sm">{item.description}</span> : null}
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </section>
  );
}
