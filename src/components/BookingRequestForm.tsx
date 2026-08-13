"use client";

import { useMemo, useState, type FormEvent } from "react";
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
  const [serviceId, setServiceId] = useState(
    services.find((s) => s.slug === initialServiceSlug)?.id ?? services[0]?.id ?? ""
  );
  const [monthStart, setMonthStart] = useState(() => {
    const today = dateToHelsinkiDateStr(new Date());
    return `${today.slice(0, 7)}-01`;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slotId, setSlotId] = useState("");
  const [showGeneralForm, setShowGeneralForm] = useState(false);

  const todayStr = useMemo(() => dateToHelsinkiDateStr(new Date()), []);

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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!showGeneralForm && !slotId) return;
    setStatus("sending");
    const form = e.currentTarget;
    const formValues = Object.fromEntries(new FormData(form).entries());

    const payload = showGeneralForm
      ? formValues
      : { name: formValues.name, email: formValues.email, message: formValues.message, slotId };

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
          router.refresh();
        }
        setErrorMessage(data?.error || "Something went wrong — please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      form.reset();
      setSlotId("");
      setSelectedDate(null);
    } catch {
      setErrorMessage("Something went wrong — please try again.");
      setStatus("error");
    }
  }

  const currentStep = showGeneralForm || slotId ? 3 : selectedDate ? 2 : 1;
  const steps = ["Choose session type", "Pick a time", "Your details"];

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
      <div className="flex items-center gap-2 pb-1">
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const done = stepNum < currentStep;
          const active = stepNum === currentStep;
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
              {stepNum < steps.length && <div className="flex-1 h-px bg-outline-variant/60 mx-1" />}
            </div>
          );
        })}
      </div>

      {!showGeneralForm && (
        <>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => selectService(s.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  serviceId === s.id
                    ? "bg-primary text-on-primary"
                    : "border border-outline-variant text-on-surface-variant hover:border-primary"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

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
                const hasSlots = cell.inMonth && (slotsByDate.get(cell.dateStr)?.length ?? 0) > 0;
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
                    onClick={() => setSlotId(slot.id)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      slotId === slot.id
                        ? "bg-primary text-on-primary"
                        : "border border-outline-variant text-on-surface hover:border-primary"
                    }`}
                  >
                    {formatTime(slot.startsAt)} · {slot.format}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showGeneralForm && (
        <>
          <div className="space-y-1.5">
            <label htmlFor="serviceId" className="text-label-lg text-on-surface-variant">
              Service
            </label>
            <select
              id="serviceId"
              name="serviceId"
              required
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
              required
              className="w-full border border-outline-variant focus:border-primary rounded-lg p-3 bg-surface-container-lowest"
            >
              <option value="online">Online</option>
              <option value="in-person">In person — Helsinki office</option>
            </select>
          </div>
        </>
      )}

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

      {!showGeneralForm && !slotId && (
        <p className="text-on-surface-variant text-sm">Pick a highlighted day, then a time, to continue.</p>
      )}

      {status === "error" && <p className="text-error text-sm">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === "sending" || (!showGeneralForm && !slotId)}
        className="w-full bg-primary text-on-primary py-4 rounded-lg text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
      >
        {status === "sending" ? "Sending…" : "Send Booking Request"}
      </button>

      <button
        type="button"
        onClick={() => {
          setShowGeneralForm((v) => !v);
          setSlotId("");
          setSelectedDate(null);
        }}
        className="w-full text-sm text-primary hover:underline"
      >
        {showGeneralForm ? "← Back to calendar" : "Can't find a time? Send a general request instead"}
      </button>
    </form>
  );
}
