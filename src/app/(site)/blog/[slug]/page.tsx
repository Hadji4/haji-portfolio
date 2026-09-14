import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { LightboxImage } from "@/components/LightboxImage";
import { BlogContent } from "@/components/BlogContent";
import { ShareButtons } from "@/components/ShareButtons";
import { readingTime } from "@/lib/reading-time";
import { SITE_URL, toSafeJsonLd } from "@/lib/site";

export const dynamic = "force-dynamic";

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

  const seoTitle = post.metaTitle || post.title;

  return {
    // Not "{seoTitle} | {name}" — the root layout's title template already
    // appends "| {name}", so doing it here too would duplicate it.
    title: seoTitle,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: post.tags as string[],
    openGraph: {
      title: seoTitle,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      tags: post.tags as string[],
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toSafeJsonLd(jsonLd) }} />

      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
        <ArrowLeft size={16} /> Back to blog
      </Link>

      {post.coverImageUrl ? (
        /* No fixed height or object-cover here on purpose: cover images are
           often infographics rather than landscape photos, and cropping one
           to a banner cuts off its content and shrinks its text past
           readability. Scaling the whole image to the column width keeps it
           intact; the card thumbnails on /blog still crop, since a grid
           needs uniform card heights. */
        <LightboxImage
          src={post.coverImageUrl}
          alt={post.title}
          priority
          className="mt-8 w-full rounded-2xl"
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

      <BlogContent html={post.content} />
    </main>
  );
}
