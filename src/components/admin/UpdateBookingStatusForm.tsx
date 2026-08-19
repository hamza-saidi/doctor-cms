"use client";

import { useActionState } from "react";
import { updateBookingStatus } from "@/app/admin/(dashboard)/bookings/actions";

const STATUSES = ["pending", "confirmed", "completed", "no-show", "cancelled"] as const;
const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  "no-show": "No-show",
  cancelled: "Cancelled",
};

// A plain `<form action={updateBookingStatus}>` gave no feedback when a
// confirm was refused (e.g. another pending request for the same slot got
// confirmed first) — useActionState surfaces that as a message instead of
// the dropdown silently reverting on the next page load.
export default function UpdateBookingStatusForm({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: string;
}) {
  const [state, formAction] = useActionState(updateBookingStatus.bind(null, bookingId), undefined);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-3">
        <select
          name="status"
          defaultValue={currentStatus}
          className="border border-outline-variant rounded-lg p-2 text-sm bg-surface-container-lowest"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-primary text-on-primary px-4 py-2 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
        >
          Update
        </button>
      </div>
      {state?.error && <p className="text-error text-xs max-w-[240px] text-right">{state.error}</p>}
    </form>
  );
}
