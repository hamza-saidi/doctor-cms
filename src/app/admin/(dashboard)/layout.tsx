import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

// Admin data (services, bookings, messages) is mutated via the DB directly
// and must never be served from a stale build-time prerender.
export const dynamic = "force-dynamic";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/availability", label: "Availability" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/seo", label: "Page Titles & SEO" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <aside className="lg:w-60 lg:flex-shrink-0 bg-surface-container border-b lg:border-b-0 lg:border-r border-outline-variant">
        <div className="p-6">
          <p className="font-display text-headline-sm text-primary">WellSight</p>
          <p className="text-label-md text-on-surface-variant uppercase tracking-widest mt-1">
            Admin
          </p>
        </div>
        <nav className="flex lg:flex-col gap-1 px-3 pb-4 overflow-x-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-lg text-body-md text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pb-6">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 bg-surface">{children}</main>
    </div>
  );
}
