"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updatePageSeo(path: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!title || !description) return;

  await prisma.pageSeo.upsert({
    where: { path },
    update: { title, description },
    create: { path, title, description },
  });

  revalidatePath("/admin/seo");
  revalidatePath(path);
}
