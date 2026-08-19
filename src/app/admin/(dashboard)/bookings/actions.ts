"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { syncBookingToGoogleCalendar } from "@/lib/google";
import { sendEmail } from "@/lib/email";

// A slot only locks (isBooked: true) once a booking for it reaches one of
// these statuses — a fresh "pending" request reserves nothing, so several
// clients can legitimately request the same slot before the admin picks
// one to confirm.
const SLOT_LOCKING_STATUSES = new Set(["confirmed", "completed", "no-show"]);

export async function updateBookingStatus(
  id: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string } | undefined> {
  const status = String(formData.get("status") ?? "pending");

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return { error: "Booking not found." };

  const locksSlot = SLOT_LOCKING_STATUSES.has(status);

  if (booking.slotId && locksSlot) {
    // Since multiple pending requests can exist for the same slot, only one
    // booking can actually hold it — refuse to confirm/complete this one if
    // another booking for the same slot already has it locked.
    const conflict = await prisma.booking.findFirst({
      where: {
        slotId: booking.slotId,
        id: { not: id },
        status: { in: Array.from(SLOT_LOCKING_STATUSES) },
      },
    });
    if (conflict) {
      return {
        error: `This slot is already ${conflict.status} for another booking (${conflict.name}). Cancel that one first if you want this one instead.`,
      };
    }
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status },
  });

  if (updated.slotId) {
    await prisma.availabilitySlot.update({
      where: { id: updated.slotId },
      data: { isBooked: locksSlot },
    });
  }

  if (status === "confirmed") {
    await syncBookingToGoogleCalendar(id);
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/availability");
}

// Lets the admin reply to a client who requested a booking (questions,
// scheduling back-and-forth, anything not covered by the automated payment
// link email) without leaving the dashboard.
export async function sendClientEmail(
  bookingId: string,
  _prevState: { success?: boolean; error?: string } | undefined,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!subject || !message) {
    return { error: "Subject and message are both required." };
  }

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    return { error: "Booking not found." };
  }

  const sent = await sendEmail({ to: booking.email, subject, text: message });
  if (!sent) {
    return { error: "Email failed to send — check SMTP settings under Settings." };
  }

  return { success: true };
}
