"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { galleryItemSchema, parseFormData } from "@/lib/validation";
import { saveUploadedFile, deleteUploadedFile } from "@/lib/upload-file";
import { validateGalleryMedia } from "@/lib/upload-media";
import type { ActionState } from "@/lib/action-state";

export type { ActionState };

export async function addGalleryItem(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const file = formData.get("photo");
  const validation = validateGalleryMedia(file);
  if (validation.error) return { error: validation.error };

  const data = parseFormData(galleryItemSchema, {
    caption: formData.get("caption") ?? "",
    order: formData.get("order") || 0,
  });

  const imageUrl = await saveUploadedFile(file as File, "gallery", "media");

  await prisma.galleryItem.create({
    data: { imageUrl, mediaType: validation.mediaType, caption: data.caption || null, order: data.order },
  });

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  return { success: validation.mediaType === "video" ? "Video added to gallery." : "Photo added to gallery." };
}

export async function deleteGalleryItem(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const item = await prisma.galleryItem.delete({ where: { id } });
  await deleteUploadedFile(item.imageUrl, "gallery");

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}
