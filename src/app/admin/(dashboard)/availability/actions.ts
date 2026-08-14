"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  helsinkiWallTimeToUtc,
  dateToHelsinkiDateStr,
  dayOfWeekFromDateStr,
  recordAvailabilityException,
  removeUnbookedSlotsOnDate,
} from "@/lib/availability";

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
  await recordAvailabilityException(slot.serviceId, slot.startsAt, slot.format);
  await prisma.availabilitySlot.delete({ where: { id } });
  revalidatePath("/admin/availability");
}

export async function createRule(formData: FormData) {
  const serviceIds = formData.getAll("serviceId").map(String).filter(Boolean);
  const dayOfWeeks = formData
    .getAll("dayOfWeek")
    .map(Number)
    .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6);
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");
  const format = String(formData.get("format") ?? "online");
  const durationMinutes = Number(formData.get("durationMinutes") ?? 50);

  if (serviceIds.length === 0 || dayOfWeeks.length === 0 || !startTime || !endTime) return;

  // One form submission can cover several days and services at once (e.g.
  // "Mon-Fri, Therapy + Consultation") — skip any combo that already has an
  // identical rule so re-submitting a broadened selection doesn't duplicate
  // the ones already set up.
  const existing = await prisma.availabilityRule.findMany({
    where: {
      serviceId: { in: serviceIds },
      dayOfWeek: { in: dayOfWeeks },
      startTime,
      endTime,
      format,
      durationMinutes,
    },
    select: { serviceId: true, dayOfWeek: true },
  });
  const existingKeys = new Set(existing.map((r) => `${r.serviceId}|${r.dayOfWeek}`));

  const data = serviceIds.flatMap((serviceId) =>
    dayOfWeeks
      .filter((dayOfWeek) => !existingKeys.has(`${serviceId}|${dayOfWeek}`))
      .map((dayOfWeek) => ({ serviceId, dayOfWeek, startTime, endTime, format, durationMinutes }))
  );

  if (data.length > 0) {
    await prisma.availabilityRule.createMany({ data });
  }

  revalidatePath("/admin/availability");
}

// Slots aren't linked to the rule that generated them (they're plain
// materialized rows), so removing a rule would otherwise leave its
// already-generated future slots dangling — this finds and removes only
// the unbooked ones that match the rule's service/weekday/time exactly.
async function removeRulesAndTheirSlots(ids: string[]) {
  if (ids.length === 0) return;
  const rules = await prisma.availabilityRule.findMany({ where: { id: { in: ids } } });
  const now = new Date();

  for (const rule of rules) {
    const futureUnbooked = await prisma.availabilitySlot.findMany({
      where: { serviceId: rule.serviceId, startsAt: { gt: now }, isBooked: false },
      select: { id: true, startsAt: true },
    });
    const staleIds = futureUnbooked
      .filter((slot) => {
        const dateStr = dateToHelsinkiDateStr(slot.startsAt);
        if (dayOfWeekFromDateStr(dateStr) !== rule.dayOfWeek) return false;
        return helsinkiWallTimeToUtc(dateStr, rule.startTime).getTime() === slot.startsAt.getTime();
      })
      .map((slot) => slot.id);
    if (staleIds.length > 0) {
      await prisma.availabilitySlot.deleteMany({ where: { id: { in: staleIds } } });
    }
  }

  await prisma.availabilityRule.deleteMany({ where: { id: { in: ids } } });
}

export async function deleteRules(ids: string[]) {
  await removeRulesAndTheirSlots(ids);
  revalidatePath("/admin/availability");
}

// Replaces a whole rule group (one service's set of day/time rows) with a
// new day/time selection in one step, instead of the admin having to
// delete the old rows and separately re-add the new ones.
export async function updateRule(formData: FormData) {
  const oldIds = String(formData.get("ruleIds") ?? "")
    .split(",")
    .filter(Boolean);
  const serviceId = String(formData.get("serviceId") ?? "");
  const dayOfWeeks = formData
    .getAll("dayOfWeek")
    .map(Number)
    .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6);
  const startTime = String(formData.get("startTime") ?? "");
  const endTime = String(formData.get("endTime") ?? "");
  const format = String(formData.get("format") ?? "online");
  const durationMinutes = Number(formData.get("durationMinutes") ?? 50);

  if (!serviceId || dayOfWeeks.length === 0 || !startTime || !endTime) return;

  await removeRulesAndTheirSlots(oldIds);
  await prisma.availabilityRule.createMany({
    data: dayOfWeeks.map((dayOfWeek) => ({
      serviceId,
      dayOfWeek,
      startTime,
      endTime,
      format,
      durationMinutes,
    })),
  });

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

// Bulk safety-net: wipes not-yet-booked slots for one chosen service (or,
// explicitly, every service) so a wrong recurring-hours setup — or wanting
// to start a service's schedule over — doesn't mean removing hundreds of
// slots one at a time. Scoped by default so clearing one service's mistake
// can't silently wipe every other service's real open slots too.
export async function clearUnbookedSlots(formData: FormData) {
  const serviceId = String(formData.get("serviceId") ?? "");
  if (!serviceId) return;

  await prisma.availabilitySlot.deleteMany({
    where: { isBooked: false, ...(serviceId === "all" ? {} : { serviceId }) },
  });
  revalidatePath("/admin/availability");
}
