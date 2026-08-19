"use client";

import { useActionState } from "react";
import { createSlot } from "./actions";

const inputClass =
  "w-full border border-outline-variant focus:border-primary rounded-lg p-2.5 bg-surface-container-lowest text-sm";
const labelClass = "text-label-md text-on-surface-variant uppercase tracking-widest";

// A plain `<form action={createSlot}>` gave no feedback when the insert
// failed (e.g. colliding with a slot a recurring rule already generated at
// the same service/time/format) — the button just looked broken. Wrapping
// in useActionState surfaces that failure as a message instead.
export default function AddSlotForm({
  services,
  selectedDate,
}: {
  services: { id: string; name: string }[];
  selectedDate: string;
}) {
  const [state, formAction] = useActionState(createSlot, undefined);

  return (
    <form
      action={formAction}
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
      {state?.error && (
        <p className="col-span-2 sm:col-span-5 text-error text-sm">{state.error}</p>
      )}
    </form>
  );
}
