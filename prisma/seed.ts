import { PrismaClient } from "../src/generated/prisma-client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

const PLACEHOLDER_PASSWORD = "ChangeThisPassword123!";

async function main() {
  // --- Admin user ---
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "hadjiomer9@gmail.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? PLACEHOLDER_PASSWORD;

  // Refuse to seed a production database with the documented example
  // password — it's public (it's printed in .env.example and this file's
  // git history), so an admin account created with it is not a secret.
  if (process.env.NODE_ENV === "production" && adminPassword === PLACEHOLDER_PASSWORD) {
    throw new Error(
      "Refusing to seed: ADMIN_SEED_PASSWORD is unset or still the placeholder value from " +
        ".env.example. Set a unique, strong ADMIN_SEED_PASSWORD before seeding production.",
    );
  }

  const hashed = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: process.env.ADMIN_SEED_NAME ?? "Haji Omer",
      email: adminEmail,
      password: hashed,
    },
  });

  // --- Site settings ---
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroName: "Haji Omer Sheno",
      heroTitle: "Digital Health Systems Architect",
      heroIntro:
        "I design and build powerful digital systems for hospitals, clinics, and pharmacies — from electronic medical records to revenue systems and fiscal printer integration. I turn complex problems into efficient, real-world software solutions that empower institutions and improve patient outcomes.",
      stats: [
        { label: "Hospitals Served", value: 6 },
        { label: "Wholesale Served", value: 4 },
        { label: "Private Pharmacy Served", value: 3 },
        { label: "Community Pharmacy Served", value: 5 },
        { label: "Projects Deployed", value: 10 },
        { label: "Years of Experience", value: 8 },
      ],
      email: "hadjiomer9@gmail.com",
      phone: "+251 927 325 044",
      github: "https://github.com/Hadji4",
      telegram: "https://t.me/Haji_Omer",
    },
  });

  // --- Education ---
  const education = [
    { title: "Master's in Computer Science", institution: "Madda Walabu University", order: 1 },
    { title: "Certified Professional in Healthcare Information and Management Systems (CPHIMS)", institution: null, order: 2 },
    { title: "HL7 FHIR Certification", institution: "Health Level Seven International", order: 3 },
    { title: "Bachelor's in Computer Science", institution: "Rift Valley University", order: 4 },
    { title: "Database Administration", institution: "Shashemene Poly Technic College", order: 5 },
  ];
  for (const item of education) {
    const existing = await prisma.education.findFirst({ where: { title: item.title } });
    if (!existing) await prisma.education.create({ data: item });
  }

  // --- Experience ---
  const experience = [
    {
      role: "ART Data Clerk (CDC Based)",
      organization: "Shashemene Comprehensive Specialized Hospital",
      period: null,
      description: "",
      order: 1,
    },
    {
      role: "Developer",
      organization:
        "CBHI (Community Based Health Insurance) Management System — Shashemene Hospital, Melka Oda General Hospital, Dodola General Hospital, Kokossa Primary Hospital, Ginnir General Hospital, and Gambo General Hospital",
      period: null,
      description: "Developed and deployed the revenue/insurance reconciliation system across six hospitals.",
      order: 2,
    },
    {
      role: "Developer",
      organization:
        "Organized Dispensing Application (ODA2) for community pharmacy — Shashemene Comprehensive Specialized Hospital, Ginnir General Hospital, and Melka Oda General Hospital",
      period: null,
      description: "",
      order: 3,
    },
    {
      role: "Developer",
      organization: "ePMS (electronic Pharmacy Management System) — for private pharmacies",
      period: null,
      description: "",
      order: 4,
    },
    {
      role: "Developer",
      organization: "eWMS (electronic Wholesale Management System) — for medicine and medical wholesale",
      period: null,
      description: "",
      order: 5,
    },
  ];
  for (const item of experience) {
    const existing = await prisma.experience.findFirst({ where: { role: item.role, organization: item.organization } });
    if (!existing) await prisma.experience.create({ data: item });
  }

  // --- Skills ---
  const skills: { category: string; name: string }[] = [
    // Backend & Database
    ...["Node.js", "PHP", "Laravel", "Python", "MySQL", "PostgreSQL", "REST APIs", "Prisma ORM"].map((name) => ({
      category: "Backend & Database",
      name,
    })),
    // Frontend
    ...["React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS", "Vue.js", "HTML5 & CSS3"].map((name) => ({
      category: "Frontend",
      name,
    })),
    // Health Tech Systems
    ...["EMR / EHR", "IHRS & Revenue Systems", "CBHI Reporting", "LIS & Pharmacy Systems", "DHIS2 & DATIM", "HL7 & FHIR"].map(
      (name) => ({ category: "Health Tech Systems", name }),
    ),
    // Tools & Platforms
    ...["Git & GitHub", "Docker", "Redis", "WAMP/LAMP Stack", "Fiscal Printer Integration", "Agile Methodologies"].map(
      (name) => ({ category: "Tools & Platforms", name }),
    ),
  ];
  for (const [i, skill] of skills.entries()) {
    const existing = await prisma.skill.findFirst({ where: { category: skill.category, name: skill.name } });
    if (!existing) await prisma.skill.create({ data: { ...skill, order: i } });
  }

  // --- Projects (sourced from real codebases on disk) ---
  const projects = [
    {
      slug: "horoo-innovations-platform",
      title: "HOROO Innovations Platform",
      category: "Company Platform",
      summary:
        "The company's flagship platform: a Laravel REST API paired with a React SPA, powering the public site, an internal admin CMS, a client portal, and a book-publishing finance module.",
      description:
        "Rebuilt HOROO Innovations' original custom-PHP company site (its own bespoke MVC framework) into a modern two-tier platform: horoo-laravel as a Laravel 13 REST API and horoo-frontend as a React 19 + TypeScript + Vite single-page app.\n\nWhat began as a company brochure site grew into a genuine product: a client portal with authentication, service requests and a shopping cart, a full finance ledger for a book-publishing arm (author agreements, payouts, purchases), and deployment tracking for every piece of software HOROO has shipped to clients.",
      techStack: [
        "Laravel 13",
        "PHP 8.3",
        "Sanctum",
        "React 19",
        "TypeScript",
        "Vite",
        "TanStack Query",
        "Tailwind CSS 4",
        "Tiptap",
        "MySQL",
      ],
      features: [
        "Public CMS: Services, Projects, Innovations, News, Team, Testimonials, Careers, FAQ, Gallery",
        "Admin panel with Roles & Permissions, 2FA, audit logs, media library, menu builder",
        "Client portal: authentication, service requests, cart checkout",
        "Book publishing ledger: authors, agreements, payouts, purchases",
        "Client deployment tracking: renewals, deployment documents per client",
        "PWA-enabled frontend with offline support",
      ],
      scale: "65+ API controllers, 41 Eloquent models",
      liveUrl: null,
      repoNote: "Company platform — private codebase",
      accent: "violet",
      featured: true,
      order: 1,
    },
    {
      slug: "horoomart-supermarket-erp",
      title: "HOROOMART — Supermarket Management ERP",
      category: "Retail ERP",
      summary:
        "An AI-ready, multi-branch supermarket ERP covering procurement, POS, inventory, payroll and finance, built on a domain-driven Laravel architecture.",
      description:
        "A large-scale retail ERP for multi-branch supermarket operations, structured with Domain-Driven Design (Organization, Inventory, Procurement, Sales, Financial, and AI domains). Handles the full retail lifecycle from supplier goods-receipt through POS sales to payroll and financial reporting, with WhatsApp alerts for overdue loans and expenses.",
      techStack: [
        "Laravel 13",
        "PHP 8.4",
        "MySQL",
        "Redis",
        "spatie/laravel-permission",
        "Maatwebsite Excel",
        "Twilio (WhatsApp)",
        "Domain-Driven Design",
      ],
      features: [
        "Multi-branch/store management with procurement & goods receipt",
        "POS / sales with stock adjustment, transfer and bin-card tracking",
        "Payroll, loans and fixed-expense tracking with WhatsApp due-date alerts",
        "Financial reporting and full audit logging",
        "Scheduled database backup/restore with off-site SFTP copy",
        "AI-ready hooks for future automation",
      ],
      scale: "58+ controllers across DDD domains, scheduled ops jobs",
      liveUrl: null,
      repoNote: "Client ERP — private codebase",
      accent: "emerald",
      featured: true,
      order: 2,
    },
    {
      slug: "ewms-wholesale-management",
      title: "eWMS — Electronic Wholesale Management System",
      category: "Wholesale ERP",
      summary:
        "A finance-grade wholesale management system for medicine and medical-supply distributors, built for Ethiopian business operations end to end.",
      description:
        "A ground-up wholesale operations system (no framework — a custom PHP/MySQL core) covering the full distribution cycle: customer and supplier pricelists, order and requisition workflows with storeman approval, customer returns, and a genuine finance department module with budget approvals, payroll, bank transfers and expense tracking. Integrates with a cash-register/fiscal bridge for legal receipting and includes Ethiopian-calendar-aware reporting.",
      techStack: ["PHP 8.1", "MySQL", "Custom RBAC layer", "phpqrcode", "Fiscal printer bridge"],
      features: [
        "Customer/supplier pricelists and wholesale order management",
        "Requisitions with storeman issue/approval workflow",
        "Customer returns processing",
        "Finance module: budgets, payroll, bank transfers, expenses",
        "Cash register / fiscal printer integration",
        "Inventory reports: low stock, expiry, valuation",
      ],
      scale: "291 endpoint files, shared Ethiopian-calendar helper library",
      liveUrl: null,
      repoNote: "Client system — private codebase",
      accent: "sky",
      featured: true,
      order: 3,
    },
    {
      slug: "pharmacypro",
      title: "PharmacyPro — Pharmacy Management System",
      category: "Pharmacy System",
      summary:
        "A role-segmented pharmacy operations system spanning patient records, prescription dispensing, POS and full inventory control.",
      description:
        "A pharmacy operations platform built for both standalone pharmacies and hospital pharmacy departments, with a role-segmented UI for admins, cashiers, pharmacists and storemen. Manages the full lifecycle from prescription approval through dispensing to inventory replenishment, including batch/expiry tracking and valuation reporting.",
      techStack: ["PHP", "MySQL", "Custom framework", "Role-based UI"],
      features: [
        "Patient records with prescription history",
        "Prescription approval → dispensing workflow (pharmacist role)",
        "Cashier POS with live prescription lookup",
        "Storeman inventory: stock adjustment, batch and expiry tracking",
        "Requisitions and returns handling",
        "Receiving, valuation and expiry reports",
      ],
      scale: "182+ route/action files, role-segmented interfaces",
      liveUrl: null,
      repoNote: "Client system — private codebase",
      accent: "pink",
      featured: true,
      order: 4,
    },
    {
      slug: "dental-clinic-ai-emr",
      title: "Dental Clinic AI EMR",
      category: "AI-Powered EMR",
      summary:
        "A full clinical EMR for dental practice — specialty billing, lab workflows, and eight dedicated AI modules for diagnosis support and radiograph analysis.",
      description:
        "The most AI-forward system in the portfolio: a LAN-deployable clinical EMR (packaged as an Electron desktop app) for dental clinics, covering encounters, a visual tooth chart, and specialty modules for Orthodontics, Endodontics, Prosthodontics, Oral Surgery and General Dentistry — each with its own billing and payment plans. Integrates Google Gemini for clinical decision support and SOAP-note drafting, plus an ONNX model for radiograph analysis.",
      techStack: [
        "Node.js",
        "Express",
        "Socket.IO",
        "PostgreSQL",
        "React 19",
        "Vite",
        "Electron",
        "Google Gemini API",
        "ONNX Runtime",
        "JWT & bcrypt",
      ],
      features: [
        "Clinical encounters with an interactive tooth chart",
        "Specialty modules: Orthodontics, Endodontics, Prosthodontics, Oral Surgery, General Dentistry",
        "AI clinical decision support and automated SOAP-note drafting",
        "AI radiograph analysis via an ONNX vision model",
        "AI-driven revenue forecasting and anomaly detection",
        "Lab orders/technician tracking, prescriptions, and patient recall reminders",
      ],
      scale: "200+ REST endpoints, 8 dedicated AI modules",
      liveUrl: null,
      repoNote: "Client system — private codebase",
      accent: "amber",
      featured: true,
      order: 5,
    },
    {
      slug: "hospital-website-product-line",
      title: "Hospital Website & CMS Product Line",
      category: "Hospital CMS",
      summary:
        "A templatized hospital website + admin CMS product, evolved from one Laravel platform into a repeatable Next.js + Express + MySQL rebuild, deployed for three hospitals.",
      description:
        "What started as a single Laravel hospital platform for Deder Hospital (appointments, patient portal, doctor directory, billing, insurance) was rebuilt into a leaner, faster product line on Next.js 15 + Express + MySQL — then deployed for Gambo General Hospital, Loke General Hospital and Melka Oda General Hospital, each sharing the same core schema and a new 'Leadership History' module while getting hospital-specific branding and content.",
      techStack: [
        "Next.js 15",
        "TypeScript",
        "Redux Toolkit / RTK Query",
        "Tailwind CSS",
        "Framer Motion",
        "Node.js",
        "Express",
        "MySQL",
        "JWT Auth",
        "Cloudinary",
      ],
      features: [
        "Public site: departments, doctors, services, news, gallery, careers, events",
        "Admin CMS with media library, roles/users, and audit logs",
        "Leadership History module — chronological timeline of hospital leadership",
        "Versioned REST API (/api/v1) split into public and admin namespaces",
        "Contact inbox with admin reply workflow",
        "Rate-limiting tiers and hardened auth across all three deployments",
      ],
      scale: "3 production deployments sharing one product architecture",
      liveUrl: null,
      repoNote: "Deder, Gambo, Loke & Melka Oda General Hospitals",
      accent: "violet",
      featured: true,
      order: 6,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / (the password from ADMIN_SEED_PASSWORD in .env)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
