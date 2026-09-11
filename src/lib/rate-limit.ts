import { NextRequest } from "next/server";

// A minimal in-process fixed-window rate limiter for public write endpoints.
// This app runs as a single Node process under cPanel/Passenger, so an
// in-memory store is sufficient — it resets on restart, which is acceptable
// for spam/abuse throttling (not a security boundary that needs to survive
// restarts, unlike the DB-backed admin login lockout in auth.ts).
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Bound memory: if the map grows large (distributed abuse or many unique
// IPs), drop expired entries opportunistically instead of growing forever.
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
