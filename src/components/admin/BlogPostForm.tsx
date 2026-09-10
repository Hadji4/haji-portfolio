"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SubmitButton } from "./SubmitButton";

export type BlogPostFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
  coverImageUrl: string | null;
};

export function BlogPostForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: Partial<BlogPostFormValues>;
}) {
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <form action={action} className="admin-card max-w-3xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="admin-label">Title</label>
          <input name="title" required defaultValue={defaultValues?.title} className="admin-input" />
        </div>
        <div>
          <label className="admin-label">Slug (url-safe)</label>
          <input
            name="slug"
            required
            defaultValue={defaultValues?.slug}
            className="admin-input"
            placeholder="e.g. lessons-from-cbhi-rollout"
          />
        </div>
      </div>

      <div>
        <label className="admin-label">Excerpt (shown on the blog list, max 300 chars)</label>
        <textarea name="excerpt" required rows={2} defaultValue={defaultValues?.excerpt} className="admin-input" />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="admin-label mb-0">Content (Markdown)</label>
          <div className="flex gap-1 rounded-md border border-white/10 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setTab("write")}
              className={`rounded px-2.5 py-1 ${tab === "write" ? "bg-violet-500/20 text-foreground" : "text-muted"}`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`rounded px-2.5 py-1 ${tab === "preview" ? "bg-violet-500/20 text-foreground" : "text-muted"}`}
            >
              Preview
            </button>
          </div>
        </div>
        {tab === "write" ? (
          <textarea
            name="content"
            required
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="admin-input font-mono text-sm"
            placeholder={"## Heading\n\nWrite your post in Markdown — **bold**, _italic_, `code`, lists, links, images..."}
          />
        ) : (
          <>
            <input type="hidden" name="content" value={content} />
            <div className="admin-input prose-invert min-h-[24rem] overflow-y-auto">
              {content ? (
                <article className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </article>
              ) : (
                <p className="text-muted">Nothing to preview yet.</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="admin-label">Tags (comma separated)</label>
          <input
            name="tags"
            defaultValue={defaultValues?.tags?.join(", ")}
            className="admin-input"
            placeholder="Health Tech, EMR, Ethiopia"
          />
        </div>
        <div>
          <label className="admin-label">Cover image (optional)</label>
          <input
            type="file"
            name="coverImage"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="admin-input file:mr-3 file:rounded-md file:border-0 file:bg-violet-500/20 file:px-3 file:py-1.5 file:text-foreground"
          />
          {defaultValues?.coverImageUrl ? (
            <p className="mt-1 text-xs text-muted">Leave blank to keep the current cover image.</p>
          ) : null}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <input type="checkbox" name="published" defaultChecked={defaultValues?.published} className="h-4 w-4 accent-violet-500" />
        Published
      </label>

      <SubmitButton label={defaultValues ? "Update Post" : "Publish Post"} />
    </form>
  );
}
