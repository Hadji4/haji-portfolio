"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { logger } from "@/lib/logger";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logger.error("Unhandled error in admin dashboard", error, { digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-2xl font-bold text-foreground">Something went wrong.</h1>
      <p className="mt-2 max-w-md text-muted">
        The error has been logged. This shouldn&apos;t affect your saved content.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/30"
      >
        <RotateCcw size={17} /> Try again
      </button>
    </div>
  );
}
