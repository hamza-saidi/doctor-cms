import type { MetadataRoute } from "next";

// Unlike the Squarespace default (which silently blocks ClaudeBot, GPTBot,
// and other AI crawlers), this allows them deliberately — AI answer engines
// are a real discovery channel for health/wellness content. Revisit if the
// client prefers to opt out.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: "https://www.wellsightcare.com/sitemap.xml",
  };
}
