// Deletes PageView rows older than the retention window. The /api/track
// endpoint has no TTL of its own (see src/app/api/track/route.ts), so this
// table grows forever unless something prunes it. Not wired to a scheduler —
// run it by hand, or add it as a cPanel cron job, e.g. weekly:
//   0 3 * * 0  cd /home/<user>/haji-portfolio-app && node_modules/.bin/tsx --env-file=.env scripts/prune-pageviews.ts
import { PrismaClient } from "../src/generated/prisma-client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const RETENTION_DAYS = Number(process.env.PAGEVIEW_RETENTION_DAYS ?? "180");

const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

async function main() {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const { count } = await prisma.pageView.deleteMany({ where: { createdAt: { lt: cutoff } } });
  console.log(`Pruned ${count} PageView row(s) older than ${RETENTION_DAYS} days (before ${cutoff.toISOString()}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
