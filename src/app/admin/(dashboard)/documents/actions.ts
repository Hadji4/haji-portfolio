"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { documentSchema, parseFormData } from "@/lib/validation";
import {
  deleteUploadedFile,
  documentFileType,
  saveUploadedFile,
  validateDocumentFile,
} from "@/lib/upload-file";
import type { ActionState } from "@/lib/action-state";

export type { ActionState };

export async function addDocument(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const file = formData.get("file");
  const validationError = validateDocumentFile(file);
  if (validationError) return { error: validationError };

  const data = parseFormData(documentSchema, {
    title: formData.get("title"),
    category: formData.get("category"),
    published: formData.get("published") === "on",
    order: formData.get("order") || 0,
  });

  const uploadedFile = file as File;
  const fileUrl = await saveUploadedFile(uploadedFile, "documents", "doc");

  await prisma.document.create({
    data: { ...data, fileUrl, fileType: documentFileType(uploadedFile) },
  });

  revalidatePath("/");
  revalidatePath("/documents");
  revalidatePath("/admin/documents");
  return { success: "Document uploaded." };
}

export async function togglePublished(id: string, published: boolean) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.document.update({ where: { id }, data: { published } });
  revalidatePath("/");
  revalidatePath("/documents");
  revalidatePath("/admin/documents");
}

export async function deleteDocument(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const doc = await prisma.document.delete({ where: { id } });
  await deleteUploadedFile(doc.fileUrl, "documents");

  revalidatePath("/");
  revalidatePath("/documents");
  revalidatePath("/admin/documents");
}
