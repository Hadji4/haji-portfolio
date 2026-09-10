import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AvatarUploadForm } from "@/components/admin/AvatarUploadForm";
import { ProfileNameForm } from "@/components/admin/ProfileNameForm";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { SignOutButton } from "@/components/admin/SignOutButton";

export const revalidate = 0;

function StaleSessionNotice() {
  return (
    <div className="admin-card max-w-md">
      <h1 className="font-display mb-2 text-xl font-bold text-foreground">
        Please sign in again
      </h1>
      <p className="mb-4 text-sm text-muted">
        Your session was started before this page existed and needs to be refreshed.
        Sign out and log back in to continue.
      </p>
      <SignOutButton />
    </div>
  );
}

export default async function ProfilePage() {
  const session = await auth();
  // A session issued before `id` was added to the JWT session callback won't
  // carry it — every profile action needs it, and redirecting to /admin/login
  // here would just bounce straight back (the proxy only checks that a valid
  // token exists, not that it has `id`), so show a real sign-out path instead.
  if (!session?.user?.id) return <StaleSessionNotice />;

  const admin = await prisma.adminUser.findUnique({ where: { id: session.user.id } });
  if (!admin) return <StaleSessionNotice />;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Profile</h1>

      <div className="admin-card">
        <AvatarUploadForm currentAvatarUrl={admin.avatarUrl} name={admin.name} />
      </div>

      <div className="admin-card">
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Account</h2>
        <p className="mb-4 text-sm text-muted">{admin.email}</p>
        <ProfileNameForm name={admin.name} />
      </div>

      <div className="admin-card">
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          Change Password
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
