import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [serviceCount, pendingBookings, openSlots, unreadMessages] = await Promise.all([
    prisma.service.count(),
    prisma.booking.count({ where: { status: "pending" } }),
    prisma.availabilitySlot.count({ where: { isBooked: false, startsAt: { gt: new Date() } } }),
    prisma.contactMessage.count(),
  ]);

  const stats = [
    { label: "Services", value: serviceCount, href: "/admin/services" },
    { label: "Pending bookings", value: pendingBookings, href: "/admin/bookings" },
    { label: "Open slots", value: openSlots, href: "/admin/availability" },
    { label: "Contact messages", value: unreadMessages, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="font-display text-headline-md text-primary mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-surface-container-lowest rounded-xl p-6 service-card-shadow hover:scale-[1.02] transition-transform"
          >
            <p className="text-3xl font-display text-primary">{stat.value}</p>
            <p className="text-on-surface-variant text-sm mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
