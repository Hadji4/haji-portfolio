"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, X } from "lucide-react";
import { AdminNavLinks } from "./AdminNavLinks";
import { AdminAvatar } from "./AdminAvatar";
import { SignOutButton } from "./SignOutButton";
import { AdminTopbar } from "./AdminTopbar";
import { AdminFooter } from "./AdminFooter";

type AdminInfo = { name: string; email: string; avatarUrl: string | null };

const COLLAPSE_KEY = "admin-sidebar-collapsed";

export function AdminShell({
  admin,
  unreadCount = 0,
  children,
}: {
  admin: AdminInfo;
  unreadCount?: number;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // localStorage isn't available during SSR, and reading it in a lazy
    // useState initializer would cause a hydration mismatch (server always
    // renders "expanded"). Reading it here, after mount, is the standard
    // hydration-safe pattern for persisted UI state.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      // localStorage unavailable — keep default expanded state
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile drawer + backdrop */}
      {drawerOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/60 md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      ) : null}
      <aside
        className={`glass-panel fixed top-0 left-0 z-50 flex h-full w-72 flex-col justify-between overflow-y-auto border-r border-white/10 p-6 transition-transform duration-300 md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-display gradient-text text-xl font-bold">Admin Panel</h1>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-white/5"
            >
              <X size={20} />
            </button>
          </div>
          <Link
            href="/admin/profile"
            onClick={() => setDrawerOpen(false)}
            className="mb-6 flex items-center gap-3 rounded-lg p-2 hover:bg-white/5"
          >
            <AdminAvatar name={admin.name} avatarUrl={admin.avatarUrl} size={40} />
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{admin.name}</p>
              <p className="truncate text-xs text-muted">{admin.email}</p>
            </div>
          </Link>
          <AdminNavLinks onNavigate={() => setDrawerOpen(false)} unreadCount={unreadCount} />
        </div>
        <div className="space-y-3 pt-6">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-sm text-muted hover:text-foreground"
          >
            <ExternalLink size={15} /> View site
          </Link>
          <SignOutButton />
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`glass-panel sticky top-0 hidden h-screen shrink-0 flex-col justify-between overflow-y-auto border-r border-white/10 transition-[width] duration-300 md:flex ${
          collapsed ? "w-20 px-3 py-6" : "w-64 p-6"
        }`}
      >
        <div>
          {collapsed ? null : (
            <h1 className="font-display gradient-text px-1 text-xl font-bold">Admin Panel</h1>
          )}
          <Link
            href="/admin/profile"
            title={collapsed ? "Profile" : undefined}
            className={`mt-6 flex items-center gap-3 rounded-lg p-2 hover:bg-white/5 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <AdminAvatar name={admin.name} avatarUrl={admin.avatarUrl} size={40} />
            {collapsed ? null : (
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{admin.name}</p>
                <p className="truncate text-xs text-muted">{admin.email}</p>
              </div>
            )}
          </Link>
          <div className="mt-6">
            <AdminNavLinks collapsed={collapsed} unreadCount={unreadCount} />
          </div>
        </div>
        <div className={`space-y-3 ${collapsed ? "flex flex-col items-center" : ""}`}>
          <Link
            href="/"
            target="_blank"
            title={collapsed ? "View site" : undefined}
            className={`flex items-center gap-2 text-sm text-muted hover:text-foreground ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <ExternalLink size={15} />
            {collapsed ? null : "View site"}
          </Link>
          <SignOutButton collapsed={collapsed} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          unreadCount={unreadCount}
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
          onOpenMobileMenu={() => setDrawerOpen(true)}
        />
        <main className="flex-1 bg-background p-4 sm:p-6 md:p-10">{children}</main>
        <AdminFooter />
      </div>
    </div>
  );
}
