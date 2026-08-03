"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeLabels, localeFromPathname, buildLocalizedPath } from "@/lib/i18n";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname() ?? "/";
  const current = localeFromPathname(pathname);

  return (
    <div className={`flex items-center gap-1 text-label-md ${className}`}>
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center gap-1">
          {i > 0 && <span className="text-on-surface-variant/40">/</span>}
          <Link
            href={buildLocalizedPath(pathname, locale)}
            aria-current={locale === current ? "page" : undefined}
            className={
              locale === current
                ? "text-primary font-semibold"
                : "text-on-surface-variant hover:text-primary transition-colors"
            }
          >
            {localeLabels[locale]}
          </Link>
        </span>
      ))}
    </div>
  );
}
