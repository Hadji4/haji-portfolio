import { Briefcase, Download } from "lucide-react";
import { TypedText } from "./TypedText";
import { StatCounter } from "./StatCounter";
import { HeroPhoto } from "./HeroPhoto";

type Stat = { label: string; value: number };

export function Hero({
  name,
  title,
  intro,
  stats,
  cvUrl,
  photoUrl,
}: {
  name: string;
  title: string;
  intro: string;
  stats: Stat[];
  cvUrl?: string | null;
  photoUrl?: string | null;
}) {
  return (
    <section id="hero" className="flex min-h-[95vh] items-center">
      <div className="flex flex-col items-center gap-16 lg:flex-row">
        <div className="relative shrink-0">
          <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-gradient-to-br from-violet-500 to-pink-500 opacity-40 blur-3xl" />
          <HeroPhoto src={photoUrl || "/haji-web.jpg"} name={name} />
        </div>

        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="font-display text-4xl font-bold text-foreground lg:text-6xl">
            {name}
          </h1>
          <div className="mt-2 min-h-[2.5rem] text-xl font-medium text-muted lg:text-2xl">
            <TypedText
              strings={[
                title,
                "Full-Stack Developer",
                "Health Tech Innovator",
                "System Integrator",
              ]}
            />
          </div>
          <p className="mt-6 max-w-2xl text-base font-light leading-relaxed">{intro}</p>

          <div className="mt-8 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <StatCounter key={stat.label} target={stat.value} label={stat.label} />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 px-7 py-3.5 font-semibold text-white shadow-lg shadow-violet-500/30 transition-transform hover:-translate-y-0.5"
            >
              <Briefcase size={18} /> View My Projects
            </a>
            {cvUrl ? (
              <a
                href={cvUrl}
                download
                className="inline-flex items-center gap-2 rounded-lg border border-violet-500/30 bg-white/5 px-7 py-3.5 font-semibold text-foreground transition-colors hover:bg-violet-500/10"
              >
                <Download size={18} /> Download CV
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
