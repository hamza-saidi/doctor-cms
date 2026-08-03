import { NextResponse } from "next/server";
import { connectGoogleCalendarFromCode } from "@/lib/google";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const settingsUrl = new URL("/admin/settings", origin);

  if (!code) {
    settingsUrl.searchParams.set("error", "Google did not return an authorization code.");
    return NextResponse.redirect(settingsUrl);
  }

  try {
    await connectGoogleCalendarFromCode(code, `${origin}/api/admin/google/callback`);
    settingsUrl.searchParams.set("connected", "1");
  } catch (err) {
    settingsUrl.searchParams.set(
      "error",
      err instanceof Error ? err.message : "Failed to connect Google Calendar."
    );
  }

  return NextResponse.redirect(settingsUrl);
}
