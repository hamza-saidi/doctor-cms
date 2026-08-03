export const locales = ["en", "fi", "ar"] as const;
export type Locale = (typeof locales)[number];

export function localeFromPathname(pathname: string): Locale {
  if (pathname === "/fi" || pathname.startsWith("/fi/")) return "fi";
  if (pathname === "/ar" || pathname.startsWith("/ar/")) return "ar";
  return "en";
}

export function localePrefix(locale: Locale): string {
  return locale === "en" ? "" : `/${locale}`;
}

export const localeLabels: Record<Locale, string> = {
  en: "English",
  fi: "Suomi",
  ar: "العربية",
};

// Strips the current locale prefix off a pathname, leaving the page's
// "slug" (e.g. "/fi/our-services" -> "/our-services", "/ar" -> "/").
export function stripLocalePrefix(pathname: string): string {
  const locale = localeFromPathname(pathname);
  if (locale === "en") return pathname || "/";
  const rest = pathname.slice(`/${locale}`.length);
  return rest || "/";
}

// Builds the equivalent URL for the same page in another locale.
export function buildLocalizedPath(pathname: string, targetLocale: Locale): string {
  const slug = stripLocalePrefix(pathname);
  const prefix = localePrefix(targetLocale);
  if (slug === "/") return prefix || "/";
  return `${prefix}${slug}`;
}

type Dict = {
  dir: "ltr" | "rtl";
  bookCta: string;
  ourApproach: string;
  nav: { href: string; label: string }[];
  locationLabel: string;
  exploreLabel: string;
  contactLabel: string;
  privacyLabel: string;
  emergencyNotice: string;
  license: string;
  allRightsReserved: string;
  whatsappMessage: string;
  whatsappLabel: string;
};

// Real nav/footer strings carried over from the live site's own fi/ar
// translations (Weglot-based) — not freshly machine-translated here.
export const dictionaries: Record<Locale, Dict> = {
  en: {
    dir: "ltr",
    bookCta: "Book a Session",
    ourApproach: "Our Approach",
    nav: [
      { href: "/about-us", label: "Our Approach" },
      { href: "/our-services", label: "Services" },
      { href: "/how-we-meet", label: "How We Meet" },
      { href: "/firstsession", label: "Starting Therapy" },
    ],
    locationLabel: "Location",
    exploreLabel: "Explore",
    contactLabel: "Contact",
    privacyLabel: "Privacy Policy",
    emergencyNotice:
      "We do not provide emergency or crisis services – in an emergency, please call 112.",
    license: "Licensed Psychologist (Valvira)",
    allRightsReserved: "All rights reserved.",
    whatsappMessage: "Hi! I'd like to know more about booking a session.",
    whatsappLabel: "Chat on WhatsApp",
  },
  fi: {
    dir: "ltr",
    bookCta: "Varaa aika",
    ourApproach: "Meistä",
    nav: [
      { href: "/about-us", label: "Meistä" },
      { href: "/our-services", label: "Palvelumme" },
      { href: "/how-we-meet", label: "Kuinka tapaamme?" },
      { href: "/firstsession", label: "Terapian aloittaminen" },
    ],
    locationLabel: "Sijainti",
    exploreLabel: "Tutustu",
    contactLabel: "Ota yhteyttä",
    privacyLabel: "Tietosuoja",
    emergencyNotice: "Emme tarjoa akuutin kriisin palveluja – hätätilanteessa soita 112.",
    license: "Laillistettu psykologi (Valvira)",
    allRightsReserved: "Kaikki oikeudet pidätetään.",
    whatsappMessage: "Hei! Haluaisin tietää lisää ajan varaamisesta.",
    whatsappLabel: "Keskustele WhatsAppissa",
  },
  ar: {
    dir: "rtl",
    bookCta: "احجز جلستك",
    ourApproach: "نبذة عنا",
    nav: [
      { href: "/about-us", label: "نبذة عنا" },
      { href: "/our-services", label: "خدماتنا" },
      { href: "/how-we-meet", label: "كيف نلتقي؟" },
      { href: "/firstsession", label: "بدء العلاج" },
    ],
    locationLabel: "الموقع",
    exploreLabel: "استكشف",
    contactLabel: "اتصل بنا",
    privacyLabel: "سياسة الخصوصية",
    emergencyNotice: "نحن لا نقدم خدمات الطوارئ أو خدمات الأزمات - في حالات الطوارئ، يُرجى الاتصال بالرقم 112.",
    license: "أخصائية نفسية مرخصة (فالفيرا)",
    allRightsReserved: "جميع الحقوق محفوظة.",
    whatsappMessage: "مرحبًا! أرغب في معرفة المزيد عن حجز جلسة.",
    whatsappLabel: "تواصل عبر واتساب",
  },
};
