import { prisma } from "@/lib/prisma";
import { updateBookingStatus } from "./actions";
import PaymentLinkButton from "@/components/admin/PaymentLinkButton";

const PAGE_SIZE = 15;
const STATUSES = ["pending", "confirmed", "completed", "no-show", "cancelled"] as const;
const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  "no-show": "No-show",
  cancelled: "Cancelled",
};

function formatDateTime(date: Date | null) {
  if (!date) return "No slot selected";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildHref(status: string | undefined, q: string | undefined, page?: number) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q) params.set("q", q);
  if (page && page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/admin/bookings?${qs}` : "/admin/bookings";
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const { status: statusFilter, q, page: pageParam } = await searchParams;

  const allBookings = await prisma.booking.findMany({
    include: { service: true, slot: true },
  });

  // Appointment date, not request date, is what an admin scanning this list
  // needs to triage by — a pending request for next week matters more right
  // now than a brand-new one created seconds ago. Requests with no slot
  // picked yet (general requests) need outreach before anything else, so
  // they sort first; everything else is soonest-appointment-first.
  allBookings.sort((a, b) => {
    if (!a.slot && !b.slot) return b.createdAt.getTime() - a.createdAt.getTime();
    if (!a.slot) return -1;
    if (!b.slot) return 1;
    return a.slot.startsAt.getTime() - b.slot.startsAt.getTime();
  });

  const counts = Object.fromEntries(STATUSES.map((s) => [s, allBookings.filter((b) => b.status === s).length]));

  const needle = (q ?? "").trim().toLowerCase();
  const filteredBookings = allBookings.filter((b) => {
    if (statusFilter && b.status !== statusFilter) return false;
    if (needle && !b.name.toLowerCase().includes(needle) && !b.email.toLowerCase().includes(needle)) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const bookings = filteredBookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-headline-md text-primary mb-6">Bookings</h1>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <a
          href={buildHref(undefined, q, 1)}
          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
            !statusFilter
              ? "bg-primary text-on-primary"
              : "border border-outline-variant text-on-surface-variant hover:border-primary"
          }`}
        >
          All ({allBookings.length})
        </a>
        {STATUSES.map((s) => (
          <a
            key={s}
            href={buildHref(s, q, 1)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              statusFilter === s
                ? "bg-primary text-on-primary"
                : "border border-outline-variant text-on-surface-variant hover:border-primary"
            }`}
          >
            {STATUS_LABELS[s]} ({counts[s]})
          </a>
        ))}
      </div>

      <form method="GET" className="mb-6 flex gap-2 max-w-sm">
        {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search name or email…"
          className="w-full border border-outline-variant focus:border-primary rounded-lg p-2.5 bg-surface-container-lowest text-sm"
        />
        <button
          type="submit"
          className="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-sm hover:bg-surface-container-highest transition-colors shrink-0"
        >
          Search
        </button>
      </form>

      {filteredBookings.length === 0 && (
        <p className="text-on-surface-variant text-sm">
          {allBookings.length === 0 ? "No booking requests yet." : "No bookings match this filter."}
        </p>
      )}
      {filteredBookings.length > 0 && (
        <p className="text-on-surface-variant text-sm mb-4">
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredBookings.length)} of{" "}
          {filteredBookings.length}
        </p>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-surface-container-lowest rounded-xl p-6 service-card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <p className="text-on-surface font-medium">
                {booking.name} · {booking.service.name}
              </p>
              <p className="text-on-surface-variant text-sm">{booking.email}</p>
              <p className="text-on-surface-variant text-sm">
                {formatDateTime(booking.slot?.startsAt ?? null)} · {booking.format}
              </p>
              {booking.message && (
                <p className="text-on-surface-variant/80 text-sm italic mt-1">
                  &ldquo;{booking.message}&rdquo;
                </p>
              )}
            </div>
            <div className="flex flex-col sm:items-end gap-3">
              <form
                action={updateBookingStatus.bind(null, booking.id)}
                className="flex items-center gap-3"
              >
                <select
                  name="status"
                  defaultValue={booking.status}
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
              </form>
              <PaymentLinkButton
                bookingId={booking.id}
                existingUrl={booking.mollieCheckoutUrl}
                paid={booking.paid}
              />
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <a
            href={buildHref(statusFilter, q, page - 1)}
            aria-disabled={page <= 1}
            className={`px-4 py-2 rounded-full text-sm border border-outline-variant transition-colors ${
              page <= 1
                ? "opacity-40 pointer-events-none"
                : "text-on-surface-variant hover:border-primary"
            }`}
          >
            ← Previous
          </a>
          <p className="text-on-surface-variant text-sm">
            Page {page} of {totalPages}
          </p>
          <a
            href={buildHref(statusFilter, q, page + 1)}
            aria-disabled={page >= totalPages}
            className={`px-4 py-2 rounded-full text-sm border border-outline-variant transition-colors ${
              page >= totalPages
                ? "opacity-40 pointer-events-none"
                : "text-on-surface-variant hover:border-primary"
            }`}
          >
            Next →
          </a>
        </div>
      )}
    </div>
  );
}
