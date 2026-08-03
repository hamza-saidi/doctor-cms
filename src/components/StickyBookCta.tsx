"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { dictionaries, localePrefix, localeFromPathname } from "@/lib/i18n";

// Mobile-only persistent booking CTA — the audit found the header CTA can
// scroll out of view on mobile with no fallback; this closes that gap.
export default function StickyBookCta() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname() ?? "/";
  const locale = localeFromPathname(pathname);
  const dict = dictionaries[locale];
  const prefix = localePrefix(locale);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <div
      className={`lg:hidden fixed bottom-4 left-4 right-4 z-40 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <Link
        href={`${prefix}/book-and-pay`}
        className="flex items-center justify-center gap-2 w-full bg-primary text-on-primary py-4 rounded-full text-label-lg shadow-lg active:scale-95 transition-transform"
      >
        <CalendarCheck size={18} />
        {dict.bookCta}
      </Link>
    </div>
  );
}
