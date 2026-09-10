import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { PageViewTracker } from "@/components/PageViewTracker";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const name = settings?.heroName ?? "Haji Omer Sheno";

  return (
    <>
      <PageViewTracker />
      <Navbar name={name} cvUrl={settings?.cvUrl} photoUrl={settings?.heroPhotoUrl} />
      {children}
      <Footer
        name={name}
        title={settings?.heroTitle ?? undefined}
        email={settings?.email}
        phone={settings?.phone}
        github={settings?.github}
        telegram={settings?.telegram}
      />
      <BackToTop />
    </>
  );
}
