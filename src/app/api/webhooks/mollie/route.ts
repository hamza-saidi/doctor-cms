import { NextResponse } from "next/server";
import { PaymentStatus } from "@mollie/api-client";
import { prisma } from "@/lib/prisma";
import { getMollieClient } from "@/lib/mollie";
import { syncBookingToGoogleCalendar } from "@/lib/google";

// Mollie webhook calls are unauthenticated POSTs carrying only a payment id
// — there's no signature to verify like Stripe. The secure pattern is to
// treat the call as a bare "something changed" trigger and fetch the
// authoritative status back from Mollie's API using our own API key.
export async function POST(request: Request) {
  const body = await request.formData();
  const paymentId = body.get("id");

  if (typeof paymentId !== "string" || !paymentId) {
    return NextResponse.json({ error: "Missing payment id." }, { status: 400 });
  }

  const mollie = await getMollieClient();
  const payment = await mollie.payments.get(paymentId);

  if (payment.status === PaymentStatus.paid) {
    const bookingId = (payment.metadata as { bookingId?: string } | null)?.bookingId;
    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { paid: true, status: "confirmed" },
      });
      await syncBookingToGoogleCalendar(bookingId);
    }
  }

  return NextResponse.json({ received: true });
}
