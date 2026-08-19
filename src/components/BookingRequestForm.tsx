"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Service, AvailabilitySlot } from "@prisma/client";

type SlotWithService = AvailabilitySlot & { service: Service };

const HELSINKI_TZ = "Europe/Helsinki";
const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

// Client-safe date helpers — deliberately not imported from lib/availability
// (server-only, pulls in Prisma) even though the logic overlaps; these stay
// tiny and dependency-free on purpose.
function dateToHelsinkiDateStr(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: HELSINKI_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}
function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
// Monday-first weekday index (0=Mon..6=Sun) — matches the day grid header.
function mondayFirstDow(dateStr: string): number {
  const sundayFirst = new Date(`${dateStr}T00:00:00Z`).getUTCDay(); // 0=Sun..6=Sat
  return (sundayFirst + 6) % 7;
}
function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: HELSINKI_TZ }).format(date);
}
function formatDayLabel(dateStr: string) {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "2-digit", month: "long", timeZone: HELSINKI_TZ }).format(
    new Date(`${dateStr}T12:00:00Z`)
  );
}
function formatMonthLabel(dateStr: string) {
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: HELSINKI_TZ }).format(
    new Date(`${dateStr}T12:00:00Z`)
  );
}

const STEP_LABELS = ["Service", "Pick a time", "Your details", "Confirm"];

export default function BookingRequestForm({
  services,
  slots,
  initialServiceSlug,
}: {
  services: Service[];
  slots: SlotWithService[];
  initialServiceSlug?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);

  const availableServices = services.filter((s) => s.status === "available");
  const [serviceId, setServiceId] = useState(
    availableServices.find((s) => s.slug === initialServiceSlug)?.id ?? availableServices[0]?.id ?? ""
  );

  const [monthStart, setMonthStart] = useState(() => {
    const today = dateToHelsinkiDateStr(new Date());
    return `${today.slice(0, 7)}-01`;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slotId, setSlotId] = useState("");
  const [showGeneralForm, setShowGeneralForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [format, setFormat] = useState<"online" | "in-person">("online");

  const todayStr = useMemo(() => dateToHelsinkiDateStr(new Date()), []);
  const selectedService = services.find((s) => s.id === serviceId);
  const selectedSlot = slots.find((s) => s.id === slotId);

  // Format no longer filters which slots are selectable — it's purely
  // informational for the admin about which room to expect the client in,
  // not tied to a specific slot's own format tag.
  const slotsForService = useMemo(
    () => slots.filter((s) => s.serviceId === serviceId),
    [slots, serviceId]
  );

  const slotsByDate = useMemo(() => {
    const map = new Map<string, SlotWithService[]>();
    for (const slot of slotsForService) {
      const key = dateToHelsinkiDateStr(slot.startsAt);
      const list = map.get(key) ?? [];
      list.push(slot);
      map.set(key, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
    return map;
  }, [slotsForService]);

  const furthestDate = useMemo(() => {
    let max = "";
    for (const key of slotsByDate.keys()) if (key > max) max = key;
    return max;
  }, [slotsByDate]);

  const gridDays = useMemo(() => {
    const leadingBlanks = mondayFirstDow(monthStart);
    const monthNum = monthStart.slice(5, 7);
    const cells: { dateStr: string; dayNum: number; inMonth: boolean }[] = [];
    for (let i = 0; i < leadingBlanks; i++) {
      cells.push({ dateStr: addDays(monthStart, i - leadingBlanks), dayNum: 0, inMonth: false });
    }
    let cursor = monthStart;
    while (cursor.slice(5, 7) === monthNum) {
      cells.push({ dateStr: cursor, dayNum: Number(cursor.slice(8, 10)), inMonth: true });
      cursor = addDays(cursor, 1);
    }
    while (cells.length % 7 !== 0) {
      cells.push({ dateStr: cursor, dayNum: Number(cursor.slice(8, 10)), inMonth: false });
      cursor = addDays(cursor, 1);
    }
    return cells;
  }, [monthStart]);

  const canGoNextMonth = furthestDate && furthestDate >= addDays(`${monthStart.slice(0, 7)}-01`, 32).slice(0, 7) + "-01";
  const canGoPrevMonth = monthStart.slice(0, 7) > todayStr.slice(0, 7);

  function changeMonth(delta: number) {
    const anchor = addDays(monthStart, delta > 0 ? 32 : -1);
    setMonthStart(`${anchor.slice(0, 7)}-01`);
    setSelectedDate(null);
    setSlotId("");
  }

  function selectService(id: string) {
    setServiceId(id);
    setSelectedDate(null);
    setSlotId("");
  }

  function goNext() {
    setStep((s) => Math.min(s + 1, 4));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  const canProceedStep1 = Boolean(serviceId);
  const canProceedStep2 = showGeneralForm || Boolean(slotId);
  const canProceedStep3 = Boolean(name && email && phone);

  async function handleConfirm() {
    setStatus("sending");

    const payload = showGeneralForm
      ? { name, email, phone, message: message || undefined, serviceId, format }
      : { name, email, phone, message: message || undefined, slotId, format };

    try {
      const res = await fetch("/api/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (res.status === 409) {
          // Someone else took this slot between page load and submit — the
          // slots this component knows about are now stale, so re-run the
          // server component (book-and-pay is force-dynamic) to fetch a
          // fresh list rather than let the visitor keep retrying a slot
          // that will always fail.
          setSlotId("");
          setSelectedDate(null);
          setStep(2);
          router.refresh();
        }
        setErrorMessage(data?.error || "Something went wrong — please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setErrorMessage("Something went wrong — please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-surface-container-lowest p-6 rounded-2xl service-card-shadow text-center">
        <p className="text-headline-sm font-display text-primary mb-2">Thank you for your request.</p>
        <p className="text-on-surface-variant">
          We&apos;ll review your request and email you a confirmation with next steps.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl service-card-shadow space-y-5">
      <div className="flex items-center gap-2 pb-1">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const done = stepNum < step;
          const active = stepNum === step;
          return (
            <div key={label} className="flex items-center gap-2 flex-1 last:flex-initial">
              <div className="flex items-center gap-2">
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-xs shrink-0 ${
                    done || active
                      ? "bg-deep-green text-on-deep-green"
                      : "bg-surface-container-high text-on-surface-variant/60"
                  }`}
                >
                  {stepNum}
                </span>
                <span
                  className={`text-xs hidden sm:inline whitespace-nowrap ${
                    active ? "text-deep-green font-medium" : "text-on-surface-variant/70"
                  }`}
                >
                  {label}
                </span>
              </div>
              {stepNum < STEP_LABELS.length && <div className="flex-1 h-px bg-outline-variant/60 mx-1" />}
            </div>
          );
        })}
      </div>

      {/* Selected service stays visible from step 2 onward so it's always
          clear what the client is booking. */}
      {step > 1 && selectedService && (
        <p className="text-sm text-on-surface-variant">
          You&apos;re booking: <span className="text-primary font-medium">{selectedService.name}</span>
        </p>
      )}

      {step === 1 && (
        <div className="space-y-2">
          <p className="text-label-lg text-on-surface-variant">Choose a service</p>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => {
              const comingSoon = s.status !== "available";
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={comingSoon}
                  onClick={() => selectService(s.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    comingSoon
                      ? "border border-outline-variant/60 text-on-surface-variant/40 cursor-not-allowed"
                      : serviceId === s.id
                        ? "bg-primary text-on-primary"
                        : "border border-outline-variant text-on-surface-variant hover:border-primary"
                  }`}
                >
                  {s.name}
                  {comingSoon && <span className="ml-1.5 text-[10px] uppercase tracking-wide">Soon</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <>
          {!showGeneralForm && (
            <>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  disabled={!canGoPrevMonth}
                  aria-label="Previous month"
                  className="p-1.5 rounded-full text-on-surface-variant hover:text-primary disabled:opacity-30 disabled:hover:text-on-surface-variant"
                >
                  <ChevronLeft size={18} />
                </button>
                <p className="text-label-lg text-primary">{formatMonthLabel(monthStart)}</p>
                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  disabled={!canGoNextMonth}
                  aria-label="Next month"
                  className="p-1.5 rounded-full text-on-surface-variant hover:text-primary disabled:opacity-30 disabled:hover:text-on-surface-variant"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {WEEKDAY_LABELS.map((d) => (
                    <div key={d} className="text-center text-[11px] uppercase tracking-widest text-on-surface-variant/70">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {gridDays.map((cell) => {
                    const daySlots = slotsByDate.get(cell.dateStr) ?? [];
                    // A day with only booked slots still needs to be
                    // clickable — otherwise a client can never see that it's
                    // fully booked (greyed times), only that it's absent.
                    const hasSlots = cell.inMonth && daySlots.length > 0;
                    const fullyBooked = hasSlots && daySlots.every((s) => s.isBooked);
                    const isPast = cell.dateStr < todayStr;
                    const isSelected = cell.dateStr === selectedDate;
                    return (
                      <button
                        key={cell.dateStr}
                        type="button"
                        disabled={!hasSlots || isPast}
                        onClick={() => {
                          setSelectedDate(cell.dateStr);
                          setSlotId("");
                        }}
                        className={`aspect-square rounded-lg text-sm transition-colors ${
                          !cell.inMonth
                            ? "invisible"
                            : isSelected
                              ? "bg-primary text-on-primary font-medium"
                              : fullyBooked && !isPast
                                ? "bg-surface-container-high text-on-surface-variant/60 hover:bg-surface-container-highest"
                                : hasSlots && !isPast
                                  ? "bg-primary-container/40 text-primary hover:bg-primary-container/70 font-medium"
                                  : "text-on-surface-variant/40"
                        }`}
                      >
                        {cell.dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <div className="space-y-2 pt-3 border-t border-outline-variant/50">
                  <p className="text-label-lg text-on-surface-variant">{formatDayLabel(selectedDate)}</p>
                  <div className="flex flex-wrap gap-2">
                    {(slotsByDate.get(selectedDate) ?? []).map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={slot.isBooked}
                        onClick={() => setSlotId(slot.id)}
                        title={slot.isBooked ? "Already booked" : undefined}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          slot.isBooked
                            ? "bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed line-through"
                            : slotId === slot.id
                              ? "bg-primary text-on-primary"
                              : "border border-outline-variant text-on-surface hover:border-primary"
                        }`}
                      >
                        {formatTime(slot.startsAt)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!slotId && (
                <p className="text-on-surface-variant text-sm">Pick a highlighted day, then a time, to continue.</p>
              )}
            </>
          )}

          {showGeneralForm && (
            <p className="text-on-surface-variant text-sm bg-surface-container-low rounded-lg p-4">
              No problem — skip the calendar and send a request. We&apos;ll follow up by email to
              find a time that works.
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              setShowGeneralForm((v) => !v);
              setSlotId("");
              setSelectedDate(null);
            }}
            className="text-sm text-primary hover:underline"
          >
            {showGeneralForm ? "← Back to calendar" : "Can't find a time? Send a general request instead"}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-label-lg text-on-surface-variant">
                Full Name
              </label>
              <input
                id="name"
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-outline-variant focus:border-primary rounded-lg p-3 bg-surface-container-lowest"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-label-lg text-on-surface-variant">
                Email
              </label>
              <input
                id="email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-outline-variant focus:border-primary rounded-lg p-3 bg-surface-container-lowest"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-label-lg text-on-surface-variant">
              Phone number
            </label>
            <input
              id="phone"
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-outline-variant focus:border-primary rounded-lg p-3 bg-surface-container-lowest"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="format" className="text-label-lg text-on-surface-variant">
              Preferred Format
            </label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value as "online" | "in-person")}
              className="w-full border border-outline-variant focus:border-primary rounded-lg p-3 bg-surface-container-lowest"
            >
              <option value="online">Online</option>
              <option value="in-person">In person — Helsinki office</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="message" className="text-label-lg text-on-surface-variant">
              Anything you&apos;d like us to know? <span className="text-on-surface-variant/60">(optional)</span>
            </label>
            <textarea
              id="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-outline-variant focus:border-primary rounded-lg p-3 bg-surface-container-lowest"
            />
          </div>
        </>
      )}

      {step === 4 && (
        <div className="space-y-3">
          <p className="text-label-lg text-on-surface-variant">Review your request</p>
          <div className="bg-surface-container-low rounded-lg p-4 space-y-2 text-sm">
            <p>
              <span className="text-on-surface-variant">Service: </span>
              <span className="text-on-surface font-medium">{selectedService?.name}</span>
            </p>
            <p>
              <span className="text-on-surface-variant">Time: </span>
              <span className="text-on-surface font-medium">
                {selectedSlot
                  ? `${formatDayLabel(dateToHelsinkiDateStr(selectedSlot.startsAt))} · ${formatTime(selectedSlot.startsAt)}`
                  : "We'll coordinate a time by email"}
              </span>
            </p>
            <p>
              <span className="text-on-surface-variant">Format: </span>
              <span className="text-on-surface font-medium">
                {format === "online" ? "Online" : "In person — Helsinki office"}
              </span>
            </p>
            <p>
              <span className="text-on-surface-variant">Name: </span>
              <span className="text-on-surface font-medium">{name}</span>
            </p>
            <p>
              <span className="text-on-surface-variant">Email: </span>
              <span className="text-on-surface font-medium">{email}</span>
            </p>
          </div>
        </div>
      )}

      {status === "error" && <p className="text-error text-sm">{errorMessage}</p>}

      <div className="flex items-center gap-3 pt-1">
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="px-6 py-3 rounded-lg text-label-lg border-2 border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
          >
            Back
          </button>
        )}
        {step < 4 && (
          <button
            type="button"
            onClick={goNext}
            disabled={
              (step === 1 && !canProceedStep1) ||
              (step === 2 && !canProceedStep2) ||
              (step === 3 && !canProceedStep3)
            }
            className="flex-1 bg-primary text-on-primary py-3 rounded-lg text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 disabled:opacity-60"
          >
            Next
          </button>
        )}
        {step === 4 && (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={status === "sending"}
            className="flex-1 bg-primary text-on-primary py-3 rounded-lg text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
          >
            {status === "sending" ? "Sending…" : "Send Booking Request"}
          </button>
        )}
      </div>
    </div>
  );
}
