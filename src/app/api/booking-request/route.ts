import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, phone, slotId, serviceId, format, message } = body ?? {};

  // Format is purely informational (which room to expect the client in) —
  // it no longer has to match the format tag on whichever slot they picked,
  // so it's always required as its own field regardless of path.
  if (!name || !email || !phone || !format) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    if (slotId) {
      // A slot only locks once the admin confirms a booking for it (see
      // updateBookingStatus) — a fresh request just reserves nothing yet, so
      // several clients can legitimately request the same slot in parallel.
      // Only reject here if it's already confirmed-booked by someone else.
      const booking = await prisma.$transaction(async (tx) => {
        const slot = await tx.availabilitySlot.findUnique({ where: { id: slotId } });
        if (!slot || slot.isBooked) {
          throw new Error("SLOT_TAKEN");
        }

        return tx.booking.create({
          data: {
            name,
            email,
            phone,
            serviceId: slot.serviceId,
            slotId: slot.id,
            format,
            message: message || null,
          },
        });
      });

      return NextResponse.json({ ok: true, bookingId: booking.id });
    }

    if (!serviceId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: { name, email, phone, serviceId, format, message: message || null },
    });

    return NextResponse.json({ ok: true, bookingId: booking.id });
  } catch (err) {
    if (err instanceof Error && err.message === "SLOT_TAKEN") {
      return NextResponse.json(
        { error: "That slot was just booked by someone else — please pick another." },
        { status: 409 }
      );
    }
    throw err;
  }
}
