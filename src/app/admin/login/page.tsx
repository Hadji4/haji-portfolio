"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogIn, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push(searchParams.get("callbackUrl") || "/admin");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="card-surface w-full max-w-sm rounded-2xl p-8">
      <h1 className="font-display gradient-text text-2xl font-bold">Admin Login</h1>
      <p className="mt-1 text-sm text-muted">Sign in to manage your portfolio content.</p>

      <div className="mt-6">
        <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-foreground outline-none focus:border-violet-500"
        />
      </div>
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-foreground outline-none focus:border-violet-500"
        />
      </div>

      {error ? <p className="mt-3 text-sm text-pink-400">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 disabled:opacity-60"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
        Sign In
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
