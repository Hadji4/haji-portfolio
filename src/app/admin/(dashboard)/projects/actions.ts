"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema, parseFormData, normalizeUrlInput } from "@/lib/validation";

function linesToArray(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseProjectForm(formData: FormData) {
  return parseFormData(projectSchema, {
    title: formData.get("title"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    techStack: linesToArray(formData.get("techStack")),
    features: linesToArray(formData.get("features")),
    scale: formData.get("scale") ?? "",
    liveUrl: normalizeUrlInput(formData.get("liveUrl")),
    repoNote: formData.get("repoNote") ?? "",
    accent: formData.get("accent"),
    featured: formData.get("featured") === "on",
    order: formData.get("order") || 0,
  });
}

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const data = parseProjectForm(formData);
  await prisma.project.create({
    data: {
      ...data,
      liveUrl: data.liveUrl || null,
      scale: data.scale || null,
      repoNote: data.repoNote || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const data = parseProjectForm(formData);
  await prisma.project.update({
    where: { id },
    data: {
      ...data,
      liveUrl: data.liveUrl || null,
      scale: data.scale || null,
      repoNote: data.repoNote || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}
