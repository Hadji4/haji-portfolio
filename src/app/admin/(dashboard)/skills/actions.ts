"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { skillSchema, parseFormData } from "@/lib/validation";

export async function createSkill(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const data = parseFormData(skillSchema, {
    category: formData.get("category"),
    name: formData.get("name"),
    order: formData.get("order") || 0,
  });

  await prisma.skill.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function deleteSkill(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/skills");
}
