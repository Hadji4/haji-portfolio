"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateProfile, type ActionState } from "@/app/admin/(dashboard)/profile/actions";
import { SubmitButton } from "./SubmitButton";

export function ProfileNameForm({ name }: { name: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateProfile, {});

  useEffect(() => {
    if (state.success) toast.success(state.success);
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="admin-label">Display name</label>
        <input name="name" defaultValue={name} required minLength={2} className="admin-input" />
      </div>
      <SubmitButton label="Save" />
    </form>
  );
}
