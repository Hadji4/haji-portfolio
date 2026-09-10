"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Code2,
  Briefcase,
  GraduationCap,
  Mail,
  Settings,
  UserCircle,
  Images,
  FileText,
  Newspaper,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

type AdminLink = { href: string; label: string; icon: LucideIcon };
type AdminNavGroup = { label: string; links: AdminLink[] };

const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: "Overview",
    links: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Content",
    links: [
      { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
      { href: "/admin/blog", label: "Blog", icon: Newspaper },
      { href: "/admin/gallery", label: "Gallery", icon: Images },
      { href: "/admin/documents", label: "Documents", icon: FileText },
    ],
  },
  {
    label: "Profile",
    links: [
      { href: "/admin/skills", label: "Skills", icon: Code2 },
      { href: "/admin/experience", label: "Experience", icon: Briefcase },
      { href: "/admin/education", label: "Education", icon: GraduationCap },
    ],
  },
  {
    label: "Account",
    links: [
      { href: "/admin/messages", label: "Messages", icon: Mail },
      { href: "/admin/settings", label: "Settings", icon: Settings },
      { href: "/admin/profile", label: "Profile", icon: UserCircle },
    ],
  },
];

export const ADMIN_LINKS: AdminLink[] = ADMIN_NAV_GROUPS.flatMap((group) => group.links);

export function AdminNavLinks({
  onNavigate,
  collapsed = false,
  unreadCount = 0,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
  unreadCount?: number;
}) {
  const pathname = usePathname();

  return (
    <nav className="space-y-5">
      {ADMIN_NAV_GROUPS.map((group) => (
        <div key={group.label}>
          {collapsed ? (
            <div className="mx-2 mb-2 h-px bg-white/10" />
          ) : (
            <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-muted/70 uppercase">
              {group.label}
            </p>
          )}
          <div className="space-y-1">
            {group.links.map((link) => {
              const isActive =
                link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              const badge = link.href === "/admin/messages" && unreadCount > 0 ? unreadCount : null;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  title={collapsed ? link.label : undefined}
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    collapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-violet-500/10 text-foreground"
                      : "text-muted hover:bg-violet-500/10 hover:text-foreground"
                  }`}
                >
                  <link.icon size={17} className={isActive ? "text-accent-violet" : ""} />
                  {collapsed ? null : (
                    <span className="flex flex-1 items-center justify-between">
                      {link.label}
                      {badge ? (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 px-1 text-xs font-semibold text-white">
                          {badge}
                        </span>
                      ) : null}
                    </span>
                  )}
                  {collapsed && badge ? (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-pink-500" />
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
