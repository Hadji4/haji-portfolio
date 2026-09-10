import { prisma } from "@/lib/prisma";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { HeroPhotoUploadForm } from "@/components/admin/HeroPhotoUploadForm";
import { updateSettings } from "./actions";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const stats = (settings?.stats as { label: string; value: number }[] | undefined) ?? [];

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Site Settings</h1>

      <div className="admin-card">
        <HeroPhotoUploadForm currentPhotoUrl={settings?.heroPhotoUrl ?? null} />
      </div>

      <form action={updateSettings} className="admin-card space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label">Hero name</label>
            <input name="heroName" required defaultValue={settings?.heroName} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Hero title</label>
            <input name="heroTitle" required defaultValue={settings?.heroTitle} className="admin-input" />
          </div>
        </div>

        <div>
          <label className="admin-label">Hero intro paragraph</label>
          <textarea name="heroIntro" required rows={3} defaultValue={settings?.heroIntro} className="admin-input" />
        </div>

        <div>
          <label className="admin-label">Hero stats — one per line, format: Label | Number</label>
          <textarea
            name="stats"
            rows={5}
            defaultValue={stats.map((s) => `${s.label} | ${s.value}`).join("\n")}
            className="admin-input"
            placeholder={"Hospitals Served | 6\nProjects Deployed | 10"}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label">Email</label>
            <input name="email" type="email" required defaultValue={settings?.email} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Phone</label>
            <input name="phone" required defaultValue={settings?.phone} className="admin-input" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label">GitHub URL (optional)</label>
            <input name="github" defaultValue={settings?.github ?? ""} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Telegram URL (optional)</label>
            <input name="telegram" defaultValue={settings?.telegram ?? ""} className="admin-input" />
          </div>
        </div>

        <div>
          <label className="admin-label">CV file URL (optional, e.g. /cv/haji_omer_cv.pdf)</label>
          <input name="cvUrl" defaultValue={settings?.cvUrl ?? ""} className="admin-input" />
        </div>

        <SubmitButton label="Save Settings" />
      </form>
    </div>
  );
}
