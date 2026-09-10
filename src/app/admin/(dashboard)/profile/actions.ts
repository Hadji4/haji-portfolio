"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema, profileSchema } from "@/lib/validation";
import { deleteUploadedImage, saveUploadedImage, validateImageFile } from "@/lib/upload-image";
import type { ActionState } from "@/lib/action-state";

export type { ActionState };

export async function updateProfile(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const parsed = profileSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.adminUser.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  });

  revalidatePath("/admin", "layout");
  return { success: "Profile updated." };
}

export async function updateAvatar(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const file = formData.get("avatar");
  const validationError = validateImageFile(file);
  if (validationError) return { error: validationError };

  const admin = await prisma.adminUser.findUnique({ where: { id: session.user.id } });
  if (!admin) return { error: "Account not found" };

  const newAvatarUrl = await saveUploadedImage(file as File, "avatars", session.user.id);
  await prisma.adminUser.update({
    where: { id: session.user.id },
    data: { avatarUrl: newAvatarUrl },
  });
  await deleteUploadedImage(admin.avatarUrl, "avatars");

  revalidatePath("/admin", "layout");
  return { success: "Profile picture updated." };
}

export async function changePassword(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const admin = await prisma.adminUser.findUnique({ where: { id: session.user.id } });
  if (!admin) return { error: "Account not found" };

  const valid = await bcrypt.compare(parsed.data.currentPassword, admin.password);
  if (!valid) return { error: "Current password is incorrect" };

  const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.adminUser.update({ where: { id: admin.id }, data: { password: hashed } });

  return { success: "Password changed." };
}
