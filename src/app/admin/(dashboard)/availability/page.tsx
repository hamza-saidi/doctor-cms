import { prisma } from "@/lib/prisma";
import { createSlot, deleteSlot } from "./actions";

const inputClass =
  "w-full border border-outline-variant focus:border-primary rounded-lg p-2.5 bg-surface-container-lowest text-sm";
const labelClass = "text-label-md text-on-surface-variant uppercase tracking-widest";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminAvailabilityPage() {
  const [services, slots] = await Promise.all([
    prisma.service.findMany({ where: { status: "available" }, orderBy: { sortOrder: "asc" } }),
    prisma.availabilitySlot.findMany({
      where: { startsAt: { gt: new Date() } },
      orderBy: { startsAt: "asc" },
      include: { service: true },
    }),
  ]);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-headline-md text-primary mb-8">Availability</h1>

      <h2 className="font-display text-headline-sm text-primary mb-4">Add a time slot</h2>
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

      <h2 className="font-display text-headline-sm text-primary mb-4">Upcoming slots</h2>
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
