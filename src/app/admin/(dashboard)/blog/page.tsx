import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { TogglePublishedButton } from "@/components/admin/TogglePublishedButton";
import { deletePost, toggleBlogPublished } from "./actions";

export const revalidate = 0;

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={16} /> New Post
        </Link>
      </div>

      <div className="admin-card mt-6 overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Tags</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{post.title}</td>
                <td className="px-5 py-3 text-muted">{(post.tags as string[]).join(", ")}</td>
                <td className="px-5 py-3">
                  <TogglePublishedButton
                    published={post.published}
                    action={toggleBlogPublished.bind(null, post.id, !post.published)}
                  />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-accent-violet transition-colors hover:bg-violet-500/10"
                    >
                      <Pencil size={15} /> Edit
                    </Link>
                    <ConfirmDeleteButton action={deletePost.bind(null, post.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-muted">
                  No posts yet — write your first one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
