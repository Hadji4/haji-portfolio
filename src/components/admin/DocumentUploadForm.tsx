"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { addDocument } from "@/app/admin/(dashboard)/documents/actions";
import type { ActionState } from "@/lib/action-state";
import { SubmitButton } from "./SubmitButton";

export function DocumentUploadForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(addDocument, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      formRef.current?.reset();
    }
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="admin-card space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="admin-label">Title</label>
          <input name="title" required className="admin-input" placeholder="e.g. CPHIMS Certificate" />
        </div>
        <div>
          <label className="admin-label">Category</label>
          <input name="category" required className="admin-input" placeholder="e.g. Education" />
        </div>
      </div>

      <div>
        <label className="admin-label">File (PDF, Word, Excel or PowerPoint, up to 15MB)</label>
        <input
          type="file"
          name="file"
          required
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          className="admin-input file:mr-3 file:rounded-md file:border-0 file:bg-violet-500/20 file:px-3 file:py-1.5 file:text-foreground"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <input type="checkbox" name="published" className="h-4 w-4 accent-violet-500" />
          Publish immediately
        </label>
        <input type="hidden" name="order" value={0} />
        <SubmitButton label="Upload Document" />
      </div>
    </form>
  );
}
