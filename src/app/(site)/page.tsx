import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const name = settings?.heroName ?? "Haji Omer Sheno";
  const title = settings?.heroTitle ?? "Digital Health Systems Architect";
  const description =
    settings?.heroIntro ??
    "I design and build powerful digital systems for hospitals, clinics, and pharmacies.";

  return {
    title: `${name} | ${title}`,
    description,
    alternates: { canonical: "/" },
    openGraph: { title: `${name} | ${title}`, description, url: "/" },
    twitter: { title: `${name} | ${title}`, description },
  };
}

export default async function Home() {
  const [settings, skills, experience, education, projects] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.project.findMany({ orderBy: { order: "asc" } }),
  ]);

  const heroName = settings?.heroName ?? "Haji Omer Sheno";
  const heroTitle = settings?.heroTitle ?? "Digital Health Systems Architect";
  const heroIntro =
    settings?.heroIntro ??
    "I design and build powerful digital systems for hospitals, clinics, and pharmacies.";
  const stats = (settings?.stats as { label: string; value: number }[] | undefined) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: heroName,
    jobTitle: heroTitle,
    description: heroIntro,
    email: settings?.email ?? "hadjiomer9@gmail.com",
    telephone: settings?.phone ?? "+251927325044",
    url: SITE_URL,
    image: settings?.heroPhotoUrl ? `${SITE_URL}${settings.heroPhotoUrl}` : `${SITE_URL}/haji-web.jpg`,
    sameAs: [settings?.github, settings?.telegram].filter(Boolean),
    knowsAbout: skills.map((s) => s.name),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <Hero
          name={heroName}
          title={heroTitle}
          intro={heroIntro}
          stats={stats}
          cvUrl={settings?.cvUrl}
          photoUrl={settings?.heroPhotoUrl}
        />
        <div className="section-divider my-4" />
        <About experience={experience} education={education} />
        <div className="section-divider my-4" />
        <Skills skills={skills} />
        <div className="section-divider my-4" />
        <Services />
        <div className="section-divider my-4" />
        <Projects
          projects={projects.map((p) => ({
            slug: p.slug,
            title: p.title,
            category: p.category,
            summary: p.summary,
            techStack: p.techStack as string[],
            liveUrl: p.liveUrl,
            accent: p.accent,
          }))}
        />
        <div className="section-divider my-4" />
        <Contact
          email={settings?.email ?? "hadjiomer9@gmail.com"}
          phone={settings?.phone ?? "+251 927 325 044"}
          telegram={settings?.telegram}
        />
      </main>
    </>
  );
}
