import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// A privacy-friendly, first-party analytics endpoint: no IP address or
// user-agent is stored, just the path visited and an anonymous random
// cookie used only to tell unique visitors apart from repeat page views.
const COOKIE_NAME = "visitor_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const path = (body as { path?: unknown } | null)?.path;
  if (typeof path !== "string" || path.length === 0 || path.length > 300 || !path.startsWith("/")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const existingVisitorId = request.cookies.get(COOKIE_NAME)?.value;
  const visitorId = existingVisitorId ?? randomUUID();

  await prisma.pageView.create({ data: { path, visitorId } });

  const response = NextResponse.json({ ok: true });
  if (!existingVisitorId) {
    response.cookies.set(COOKIE_NAME, visitorId, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }
  return response;
}
