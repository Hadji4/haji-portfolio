import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { UPLOADS_ROOT } from "./upload-storage";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function validateImageFile(value: FormDataEntryValue | null): string | null {
  if (!(value instanceof File) || value.size === 0) return "Choose an image to upload";
  if (!ALLOWED_IMAGE_TYPES.includes(value.type)) return "Image must be JPEG, PNG, WebP or GIF";
  if (value.size > MAX_IMAGE_BYTES) return "Image must be under 10MB";
  return null;
}

export async function saveUploadedImage(file: File, subdir: string, baseName: string) {
  const uploadDir = path.join(UPLOADS_ROOT, subdir);
  await mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
  const filename = `${baseName}-${Date.now()}${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), bytes);

  return `/uploads/${subdir}/${filename}`;
}

export async function deleteUploadedImage(url: string | null | undefined, subdir: string) {
  if (!url || !url.startsWith(`/uploads/${subdir}/`)) return;
  await unlink(path.join(UPLOADS_ROOT, url.slice("/uploads/".length))).catch(() => {});
}
