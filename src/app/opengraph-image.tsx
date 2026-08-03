import { ImageResponse } from "next/og";
import { business } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site-wide default OG image — fixes the audit finding that
// wellsightcare.com ships no og:image at all. Individual pages can override
// this later with their own opengraph-image.tsx.
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #183829 0%, #2f4f3f 100%)",
          color: "#fcf9f8",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 600, display: "flex" }}>{business.name}</div>
        <div style={{ fontSize: 32, marginTop: 24, opacity: 0.85, display: "flex", maxWidth: 820 }}>
          {business.tagline}
        </div>
        <div style={{ fontSize: 24, marginTop: 48, opacity: 0.7, display: "flex" }}>
          Psychologist in Helsinki · Therapy & Consultation
        </div>
      </div>
    ),
    { ...size }
  );
}
