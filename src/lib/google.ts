import { google } from "googleapis";
import { prisma } from "@/lib/prisma";
import { getIntegrationSettings } from "@/lib/settings";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
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
