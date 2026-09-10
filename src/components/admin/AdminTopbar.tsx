"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Mail, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ADMIN_LINKS } from "./AdminNavLinks";

function currentPageTitle(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  const match = [...ADMIN_LINKS].reverse().find((link) => pathname.startsWith(link.href));
  return match?.label ?? "Admin";
}

export function AdminTopbar({
  unreadCount,
  collapsed,
  onToggleCollapsed,
  onOpenMobileMenu,
}: {
  unreadCount: number;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onOpenMobileMenu: () => void;
}) {
  const pathname = usePathname();

  return (
    <header className="glass-panel sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-white/10 px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onOpenMobileMenu}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-white/5 md:hidden"
        >
          <Menu size={20} />
        </button>
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggleCollapsed}
          className="hidden h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-white/5 hover:text-foreground md:flex"
        >
          {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
        </button>
        <h1 className="font-display text-lg font-semibold text-foreground">
          {currentPageTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/admin/messages"
          aria-label="Messages"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-white/5 hover:text-foreground"
        >
          <Mail size={19} />
          {unreadCount > 0 ? (
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 rounded-full bg-pink-500" />
          ) : null}
        </Link>
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-muted hover:border-violet-500/40 hover:text-foreground sm:flex"
        >
          <ExternalLink size={15} /> View site
        </Link>
      </div>
    </header>
  );
}
