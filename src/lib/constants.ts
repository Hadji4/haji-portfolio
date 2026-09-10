// Primary site navigation — shown in the navbar (desktop + mobile menu).
export const NAV_ITEMS = [
  { href: "/#about", label: "About", icon: "User", kind: "anchor" },
  { href: "/#skills", label: "Skills", icon: "Code2", kind: "anchor" },
  { href: "/#projects", label: "Projects", icon: "FolderGit2", kind: "anchor" },
  { href: "/blog", label: "Blog", icon: "Newspaper", kind: "route" },
  { href: "/gallery", label: "Gallery", icon: "Images", kind: "route" },
  { href: "/#contact", label: "Contact", icon: "Mail", kind: "anchor" },
] as const;

// Secondary links — footer only, keeps the navbar lean.
export const FOOTER_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/documents", label: "Documents" },
  { href: "/#contact", label: "Contact" },
] as const;

export const SOCIAL_LINKS = [
  { href: "https://github.com/Hadji4", label: "GitHub", icon: "GitBranch" },
  { href: "https://t.me/Haji_Omer", label: "Telegram", icon: "Send" },
  { href: "mailto:hadjiomer9@gmail.com", label: "Email", icon: "Mail" },
  { href: "tel:+251927325044", label: "Phone", icon: "Phone" },
] as const;

export const SERVICES = [
  {
    title: "Custom Health System Development",
    description:
      "Designing and building custom systems for the unique workflows of hospitals, clinics, wholesalers and pharmacies.",
    items: ["EMR / clinical records systems", "Integrated Health Revenue Systems (IHRS)", "Pharmacy & laboratory information systems"],
  },
  {
    title: "Fiscal Printer Integration",
    description:
      "Developing middleware to connect PHP and JavaScript systems with ELTRADE A3 fiscal printers for legal receipting.",
    items: ["Full receipt lifecycle support", "Tax, discount, and payment handling", "Python/PHP/JS integration bridges"],
  },
  {
    title: "Hospital & Clinic Digitization",
    description:
      "Complete digital transformation support, from system analysis to LAN-based server deployment.",
    items: ["Full LAMP/WAMP system setup", "Staff training & orientation", "Role-based access control"],
  },
  {
    title: "Report Automation & Data Integration",
    description:
      "Powerful tools to generate and submit the monthly/quarterly reports required by health authorities.",
    items: ["CBHI report generation", "Pharmacy & lab reporting", "Custom exports for DHIS2, DATIM, etc."],
  },
] as const;

export const ACCENT_CLASSES: Record<string, string> = {
  violet: "from-violet-500 to-purple-500",
  pink: "from-pink-500 to-rose-500",
  sky: "from-sky-400 to-blue-500",
  emerald: "from-emerald-400 to-teal-500",
  amber: "from-amber-400 to-orange-500",
};

export const ACCENT_OPTIONS = Object.keys(ACCENT_CLASSES);
