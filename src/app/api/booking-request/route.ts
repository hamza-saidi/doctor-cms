import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, slotId, serviceId, format, message } = body ?? {};

  if (!name || !email) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    if (slotId) {
      const booking = await prisma.$transaction(async (tx) => {
        const slot = await tx.availabilitySlot.findUnique({ where: { id: slotId } });
        if (!slot || slot.isBooked) {
          throw new Error("SLOT_TAKEN");
        }

        await tx.availabilitySlot.update({
          where: { id: slotId },
          data: { isBooked: true },
        });

        return tx.booking.create({
          data: {
            name,
            email,
            serviceId: slot.serviceId,
            slotId: slot.id,
            format: slot.format,
            message: message || null,
          },
        });
      });

      return NextResponse.json({ ok: true, bookingId: booking.id });
    }

    if (!serviceId || !format) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: { name, email, serviceId, format, message: message || null },
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
