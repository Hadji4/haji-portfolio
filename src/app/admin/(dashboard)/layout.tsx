import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const [admin, unreadCount] = await Promise.all([
    session?.user?.id
      ? prisma.adminUser.findUnique({
          where: { id: session.user.id },
          select: { name: true, email: true, avatarUrl: true },
        })
      : null,
    prisma.message.count({ where: { read: false } }),
  ]);

  return (
    <AdminShell
      admin={{
        name: admin?.name ?? session?.user?.name ?? "Admin",
        email: admin?.email ?? session?.user?.email ?? "",
        avatarUrl: admin?.avatarUrl ?? null,
      }}
      unreadCount={unreadCount}
    >
      {children}
    </AdminShell>
  );
}
