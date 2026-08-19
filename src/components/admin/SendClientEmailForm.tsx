"use client";

import { useActionState, useState } from "react";
import { Mail } from "lucide-react";
import { sendClientEmail } from "@/app/admin/(dashboard)/bookings/actions";

export default function SendClientEmailForm({
  bookingId,
  clientEmail,
}: {
  bookingId: string;
  clientEmail: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(sendClientEmail.bind(null, bookingId), undefined);

  if (state?.success && !open) {
    return <span className="text-sm text-primary font-medium">Email sent ✓</span>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm text-primary hover:underline"
      >
        <Mail size={14} />
        Email client
      </button>
    );
  }

  return (
    <form action={formAction} className="w-full sm:w-72 space-y-2 text-left">
      <p className="text-on-surface-variant text-xs">To: {clientEmail}</p>
      <input
        type="text"
        name="subject"
        placeholder="Subject"
        required
        className="w-full border border-outline-variant focus:border-primary rounded-lg p-2 bg-surface-container-lowest text-sm"
      />
      <textarea
        name="message"
        placeholder="Message"
        required
        rows={4}
        className="w-full border border-outline-variant focus:border-primary rounded-lg p-2 bg-surface-container-lowest text-sm"
      />
      {state?.error && <p className="text-error text-xs">{state.error}</p>}
      {state?.success && <p className="text-primary text-xs">Sent!</p>}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="bg-primary text-on-primary px-3 py-1.5 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
        >
          Send
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-on-surface-variant text-sm hover:underline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
