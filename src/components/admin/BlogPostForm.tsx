"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { RichTextEditor } from "./RichTextEditor";
import { SubmitButton } from "./SubmitButton";
import type { ActionState } from "@/lib/action-state";

export type BlogPostFormValues = {
  title: string;
  metaTitle: string | null;
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
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: Partial<BlogPostFormValues>;
}) {
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const [state, formAction] = useActionState<ActionState, FormData>(action, {});

  // A failed submission (e.g. a validation error) re-renders this same form
  // instead of navigating away, so `content` above is untouched — but show
  // the error so it isn't a silent no-op, and don't lose the rest of what
  // was typed.
  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="admin-card max-w-3xl space-y-5">
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
        <label className="admin-label">
          SEO Meta Title <span className="font-normal text-muted">(optional — shown in search results and the browser tab; defaults to Title)</span>
        </label>
        <input
          name="metaTitle"
          defaultValue={defaultValues?.metaTitle ?? ""}
          className="admin-input"
          placeholder={defaultValues?.title || "e.g. How We Cut CBHI Reconciliation Time by 80% | Haji Omer Sheno"}
          maxLength={200}
        />
      </div>

      <div>
        <label className="admin-label">Excerpt (shown on the blog list and as the SEO meta description, max 300 chars)</label>
        <textarea name="excerpt" required rows={2} defaultValue={defaultValues?.excerpt} className="admin-input" />
      </div>

      <div>
        <label className="admin-label">Content</label>
        <input type="hidden" name="content" value={content} />
        <RichTextEditor value={content} onChange={setContent} placeholder="Write your post..." />
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
