"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const ADDRESS = "Lapinrinne 1, 00180 Helsinki, Finland";

// Keyless Google Maps embed — no API key/account needed, unlike the
// official Maps Embed API. Good enough for a single static pin.
export default function LocationMap({
  locale = "en",
  className = "",
}: {
  locale?: Locale;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&hl=${locale}&output=embed`;

  return (
    <div className={`relative overflow-hidden bg-surface-container-high ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <MapPin className="text-outline" size={28} strokeWidth={1.5} />
        </div>
      )}
      <iframe
        src={src}
        title="WellSight — Lapinrinne 1, Helsinki"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
        style={{ border: 0 }}
        className={`w-full h-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
