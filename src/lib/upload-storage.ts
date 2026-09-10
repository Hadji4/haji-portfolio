import path from "path";

// Next's production server scans `public/` once at startup and caches that
// file list in memory, so files written there after boot (like admin
// uploads) 404 until the process restarts. Storing uploads outside `public/`
// and serving them through the `/uploads/[...path]` route handler instead
// keeps every request live against the filesystem.
export const UPLOADS_ROOT = path.join(process.cwd(), "storage", "uploads");
