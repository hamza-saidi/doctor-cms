import { prisma } from "@/lib/prisma";

export const HELSINKI_TZ = "Europe/Helsinki";

// How far ahead recurring rules generate real AvailabilitySlot rows.
const GENERATION_WINDOW_DAYS = 56; // 8 weeks

// Converts a Helsinki-local wall-clock date+time into the correct UTC
// instant, DST-aware. Node has no built-in "construct Date from IANA-zone
// local time," so this uses the classic double-conversion trick: format a
// UTC guess back through the target zone, then correct by the resulting
// offset.
export function helsinkiWallTimeToUtc(dateStr: string, timeStr: string): Date {
  const naiveUtc = new Date(`${dateStr}T${timeStr}:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: HELSINKI_TZ,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(naiveUtc);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const hour = map.hour === "24" ? "00" : map.hour;
  const asIfUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(hour),
    Number(map.minute),
    Number(map.second)
  );
  const offsetMs = asIfUtc - naiveUtc.getTime();
  return new Date(naiveUtc.getTime() - offsetMs);
}

// The Helsinki calendar date ("YYYY-MM-DD") a given instant falls on.
export function dateToHelsinkiDateStr(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: HELSINKI_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

// A "YYYY-MM-DD" triple alone determines its weekday — treating it as UTC
// midnight here is safe since only getUTCDay() is read, never the wall
// clock hour (which is what would otherwise need DST handling).
export function dayOfWeekFromDateStr(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay(); // 0 = Sunday .. 6 = Saturday
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Regenerates any missing rule-derived slots for the rolling window ahead.
// Idempotent and cheap to call on every relevant page load — skips dates
// that are blocked, occurrences already generated, and ones an admin
// explicitly removed (AvailabilityException). No-ops instantly if no rules
// exist yet, so this is safe to call unconditionally.
export async function ensureSlotsGenerated(): Promise<void> {
  const rules = await prisma.availabilityRule.findMany();
  if (rules.length === 0) return;

  const todayStr = dateToHelsinkiDateStr(new Date());
  const blockedDates = new Set(
    (await prisma.blockedDate.findMany({ select: { date: true } })).map((b) => b.date)
  );

  const rangeStart = helsinkiWallTimeToUtc(todayStr, "00:00");
  const rangeEnd = helsinkiWallTimeToUtc(addDays(todayStr, GENERATION_WINDOW_DAYS), "00:00");

  const [existingSlots, exceptions] = await Promise.all([
    prisma.availabilitySlot.findMany({
      where: { startsAt: { gte: rangeStart, lt: rangeEnd } },
      select: { serviceId: true, startsAt: true, format: true },
    }),
    prisma.availabilityException.findMany({
      where: { startsAt: { gte: rangeStart, lt: rangeEnd } },
      select: { serviceId: true, startsAt: true, format: true },
    }),
  ]);

  // Keyed by format too — two rules for the same service/day/time but
  // different formats (e.g. online + in-person, both Mon-Fri 09:00-17:00)
  // are legitimately different slots, not duplicates of each other.
  const seenKeys = new Set(existingSlots.map((s) => `${s.serviceId}|${s.format}|${s.startsAt.getTime()}`));
  const exceptionKeys = new Set(exceptions.map((e) => `${e.serviceId}|${e.format}|${e.startsAt.getTime()}`));

  const candidates: { serviceId: string; startsAt: Date; endsAt: Date; format: string }[] = [];

  for (let i = 0; i < GENERATION_WINDOW_DAYS; i++) {
    const dateStr = addDays(todayStr, i);
    if (blockedDates.has(dateStr)) continue;
    const dow = dayOfWeekFromDateStr(dateStr);

    for (const rule of rules) {
      if (rule.dayOfWeek !== dow) continue;

      const dayStart = helsinkiWallTimeToUtc(dateStr, rule.startTime).getTime();
      const dayEnd = helsinkiWallTimeToUtc(dateStr, rule.endTime).getTime();
      const durationMs = rule.durationMinutes * 60_000;

      for (let slotStart = dayStart; slotStart + durationMs <= dayEnd; slotStart += durationMs) {
        if (slotStart < Date.now()) continue; // never backfill past slots
        const startsAt = new Date(slotStart);
        const key = `${rule.serviceId}|${rule.format}|${startsAt.getTime()}`;
        if (seenKeys.has(key) || exceptionKeys.has(key)) continue;
        seenKeys.add(key); // guards against overlapping rules double-booking the same instant
        candidates.push({
          serviceId: rule.serviceId,
          startsAt,
          endsAt: new Date(slotStart + durationMs),
          format: rule.format,
        });
      }
    }
  }

  if (candidates.length > 0) {
    await prisma.availabilitySlot.createMany({ data: candidates, skipDuplicates: true });
  }
}

// Called when a BlockedDate is added — clears any open (unbooked) slots
// that would otherwise still show as available that day. Booked slots are
// left untouched; cancelling an existing booking is a separate, explicit
// action, not a side effect of blocking a date.
export async function removeUnbookedSlotsOnDate(dateStr: string): Promise<void> {
  const rangeStart = helsinkiWallTimeToUtc(dateStr, "00:00");
  const rangeEnd = helsinkiWallTimeToUtc(addDays(dateStr, 1), "00:00");
  await prisma.availabilitySlot.deleteMany({
    where: { startsAt: { gte: rangeStart, lt: rangeEnd }, isBooked: false },
  });
}

// Records that a specific rule-generated occurrence should stay removed —
// otherwise the next ensureSlotsGenerated() pass would just recreate the
// exact slot an admin just deleted.
export async function recordAvailabilityException(
  serviceId: string,
  startsAt: Date,
  format: string
): Promise<void> {
  await prisma.availabilityException.upsert({
    where: { serviceId_startsAt_format: { serviceId, startsAt, format } },
    update: {},
    create: { serviceId, startsAt, format },
  });
}
