import { NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google";

function redirectUriFor(request: Request) {
  return `${new URL(request.url).origin}/api/admin/google/callback`;
}

export async function GET(request: Request) {
  try {
    const authUrl = await getGoogleAuthUrl(redirectUriFor(request));
    return NextResponse.redirect(authUrl);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Google Calendar isn't configured.";
    const url = new URL("/admin/settings", request.url);
    url.searchParams.set("error", message);
    return NextResponse.redirect(url);
  }
}
