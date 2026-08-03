import { prisma } from "@/lib/prisma";
import { updateBookingStatus } from "./actions";
import PaymentLinkButton from "@/components/admin/PaymentLinkButton";

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

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { service: true, slot: true },
  });

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-headline-md text-primary mb-8">Bookings</h1>

      {bookings.length === 0 && (
        <p className="text-on-surface-variant text-sm">No booking requests yet.</p>
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
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
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
    </div>
  );
}
