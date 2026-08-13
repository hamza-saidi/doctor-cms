import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import BookingRequestForm from "@/components/BookingRequestForm";
import { prisma } from "@/lib/prisma";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/book-and-pay");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/book-and-pay" },
  };
}

// Slot availability must always be fresh to avoid double-booking.
export const dynamic = "force-dynamic";

export default async function BookAndPayPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service: initialServiceSlug } = await searchParams;
  const [services, packages, slots] = await Promise.all([
    prisma.service.findMany({ where: { status: "available" }, orderBy: { sortOrder: "asc" } }),
    prisma.package.findMany({ where: { fee: { not: null } }, orderBy: { sortOrder: "asc" } }),
    prisma.availabilitySlot.findMany({
      where: { isBooked: false, startsAt: { gt: new Date() } },
      orderBy: { startsAt: "asc" },
      include: { service: true },
    }),
  ]);

  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
        <h1 className="font-display text-headline-lg text-primary mb-4">
          Book a Session in Helsinki or Online
        </h1>
        <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">
          Pick an open time slot below, or send a request and we&apos;ll follow up by email with
          a confirmation and secure payment link. The session is confirmed only after payment is
          completed. For in-person sessions, payment may also be completed on-site.
        </p>
      </section>

      <Reveal>
        <section className="px-4 md:px-16 pb-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h2 className="font-display text-headline-sm text-primary mb-2">
                Sessions & Pricing
              </h2>
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-surface-container-lowest rounded-xl p-5 service-card-shadow flex justify-between items-start gap-4"
                >
                  <div>
                    <p className="text-primary font-medium">{s.name}</p>
                    <p className="text-on-surface-variant text-sm">{s.duration}</p>
                  </div>
                  <p className="text-primary text-label-lg whitespace-nowrap">{s.fee}</p>
                </div>
              ))}

              {packages.length > 0 && (
                <>
                  <h2 className="font-display text-headline-sm text-primary pt-6 mb-2">
                    Packages
                  </h2>
                  {packages.map((p) => (
                    <div
                      key={p.id}
                      className="bg-surface-container-lowest rounded-xl p-5 service-card-shadow flex justify-between items-start gap-4"
                    >
                      <div>
                        <p className="text-primary font-medium">{p.name}</p>
                        <p className="text-on-surface-variant text-sm mt-1">{p.description}</p>
                      </div>
                      <p className="text-primary text-label-lg whitespace-nowrap">{p.fee}</p>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div>
              <h2 className="font-display text-headline-sm text-primary mb-2">
                Request a Session
              </h2>
              <p className="text-on-surface-variant text-sm mb-4">
                {slots.length > 0
                  ? "Choose an open slot below, or leave it unselected and we'll coordinate a time by email."
                  : "No open slots are published yet — send a request and we'll coordinate a time by email."}
              </p>
              <BookingRequestForm services={services} slots={slots} initialServiceSlug={initialServiceSlug} />
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
