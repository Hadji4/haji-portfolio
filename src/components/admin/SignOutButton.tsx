"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      title={collapsed ? "Sign out" : undefined}
      className={`flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:border-pink-500/40 hover:text-pink-400 ${
        collapsed ? "justify-center" : "w-full"
      }`}
    >
      <LogOut size={16} /> {collapsed ? null : "Sign out"}
    </button>
  );
}
