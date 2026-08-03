import createMollieClient, { type MollieClient } from "@mollie/api-client";
import { getIntegrationSettings } from "@/lib/settings";

// The API key is entered once through /admin/settings, not .env — the
// client manages her own Mollie account without ever touching a config file.
export async function getMollieClient(): Promise<MollieClient> {
  const settings = await getIntegrationSettings();
  if (!settings?.mollieApiKey) {
    throw new Error(
      "Mollie isn't connected yet — add the API Key under Settings in the admin panel."
    );
  }
  return createMollieClient({ apiKey: settings.mollieApiKey });
}
