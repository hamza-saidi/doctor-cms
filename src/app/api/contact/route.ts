import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { firstName, lastName, email, message } = body ?? {};

  if (!firstName || !lastName || !email) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  await prisma.contactMessage.create({
    data: { firstName, lastName, email, message: message || null },
  });

  // TODO: also notify by email (e.g. Resend, Postmark) once hosting is
  // finalized — messages are stored and visible under /admin/messages for now.

  return NextResponse.json({ ok: true });
}
