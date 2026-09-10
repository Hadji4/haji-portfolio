import { Eye, Users, TrendingUp, UserCheck } from "lucide-react";
import { getAnalyticsTotals, getDailyPageViews, getTopPages } from "@/lib/analytics";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";

export const revalidate = 0;

export default async function AdminAnalyticsPage() {
  const [totals, daily, topPages] = await Promise.all([
    getAnalyticsTotals(),
    getDailyPageViews(30),
    getTopPages(30, 10),
  ]);

  const cards = [
    { label: "Total Page Views", value: totals.totalViews, icon: Eye },
    { label: "Total Unique Visitors", value: totals.totalVisitors, icon: Users },
    { label: "Views — Last 30 Days", value: totals.recentViews, icon: TrendingUp },
    { label: "Visitors — Last 30 Days", value: totals.recentVisitors, icon: UserCheck },
  ];

  const maxViews = Math.max(1, ...topPages.map((p) => p.views));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Analytics</h1>
      <p className="mt-1 text-muted">
        Who&apos;s visiting your site and what they&apos;re reading. Counted with a
        privacy-friendly first-party cookie — no IP addresses or personal data stored.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="admin-card">
            <card.icon className="text-accent-violet" size={22} />
            <p className="mt-4 text-3xl font-bold text-foreground">{card.value.toLocaleString()}</p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="admin-card mt-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          Traffic — Last 30 Days
        </h2>
        <AnalyticsChart data={daily} />
      </div>

      <div className="admin-card mt-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          Top Pages — Last 30 Days
        </h2>
        <div className="space-y-3">
          {topPages.map((page) => (
            <div key={page.path} className="flex items-center gap-4">
              <span className="w-40 shrink-0 truncate text-sm text-muted sm:w-64" title={page.path}>
                {page.path}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                  style={{ width: `${(page.views / maxViews) * 100}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-sm font-medium text-foreground">
                {page.views}
              </span>
            </div>
          ))}
          {topPages.length === 0 ? (
            <p className="text-muted">No traffic recorded yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
