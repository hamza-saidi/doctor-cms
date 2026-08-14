import { ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  ensureSlotsGenerated,
  dateToHelsinkiDateStr,
  helsinkiWallTimeToUtc,
  addDays,
  dayOfWeekFromDateStr,
} from "@/lib/availability";
import {
  createSlot,
  createRule,
  deleteRules,
  updateRule,
  createBlockedDate,
  deleteBlockedDate,
  clearUnbookedSlots,
} from "./actions";

const inputClass =
  "w-full border border-outline-variant focus:border-primary rounded-lg p-2.5 bg-surface-container-lowest text-sm";
const labelClass = "text-label-md text-on-surface-variant uppercase tracking-widest";
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Condenses a sorted list of weekday indices into a compact label, e.g.
// [1,2,3,4,5] -> "Mon–Fri", [1,3,5] -> "Mon, Wed, Fri", [0,1,2,5,6] ->
// "Sun–Tue, Fri–Sat" — so a form submission covering several days
// reads as one line instead of one row per day.
function formatDayRange(days: number[]): string {
  const sorted = [...new Set(days)].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i <= sorted.length; i++) {
    const cur = sorted[i];
    if (cur === prev + 1) {
      prev = cur;
      continue;
    }
    ranges.push(start === prev ? DAY_SHORT[start] : `${DAY_SHORT[start]}–${DAY_SHORT[prev]}`);
    start = cur;
    prev = cur;
  }
  return ranges.join(", ");
}

function formatTimeOnly(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Helsinki",
  }).format(date);
}

function formatMonthLabel(monthStr: string) {
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(
    new Date(`${monthStr}-01T12:00:00Z`)
  );
}

function addMonths(monthStr: string, delta: number): string {
  const [y, m] = monthStr.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

// Monday-first grid cells for a given "YYYY-MM" month, including the
// leading/trailing days from adjacent months needed to fill whole weeks —
// same layout convention as the visitor-facing booking calendar.
function buildMonthGrid(monthStr: string): { dateStr: string; dayNum: number; inMonth: boolean }[] {
  const monthStartStr = `${monthStr}-01`;
  const leadingBlanks = (dayOfWeekFromDateStr(monthStartStr) + 6) % 7;
  const [y, m] = monthStr.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();

  const cells: { dateStr: string; dayNum: number; inMonth: boolean }[] = [];
  for (let i = 0; i < leadingBlanks; i++) {
    const dateStr = addDays(monthStartStr, i - leadingBlanks);
    cells.push({ dateStr, dayNum: Number(dateStr.slice(8, 10)), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ dateStr: `${monthStr}-${String(d).padStart(2, "0")}`, dayNum: d, inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const nextDate = addDays(cells[cells.length - 1].dateStr, 1);
    cells.push({ dateStr: nextDate, dayNum: Number(nextDate.slice(8, 10)), inMonth: false });
  }
  return cells;
}

function formatDateOnly(dateStr: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dateStr}T12:00:00Z`));
}

// Shared by the "add recurring hours" form and each rule group's inline
// edit form — grouped under data-day-group so the preset-button script
// below can target whichever instance a click happened in.
function DayPicker({ selectedDays }: { selectedDays: number[] }) {
  return (
    <div className="space-y-1" data-day-group>
      <div className="flex items-center justify-between">
        <label className={labelClass}>Days</label>
        <div className="flex gap-3">
          <button type="button" data-day-preset="1,2,3,4,5" className="text-xs text-primary hover:underline">
            Weekdays
          </button>
          <button type="button" data-day-preset="0,6" className="text-xs text-primary hover:underline">
            Weekend
          </button>
          <button type="button" data-day-preset="0,1,2,3,4,5,6" className="text-xs text-primary hover:underline">
            Every day
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
        {DAY_NAMES.map((name, i) => (
          <label key={name} className="flex items-center gap-2 text-sm text-on-surface">
            <input
              type="checkbox"
              name="dayOfWeek"
              value={i}
              defaultChecked={selectedDays.includes(i)}
              className="accent-primary w-4 h-4"
            />
            {DAY_SHORT[i]}
          </label>
        ))}
      </div>
    </div>
  );
}

export default async function AdminAvailabilityPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; month?: string; date?: string }>;
}) {
  const { edit: editKey, month: monthParam, date: dateParam } = await searchParams;
  await ensureSlotsGenerated();

  const todayStr = dateToHelsinkiDateStr(new Date());
  const monthStr = monthParam && /^\d{4}-\d{2}$/.test(monthParam) ? monthParam : todayStr.slice(0, 7);
  const selectedDate = dateParam && dateParam.slice(0, 7) === monthStr ? dateParam : null;

  const monthStartStr = `${monthStr}-01`;
  const [my, mm] = monthStr.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(my, mm, 0)).getUTCDate();
  const monthEndStr = `${monthStr}-${String(daysInMonth).padStart(2, "0")}`;
  const monthRangeStart = helsinkiWallTimeToUtc(monthStartStr, "00:00");
  const monthRangeEnd = helsinkiWallTimeToUtc(addDays(monthEndStr, 1), "00:00");

  const [services, rules, monthSlots, monthBlockedDates] = await Promise.all([
    prisma.service.findMany({ where: { status: "available" }, orderBy: { sortOrder: "asc" } }),
    prisma.availabilityRule.findMany({ include: { service: true }, orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] }),
    prisma.availabilitySlot.findMany({
      where: { startsAt: { gte: monthRangeStart, lt: monthRangeEnd } },
      orderBy: { startsAt: "asc" },
      include: { service: true },
    }),
    prisma.blockedDate.findMany({ where: { date: { gte: monthStartStr, lte: monthEndStr } } }),
  ]);

  const slotsByDate = new Map<string, typeof monthSlots>();
  for (const slot of monthSlots) {
    const key = dateToHelsinkiDateStr(slot.startsAt);
    (slotsByDate.get(key) ?? slotsByDate.set(key, []).get(key)!).push(slot);
  }
  const blockedByDate = new Map(monthBlockedDates.map((b) => [b.date, b]));
  const monthGrid = buildMonthGrid(monthStr);
  const selectedDaySlots = selectedDate ? (slotsByDate.get(selectedDate) ?? []) : [];
  const selectedBlocked = selectedDate ? blockedByDate.get(selectedDate) : undefined;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-headline-md text-primary mb-8">Availability</h1>

      {/* Recurring hours */}
      <h2 className="font-display text-headline-sm text-primary mb-2">Recurring hours</h2>
      <p className="text-on-surface-variant text-sm mb-4">
        Set weekly working hours once and open slots are generated automatically, 8 weeks ahead —
        no need to add each one by hand.
      </p>
      <form
        action={createRule}
        className="bg-surface-container rounded-xl p-6 space-y-4 border border-dashed border-outline-variant mb-6"
      >
        <div className="space-y-1">
          <label className={labelClass}>Services</label>
          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
            {services.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-sm text-on-surface">
                <input type="checkbox" name="serviceId" value={s.id} defaultChecked className="accent-primary w-4 h-4" />
                {s.name}
              </label>
            ))}
          </div>
        </div>

        <DayPicker selectedDays={[1, 2, 3, 4, 5]} />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>From</label>
            <input type="time" name="startTime" required defaultValue="09:00" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>To</label>
            <input type="time" name="endTime" required defaultValue="17:00" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Session length (min)</label>
            <input type="number" name="durationMinutes" defaultValue={50} min={15} step={5} className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Format</label>
            <select name="format" defaultValue="online" className={inputClass}>
              <option value="online">Online</option>
              <option value="in-person">In person</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
        >
          Add recurring hours
        </button>
      </form>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.querySelectorAll('[data-day-preset]').forEach(function (btn) {
              btn.addEventListener('click', function () {
                var days = btn.getAttribute('data-day-preset').split(',');
                var group = btn.closest('[data-day-group]');
                if (!group) return;
                group.querySelectorAll('input[name="dayOfWeek"]').forEach(function (cb) {
                  cb.checked = days.indexOf(cb.value) !== -1;
                });
              });
            });
            var clearSlotsForm = document.getElementById('clear-slots-form');
            if (clearSlotsForm) {
              clearSlotsForm.addEventListener('submit', function (e) {
                var select = clearSlotsForm.querySelector('select[name="serviceId"]');
                var label = select.options[select.selectedIndex].text;
                if (!confirm('Remove all open (not yet booked) slots for "' + label + '"? Booked sessions are not affected. This cannot be undone.')) {
                  e.preventDefault();
                }
              });
            }
          `,
        }}
      />

      {rules.length > 0 && (
        <div className="space-y-2 mb-10">
          {Object.values(
            rules.reduce<Record<string, { rule: (typeof rules)[number]; ids: string[]; days: number[] }>>(
              (groups, rule) => {
                const key = `${rule.serviceId}|${rule.startTime}|${rule.endTime}|${rule.durationMinutes}|${rule.format}`;
                if (!groups[key]) groups[key] = { rule, ids: [], days: [] };
                groups[key].ids.push(rule.id);
                groups[key].days.push(rule.dayOfWeek);
                return groups;
              },
              {}
            )
          ).map(({ rule, ids, days }) => {
            const groupKey = ids.join(",");

            if (editKey === groupKey) {
              return (
                <form
                  key={groupKey}
                  action={updateRule}
                  className="bg-surface-container rounded-xl p-4 space-y-4 border border-dashed border-outline-variant"
                >
                  <input type="hidden" name="ruleIds" value={groupKey} />
                  <input type="hidden" name="serviceId" value={rule.serviceId} />
                  <p className="text-on-surface font-medium text-sm">Editing: {rule.service.name}</p>
                  <DayPicker selectedDays={days} />
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className={labelClass}>From</label>
                      <input type="time" name="startTime" required defaultValue={rule.startTime} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>To</label>
                      <input type="time" name="endTime" required defaultValue={rule.endTime} className={inputClass} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Session length (min)</label>
                      <input
                        type="number"
                        name="durationMinutes"
                        defaultValue={rule.durationMinutes}
                        min={15}
                        step={5}
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Format</label>
                      <select name="format" defaultValue={rule.format} className={inputClass}>
                        <option value="online">Online</option>
                        <option value="in-person">In person</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
                    >
                      Save changes
                    </button>
                    <a
                      href="/admin/availability"
                      className="px-5 py-2 rounded-full text-sm border border-outline-variant text-on-surface-variant hover:border-primary"
                    >
                      Cancel
                    </a>
                  </div>
                </form>
              );
            }

            return (
              <div
                key={groupKey}
                className="bg-surface-container-lowest rounded-xl p-4 service-card-shadow flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-on-surface font-medium">
                    {rule.service.name} · {formatDayRange(days)}, {rule.startTime}–{rule.endTime}
                  </p>
                  <p className="text-on-surface-variant text-sm">
                    {rule.durationMinutes}-min sessions · {rule.format}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <a href={`/admin/availability?edit=${groupKey}`} className="text-primary text-sm hover:underline">
                    Edit
                  </a>
                  <form action={deleteRules.bind(null, ids)}>
                    <button type="submit" className="text-error text-sm hover:underline">
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Calendar */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-headline-sm text-primary">Calendar</h2>
        {monthSlots.some((s) => !s.isBooked) && (
          <form action={clearUnbookedSlots} id="clear-slots-form" className="flex items-center gap-2">
            <select
              name="serviceId"
              defaultValue={services[0]?.id ?? "all"}
              className="border border-outline-variant rounded-lg px-2 py-1.5 text-xs bg-surface-container-lowest"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
              <option value="all">All services</option>
            </select>
            <button type="submit" className="text-error text-sm hover:underline">
              Clear open slots
            </button>
          </form>
        )}
      </div>
      <p className="text-on-surface-variant text-sm mb-4">
        Click a day to see who&apos;s booked, block the day off, or add a one-off extra slot.
        Numbers show bookings only — your regular hours above already cover the rest.
      </p>

      <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-6 service-card-shadow">
        <div className="flex items-center justify-between mb-4">
          <a
            href={`/admin/availability?month=${addMonths(monthStr, -1)}`}
            aria-label="Previous month"
            className="p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
          >
            <ChevronLeft size={18} />
          </a>
          <div className="flex items-center gap-3">
            <p className="text-label-lg text-primary font-medium">{formatMonthLabel(monthStr)}</p>
            {monthStr !== todayStr.slice(0, 7) && (
              <a
                href={`/admin/availability?month=${todayStr.slice(0, 7)}&date=${todayStr}`}
                className="text-xs text-primary hover:underline"
              >
                Today
              </a>
            )}
          </div>
          <a
            href={`/admin/availability?month=${addMonths(monthStr, 1)}`}
            aria-label="Next month"
            className="p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high"
          >
            <ChevronRight size={18} />
          </a>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {[1, 2, 3, 4, 5, 6, 0].map((i) => (
            <div key={i} className="text-center text-[11px] uppercase tracking-widest text-on-surface-variant/70">
              {DAY_SHORT[i]}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {monthGrid.map((cell) => {
            if (!cell.inMonth) return <div key={cell.dateStr} />;

            const daySlots = slotsByDate.get(cell.dateStr) ?? [];
            const bookedCount = daySlots.filter((s) => s.isBooked).length;
            const blocked = blockedByDate.has(cell.dateStr);
            const isToday = cell.dateStr === todayStr;
            const isSelected = cell.dateStr === selectedDate;

            return (
              <a
                key={cell.dateStr}
                href={`/admin/availability?month=${monthStr}&date=${cell.dateStr}`}
                className={`aspect-square rounded-lg p-1 flex flex-col items-center pt-1.5 transition-colors ${
                  isSelected
                    ? "bg-primary text-on-primary"
                    : blocked
                      ? "bg-error-container/50 hover:bg-error-container/70"
                      : "hover:bg-surface-container-high"
                } ${isToday && !isSelected ? "ring-1 ring-primary" : ""}`}
              >
                <span className={`text-sm font-medium ${isSelected ? "" : "text-on-surface"}`}>{cell.dayNum}</span>
                {!isSelected && blocked && (
                  <span className="text-[9px] text-on-error-container mt-0.5">Blocked</span>
                )}
                {!isSelected && !blocked && bookedCount > 0 && (
                  <span className="min-w-4 h-4 px-1 mt-1 rounded-full bg-primary-container text-primary-fixed text-[10px] flex items-center justify-center">
                    {bookedCount}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="mt-4 bg-surface-container-lowest rounded-xl p-6 service-card-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-headline-sm text-primary">{formatDateOnly(selectedDate)}</h3>
            <a
              href={`/admin/availability?month=${monthStr}`}
              className="text-on-surface-variant text-sm hover:underline"
            >
              Close
            </a>
          </div>

          {selectedBlocked ? (
            <div className="flex items-center justify-between bg-error-container/40 rounded-lg p-3">
              <p className="text-sm text-on-error-container">
                Blocked{selectedBlocked.reason ? ` — ${selectedBlocked.reason}` : ""}
              </p>
              <form action={deleteBlockedDate.bind(null, selectedBlocked.id)}>
                <button type="submit" className="text-sm text-primary hover:underline shrink-0">
                  Unblock
                </button>
              </form>
            </div>
          ) : (
            <>
              {(() => {
                const booked = selectedDaySlots.filter((s) => s.isBooked);
                const openCount = selectedDaySlots.length - booked.length;
                return (
                  <>
                    {booked.length === 0 ? (
                      <p className="text-on-surface-variant text-sm">No bookings this day.</p>
                    ) : (
                      <div className="space-y-1.5">
                        <p className={labelClass}>Booked</p>
                        {booked.map((slot) => (
                          <p key={slot.id} className="text-sm text-on-surface">
                            {formatTimeOnly(slot.startsAt)} — {slot.service.name} ({slot.format})
                          </p>
                        ))}
                      </div>
                    )}
                    {openCount > 0 && (
                      <p className="text-on-surface-variant text-sm">
                        {openCount} more open slot{openCount === 1 ? "" : "s"} available to clients from your
                        regular hours.
                      </p>
                    )}
                  </>
                );
              })()}

              <form
                action={createSlot}
                className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-4 border-t border-outline-variant/50 items-end"
              >
                <input type="hidden" name="date" value={selectedDate} />
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className={labelClass}>Service</label>
                  <select name="serviceId" required className={inputClass}>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Format</label>
                  <select name="format" defaultValue="online" className={inputClass}>
                    <option value="online">Online</option>
                    <option value="in-person">In person</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Start</label>
                  <input type="time" name="startTime" required className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Minutes</label>
                  <input type="number" name="durationMinutes" defaultValue={50} min={15} step={5} className={inputClass} />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-4 py-2.5 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
                >
                  Add slot
                </button>
              </form>

              <form
                action={createBlockedDate}
                className="flex items-center gap-2 pt-4 border-t border-outline-variant/50"
              >
                <input type="hidden" name="date" value={selectedDate} />
                <input
                  type="text"
                  name="reason"
                  placeholder="Reason (optional, e.g. Vacation)"
                  className={`${inputClass} flex-1`}
                />
                <button type="submit" className="text-error text-sm hover:underline shrink-0">
                  Block this day
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
