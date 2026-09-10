import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="font-display gradient-text text-8xl font-bold">404</p>
      <h1 className="font-display mt-4 text-2xl font-bold text-foreground sm:text-3xl">
        This page took a wrong turn.
      </h1>
      <p className="mt-3 max-w-md text-muted">
        Whatever you were looking for isn&apos;t here — it may have moved, or the link was
        mistyped.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 transition-transform hover:-translate-y-0.5"
        >
          <Home size={17} /> Back to home
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-lg border border-violet-500/30 bg-white/5 px-6 py-3 font-semibold text-foreground transition-colors hover:bg-violet-500/10"
        >
          <ArrowLeft size={17} /> Visit the blog
        </Link>
      </div>
    </main>
  );
}
