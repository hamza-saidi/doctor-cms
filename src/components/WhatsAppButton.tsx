"use client";

import { usePathname } from "next/navigation";
import { business } from "@/lib/content";
import { dictionaries, localeFromPathname } from "@/lib/i18n";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

// Plain click-to-chat link (wa.me) — deliberately not a Business API bot.
// For a solo therapy practice, an automated responder undercuts the "warm,
// personal" positioning the whole site is built around, and adds ongoing
// cost/approval overhead disproportionate to the message volume here.
export default function WhatsAppButton() {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPathname(pathname);
  const dict = dictionaries[locale];

  if (pathname.startsWith("/admin")) return null;

  const phone = business.whatsapp.replace(/\D/g, "");
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(dict.whatsappMessage)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dict.whatsappLabel}
      title={dict.whatsappLabel}
      className="fixed z-40 bottom-24 right-4 lg:bottom-6 lg:right-6 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 active:scale-95 transition-transform"
    >
      <WhatsAppIcon size={26} />
    </a>
  );
}
