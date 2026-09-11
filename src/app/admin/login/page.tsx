import { LoginPageContent } from "./LoginForm";

// This page must render fresh per request, not be statically prerendered:
// the site-wide CSP (src/proxy.ts) generates a new random nonce on every
// request, and a statically cached page would bake in a stale nonce that no
// longer matches the header, blocking every script on the page.
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return <LoginPageContent />;
}
