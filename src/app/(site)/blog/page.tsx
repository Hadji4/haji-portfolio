import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock, Rss } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Reveal } from "@/components/Reveal";
import { readingTime } from "@/lib/reading-time";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const name = settings?.heroName ?? "Haji Omer Sheno";
  const title = settings?.heroTitle ?? "Digital Health Systems Architect";
  return {
    title: `Blog | ${name}`,
    description: `Writing on health tech, full-stack development and building software for real institutions, by ${name} — ${title}.`,
    alternates: {
      canonical: "/blog",
      types: { "application/rss+xml": "/blog/rss.xml" },
    },
    openGraph: {
      title: `Blog | ${name}`,
      description: `Writing on health tech and full-stack development by ${name}.`,
      url: "/blog",
      type: "website",
    },
  };
}

export default async function BlogListPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="section-heading">Blog</h1>
          <p className="max-w-2xl">
            Notes on health tech, full-stack development, and building software that
            hospitals and clinics actually rely on.
          </p>
        </div>
        <a
          href="/blog/rss.xml"
          className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-muted hover:border-violet-500 hover:text-accent-violet"
        >
          <Rss size={13} /> RSS
        </a>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={0.05 * (i + 1)}>
            <Link href={`/blog/${post.slug}`} className="card-surface group block h-full rounded-2xl p-8">
              {post.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="mb-5 h-40 w-full rounded-xl object-cover"
                />
              ) : null}
              <div className="mb-3 flex items-center gap-3 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {post.publishedAt?.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {readingTime(post.content)}
                </span>
              </div>
              <h2 className="font-display mb-3 text-xl font-semibold text-foreground">{post.title}</h2>
              <p className="mb-5 text-sm leading-relaxed">{post.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-violet transition-transform group-hover:translate-x-0.5">
                Read post <ArrowUpRight size={16} />
              </span>
            </Link>
          </Reveal>
        ))}
        {posts.length === 0 ? <p className="text-muted">No posts published yet — check back soon.</p> : null}
      </div>
    </main>
  );
}
