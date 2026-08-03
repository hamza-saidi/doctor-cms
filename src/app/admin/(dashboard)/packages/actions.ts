"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function emptyToNull(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? null : str;
}

export async function createPackage(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const count = await prisma.package.count();

  await prisma.package.create({
    data: {
      name,
      description: String(formData.get("description") ?? ""),
      fee: emptyToNull(formData.get("fee")),
      originalFee: emptyToNull(formData.get("originalFee")),
      note: emptyToNull(formData.get("note")),
      sortOrder: count,
    },
  });

  revalidatePath("/admin/packages");
  revalidatePath("/packages-offers");
  revalidatePath("/book-and-pay");
}

export async function updatePackage(id: string, formData: FormData) {
  await prisma.package.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      fee: emptyToNull(formData.get("fee")),
      originalFee: emptyToNull(formData.get("originalFee")),
      note: emptyToNull(formData.get("note")),
    },
  });

  revalidatePath("/admin/packages");
  revalidatePath("/packages-offers");
  revalidatePath("/book-and-pay");
}

export async function deletePackage(id: string) {
  await prisma.package.delete({ where: { id } });
  revalidatePath("/admin/packages");
  revalidatePath("/packages-offers");
  revalidatePath("/book-and-pay");
}
