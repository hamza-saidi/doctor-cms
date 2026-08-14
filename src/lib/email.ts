import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { getIntegrationSettings } from "@/lib/settings";

// Outgoing mail goes through a regular hosting mailbox (e.g. Plesk), not
// Gmail — the mailbox address doubles as both the SMTP username and the
// "From" address, entered once under Settings in the admin panel.
async function getSmtpTransport() {
  const settings = await getIntegrationSettings();
  if (!settings?.smtpHost || !settings?.smtpPort || !settings?.smtpUser || !settings?.smtpPassword) {
    return null;
  }

  return {
    transport: nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpPort === 465, // 465 = implicit TLS, 587/others = STARTTLS
      auth: { user: settings.smtpUser, pass: settings.smtpPassword },
    }),
    from: settings.smtpUser,
  };
}

// Returns false (never throws) if SMTP isn't configured yet — callers treat
// email as a nice-to-have alongside the payment link, not a hard dependency.
export async function sendEmail(params: { to: string; subject: string; text: string }): Promise<boolean> {
  const smtp = await getSmtpTransport();
  if (!smtp) return false;

  await smtp.transport.sendMail({ from: smtp.from, to: params.to, subject: params.subject, text: params.text });
  return true;
}

const helsinkiDateTime = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Helsinki",
});

// Sent when the admin generates a Mollie payment link for a booking — the
// "doctor checks availability and sends the confirmation" step, done
// automatically instead of by hand.
export async function sendBookingConfirmationEmail(bookingId: string, checkoutUrl: string): Promise<boolean> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true, slot: true },
  });
  if (!booking) return false;

  const lines = [
    `Hi ${booking.name},`,
    "",
    `Your ${booking.service.name.toLowerCase()} session (${booking.format}) is confirmed on our end.`,
  ];

  if (booking.slot) {
    lines.push(`Time: ${helsinkiDateTime.format(booking.slot.startsAt)} (Helsinki time)`);
  }

  lines.push(
    "",
    "To finish booking your spot, please complete payment using the secure link below:",
    checkoutUrl,
    "",
    "If you have any questions before then, just reply to this email.",
    "",
    "Best,",
    "WellSight"
  );

  try {
    return await sendEmail({
      to: booking.email,
      subject: `Your WellSight ${booking.service.name} booking — payment link inside`,
      text: lines.join("\n"),
    });
  } catch (err) {
    console.error("Failed to send booking confirmation email:", err);
    return false;
  }
}
