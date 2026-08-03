import { google } from "googleapis";
import { prisma } from "@/lib/prisma";
import { getIntegrationSettings } from "@/lib/settings";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/userinfo.email",
];

// Client ID/Secret are entered once through /admin/settings, not .env — the
// redirect URI is derived from the request itself so nobody has to type it.
async function getOAuthClient(redirectUri?: string) {
  const settings = await getIntegrationSettings();
  if (!settings?.googleClientId || !settings?.googleClientSecret) {
    throw new Error(
      "Google Calendar isn't connected yet — add the Client ID and Client Secret under Settings in the admin panel."
    );
  }

  return new google.auth.OAuth2(settings.googleClientId, settings.googleClientSecret, redirectUri);
}

export async function getGoogleAuthUrl(redirectUri: string) {
  const client = await getOAuthClient(redirectUri);
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // ensures a refresh_token is issued even on reconnect
    scope: SCOPES,
  });
}

export async function connectGoogleCalendarFromCode(code: string, redirectUri: string) {
  const client = await getOAuthClient(redirectUri);
  const { tokens } = await client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error(
      "Google did not return a refresh token — disconnect any prior access at https://myaccount.google.com/permissions and try connecting again."
    );
  }

  client.setCredentials(tokens);
  const oauth2 = google.oauth2({ auth: client, version: "v2" });
  const { data: userInfo } = await oauth2.userinfo.get();

  await prisma.googleCalendarConnection.upsert({
    where: { id: 1 },
    update: {
      accountEmail: userInfo.email ?? "unknown",
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token ?? null,
      accessTokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    },
    create: {
      id: 1,
      accountEmail: userInfo.email ?? "unknown",
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token ?? null,
      accessTokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    },
  });
}

export async function getConnectedCalendarClient() {
  const connection = await prisma.googleCalendarConnection.findUnique({ where: { id: 1 } });
  if (!connection) return null;

  // No redirect URI needed here — refreshing an access token from a stored
  // refresh token doesn't go through the browser redirect step again.
  const client = await getOAuthClient();
  client.setCredentials({ refresh_token: connection.refreshToken });

  return { calendar: google.calendar({ version: "v3", auth: client }), connection };
}

export async function createCalendarEvent(params: {
  summary: string;
  description?: string;
  startsAt: Date;
  endsAt: Date;
  attendeeEmail: string;
}) {
  const connected = await getConnectedCalendarClient();
  if (!connected) return null;

  const { data } = await connected.calendar.events.insert({
    calendarId: connected.connection.calendarId,
    requestBody: {
      summary: params.summary,
      description: params.description,
      start: { dateTime: params.startsAt.toISOString() },
      end: { dateTime: params.endsAt.toISOString() },
      attendees: [{ email: params.attendeeEmail }],
    },
  });

  return data.id ?? null;
}

// Gmail's raw send format is a base64url-encoded RFC 2822 message — no
// separate email service needed, since this reuses the same connected
// Google account (and its refresh token) as Calendar sync above.
function buildRawEmail(params: { to: string; from: string; subject: string; text: string }) {
  const message = [
    `To: ${params.to}`,
    `From: ${params.from}`,
    `Subject: ${params.subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "",
    params.text,
  ].join("\r\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Sends from whichever Google account is connected under /admin/settings.
// Returns false (never throws) if nothing is connected — callers treat
// email as a nice-to-have alongside the payment link, not a hard dependency.
export async function sendEmail(params: { to: string; subject: string; text: string }): Promise<boolean> {
  const connection = await prisma.googleCalendarConnection.findUnique({ where: { id: 1 } });
  if (!connection) return false;

  const client = await getOAuthClient();
  client.setCredentials({ refresh_token: connection.refreshToken });
  const gmail = google.gmail({ version: "v1", auth: client });

  const raw = buildRawEmail({ ...params, from: connection.accountEmail });
  await gmail.users.messages.send({ userId: "me", requestBody: { raw } });
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

// Puts a confirmed booking on the connected Google Calendar. No-ops quietly
// if there's no linked slot (nothing to schedule) or no calendar connected
// yet — confirming a booking should never fail because of this.
export async function syncBookingToGoogleCalendar(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true, slot: true },
  });

  if (!booking || booking.googleEventId || !booking.slot) return;

  try {
    const eventId = await createCalendarEvent({
      summary: `${booking.service.name} — ${booking.name}`,
      description: [`Client: ${booking.name} (${booking.email})`, booking.message]
        .filter(Boolean)
        .join("\n"),
      startsAt: booking.slot.startsAt,
      endsAt: booking.slot.endsAt,
      attendeeEmail: booking.email,
    });

    if (eventId) {
      await prisma.booking.update({ where: { id: bookingId }, data: { googleEventId: eventId } });
    }
  } catch (err) {
    console.error("Failed to sync booking to Google Calendar:", err);
  }
}
