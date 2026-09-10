"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { experienceSchema, parseFormData } from "@/lib/validation";

export async function createExperience(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const data = parseFormData(experienceSchema, {
    role: formData.get("role"),
    organization: formData.get("organization"),
    period: formData.get("period") ?? "",
    description: formData.get("description"),
    order: formData.get("order") || 0,
  });

  await prisma.experience.create({ data: { ...data, period: data.period || null } });
  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function deleteExperience(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/experience");
}
