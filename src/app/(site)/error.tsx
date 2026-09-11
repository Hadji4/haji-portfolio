"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";
import { logger } from "@/lib/logger";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logger.error("Unhandled error in (site) route segment", error, { digest: error.digest });
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="font-display gradient-text text-8xl font-bold">500</p>
      <h1 className="font-display mt-4 text-2xl font-bold text-foreground sm:text-3xl">
        Something went wrong.
      </h1>
      <p className="mt-3 max-w-md text-muted">
        The error has been logged. Try again, or head back home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 transition-transform hover:-translate-y-0.5"
        >
          <RotateCcw size={17} /> Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-violet-500/30 bg-white/5 px-6 py-3 font-semibold text-foreground transition-colors hover:bg-violet-500/10"
        >
          <Home size={17} /> Back to home
        </Link>
      </div>
    </main>
  );
}
