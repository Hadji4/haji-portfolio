# Deploying to cPanel (haji.horooinnovations.com)

This app is configured with Next.js's `output: "standalone"` build — it produces a
minimal, self-contained server instead of requiring a full `npm install` on the
production machine. That matters on shared/cPanel hosting, which is usually slow or
memory-constrained for building Node apps in place.

**Build locally (or in CI), upload the result, run it on the server.**

## 0. One-time prerequisites on the cPanel account

- **Node.js App support** — cPanel's "Setup Node.js App" (Phusion Passenger). Confirm
  it's available and that you can select **Node.js 20 or newer** (22 recommended). This
  app uses `process.loadEnvFile()` (Node 20.6+) and Prisma 7 — an older default Node
  version (18 or below, common on older cPanel installs) will not work.
- **A MySQL database** — create one via cPanel → **MySQL® Databases**. cPanel usually
  prefixes both the database name and username with your cPanel account name, e.g.
  `cpaneluser_haji_portfolio` / `cpaneluser_haji`. Create a dedicated user, grant it
  **All Privileges** on that database only.
- **A subdomain** — `haji.horooinnovations.com` pointing at the app (the Node.js App
  setup step below creates this domain mapping for you if it doesn't already exist).
- **Terminal/SSH access** is strongly preferred (needed to run the database migration
  command below). If it's not available, see the phpMyAdmin fallback in step 4.

## 1. Build the production bundle locally

```bash
# In the site/ directory, with a .env pointed at your LOCAL dev database
# (this only affects the build — no database calls happen at build time,
# every page in this app is server-rendered per request, not statically
# generated, so the build itself doesn't need production DB access).
npm run build
```

This produces:
- `.next/standalone/` — the self-contained server (`server.js` + only the
  `node_modules` it actually uses)
- `.next/static/` — built CSS/JS assets (not included in `standalone/` automatically)
- `public/` — static assets that ship with the app (logo, favicon, etc.) — this is
  **not** where admin uploads live; see the `storage/uploads/` note below

## 2. Assemble the deployment folder

```bash
# From site/, build a clean folder to upload
mkdir -p deploy
cp -r .next/standalone/* deploy/
mkdir -p deploy/.next
cp -r .next/static deploy/.next/static
cp -r public deploy/public
cp -r prisma deploy/prisma
cp prisma.config.ts deploy/
```

`deploy/` now contains everything needed to run the app: `server.js`, a pruned
`node_modules`, the built `.next` assets, your `public/` static files, and the
Prisma schema + migrations (needed once, to run migrations directly on the server).

**Admin uploads live outside this folder entirely.** Avatars, the hero photo,
gallery media, documents and blog cover images are all written at runtime to
`storage/uploads/` (relative to the app root, *not* under `public/` — see the
comment in `src/lib/upload-storage.ts` for why). That directory is created
automatically the first time something is uploaded, via `mkdir(..., { recursive: true })`
in `src/lib/upload-file.ts` / `upload-image.ts`, so a fresh deploy doesn't need to
pre-create it. What you must never do is overwrite or delete an existing
`storage/uploads/` directory on the server when redeploying — see step 6.

## 3. Upload and configure in cPanel

1. Upload the `deploy/` folder's contents via **File Manager** or SFTP to a directory
   **outside** `public_html`, e.g. `~/haji-portfolio-app`.
2. cPanel → **Setup Node.js App** → **Create Application**:
   - Node.js version: 20+ (22 recommended)
   - Application mode: Production
   - Application root: `haji-portfolio-app` (the folder from step 3.1)
   - Application URL: `haji.horooinnovations.com`
   - Application startup file: `server.js`
3. In the same screen's **Environment Variables** section, add:
   - `DATABASE_URL` = `mysql://cpaneluser_haji:PASSWORD@localhost:3306/cpaneluser_haji_portfolio`
   - `AUTH_SECRET` = a long random string — generate one with `openssl rand -base64 32`
     (use a **different** value than your local `.env`; never reuse dev secrets in prod)
   - `NEXT_PUBLIC_SITE_URL` = `https://haji.horooinnovations.com`
   - `ADMIN_SEED_NAME`, `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD` — only needed for the
     one-time seed command in step 4; pick a real password, not the placeholder one.
4. Click **Run NPM Install** if offered — with the standalone build this is usually a
   no-op (dependencies are already bundled), but it's safe to run.

## 4. Run migrations + seed (one time)

Via cPanel Terminal (or SSH), `cd` into the app root and run, using the **same Node
version** selected in the Node.js App setup:

```bash
# cPanel's Node App UI shows an "Enter to virtual environment" command —
# run that first so `node`/`npx` resolve to the right version, e.g.:
source /home/cpaneluser/nodevenv/haji-portfolio-app/20/bin/activate

npx prisma migrate deploy   # NOT `migrate dev` — deploy applies existing migrations only
npm run db:seed             # creates the admin login from the env vars above
```

**No Terminal access?** Open **phpMyAdmin**, select your database, go to the **SQL**
tab, and paste-and-run the contents of each `prisma/migrations/*/migration.sql` file
**in folder-name order** (they're timestamp-prefixed). Then create the admin account
manually: insert a row into `AdminUser` with a bcrypt hash for the password (generate
one locally with `node -e "console.log(require('bcryptjs').hashSync('yourpassword',12))"`
from inside `site/`, since bcryptjs is a local dependency there).

## 5. Start the app

Back in **Setup Node.js App**, click **Restart**. Visit
`https://haji.horooinnovations.com` — you should see the live site. Log in at
`/admin/login` with the seeded credentials and **change the password immediately**
(Profile → Change Password).

## 6. Redeploying updates later

`storage/uploads/` holds real content (avatars, gallery photos/videos, documents, blog
cover images) written at runtime — **never overwrite or delete this directory** on
redeploy. It lives at the application root, alongside `server.js`, not under `public/`.

```bash
# Locally: pull latest code, then
npm run build
rm -rf deploy && mkdir deploy
cp -r .next/standalone/* deploy/
mkdir -p deploy/.next && cp -r .next/static deploy/.next/static
cp -r public deploy/public
cp -r prisma deploy/prisma
cp prisma.config.ts deploy/
# NOTE: this does not touch storage/uploads/ at all — it isn't part of the
# build output, so there's nothing to accidentally overwrite as long as you
# upload deploy/'s contents INTO the existing app root rather than replacing
# the app root wholesale (e.g. don't `rsync --delete`, don't wipe the folder
# before uploading).
```

Upload `deploy/`'s contents over the existing server folder (overwrite `server.js`,
`.next/`, `node_modules/`, `public/`), leaving `storage/uploads/` untouched, run
`npx prisma migrate deploy` again if the update included a schema change, then
**Restart** the app in cPanel.

## Troubleshooting

- **500 error on every page**: almost always `DATABASE_URL` — check the env var was
  saved in the Node.js App UI and that the DB user/host/password are correct in
  cPanel → MySQL Databases.
- **Login redirect loop**: `AUTH_SECRET` is missing or `NEXT_PUBLIC_SITE_URL` doesn't
  match the real domain (cookies won't be trusted otherwise).
- **Uploads fail / "ENOENT" errors**: the app process needs write permission on
  `storage/uploads/` under the application root (created automatically on first
  upload) — confirm it isn't owned by a different user than the Node app runs as.
- **Old content after redeploy**: hard-refresh / check you restarted the Node app —
  it doesn't pick up new files until restarted.
