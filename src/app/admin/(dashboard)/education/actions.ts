"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { educationSchema, parseFormData } from "@/lib/validation";

export async function createEducation(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const data = parseFormData(educationSchema, {
    title: formData.get("title"),
    institution: formData.get("institution") ?? "",
    order: formData.get("order") || 0,
  });

  await prisma.education.create({ data: { ...data, institution: data.institution || null } });
  revalidatePath("/");
  revalidatePath("/admin/education");
}

export async function deleteEducation(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.education.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/education");
}
