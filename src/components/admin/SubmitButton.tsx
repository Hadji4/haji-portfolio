"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";

export function SubmitButton({ label = "Save" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-violet-500/30 disabled:opacity-60"
    >
      {pending ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
      {label}
    </button>
  );
}
