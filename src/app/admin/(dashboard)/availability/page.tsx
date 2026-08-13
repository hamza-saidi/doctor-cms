import { prisma } from "@/lib/prisma";
import { ensureSlotsGenerated } from "@/lib/availability";
import {
  createSlot,
  deleteSlot,
  createRule,
  deleteRules,
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

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Helsinki",
  }).format(date);
}

function formatDateOnly(dateStr: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dateStr}T12:00:00Z`));
}

export default async function AdminAvailabilityPage() {
  await ensureSlotsGenerated();

  const [services, slots, rules, blockedDates] = await Promise.all([
    prisma.service.findMany({ where: { status: "available" }, orderBy: { sortOrder: "asc" } }),
    prisma.availabilitySlot.findMany({
      where: { startsAt: { gt: new Date() } },
      orderBy: { startsAt: "asc" },
      include: { service: true },
    }),
    prisma.availabilityRule.findMany({ include: { service: true }, orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] }),
    prisma.blockedDate.findMany({ orderBy: { date: "asc" } }),
  ]);

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

        <div className="space-y-1">
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
          <div id="day-checkboxes" className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
            {DAY_NAMES.map((name, i) => (
              <label key={name} className="flex items-center gap-2 text-sm text-on-surface">
                <input
                  type="checkbox"
                  name="dayOfWeek"
                  value={i}
                  defaultChecked={i >= 1 && i <= 5}
                  className="accent-primary w-4 h-4"
                />
                {DAY_SHORT[i]}
              </label>
            ))}
          </div>
        </div>

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
                document.querySelectorAll('#day-checkboxes input[name="dayOfWeek"]').forEach(function (cb) {
                  cb.checked = days.indexOf(cb.value) !== -1;
                });
              });
            });
            var clearSlotsForm = document.getElementById('clear-slots-form');
            if (clearSlotsForm) {
              clearSlotsForm.addEventListener('submit', function (e) {
                if (!confirm('Remove all open (not yet booked) slots? Booked sessions are not affected. This cannot be undone.')) {
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
          ).map(({ rule, ids, days }) => (
            <div
              key={ids.join(",")}
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
              <form action={deleteRules.bind(null, ids)}>
                <button type="submit" className="text-error text-sm hover:underline">
                  Remove
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      {/* Blocked dates */}
      <h2 className="font-display text-headline-sm text-primary mb-2">Blocked dates</h2>
      <p className="text-on-surface-variant text-sm mb-4">
        Days off, holidays, vacation — no slots will be offered on these dates regardless of your
        recurring hours above.
      </p>
      <form
        action={createBlockedDate}
        className="bg-surface-container rounded-xl p-6 space-y-4 border border-dashed border-outline-variant mb-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Date</label>
            <input type="date" name="date" required className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Reason (optional)</label>
            <input type="text" name="reason" placeholder="e.g. Vacation" className={inputClass} />
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
        >
          Block date
        </button>
      </form>

      {blockedDates.length > 0 && (
        <div className="space-y-2 mb-10">
          {blockedDates.map((b) => (
            <div
              key={b.id}
              className="bg-surface-container-lowest rounded-xl p-4 service-card-shadow flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-on-surface font-medium">{formatDateOnly(b.date)}</p>
                {b.reason && <p className="text-on-surface-variant text-sm">{b.reason}</p>}
              </div>
              <form action={deleteBlockedDate.bind(null, b.id)}>
                <button type="submit" className="text-error text-sm hover:underline">
                  Unblock
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      {/* Manual one-off slots */}
      <h2 className="font-display text-headline-sm text-primary mb-2">One-off slot</h2>
      <p className="text-on-surface-variant text-sm mb-4">
        For a single exception outside your recurring hours above.
      </p>
      <form
        action={createSlot}
        className="bg-surface-container rounded-xl p-6 space-y-4 border border-dashed border-outline-variant mb-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
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
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Date</label>
            <input type="date" name="date" required className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Start time</label>
            <input type="time" name="startTime" required className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Duration (minutes)</label>
            <input
              type="number"
              name="durationMinutes"
              defaultValue={50}
              min={15}
              step={5}
              className={inputClass}
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
        >
          Add slot
        </button>
      </form>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-headline-sm text-primary">Upcoming slots</h2>
        {slots.length > 0 && (
          <form action={clearUnbookedSlots} id="clear-slots-form">
            <button type="submit" className="text-error text-sm hover:underline">
              Clear all open slots
            </button>
          </form>
        )}
      </div>
      {slots.length === 0 && (
        <p className="text-on-surface-variant text-sm">No upcoming slots yet.</p>
      )}
      <div className="space-y-3">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="bg-surface-container-lowest rounded-xl p-4 service-card-shadow flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-on-surface font-medium">{formatDateTime(slot.startsAt)}</p>
              <p className="text-on-surface-variant text-sm">
                {slot.service.name} · {slot.format}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  slot.isBooked
                    ? "bg-primary-container text-primary-fixed"
                    : "bg-secondary-container text-on-secondary-container"
                }`}
              >
                {slot.isBooked ? "Booked" : "Open"}
              </span>
              {!slot.isBooked && (
                <form action={deleteSlot.bind(null, slot.id)}>
                  <button type="submit" className="text-error text-sm hover:underline">
                    Remove
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
