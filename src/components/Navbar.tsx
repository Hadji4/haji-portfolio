"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Download,
  User,
  Code2,
  FolderGit2,
  Newspaper,
  Images,
  Mail,
  GitBranch,
  Send,
  Phone,
} from "lucide-react";
import { NAV_ITEMS, SOCIAL_LINKS } from "@/lib/constants";

const ICONS = {
  User,
  Code2,
  FolderGit2,
  Newspaper,
  Images,
  Mail,
  GitBranch,
  Send,
  Phone,
};

function NavbarLogo({
  photoUrl,
  name,
  size,
}: {
  photoUrl?: string | null;
  name: string;
  size: number;
}) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        width={size}
        height={size}
        className="rounded-full border border-violet-500/40 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className="font-display flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </span>
  );
}

export function Navbar({
  name,
  cvUrl,
  photoUrl,
}: {
  name: string;
  cvUrl?: string | null;
  photoUrl?: string | null;
}) {
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const anchorIds = NAV_ITEMS.filter((item) => item.kind === "anchor").map(
      (item) => item.href.slice(2),
    );
    const sections = anchorIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHash(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  // Lock page scroll while the full-screen mobile menu is open, and let
  // Escape close it — without this the page behind kept scrolling, which
  // is what made the mobile menu feel broken/unfinished.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close the mobile menu automatically if the viewport is resized past
  // the mobile breakpoint (e.g. rotating a tablet to landscape).
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isActive = (item: (typeof NAV_ITEMS)[number]) =>
    item.kind === "anchor"
      ? pathname === "/" && activeHash === item.href.slice(2)
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
          scrolled
            ? "border-white/10 bg-[var(--background)]/80 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <NavbarLogo photoUrl={photoUrl} name={name} size={36} />
            <span className="font-display hidden text-lg font-bold text-foreground sm:inline">
              {name}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              const className = `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                active ? "text-foreground" : "text-muted hover:text-foreground"
              }`;
              return item.kind === "route" ? (
                <Link key={item.href} href={item.href} className={className}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.href} href={item.href} className={className}>
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {cvUrl ? (
              <a
                href={cvUrl}
                download
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-transform hover:-translate-y-0.5"
              >
                <Download size={15} /> Resume
              </a>
            ) : null}
          </div>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground lg:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Full-screen mobile menu — kept outside <header> since that element
          gets backdrop-blur once scrolled, and backdrop-filter creates a new
          containing block for fixed descendants, which shrinks `fixed
          inset-0` down to the header's own small box instead of the
          viewport. */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-[var(--background)] transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-18 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5"
          >
            <NavbarLogo photoUrl={photoUrl} name={name} size={36} />
            <span className="font-display gradient-text text-lg font-bold">
              {name}
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-white/5"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-8">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              const Icon = ICONS[item.icon as keyof typeof ICONS];
              const className = `flex items-center gap-4 rounded-xl px-4 py-3.5 text-lg font-medium transition-colors ${
                active
                  ? "bg-violet-500/10 text-foreground"
                  : "text-muted hover:bg-violet-500/10 hover:text-foreground"
              }`;
              const content = (
                <>
                  <Icon
                    size={20}
                    className={active ? "text-accent-violet" : ""}
                  />
                  {item.label}
                </>
              );
              return item.kind === "route" ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={className}
                >
                  {content}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={className}
                >
                  {content}
                </a>
              );
            })}
          </nav>

          <div className="space-y-6 pt-8">
            {cvUrl ? (
              <a
                href={cvUrl}
                download
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30"
              >
                <Download size={16} /> Download Resume
              </a>
            ) : null}
            <div className="flex justify-center gap-5">
              {SOCIAL_LINKS.map((link) => {
                const Icon = ICONS[link.icon as keyof typeof ICONS];
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    aria-label={link.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-muted hover:border-violet-500 hover:text-accent-violet"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
