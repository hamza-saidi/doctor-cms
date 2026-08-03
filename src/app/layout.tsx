import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Naskh_Arabic, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyBookCta from "@/components/StickyBookCta";
import WhatsAppButton from "@/components/WhatsAppButton";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import { business } from "@/lib/content";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Arabic script isn't covered by Playfair Display/Inter — loaded site-wide
// but only applied on /ar routes via the [dir="rtl"] override in globals.css.
const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-naskh-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-sans-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wellsightcare.com"),
  // Absolute (not templated): each page's title comes verbatim from
  // /admin/seo so what the client types is exactly what appears — no
  // hidden "%s | WellSight" concatenation to account for.
  title: `${business.name} | Psychologist in Helsinki — Therapy & Consultation`,
  description:
    "Private psychological practice in Helsinki offering therapy, consultation, and family sessions in English and Arabic — in person or online.",
  openGraph: {
    siteName: business.name,
    type: "website",
    locale: "en_FI",
  },
  alternates: {
    languages: {
      en: "https://www.wellsightcare.com",
      ar: "https://www.wellsightcare.com/ar",
      fi: "https://www.wellsightcare.com/fi",
    },
  },
};

// Blocking inline script (not a useEffect) so <html lang/dir> is correct
// before first paint on /ar routes — no FOUC, and unlike reading the
// pathname via headers() server-side, this doesn't force every page in the
// site out of static rendering.
const setLangDirScript = `
(function () {
  var p = window.location.pathname;
  var locale = p === "/ar" || p.indexOf("/ar/") === 0 ? "ar"
    : p === "/fi" || p.indexOf("/fi/") === 0 ? "fi"
    : "en";
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // The inline script below intentionally rewrites lang/dir before
      // hydration for /fi and /ar routes — expected divergence, not a bug.
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} ${notoNaskhArabic.variable} ${notoSansArabic.variable} scroll-smooth h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: setLangDirScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-primary overflow-x-hidden">
        <LocalBusinessJsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyBookCta />
        <WhatsAppButton />
      </body>
    </html>
  );
}
