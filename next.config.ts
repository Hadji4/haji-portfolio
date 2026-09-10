import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal, self-contained .next/standalone build (its own
  // server.js + only the node_modules it actually needs) — the standard
  // way to deploy Next.js to a constrained host like cPanel's Node.js App
  // Manager (Phusion Passenger), instead of shipping the whole repo and
  // running a full `npm install` on the server. See DEPLOYMENT.md.
  output: "standalone",

  // Next's file-tracer doesn't follow @prisma/adapter-mariadb's own
  // requires into the `mariadb` driver package, so the standalone build
  // silently omits it — every DB call would crash at runtime in
  // production. Verified by inspecting .next/standalone/node_modules
  // after a build; force-include both explicitly.
  outputFileTracingIncludes: {
    "/**": ["./node_modules/@prisma/adapter-mariadb/**", "./node_modules/mariadb/**"],
  },

  // Default is 1MB — raised so document uploads (up to 15MB) and gallery
  // video uploads (up to 50MB, both validated in lib/upload-file.ts and
  // lib/upload-image.ts) don't get rejected before they even reach that
  // validation.
  experimental: {
    serverActions: {
      bodySizeLimit: "60mb",
    },
  },
};

export default nextConfig;
