import { Server, Monitor, HeartPulse, Wrench } from "lucide-react";
import { Reveal } from "./Reveal";

type SkillItem = { id: string; category: string; name: string };

const CATEGORY_ICON: Record<string, typeof Server> = {
  "Backend & Database": Server,
  Frontend: Monitor,
  "Health Tech Systems": HeartPulse,
  "Tools & Platforms": Wrench,
};

export function Skills({ skills }: { skills: SkillItem[] }) {
  const grouped = skills.reduce<Record<string, SkillItem[]>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="scroll-mt-24 py-16">
      <Reveal>
        <h2 className="section-heading">Technical Skills</h2>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(grouped).map(([category, items], i) => {
          const Icon = CATEGORY_ICON[category] ?? Wrench;
          return (
            <Reveal key={category} delay={0.05 * (i + 1)}>
              <div className="card-surface h-full rounded-2xl p-7">
                <div className="mb-5 flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-lg shadow-violet-500/30">
                    <Icon size={22} />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foreground lg:text-xl">
                    {category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {items.map((skill) => (
                    <span key={skill.id} className="skill-tag">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
