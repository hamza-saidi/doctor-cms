import type { Metadata } from "next";
import Link from "next/link";
import { Users, Heart, MessageCircle, Stethoscope, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { prisma } from "@/lib/prisma";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/our-services");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/our-services" },
  };
}

const serviceIcons: Record<string, typeof Users> = {
  consultation: MessageCircle,
  therapy: Heart,
  "peer-group": Users,
  neuropsychology: Stethoscope,
};

export default async function OurServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
        <h1 className="font-display text-headline-lg text-primary mb-4">
          Our Services in Helsinki
        </h1>
        <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">
          Individual sessions, peer group sessions, and specialized assessments — tailored to
          your goals, offered in person or online.
        </p>
      </section>

      {services.map((service, i) => {
        const Icon = serviceIcons[service.slug] ?? Heart;
        return (
          <Reveal key={service.slug}>
            <section
              id={service.slug}
              className={`px-4 md:px-16 py-12 md:py-16 scroll-mt-24 ${
                i % 2 === 1 ? "bg-surface-container-high" : ""
              }`}
            >
              <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1">
                  <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center mb-4">
                    <Icon className="text-primary-fixed" size={26} />
                  </div>
                  <h2 className="font-display text-headline-md text-primary mb-2">
                    {service.name}
                  </h2>
                  <p className="text-on-surface-variant text-body-md">
                    {service.shortDescription}
                  </p>
                  {service.status === "comingSoon" && (
                    <span className="inline-block mt-4 bg-primary/90 text-white px-4 py-1 rounded-full text-xs text-label-lg">
                      COMING SOON
                    </span>
                  )}
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-container-lowest rounded-xl p-6 service-card-shadow">
                    <div>
                      <p className="text-label-md uppercase tracking-widest text-on-surface-variant/70 mb-1">
                        Duration
                      </p>
                      <p className="text-body-md text-on-surface">{service.duration}</p>
                    </div>
                    <div>
                      <p className="text-label-md uppercase tracking-widest text-on-surface-variant/70 mb-1">
                        Fee
                      </p>
                      <p className="text-body-md text-on-surface">{service.fee}</p>
                    </div>
                    <div>
                      <p className="text-label-md uppercase tracking-widest text-on-surface-variant/70 mb-1">
                        Includes
                      </p>
                      <p className="text-body-md text-on-surface">{service.includes}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-on-surface-variant text-body-md">
                    {service.detail
                      .split("\n\n")
                      .filter(Boolean)
                      .map((paragraph) => (
                        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                      ))}
                  </div>

                  {service.status === "available" ? (
                    <Link
                      href={`/book-and-pay?service=${service.slug}`}
                      className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-full text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-105"
                    >
                      <CheckCircle2 size={18} />
                      Book your {service.name.toLowerCase()} now
                    </Link>
                  ) : (
                    <button
                      className="border-2 border-outline text-outline px-8 py-3 rounded-full text-label-lg cursor-not-allowed"
                      disabled
                    >
                      Register interest
                    </button>
                  )}
                </div>
              </div>
            </section>
          </Reveal>
        );
      })}

      <Reveal>
        <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
          <h2 className="font-display text-headline-md text-primary mb-4">
            Not sure which service fits your situation?
          </h2>
          <p className="text-on-surface-variant text-body-lg max-w-xl mx-auto mb-8">
            Read about what to expect before your first session, or reach out and we&apos;ll
            help you choose.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/firstsession"
              className="border-2 border-primary text-primary px-8 py-3 rounded-full text-label-lg hover:bg-primary hover:text-on-primary transition-all duration-500"
            >
              Starting Therapy
            </Link>
          </div>
        </section>
      </Reveal>
    </>
  );
}
