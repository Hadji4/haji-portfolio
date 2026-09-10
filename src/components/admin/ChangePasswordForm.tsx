"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { changePassword, type ActionState } from "@/app/admin/(dashboard)/profile/actions";
import { SubmitButton } from "./SubmitButton";

export function ChangePasswordForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(changePassword, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
      formRef.current?.reset();
    }
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <label className="admin-label">Current password</label>
        <input type="password" name="currentPassword" required autoComplete="current-password" className="admin-input" />
      </div>
      <div>
        <label className="admin-label">New password</label>
        <input
          type="password"
          name="newPassword"
          required
          minLength={8}
          autoComplete="new-password"
          className="admin-input"
        />
      </div>
      <div>
        <label className="admin-label">Confirm new password</label>
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={8}
          autoComplete="new-password"
          className="admin-input"
        />
      </div>
      <SubmitButton label="Change Password" />
    </form>
  );
}
