"use client";

import { useState, type FormEvent } from "react";
import type { Service, AvailabilitySlot } from "@prisma/client";

type SlotWithService = AvailabilitySlot & { service: Service };

// Builds the display string from individually-formatted parts (rather than
// one Intl.DateTimeFormat call) and joins them with our own fixed
// punctuation. A single formatted call's surrounding punctuation is locale
// *pattern* data, which can differ between Node's bundled ICU (server) and
// the browser's ICU (client) even for identical options — producing a
// server/client text mismatch and a React hydration error. The individual
// parts (weekday/day/month/time) are stable; only the separators are ours.
function formatSlot(slot: SlotWithService) {
  const tz = "Europe/Helsinki";
  const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: tz }).format(slot.startsAt);
  const day = new Intl.DateTimeFormat("en-GB", { day: "2-digit", timeZone: tz }).format(slot.startsAt);
  const month = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: tz }).format(slot.startsAt);
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: tz }).format(slot.startsAt);
  return `${slot.service.name} — ${weekday} ${day} ${month}, ${time} (${slot.format})`;
}

export default function BookingRequestForm({
  services,
  slots,
}: {
  services: Service[];
  slots: SlotWithService[];
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [slotId, setSlotId] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
      setSlotId("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-surface-container-lowest p-6 rounded-2xl service-card-shadow text-center">
        <p className="text-headline-sm font-display text-primary mb-2">Request received</p>
        <p className="text-on-surface-variant">
          We&apos;ll review your request and email you a confirmation with next steps.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-container-lowest p-6 rounded-2xl service-card-shadow space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-label-lg text-on-surface-variant">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            required
            type="text"
            className="w-full border border-outline-variant focus:border-primary rounded-lg p-3 bg-surface-container-lowest"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-label-lg text-on-surface-variant">
            Email
          </label>
          <input
            id="email"
            name="email"
            required
            type="email"
            className="w-full border border-outline-variant focus:border-primary rounded-lg p-3 bg-surface-container-lowest"
          />
        </div>
      </div>

      {slots.length > 0 && (
        <div className="space-y-1.5">
          <label htmlFor="slotId" className="text-label-lg text-on-surface-variant">
            Open Time Slot (optional)
          </label>
          <select
            id="slotId"
            name="slotId"
            value={slotId}
            onChange={(e) => setSlotId(e.target.value)}
            className="w-full border border-outline-variant focus:border-primary rounded-lg p-3 bg-surface-container-lowest"
          >
            <option value="">No preference</option>
            {slots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {formatSlot(slot)}
              </option>
            ))}
          </select>
        </div>
      )}

      {!slotId && (
        <>
          <div className="space-y-1.5">
            <label htmlFor="serviceId" className="text-label-lg text-on-surface-variant">
              Service
            </label>
            <select
              id="serviceId"
              name="serviceId"
              required={!slotId}
              className="w-full border border-outline-variant focus:border-primary rounded-lg p-3 bg-surface-container-lowest"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="format" className="text-label-lg text-on-surface-variant">
              Preferred Format
            </label>
            <select
              id="format"
              name="format"
              required={!slotId}
              className="w-full border border-outline-variant focus:border-primary rounded-lg p-3 bg-surface-container-lowest"
            >
              <option value="online">Online</option>
              <option value="in-person">In person — Helsinki office</option>
            </select>
          </div>
        </>
      )}

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-label-lg text-on-surface-variant">
          Anything you&apos;d like us to know?
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className="w-full border border-outline-variant focus:border-primary rounded-lg p-3 bg-surface-container-lowest"
        />
      </div>

      {status === "error" && (
        <p className="text-error text-sm">Something went wrong — please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-primary text-on-primary py-4 rounded-lg text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send Booking Request"}
      </button>
    </form>
  );
}
