import Link from "next/link";
import { GitBranch, Send, Mail, Phone } from "lucide-react";
import { FOOTER_LINKS } from "@/lib/constants";

const ICONS = { Github: GitBranch, Send, Mail, Phone };

type FooterProps = {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  github?: string | null;
  telegram?: string | null;
};

export function Footer({
  name,
  title = "Digital Health Systems Architect",
  email = "hadjiomer9@gmail.com",
  phone = "+251 927 325 044",
  github = "https://github.com/Hadji4",
  telegram = "https://t.me/Haji_Omer",
}: FooterProps) {
  const socials = [
    github ? { href: github, label: "GitHub", icon: "Github" as const } : null,
    telegram ? { href: telegram, label: "Telegram", icon: "Send" as const } : null,
    { href: `mailto:${email}`, label: "Email", icon: "Mail" as const },
    { href: `tel:${phone.replace(/\s/g, "")}`, label: "Phone", icon: "Phone" as const },
  ].filter((s): s is { href: string; label: string; icon: keyof typeof ICONS } => !!s);

  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="font-display gradient-text text-2xl font-bold">{name}</h3>
            <p className="mt-2 text-sm text-muted">{title}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Building EMR, revenue, and pharmacy systems that hospitals and clinics
              actually rely on — from Shashemene, Ethiopia.
            </p>
            <div className="mt-6 flex gap-4">
              {socials.map((s) => {
                const Icon = ICONS[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted transition-all hover:-translate-y-0.5 hover:border-violet-500 hover:text-accent-violet"
                  >
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-foreground uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-muted hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-foreground uppercase">
              Get In Touch
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <a href={`mailto:${email}`} className="hover:text-foreground">
                  {email}
                </a>
              </li>
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                  {phone}
                </a>
              </li>
              <li>Shashemene, Ethiopia</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-8 text-xs text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {name}. All Rights Reserved.
          </p>
          <p>Built with Next.js, MySQL and modern web technologies.</p>
        </div>
      </div>
    </footer>
  );
}
