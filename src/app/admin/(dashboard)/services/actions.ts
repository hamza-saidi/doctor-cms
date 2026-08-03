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

function parsePriceCents(value: FormDataEntryValue | null): number | null {
  const str = String(value ?? "").trim().replace(",", ".");
  if (str === "") return null;
  const euros = Number(str);
  if (Number.isNaN(euros)) return null;
  return Math.round(euros * 100);
}

export async function createService(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const count = await prisma.service.count();

  await prisma.service.create({
    data: {
      slug: slugify(name),
      name,
      shortDescription: String(formData.get("shortDescription") ?? ""),
      duration: String(formData.get("duration") ?? ""),
      fee: String(formData.get("fee") ?? ""),
      priceCents: parsePriceCents(formData.get("priceEuros")),
      includes: String(formData.get("includes") ?? ""),
      status: String(formData.get("status") ?? "available"),
      detail: String(formData.get("detail") ?? ""),
      sortOrder: count,
    },
  });

  revalidatePath("/admin/services");
  revalidatePath("/our-services");
  revalidatePath("/");
}

export async function updateService(id: string, formData: FormData) {
  await prisma.service.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      duration: String(formData.get("duration") ?? ""),
      fee: String(formData.get("fee") ?? ""),
      priceCents: parsePriceCents(formData.get("priceEuros")),
      includes: String(formData.get("includes") ?? ""),
      status: String(formData.get("status") ?? "available"),
      detail: String(formData.get("detail") ?? ""),
    },
  });

  revalidatePath("/admin/services");
  revalidatePath("/our-services");
  revalidatePath("/");
}

export async function deleteService(id: string) {
  await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/services");
  revalidatePath("/our-services");
  revalidatePath("/");
}
