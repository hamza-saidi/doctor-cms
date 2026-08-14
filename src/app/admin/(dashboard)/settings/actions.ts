"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function disconnectGoogleCalendar() {
  await prisma.googleCalendarConnection.deleteMany();
  revalidatePath("/admin/settings");
}

function emptyToUndefined(value: FormDataEntryValue | null) {
  const str = String(value ?? "").trim();
  return str === "" ? undefined : str;
}

// Blank fields are left untouched (so re-saving one credential doesn't wipe
// another) — clearing a key is a separate explicit action.
export async function saveMollieSettings(formData: FormData) {
  await prisma.integrationSettings.upsert({
    where: { id: 1 },
    update: {
      mollieApiKey: emptyToUndefined(formData.get("mollieApiKey")),
    },
    create: {
      id: 1,
      mollieApiKey: emptyToUndefined(formData.get("mollieApiKey")),
    },
  });
  revalidatePath("/admin/settings");
}

export async function saveGoogleSettings(formData: FormData) {
  await prisma.integrationSettings.upsert({
    where: { id: 1 },
    update: {
      googleClientId: emptyToUndefined(formData.get("googleClientId")),
      googleClientSecret: emptyToUndefined(formData.get("googleClientSecret")),
    },
    create: {
      id: 1,
      googleClientId: emptyToUndefined(formData.get("googleClientId")),
      googleClientSecret: emptyToUndefined(formData.get("googleClientSecret")),
    },
  });
  revalidatePath("/admin/settings");
}

export async function saveSmtpSettings(formData: FormData) {
  const portRaw = emptyToUndefined(formData.get("smtpPort"));
  await prisma.integrationSettings.upsert({
    where: { id: 1 },
    update: {
      smtpHost: emptyToUndefined(formData.get("smtpHost")),
      smtpPort: portRaw ? Number(portRaw) : undefined,
      smtpUser: emptyToUndefined(formData.get("smtpUser")),
      smtpPassword: emptyToUndefined(formData.get("smtpPassword")),
    },
    create: {
      id: 1,
      smtpHost: emptyToUndefined(formData.get("smtpHost")),
      smtpPort: portRaw ? Number(portRaw) : undefined,
      smtpUser: emptyToUndefined(formData.get("smtpUser")),
      smtpPassword: emptyToUndefined(formData.get("smtpPassword")),
    },
  });
  revalidatePath("/admin/settings");
}

// The "Configured" badge only checks that fields are non-empty, not that
// the credentials actually work — this is the way to find out for real,
// without needing to run the whole booking flow. Sends to the mailbox's
// own address so success shows up directly in the inbox being tested.
export async function sendTestEmail() {
  const settings = await prisma.integrationSettings.findUnique({ where: { id: 1 } });
  if (!settings?.smtpHost || !settings?.smtpPort || !settings?.smtpUser || !settings?.smtpPassword) {
    redirect(`/admin/settings?emailTestError=${encodeURIComponent("Fill in and save all Email fields first.")}`);
  }

  let errorMessage: string | null = null;
  try {
    const sent = await sendEmail({
      to: settings.smtpUser,
      subject: "WellSight test email",
      text: "If you're reading this, your Email settings are working correctly.",
    });
    if (!sent) errorMessage = "SMTP isn't fully configured.";
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Failed to send test email.";
  }

  if (errorMessage) {
    redirect(`/admin/settings?emailTestError=${encodeURIComponent(errorMessage)}`);
  }
  redirect("/admin/settings?emailTestOk=1");
}
