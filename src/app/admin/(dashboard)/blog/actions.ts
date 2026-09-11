"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { blogPostSchema, parseFormData } from "@/lib/validation";
import { deleteUploadedImage, saveUploadedImage, validateImageFile } from "@/lib/upload-image";
import { sanitizeBlogContent } from "@/lib/sanitize-content";

function tagsToArray(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseBlogForm(formData: FormData) {
  const data = parseFormData(blogPostSchema, {
    title: formData.get("title"),
    metaTitle: formData.get("metaTitle"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    tags: tagsToArray(formData.get("tags")),
    published: formData.get("published") === "on",
  });
  return {
    ...data,
    metaTitle: data.metaTitle || null,
    content: sanitizeBlogContent(data.content),
  };
}

async function maybeUploadCover(formData: FormData) {
  const file = formData.get("coverImage");
  if (!(file instanceof File) || file.size === 0) return undefined;
  return saveUploadedImage(file, "blog", "cover");
}

export async function uploadBlogContentImage(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  const session = await auth();
  if (!session) return { error: "Unauthorized" };

  const file = formData.get("image");
  const error = validateImageFile(file);
  if (error) return { error };

  const url = await saveUploadedImage(file as File, "blog-content", "image");
  return { url };
}

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const data = parseBlogForm(formData);
  const coverImageUrl = await maybeUploadCover(formData);

  await prisma.blogPost.create({
    data: {
      ...data,
      coverImageUrl: coverImageUrl ?? null,
      publishedAt: data.published ? new Date() : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updatePost(id: string, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const data = parseBlogForm(formData);
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  const coverImageUrl = await maybeUploadCover(formData);

  await prisma.blogPost.update({
    where: { id },
    data: {
      ...data,
      coverImageUrl: coverImageUrl ?? existing?.coverImageUrl ?? null,
      publishedAt: data.published ? (existing?.publishedAt ?? new Date()) : null,
    },
  });

  if (coverImageUrl && existing?.coverImageUrl) {
    await deleteUploadedImage(existing.coverImageUrl, "blog");
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function toggleBlogPublished(id: string, published: boolean) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  await prisma.blogPost.update({
    where: { id },
    data: { published, publishedAt: published ? (existing?.publishedAt ?? new Date()) : null },
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

export async function deletePost(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const post = await prisma.blogPost.delete({ where: { id } });
  await deleteUploadedImage(post.coverImageUrl, "blog");

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
