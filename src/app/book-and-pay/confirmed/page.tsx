import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Payment Confirmed",
  robots: { index: false },
};

// Mollie redirects here after every outcome (paid, cancelled, or failed) —
// unlike Stripe, which only ever hit this page on success. The booking's own
// `paid` flag (set by the webhook once Mollie confirms payment) is the
// source of truth, so it's looked up rather than assuming success.
export default async function BookingConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) {
  const { booking: bookingId } = await searchParams;
  const booking = bookingId
    ? await prisma.booking.findUnique({ where: { id: bookingId }, select: { paid: true } })
    : null;

  if (booking?.paid) {
    return (
      <section className="py-24 px-4 md:px-16 max-w-xl mx-auto text-center">
        <CheckCircle2 className="text-primary mx-auto mb-6" size={48} />
        <h1 className="font-display text-headline-md text-primary mb-4">Payment received</h1>
        <p className="text-on-surface-variant text-body-lg mb-8">
          Thank you — your session is confirmed. You&apos;ll receive an email with the details
          shortly.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500"
        >
          Back to home
        </Link>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 md:px-16 max-w-xl mx-auto text-center">
      <Circle className="text-on-surface-variant mx-auto mb-6" size={48} />
      <h1 className="font-display text-headline-md text-primary mb-4">Payment not completed</h1>
      <p className="text-on-surface-variant text-body-lg mb-8">
        We didn&apos;t receive a payment for this booking. You can try again from the payment
        link in your confirmation email, or reach out if you need help.
      </p>
      <Link
        href="/"
        className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500"
      >
        Back to home
      </Link>
    </section>
  );
}
