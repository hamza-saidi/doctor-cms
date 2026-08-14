import { CalendarCheck, CalendarPlus, CheckCircle2, Circle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { disconnectGoogleCalendar, saveMollieSettings, saveGoogleSettings, saveSmtpSettings } from "./actions";

const inputClass =
  "w-full border border-outline-variant focus:border-primary rounded-lg p-2.5 bg-surface-container-lowest text-sm";
const labelClass = "text-label-md text-on-surface-variant uppercase tracking-widest";

function ConfiguredBadge({ configured }: { configured: boolean }) {
  return configured ? (
    <span className="flex items-center gap-1.5 text-primary text-xs">
      <CheckCircle2 size={14} /> Configured
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-on-surface-variant/60 text-xs">
      <Circle size={14} /> Not set
    </span>
  );
}

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string }>;
}) {
  const { connected, error } = await searchParams;
  const [connection, settings] = await Promise.all([
    prisma.googleCalendarConnection.findUnique({ where: { id: 1 } }),
    prisma.integrationSettings.findUnique({ where: { id: 1 } }),
  ]);

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="font-display text-headline-md text-primary">Settings</h1>

      {connected && (
        <div className="bg-primary-container text-on-primary-container rounded-lg p-4 text-sm">
          Google account connected successfully — confirmed bookings will now sync to this
          calendar.
        </div>
      )}
      {error && (
        <div className="bg-error-container text-on-error-container rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {/* Mollie */}
      <div className="bg-surface-container-lowest rounded-xl p-6 service-card-shadow space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-headline-sm text-primary">Mollie (online payments)</h2>
          <ConfiguredBadge configured={Boolean(settings?.mollieApiKey)} />
        </div>
        <p className="text-on-surface-variant text-sm">
          From your Mollie Dashboard → Developers → API keys. Mollie is notified of payment
          updates automatically at this site&apos;s <code>/api/webhooks/mollie</code> — no
          separate webhook secret to configure.
        </p>
        <form action={saveMollieSettings} className="space-y-3">
          <div className="space-y-1">
            <label className={labelClass}>API key</label>
            <input
              name="mollieApiKey"
              type="password"
              placeholder={settings?.mollieApiKey ? "•••••••••••••••• (leave blank to keep)" : "live_…"}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
          >
            Save
          </button>
        </form>
      </div>

      {/* Google Calendar */}
      <div className="bg-surface-container-lowest rounded-xl p-6 service-card-shadow space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-headline-sm text-primary">Google Calendar</h2>
          <ConfiguredBadge
            configured={Boolean(settings?.googleClientId && settings?.googleClientSecret)}
          />
        </div>
        <p className="text-on-surface-variant text-sm">
          Client ID/Secret come from a Google Cloud OAuth client (set up once by your developer).
          Once saved, connect your own Google account below to sync confirmed bookings to your
          calendar. Booking confirmation emails are sent separately — see Email below.
        </p>
        <form action={saveGoogleSettings} className="space-y-3">
          <div className="space-y-1">
            <label className={labelClass}>Client ID</label>
            <input
              name="googleClientId"
              type="text"
              placeholder={settings?.googleClientId ? "•••••••••••••••• (leave blank to keep)" : "….apps.googleusercontent.com"}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Client Secret</label>
            <input
              name="googleClientSecret"
              type="password"
              placeholder={settings?.googleClientSecret ? "•••••••••••••••• (leave blank to keep)" : "GOCSPX-…"}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
          >
            Save
          </button>
        </form>

        <div className="pt-2 border-t border-outline-variant/50">
          {connection ? (
            <div className="flex items-center justify-between gap-4 pt-4">
              <p className="flex items-center gap-2 text-primary text-sm">
                <CalendarCheck size={18} />
                Connected as {connection.accountEmail}
              </p>
              <form action={disconnectGoogleCalendar}>
                <button type="submit" className="text-error text-sm hover:underline">
                  Disconnect
                </button>
              </form>
            </div>
          ) : (
            <a
              href="/api/admin/google/connect"
              className="inline-flex items-center gap-2 mt-4 bg-primary text-on-primary px-5 py-2.5 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
            >
              <CalendarPlus size={16} />
              Connect Google Account
            </a>
          )}
        </div>
      </div>

      {/* Email (SMTP) */}
      <div className="bg-surface-container-lowest rounded-xl p-6 service-card-shadow space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-headline-sm text-primary">Email</h2>
          <ConfiguredBadge
            configured={Boolean(
              settings?.smtpHost && settings?.smtpPort && settings?.smtpUser && settings?.smtpPassword
            )}
          />
        </div>
        <p className="text-on-surface-variant text-sm">
          Booking confirmations and payment links are sent from this mailbox (e.g. your hosting
          provider&apos;s email, like <code>info@wellsight.fi</code>) — get the Host/Port from your
          email host&apos;s SMTP settings page. The password is stored securely and never shown
          again once saved.
        </p>
        <form action={saveSmtpSettings} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={labelClass}>Host</label>
              <input
                name="smtpHost"
                type="text"
                placeholder={settings?.smtpHost ?? "mail.wellsightcare.com"}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Port</label>
              <input
                name="smtpPort"
                type="number"
                placeholder={settings?.smtpPort ? String(settings.smtpPort) : "587"}
                className={inputClass}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Email address</label>
            <input
              name="smtpUser"
              type="email"
              placeholder={settings?.smtpUser ?? "info@wellsight.fi"}
              className={inputClass}
            />
            <p className="text-on-surface-variant/70 text-xs">
              Used as both the login and the &ldquo;From&rdquo; address clients see.
            </p>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Password</label>
            <input
              name="smtpPassword"
              type="password"
              placeholder={settings?.smtpPassword ? "•••••••••••••••• (leave blank to keep)" : "mailbox password"}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
