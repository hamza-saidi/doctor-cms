"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, Users, MessageCircle, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Photo from "@/components/Photo";
import ImagePlaceholder from "@/components/ImagePlaceholder";

// Falls back to ImagePlaceholder / a generic heart icon for any service
// without an entry here (e.g. a new one added from the admin panel), so
// this only needs updating once real photography/iconography exists for it.
// Keyed by the English Prisma slug regardless of locale — see `imageKey`
// on CarouselService for how the ar/fi pages (whose display slugs are
// translated, not English) still resolve into this map.
const serviceImages: Record<string, string> = {
  consultation: "/images/consultation-room.jpg",
  therapy: "/images/therapy-room-helsinki.jpg",
  neuropsychology: "/images/neuropsychology-assessment.jpg",
};

const serviceIcons: Record<string, LucideIcon> = {
  consultation: MessageCircle,
  therapy: Heart,
  "peer-group": Users,
  neuropsychology: Stethoscope,
};

export type CarouselService = {
  slug: string;
  // English Prisma slug, only needed when `slug` itself is translated (ar/fi
  // pages) and therefore can't be used to look up serviceImages/serviceIcons
  // above. Defaults to `slug` when omitted (the English page's own case).
  imageKey?: string;
  name: string;
  shortDescription: string;
  duration: string;
  fee: string;
  status: string;
};

type Locale = "en" | "ar" | "fi";

// Locale text lives here (not passed in as props) because this component is
// a Client Component ("use client") and the ar/fi pages that use it are
// Server Components — functions can't cross that boundary as props, so a
// plain serializable `locale` string is the only thing that can travel
// from the server component down into this one.
const chrome: Record<
  Locale,
  {
    hrefBase: string;
    viewDetails: (name: string) => string;
    registerInterest: string;
    comingSoon: string;
    imageAlt: (name: string, comingSoon: boolean) => string;
  }
> = {
  en: {
    hrefBase: "/our-services",
    viewDetails: (name) => `View ${name} Details`,
    registerInterest: "Register Interest",
    comingSoon: "COMING SOON",
    imageAlt: (name, comingSoon) =>
      `${name} at WellSight, Helsinki${comingSoon ? " — coming soon" : ""}`,
  },
  ar: {
    hrefBase: "/ar/our-services",
    viewDetails: (name) => `عرض تفاصيل ${name}`,
    registerInterest: "سجّل اهتمامك",
    comingSoon: "قيد التطوير",
    imageAlt: (name, comingSoon) =>
      `${name} في عيادة WellSight بهلسنكي${comingSoon ? " — قيد التطوير" : ""}`,
  },
  fi: {
    hrefBase: "/fi/our-services",
    viewDetails: (name) => `Katso ${name.toLowerCase()}`,
    registerInterest: "Ilmoita kiinnostuksesta",
    comingSoon: "KEHITTEILLÄ",
    imageAlt: (name, comingSoon) =>
      `${name} WellSightin vastaanotolla, Helsinki${comingSoon ? " — kehitteillä" : ""}`,
  },
};

// Services all stay on one row — as more get added from the admin panel,
// wrapping into a lopsided grid stops looking intentional. Scrolling
// natively handles touch swipe on mobile; the arrow buttons are a desktop
// affordance since drag-to-scroll isn't always obvious with a mouse.
export default function ServiceCarousel({
  services,
  locale = "en",
}: {
  services: CarouselService[];
  locale?: Locale;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = chrome[locale];

  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {services.map((service) => {
          const key = service.imageKey ?? service.slug;
          const Icon = serviceIcons[key] ?? Heart;
          const image = serviceImages[key];
          const comingSoon = service.status === "comingSoon";
          return (
            <div
              key={service.slug}
              className={`relative flex-shrink-0 w-[85%] sm:w-[360px] snap-start bg-surface-container-lowest rounded-xl overflow-hidden service-card-shadow flex flex-col group transition-all duration-500 hover:translate-y-[-8px] ${
                comingSoon ? "" : "service-card-hover"
              }`}
            >
              {comingSoon && (
                <div className="absolute inset-0 bg-surface-container-highest/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-8 text-center">
                  <div className="bg-primary/90 text-white px-4 py-1 rounded-full text-xs text-label-lg mb-4">
                    {t.comingSoon}
                  </div>
                  <h3 className="font-display text-headline-sm text-primary mb-3 opacity-40">
                    {service.name}
                  </h3>
                </div>
              )}
              {image ? (
                <Photo
                  src={image}
                  alt={t.imageAlt(service.name, comingSoon)}
                  className={`h-48 md:h-64 w-full ${comingSoon ? "grayscale-[0.5] opacity-50" : ""}`}
                />
              ) : (
                <ImagePlaceholder
                  label={service.name}
                  icon={Icon}
                  className={`h-48 md:h-64 w-full ${comingSoon ? "grayscale-[0.5] opacity-50" : ""}`}
                />
              )}
              <div className={`p-6 md:p-8 flex-grow ${comingSoon ? "opacity-50" : ""}`}>
                {!comingSoon && (
                  <h3 className="font-display text-headline-sm text-primary mb-3">
                    {service.name}
                  </h3>
                )}
                <p className={`text-on-surface-variant text-body-md ${comingSoon ? "mb-8" : "mb-2"}`}>
                  {service.shortDescription}
                </p>
                {!comingSoon && (
                  <p className="text-on-surface-variant/80 text-sm">
                    {service.duration} · {service.fee}
                  </p>
                )}
              </div>
              <div className="p-6 md:p-8 pt-0 mt-auto">
                {comingSoon ? (
                  <button
                    className="w-full border-2 border-outline text-outline py-3 rounded-full text-label-lg cursor-not-allowed"
                    disabled
                  >
                    {t.registerInterest}
                  </button>
                ) : (
                  <Link
                    href={`${t.hrefBase}#${service.slug}`}
                    className="block w-full text-center py-3 rounded-full text-label-lg border-2 border-primary text-primary hover:bg-primary hover:text-on-primary transition-all duration-500 hover:scale-[1.02]"
                  >
                    {t.viewDetails(service.name)}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {services.length > 3 && (
        <>
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            aria-label="Scroll services left"
            className="hidden md:flex items-center justify-center absolute top-24 md:top-32 -translate-y-1/2 -left-5 w-11 h-11 rounded-full bg-surface-container-lowest service-card-shadow text-primary hover:scale-110 transition-transform"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            aria-label="Scroll services right"
            className="hidden md:flex items-center justify-center absolute top-24 md:top-32 -translate-y-1/2 -right-5 w-11 h-11 rounded-full bg-surface-container-lowest service-card-shadow text-primary hover:scale-110 transition-transform"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}
    </div>
  );
}
