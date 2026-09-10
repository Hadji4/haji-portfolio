import Link from "next/link";
import { ArrowUpRight, Eye, FolderGit2, Newspaper, Images, FileText, Mail, MailWarning } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAnalyticsTotals, getDailyPageViews } from "@/lib/analytics";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [projectCount, postCount, galleryCount, documentCount, messageCount, unreadCount, totals, daily] =
    await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.galleryItem.count(),
      prisma.document.count(),
      prisma.message.count(),
      prisma.message.count({ where: { read: false } }),
      getAnalyticsTotals(),
      getDailyPageViews(14),
    ]);

  const cards = [
    { label: "Views (30d)", value: totals.recentViews, href: "/admin/analytics", icon: Eye },
    { label: "Projects", value: projectCount, href: "/admin/projects", icon: FolderGit2 },
    { label: "Blog Posts", value: postCount, href: "/admin/blog", icon: Newspaper },
    { label: "Gallery Photos", value: galleryCount, href: "/admin/gallery", icon: Images },
    { label: "Documents", value: documentCount, href: "/admin/documents", icon: FileText },
    { label: "Messages", value: messageCount, href: "/admin/messages", icon: Mail },
    { label: "Unread Messages", value: unreadCount, href: "/admin/messages", icon: MailWarning },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-muted">Overview of your portfolio content.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="admin-card block transition-all hover:-translate-y-1 hover:border-violet-500"
          >
            <card.icon className="text-accent-violet" size={22} />
            <p className="mt-4 text-3xl font-bold text-foreground">{card.value.toLocaleString()}</p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="admin-card mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">Traffic — Last 14 Days</h2>
          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent-violet hover:underline"
          >
            Full analytics <ArrowUpRight size={14} />
          </Link>
        </div>
        <AnalyticsChart data={daily} />
      </div>
    </div>
  );
}
