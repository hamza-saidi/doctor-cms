"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { helsinkiWallTimeToUtc, recordAvailabilityException, removeUnbookedSlotsOnDate } from "@/lib/availability";

export async function createSlot(formData: FormData) {
  const serviceId = String(formData.get("serviceId") ?? "");
  const date = String(formData.get("date") ?? "");
  const startTime = String(formData.get("startTime") ?? "");
  const durationMinutes = Number(formData.get("durationMinutes") ?? 50);
  const format = String(formData.get("format") ?? "online");

  if (!serviceId || !date || !startTime) return;

  const startsAt = helsinkiWallTimeToUtc(date, startTime);
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60_000);

  await prisma.availabilitySlot.create({
    data: { serviceId, startsAt, endsAt, format },
  });

  revalidatePath("/admin/availability");
}

export async function deleteSlot(id: string) {
  const slot = await prisma.availabilitySlot.findUnique({ where: { id } });
  if (!slot || slot.isBooked) return;

  // Record first: if this occurrence came from a recurring rule, this stops
  // it from being regenerated on the next page load. Harmless no-op for
  // manually-added slots, which nothing will try to recreate anyway.
  await recordAvailabilityException(slot.serviceId, slot.startsAt);
  await prisma.availabilitySlot.delete({ where: { id } });
  revalidatePath("/admin/availability");
}

export async function createRule(formData: FormData) {
  const serviceId = String(formData.get("serviceId") ?? "");
  const dayOfWeek = Number(formData.get("dayOfWeek"));
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");
  const format = String(formData.get("format") ?? "online");
  const durationMinutes = Number(formData.get("durationMinutes") ?? 50);

  if (!serviceId || !startTime || !endTime || Number.isNaN(dayOfWeek)) return;

  await prisma.availabilityRule.create({
    data: { serviceId, dayOfWeek, startTime, endTime, format, durationMinutes },
  });

  revalidatePath("/admin/availability");
}

export async function deleteRule(id: string) {
  await prisma.availabilityRule.delete({ where: { id } });
  revalidatePath("/admin/availability");
}

export async function createBlockedDate(formData: FormData) {
  const date = String(formData.get("date") ?? "");
  const reason = String(formData.get("reason") ?? "").trim() || null;
  if (!date) return;

  await prisma.blockedDate.upsert({
    where: { date },
    update: { reason },
    create: { date, reason },
  });
  await removeUnbookedSlotsOnDate(date);

  revalidatePath("/admin/availability");
}

export async function deleteBlockedDate(id: string) {
  await prisma.blockedDate.delete({ where: { id } });
  revalidatePath("/admin/availability");
}
