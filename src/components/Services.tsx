import { SERVICES } from "@/lib/constants";
import { Reveal } from "./Reveal";

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 py-16">
      <Reveal>
        <h2 className="section-heading">My Services</h2>
      </Reveal>
      <div className="grid gap-8 md:grid-cols-2">
        {SERVICES.map((service, i) => (
          <Reveal key={service.title} delay={0.05 * (i + 1)}>
            <div className="card-surface h-full rounded-2xl p-8">
              <h3 className="font-display relative mb-4 inline-block text-xl font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed">{service.description}</p>
              <h4 className="mt-5 mb-2 font-medium text-foreground">What&apos;s included:</h4>
              <ul className="space-y-2">
                {service.items.map((item) => (
                  <li key={item} className="relative pl-5 text-sm font-light">
                    <span className="absolute left-0 text-accent-violet">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
