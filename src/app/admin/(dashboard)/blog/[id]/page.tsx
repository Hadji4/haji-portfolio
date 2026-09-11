import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { updatePost } from "../actions";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const boundUpdate = updatePost.bind(null, id);

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl font-bold text-foreground">Edit Post</h1>
      <BlogPostForm
        action={boundUpdate}
        defaultValues={{
          title: post.title,
          metaTitle: post.metaTitle,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          tags: post.tags as string[],
          published: post.published,
          coverImageUrl: post.coverImageUrl,
        }}
      />
    </div>
  );
}
