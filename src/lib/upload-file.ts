import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { UPLOADS_ROOT } from "./upload-storage";

const MAX_DOCUMENT_BYTES = 15 * 1024 * 1024;
const ALLOWED_DOCUMENT_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
};

export function validateDocumentFile(value: FormDataEntryValue | null): string | null {
  if (!(value instanceof File) || value.size === 0) return "Choose a file to upload";
  if (!(value.type in ALLOWED_DOCUMENT_TYPES)) {
    return "File must be a PDF, Word, Excel or PowerPoint document";
  }
  if (value.size > MAX_DOCUMENT_BYTES) return "File must be under 15MB";
  return null;
}

export function documentFileType(file: File): string {
  return ALLOWED_DOCUMENT_TYPES[file.type] ?? "file";
}

export async function saveUploadedFile(file: File, subdir: string, baseName: string) {
  const uploadDir = path.join(UPLOADS_ROOT, subdir);
  await mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || `.${file.type.split("/")[1] ?? "bin"}`;
  const filename = `${baseName}-${Date.now()}${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), bytes);

  return `/uploads/${subdir}/${filename}`;
}

export async function deleteUploadedFile(url: string | null | undefined, subdir: string) {
  if (!url || !url.startsWith(`/uploads/${subdir}/`)) return;
  await unlink(path.join(UPLOADS_ROOT, url.slice("/uploads/".length))).catch(() => {});
}
