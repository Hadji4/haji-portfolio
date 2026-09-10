# Haji Omer Sheno — Portfolio

A full-stack personal portfolio for **Haji Omer Sheno**, Digital Health Systems
Architect. Every piece of content — hero stats, skills, experience, education,
project case studies, blog posts, gallery, documents — is stored in MySQL and
managed from a password-protected admin dashboard, instead of being hardcoded HTML.

## Features

**Public site**
- Animated hero, about, skills, services and featured-projects sections
- Blog with Markdown posts (syntax highlighting, reading time, share buttons, RSS feed)
- Photo/video gallery with a full-size lightbox
- Public document library, organized by category, with a publish/private toggle per file
- Full SEO: per-page metadata, Open Graph/Twitter cards, JSON-LD structured data,
  dynamic `sitemap.xml` and `robots.txt`
- Privacy-friendly first-party analytics (see below) — no IP addresses or user-agents
  stored

**Admin dashboard** (`/admin`)
- Collapsible sidebar, sticky topbar, full CRUD for every content type above
- Profile management: avatar upload, display name, password change
- Contact form inbox (read/unread)
- **Analytics** — page views and unique visitors over time (chart), top pages
- Mobile-first throughout

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **MySQL** via **Prisma ORM** (driver adapter, no native query engine binary)
- **Auth.js (NextAuth v5)** — credentials login for the admin dashboard
- **Tailwind CSS 4** + **Framer Motion** for the UI
- **Recharts** for the analytics chart
- **react-markdown** for blog rendering
- **Zod** + **react-hook-form** for validation
- **TypeScript** throughout

> **Bundler note:** `dev`/`build` explicitly pass `--webpack`. Next.js 16's default
> Turbopack crashes every `/api/auth/*` route in this project (a Turbopack ⇄
> next-auth@5-beta incompatibility, not an app bug — confirmed by reproducing it with
> a stubbed `authorize()` and no Prisma/bcrypt calls at all). Don't remove `--webpack`
> without re-testing `/api/auth/csrf` under Turbopack first.

## Project structure

```
src/
  app/
    (site)/                   Public route group — shares one layout (Navbar/Footer)
      page.tsx                 Homepage
      blog/, gallery/, documents/, projects/[slug]/
    admin/
      login/                   Admin sign-in
      (dashboard)/             Protected admin CRUD — one folder per content type
    api/                       Contact form, analytics tracking, NextAuth route
    sitemap.ts, robots.ts, not-found.tsx
  components/                  Public site UI components
  components/admin/            Admin dashboard UI components
  lib/                         Prisma client, zod schemas, analytics queries, uploads
  auth.ts / auth.config.ts     Auth.js configuration (split for Edge-safe middleware)
  proxy.ts                     Middleware — protects /admin/* routes
prisma/
  schema.prisma                Database schema
  seed.ts                      Seeds the admin account + starter content
```

## Getting started

```bash
cp .env.example .env
# then edit .env: DATABASE_URL, AUTH_SECRET, ADMIN_SEED_*, NEXT_PUBLIC_SITE_URL
```

Create a MySQL database and a dedicated user for it (don't reuse another project's
credentials) — via phpMyAdmin, or:

```sql
CREATE DATABASE haji_portfolio CHARACTER SET utf8mb4;
CREATE USER 'haji_portfolio'@'localhost' IDENTIFIED BY 'a-strong-password';
GRANT ALL PRIVILEGES ON haji_portfolio.* TO 'haji_portfolio'@'localhost';
FLUSH PRIVILEGES;
```

Then:

```bash
npm install
npx prisma migrate dev --name init
npm run db:seed     # creates the admin login + starter content
npm run dev
```

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login — sign in with `ADMIN_SEED_EMAIL` /
  `ADMIN_SEED_PASSWORD` from `.env`, then change the password immediately from
  Profile → Change Password.

## Admin dashboard

Everything below is editable without touching code:

- **Projects** — title, category, summary, full case-study description, tech stack,
  key features, scale, live URL, accent color, featured flag, display order
- **Blog** — Markdown editor (Write/Preview tabs), tags, cover image, publish toggle
- **Gallery** — photo/video upload (images ≤10MB, video ≤50MB), captions
- **Documents** — file upload (PDF/Word/Excel/PowerPoint ≤15MB), category, publish toggle
- **Skills** / **Experience** / **Education** — grouped, ordered lists
- **Messages** — contact form submissions, mark read/unread
- **Analytics** — traffic chart and top pages
- **Settings** — hero name/title/intro/photo, hero stats, contact info, socials, CV link
- **Profile** — avatar, display name, password

## Production deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full cPanel deployment guide
(`output: "standalone"` build, environment variables, one-time migration, and the
redeploy process that doesn't touch existing uploaded content).

Quick checklist before deploying:
- [ ] `AUTH_SECRET` and `DATABASE_URL` are real production values (never reuse dev
      secrets), set as real environment variables — never commit `.env`
- [ ] `NEXT_PUBLIC_SITE_URL` matches the real production domain
- [ ] `npx prisma migrate deploy` run against the production database (not `migrate dev`)
- [ ] Admin password changed from the seeded placeholder
