"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function markMessageRead(id: string, read: boolean) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.message.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.message.delete({ where: { id } });
  revalidatePath("/admin/messages");
}
