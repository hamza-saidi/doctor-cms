"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { dictionaries, localePrefix, localeFromPathname } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const locale = localeFromPathname(pathname);
  const dict = dictionaries[locale];
  const prefix = localePrefix(locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={`sticky top-0 w-full z-50 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "bg-surface/95 shadow-md" : "bg-surface/80"
      }`}
    >
      <nav className="flex justify-between items-center h-20 px-4 md:px-16 max-w-[1280px] mx-auto">
        <Link href={prefix || "/"} className="flex items-center gap-2 font-display text-headline-sm text-primary">
          <Image src="/images/wellsight-logo.png" alt="" width={32} height={32} className="h-8 w-8" priority />
          WellSight
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-body-md">
          {dict.nav.map((item) => (
            <Link
              key={item.href}
              href={`${prefix}${item.href}`}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={`${prefix}/book-and-pay`}
            className="bg-primary text-on-primary px-5 md:px-6 py-2.5 md:py-3 rounded-full text-label-lg transition-transform duration-500 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            {dict.bookCta}
          </Link>
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden text-primary p-2"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-surface-container-lowest border-t border-outline-variant shadow-lg">
          <div className="flex flex-col px-4 py-6 gap-1">
            {dict.nav.map((item) => (
              <Link
                key={item.href}
                href={`${prefix}${item.href}`}
                onClick={() => setMenuOpen(false)}
                className="px-2 py-3 text-body-lg text-on-surface-variant hover:text-primary transition-colors border-b border-outline-variant/50 last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <LanguageSwitcher className="px-2 py-3" />
          </div>
        </div>
      )}
    </header>
  );
}
