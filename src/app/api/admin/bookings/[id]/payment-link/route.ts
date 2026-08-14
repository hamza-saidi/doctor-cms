import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMollieClient } from "@/lib/mollie";
import { sendBookingConfirmationEmail } from "@/lib/email";

export async function POST(request: Request, ctx: RouteContext<"/api/admin/bookings/[id]/payment-link">) {
  const { id } = await ctx.params;

  const booking = await prisma.booking.findUnique({ where: { id }, include: { service: true } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }
  if (!booking.service.priceCents) {
    return NextResponse.json(
      { error: `Set an exact price for "${booking.service.name}" in Services before generating a payment link.` },
      { status: 400 }
    );
  }

  const appUrl = new URL(request.url).origin;

  try {
    const mollie = await getMollieClient();
    const payment = await mollie.payments.create({
      amount: {
        currency: booking.service.currency.toUpperCase(),
        value: (booking.service.priceCents / 100).toFixed(2),
      },
      description: booking.service.name,
      redirectUrl: `${appUrl}/book-and-pay/confirmed?booking=${booking.id}`,
      webhookUrl: `${appUrl}/api/webhooks/mollie`,
      metadata: { bookingId: booking.id },
    });

    const checkoutUrl = payment.getCheckoutUrl();

    await prisma.booking.update({
      where: { id: booking.id },
      data: { molliePaymentId: payment.id, mollieCheckoutUrl: checkoutUrl },
    });

    const emailSent = checkoutUrl ? await sendBookingConfirmationEmail(booking.id, checkoutUrl) : false;

    return NextResponse.json({ url: checkoutUrl, emailSent });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create payment link.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
