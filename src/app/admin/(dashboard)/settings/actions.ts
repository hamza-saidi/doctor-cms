"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

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
