import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import BookingRequestForm from "@/components/BookingRequestForm";
import { prisma } from "@/lib/prisma";
import { getPageSeo } from "@/lib/pageSeo";
import { ensureDefaultSlotsGenerated } from "@/lib/availability";

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

  // Materializes the default Mon–Fri 8:00–18:00 schedule before slots are
  // queried below, so every visit sees a fresh rolling window without any
  // admin setup.
  await ensureDefaultSlotsGenerated();

  const [services, slots] = await Promise.all([
    // Coming-soon services (e.g. Neuropsychology) are included so the form
    // can show them in the service picker as visible-but-unselectable,
    // rather than just omitting them entirely.
    prisma.service.findMany({
      where: { status: { in: ["available", "comingSoon"] } },
      orderBy: { sortOrder: "asc" },
    }),
    // Booked slots are included too (not just isBooked: false) so the form
    // can show them as greyed-out/unclickable instead of omitting them —
    // clients see the full picture of what's taken vs. actually open.
    prisma.availabilitySlot.findMany({
      where: { startsAt: { gt: new Date() } },
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
          <div className="max-w-2xl mx-auto">
            <BookingRequestForm services={services} slots={slots} initialServiceSlug={initialServiceSlug} />
          </div>
        </section>
      </Reveal>
    </>
  );
}
