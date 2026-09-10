"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { settingsSchema, parseFormData, normalizeUrlInput } from "@/lib/validation";
import { deleteUploadedImage, saveUploadedImage, validateImageFile } from "@/lib/upload-image";
import type { ActionState } from "@/lib/action-state";

export type { ActionState };

function parseStats(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, valueStr] = line.split("|").map((part) => part.trim());
      return { label: label ?? "", value: Number(valueStr) || 0 };
    });
}

export async function updateSettings(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const data = parseFormData(settingsSchema, {
    heroName: formData.get("heroName"),
    heroTitle: formData.get("heroTitle"),
    heroIntro: formData.get("heroIntro"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    github: normalizeUrlInput(formData.get("github")),
    telegram: normalizeUrlInput(formData.get("telegram")),
    cvUrl: formData.get("cvUrl") ?? "",
  });

  const stats = parseStats(formData.get("stats"));

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      ...data,
      github: data.github || null,
      telegram: data.telegram || null,
      cvUrl: data.cvUrl || null,
      stats,
    },
    update: {
      ...data,
      github: data.github || null,
      telegram: data.telegram || null,
      cvUrl: data.cvUrl || null,
      stats,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function updateHeroPhoto(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const file = formData.get("photo");
  const validationError = validateImageFile(file);
  if (validationError) return { error: validationError };

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  const newPhotoUrl = await saveUploadedImage(file as File, "hero", "hero");
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      heroIntro: "",
      stats: [],
      heroPhotoUrl: newPhotoUrl,
    },
    update: { heroPhotoUrl: newPhotoUrl },
  });
  await deleteUploadedImage(settings?.heroPhotoUrl, "hero");

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: "Hero photo updated." };
}
