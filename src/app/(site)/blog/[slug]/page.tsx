import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { LightboxImage } from "@/components/LightboxImage";
import { ShareButtons } from "@/components/ShareButtons";
import { readingTime } from "@/lib/reading-time";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const markdownComponents: Components = {
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      <LightboxImage src={src} alt={alt ?? ""} className="rounded-xl" />
    ) : null,
};

async function getPost(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || !post.published) return {};

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const name = settings?.heroName ?? "Haji Omer Sheno";

  return {
    title: `${post.title} | ${name}`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: post.tags as string[],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      tags: post.tags as string[],
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || !post.published) notFound();

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const heroName = settings?.heroName ?? "Haji Omer Sheno";
  const tags = post.tags as string[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    image: post.coverImageUrl ?? undefined,
    keywords: tags.join(", "),
    author: {
      "@type": "Person",
      name: heroName,
    },
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
        <ArrowLeft size={16} /> Back to blog
      </Link>

      {post.coverImageUrl ? (
        <LightboxImage
          src={post.coverImageUrl}
          alt={post.title}
          className="mt-8 h-64 w-full rounded-2xl object-cover sm:h-80"
        />
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted">
        <span className="flex items-center gap-1.5">
          <CalendarDays size={15} />
          {post.publishedAt?.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={15} />
          {readingTime(post.content)}
        </span>
      </div>
      <h1 className="font-display mt-3 text-3xl font-bold text-foreground lg:text-4xl">{post.title}</h1>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted">
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <span />
        )}
        <ShareButtons url={`${SITE_URL}/blog/${post.slug}`} title={post.title} />
      </div>

      <article className="prose prose-invert mt-10 max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={markdownComponents}
        >
          {post.content}
        </ReactMarkdown>
      </article>
    </main>
  );
}
