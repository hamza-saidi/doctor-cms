"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const status = String(formData.get("status") ?? "draft");

  await prisma.post.create({
    data: {
      slug: slugify(title),
      title,
      excerpt: String(formData.get("excerpt") ?? ""),
      body: String(formData.get("body") ?? ""),
      status,
      publishedAt: status === "published" ? new Date() : null,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function updatePost(id: string, formData: FormData) {
  const status = String(formData.get("status") ?? "draft");
  const existing = await prisma.post.findUnique({ where: { id } });

  await prisma.post.update({
    where: { id },
    data: {
      title: String(formData.get("title") ?? ""),
      excerpt: String(formData.get("excerpt") ?? ""),
      body: String(formData.get("body") ?? ""),
      status,
      publishedAt:
        status === "published" ? (existing?.publishedAt ?? new Date()) : existing?.publishedAt ?? null,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (existing) revalidatePath(`/blog/${existing.slug}`);
}

export async function deletePost(id: string) {
  const existing = await prisma.post.findUnique({ where: { id } });
  await prisma.post.delete({ where: { id } });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (existing) revalidatePath(`/blog/${existing.slug}`);
}
