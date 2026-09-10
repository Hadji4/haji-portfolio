import { prisma } from "./prisma";

export type DailyStat = { day: string; views: number; visitors: number };
export type TopPage = { path: string; views: number };

export async function getDailyPageViews(days = 30): Promise<DailyStat[]> {
  const rows = await prisma.$queryRaw<{ day: Date; views: bigint; visitors: bigint }[]>`
    SELECT DATE(createdAt) AS day, COUNT(*) AS views, COUNT(DISTINCT visitorId) AS visitors
    FROM \`PageView\`
    WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
    GROUP BY DATE(createdAt)
    ORDER BY day ASC
  `;

  const byDay = new Map(
    rows.map((r) => [
      r.day.toISOString().slice(0, 10),
      { views: Number(r.views), visitors: Number(r.visitors) },
    ]),
  );

  // Fill in gaps so the chart doesn't skip days with zero traffic.
  const result: DailyStat[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    const entry = byDay.get(key);
    result.push({ day: key, views: entry?.views ?? 0, visitors: entry?.visitors ?? 0 });
  }
  return result;
}

export async function getTopPages(days: number | null, limit = 10): Promise<TopPage[]> {
  const where = days
    ? { createdAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) } }
    : {};

  const grouped = await prisma.pageView.groupBy({
    by: ["path"],
    where,
    _count: { path: true },
    orderBy: { _count: { path: "desc" } },
    take: limit,
  });

  return grouped.map((g) => ({ path: g.path, views: g._count.path }));
}

export async function getAnalyticsTotals() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalViews, totalVisitorRows, recentViews, recentVisitorRows] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.findMany({ distinct: ["visitorId"], select: { visitorId: true } }),
    prisma.pageView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.pageView.findMany({
      distinct: ["visitorId"],
      select: { visitorId: true },
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
  ]);

  return {
    totalViews,
    totalVisitors: totalVisitorRows.length,
    recentViews,
    recentVisitors: recentVisitorRows.length,
  };
}
