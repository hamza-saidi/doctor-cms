import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const baseUrl = "https://www.wellsightcare.com";

const pages = [
  { slug: "", priority: 1, changeFrequency: "monthly" as const },
  { slug: "/about-us", priority: 0.8, changeFrequency: "monthly" as const },
  { slug: "/our-services", priority: 0.9, changeFrequency: "monthly" as const },
  { slug: "/how-we-meet", priority: 0.7, changeFrequency: "yearly" as const },
  { slug: "/firstsession", priority: 0.7, changeFrequency: "yearly" as const },
  { slug: "/book-and-pay", priority: 0.9, changeFrequency: "yearly" as const },
];

function urlFor(locale: "en" | "fi" | "ar", slug: string) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  return `${baseUrl}${prefix}${slug}` || baseUrl;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const localizedEntries = pages.flatMap((page) =>
    (["en", "fi", "ar"] as const).map((locale) => ({
      url: urlFor(locale, page.slug),
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: locale === "en" ? page.priority : page.priority * 0.9,
      alternates: {
        languages: {
          en: urlFor("en", page.slug),
          fi: urlFor("fi", page.slug),
          ar: urlFor("ar", page.slug),
        },
      },
    }))
  );

  // Blog is English-only for now — no fi/ar alternates.
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    select: { slug: true, updatedAt: true },
  });

  const blogEntries: MetadataRoute.Sitemap = [
    {
      url: urlFor("en", "/blog"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...posts.map((post) => ({
      url: urlFor("en", `/blog/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];

  return [...localizedEntries, ...blogEntries];
}
