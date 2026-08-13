"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mail, MapPin } from "lucide-react";
import { business } from "@/lib/content";
import { dictionaries, localePrefix, localeFromPathname } from "@/lib/i18n";

export default function Footer() {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPathname(pathname);
  const dict = dictionaries[locale];
  const prefix = localePrefix(locale);

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="w-full pt-16 md:pt-24 pb-8 md:pb-12 bg-surface-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 px-4 md:px-16 max-w-[1280px] mx-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-2 font-display text-headline-md text-primary">
            <Image src="/images/wellsight-logo.png" alt="" width={36} height={36} className="h-9 w-9" />
            {business.name}
          </div>
          <p className="text-on-surface-variant text-body-md opacity-80 max-w-xs">
            {business.tagline}
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-label-lg text-primary uppercase tracking-widest">
            {dict.locationLabel}
          </h4>
          <p className="text-on-surface-variant text-body-md">
            {business.address.street}
            <br />
            {business.address.postalCode} {business.address.city}, {business.address.country}
          </p>
          <div className="pt-4 space-y-2">
            <p className="text-primary font-semibold flex items-center gap-2">
              <Mail size={16} /> {business.email}
            </p>
            <p className="text-on-surface-variant text-body-md">
              WhatsApp: {business.phoneDisplay}
            </p>
          </div>
        </div>

        <div className="space-y-6 sm:col-span-2 md:col-span-1">
          <h4 className="text-label-lg text-primary uppercase tracking-widest">
            {dict.exploreLabel}
          </h4>
          <nav className="flex flex-wrap md:flex-col gap-x-6 gap-y-3">
            {dict.nav.map((item) => (
              <Link
                key={item.href}
                href={`${prefix}${item.href}`}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={`${prefix}/privacy-policy`}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              {dict.privacyLabel}
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-16 mt-12 md:mt-16 pt-8 border-t border-surface-variant/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-label-lg text-on-surface-variant text-center md:text-left flex items-center gap-2">
            <MapPin size={14} className="text-primary/60" />© {new Date().getFullYear()}{" "}
            {business.name}. {dict.allRightsReserved}
          </p>
        </div>
        <p className="text-[11px] md:text-xs text-on-surface-variant mt-6 text-center md:text-left leading-relaxed">
          {dict.license}. {dict.emergencyNotice} {business.name} ({business.legalName}, Y-tunnus/Business ID: {business.businessId}).
        </p>
      </div>
    </footer>
  );
}
