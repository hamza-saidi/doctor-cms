"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createSlot(formData: FormData) {
  const serviceId = String(formData.get("serviceId") ?? "");
  const date = String(formData.get("date") ?? "");
  const startTime = String(formData.get("startTime") ?? "");
  const durationMinutes = Number(formData.get("durationMinutes") ?? 50);
  const format = String(formData.get("format") ?? "online");

  if (!serviceId || !date || !startTime) return;

  const startsAt = new Date(`${date}T${startTime}:00`);
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60_000);

  await prisma.availabilitySlot.create({
    data: { serviceId, startsAt, endsAt, format },
  });

  revalidatePath("/admin/availability");
}

export async function deleteSlot(id: string) {
  const slot = await prisma.availabilitySlot.findUnique({ where: { id } });
  if (!slot || slot.isBooked) return;
  await prisma.availabilitySlot.delete({ where: { id } });
  revalidatePath("/admin/availability");
}
