import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { prisma } from "@/lib/prisma";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/pricing");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/pricing" },
  };
}

// Deliberately just services + prices, nothing else — the fuller
// descriptions/accordions live on /our-services; this page exists so a
// visitor can scan prices and jump straight into booking one.
export default async function PricingPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
        <h1 className="font-display text-headline-lg text-primary">Services & Pricing</h1>
      </section>

      <Reveal>
        <section className="px-4 md:px-16 pb-24">
          <div className="max-w-2xl mx-auto space-y-4">
            {services.map((service) => {
              const comingSoon = service.status === "comingSoon";
              const card = (
                <div className="bg-surface-container-lowest rounded-xl p-6 service-card-shadow flex items-center justify-between gap-4 transition-all duration-500">
                  <div>
                    <p className="text-primary font-display text-headline-sm">{service.name}</p>
                    <p className="text-on-surface-variant text-sm mt-1">{service.duration}</p>
                    {comingSoon && (
                      <span className="inline-block mt-2 bg-primary/90 text-white px-3 py-0.5 rounded-full text-xs text-label-lg">
                        COMING SOON
                      </span>
                    )}
                  </div>
                  <p className="text-primary text-label-lg whitespace-nowrap">{service.fee}</p>
                </div>
              );

              return comingSoon ? (
                <div key={service.slug} className="opacity-60 cursor-not-allowed">
                  {card}
                </div>
              ) : (
                <Link
                  key={service.slug}
                  href={`/book-and-pay?service=${service.slug}`}
                  className="block hover:scale-[1.01] transition-transform"
                >
                  {card}
                </Link>
              );
            })}
          </div>
        </section>
      </Reveal>
    </>
  );
}
