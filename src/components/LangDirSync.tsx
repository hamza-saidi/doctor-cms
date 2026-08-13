"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// The blocking inline script in RootLayout's <head> only runs once, on the
// initial full document load — it sets <html lang/dir> correctly for a
// fresh load or hard refresh, but Next.js client-side navigation (Link,
// router.push) doesn't reload the document, so it never re-runs. Without
// this, switching locales via a Link (e.g. the language switcher) updates
// the page content but leaves <html dir> stuck at whatever it was on first
// load — this component keeps it in sync on every route change too.
export default function LangDirSync() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    const locale =
      pathname === "/ar" || pathname.startsWith("/ar/")
        ? "ar"
        : pathname === "/fi" || pathname.startsWith("/fi/")
          ? "fi"
          : "en";
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [pathname]);

  return null;
}
