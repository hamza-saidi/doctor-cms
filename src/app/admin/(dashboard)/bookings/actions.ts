"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { syncBookingToGoogleCalendar } from "@/lib/google";

export async function updateBookingStatus(id: string, formData: FormData) {
  const status = String(formData.get("status") ?? "pending");

  const booking = await prisma.booking.update({
    where: { id },
    data: { status },
  });

  // Free the slot back up if a booking is cancelled.
  if (status === "cancelled" && booking.slotId) {
    await prisma.availabilitySlot.update({
      where: { id: booking.slotId },
      data: { isBooked: false },
    });
  }

  if (status === "confirmed") {
    await syncBookingToGoogleCalendar(id);
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/availability");
}
