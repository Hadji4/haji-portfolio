import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { NextRequest } from "next/server";
import { UPLOADS_ROOT } from "@/lib/upload-storage";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Serves admin-uploaded files (images, videos, documents) from outside the
// `public/` folder. Next's production server only scans `public/` once at
// startup, so anything written there after boot 404s until a restart — a
// route handler re-checks the filesystem on every request instead. See
// upload-storage.ts for why this exists.

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  if (segments.some((segment) => segment.includes("..") || segment.includes("\\"))) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(UPLOADS_ROOT, ...segments);
  if (!filePath.startsWith(UPLOADS_ROOT + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  // Documents carry an explicit publish flag (used to gate the public
  // /documents listing) — enforce it here too, so an unpublished file isn't
  // still fetchable by anyone who has or guesses its URL. Logged-in admins
  // can still preview unpublished documents.
  if (segments[0] === "documents") {
    const fileUrl = `/uploads/${segments.join("/")}`;
    const doc = await prisma.document.findFirst({ where: { fileUrl }, select: { published: true } });
    if (doc && !doc.published) {
      const session = await auth();
      if (!session) return new Response("Not found", { status: 404 });
    }
  }

  let fileStat;
  try {
    fileStat = await stat(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  if (!fileStat.isFile()) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
  const cacheControl = "public, max-age=31536000, immutable";

  const range = request.headers.get("range");
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match) {
      const start = match[1] ? parseInt(match[1], 10) : 0;
      const end = match[2] ? parseInt(match[2], 10) : fileStat.size - 1;
      if (start <= end && end < fileStat.size) {
        const stream = createReadStream(filePath, { start, end });
        return new Response(Readable.toWeb(stream) as ReadableStream, {
          status: 206,
          headers: {
            "Content-Type": contentType,
            "Content-Length": String(end - start + 1),
            "Content-Range": `bytes ${start}-${end}/${fileStat.size}`,
            "Accept-Ranges": "bytes",
            "Cache-Control": cacheControl,
          },
        });
      }
    }
  }

  const stream = createReadStream(filePath);
  return new Response(Readable.toWeb(stream) as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(fileStat.size),
      "Accept-Ranges": "bytes",
      "Cache-Control": cacheControl,
    },
  });
}
