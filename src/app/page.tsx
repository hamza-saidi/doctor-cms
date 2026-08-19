import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Heart,
  Brain,
  Sparkles,
  CheckCircle2,
  MapPin,
  Clock,
  TrainFront,
  Laptop,
} from "lucide-react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import ServiceCarousel from "@/components/ServiceCarousel";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import ContactForm from "@/components/ContactForm";
import LocationMap from "@/components/LocationMap";
import { business, values } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/" },
  };
}

const valueIcons = { shield: ShieldCheck, heart: Heart, brain: Brain, sparkles: Sparkles } as const;

export default async function HomePage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[600px] h-[80vh] md:h-[780px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-primary">
          <Image
            src="/images/hero-calm-woman-lakeside.jpg"
            alt="Woman finding calm and clarity outdoors — the sense of balance WellSight therapy supports"
            fill
            sizes="100vw"
            priority
            className="object-cover object-[68%_28%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-primary/10" />
        </div>
        <div className="relative z-10 px-4 md:px-16 max-w-[1280px] mx-auto w-full">
          <div className="max-w-2xl text-white">
            <h1 className="font-display text-display-lg mb-4">
              WellSight — Psychologist in Helsinki
            </h1>
            <p className="font-display text-headline-md leading-tight mb-8 md:mb-10 opacity-90">
              {business.tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/book-and-pay"
                className="bg-white text-on-primary-fixed px-8 py-4 rounded-full text-label-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 text-center"
              >
                Book a Session
              </Link>
              <Link
                href="/about-us"
                className="border border-white/40 backdrop-blur-sm text-white px-8 py-4 rounded-full text-label-lg hover:bg-white/20 hover:scale-105 transition-all duration-500 text-center"
              >
                Our Approach
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <Reveal>
        <section className="bg-surface-container py-[clamp(60px,10vw,120px)] px-4 md:px-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
              <h2 className="font-display text-headline-lg text-primary">About Wellsight</h2>
              <div className="space-y-4 md:space-y-6 text-on-surface-variant text-body-lg">
                <p>
                  WellSight is a private mental health practice in Helsinki, Finland. Built on
                  scientific knowledge and evidence-based practice, we offer therapy,
                  consultation, and peer group sessions for individuals and families in English
                  and Arabic.
                </p>
                <p>
                  We believe in creating a safe and meaningful space where people can restore
                  balance, be genuinely heard, and find the support they need to understand
                  themselves more deeply.
                </p>
                <Link
                  href="/about-us"
                  className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-full text-label-lg hover:bg-primary hover:text-on-primary hover:scale-105 transition-all duration-500"
                >
                  Learn more about us
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Photo
                src="/images/therapy-room-helsinki.jpg"
                alt="The calm, comfortable therapy room at WellSight's Helsinki practice"
                className="aspect-[4/3] md:aspect-[4/5] rounded-xl w-full"
              />
              <div className="mt-6 text-center">
                <p className="text-on-surface-variant italic mb-4">
                  Get to know the psychologist behind WellSight
                </p>
                <Link
                  href="/about-us"
                  className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-full text-label-lg hover:bg-primary hover:text-on-primary hover:scale-105 transition-all duration-500"
                >
                  Meet the psychologist
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Services */}
      <Reveal>
        <section className="bg-surface-container-low py-[clamp(60px,10vw,120px)] px-4 md:px-16">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-display text-headline-lg text-primary mb-4">Our Services</h2>
              <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">
                Tailored psychological support designed for your unique journey toward clarity
                and wellness.
              </p>
            </div>
            <ServiceCarousel services={services} />
          </div>
        </section>
      </Reveal>

      {/* Why WellSight */}
      <Reveal>
        <section className="bg-surface-container py-[clamp(60px,10vw,120px)] px-4 md:px-16 overflow-hidden">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                {values.slice(0, 2).map((v) => {
                  const Icon = valueIcons[v.icon as keyof typeof valueIcons];
                  return (
                    <div
                      key={v.title}
                      className="bg-surface-container-lowest service-card-shadow p-6 md:p-8 rounded-xl transition-all duration-500 hover:scale-[1.03]"
                    >
                      <Icon className="text-primary mb-4" size={32} strokeWidth={1.5} />
                      <h4 className="font-display text-headline-sm text-primary mb-2">
                        {v.title}
                      </h4>
                      <p className="text-on-surface-variant text-body-md">{v.description}</p>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-4">
                {values.slice(2, 4).map((v) => {
                  const Icon = valueIcons[v.icon as keyof typeof valueIcons];
                  return (
                    <div
                      key={v.title}
                      className="bg-surface-container-lowest service-card-shadow p-6 md:p-8 rounded-xl transition-all duration-500 hover:scale-[1.03]"
                    >
                      <Icon className="text-primary mb-4" size={32} strokeWidth={1.5} />
                      <h4 className="font-display text-headline-sm text-primary mb-2">
                        {v.title}
                      </h4>
                      <p className="text-on-surface-variant text-body-md">{v.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6 md:space-y-8">
              <h2 className="font-display text-headline-lg text-primary">Why WellSight?</h2>
              <p className="text-on-surface-variant text-body-lg">
                We offer holistic, evidence-based mental health care that respects your
                background and supports your journey with warmth and professionalism.
              </p>
              <ul className="space-y-4">
                {["Online & in-person sessions.", "Clear, goal-oriented care.", "Professional clinical team."].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3 text-label-lg text-primary">
                      <CheckCircle2 size={20} />
                      {item}
                    </li>
                  )
                )}
              </ul>
              <Link
                href="/about-us"
                className="hidden lg:inline-block w-full sm:w-auto bg-primary text-on-primary px-10 py-4 rounded-full text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-105 active:scale-95 text-center"
              >
                Learn more about our approach
              </Link>
            </div>
            <Link
              href="/about-us"
              className="order-3 lg:hidden w-full bg-primary text-on-primary px-10 py-4 rounded-full text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 active:scale-95 text-center"
            >
              Learn more about our approach
            </Link>
          </div>
        </section>
      </Reveal>

      {/* Visit Us */}
      <Reveal>
        <section className="bg-surface-container-low py-[clamp(60px,10vw,120px)] px-4 md:px-16">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">
              <div className="lg:col-span-7 order-2 lg:order-1">
                <LocationMap
                  className="h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl border-2 border-deep-green w-full"
                />
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center space-y-8 md:space-y-12 order-1 lg:order-2">
                <h2 className="font-display text-headline-lg text-primary">Visit Us</h2>
                <div className="space-y-6 md:space-y-8">
                  <div className="flex gap-4 md:gap-6">
                    <MapPin className="text-primary flex-shrink-0" size={28} />
                    <div>
                      <h4 className="text-label-lg text-primary uppercase tracking-widest mb-2">
                        Location
                      </h4>
                      <p className="text-body-lg text-on-surface">
                        {business.address.street}
                        <br />
                        {business.address.postalCode} {business.address.city},{" "}
                        {business.address.country}
                      </p>
                      <p className="mt-2 text-on-surface-variant text-body-md italic">
                        Just minutes from Kamppi and Helsinki Central Station.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 md:gap-6">
                    <Clock className="text-primary flex-shrink-0" size={28} />
                    <div>
                      <h4 className="text-label-lg text-primary uppercase tracking-widest mb-2">
                        Opening Hours
                      </h4>
                      {business.hours.map((h) => (
                        <p key={h.days} className="text-body-lg text-on-surface">
                          {h.days}: {h.hours}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 md:gap-6">
                    <TrainFront className="text-primary flex-shrink-0" size={28} />
                    <div>
                      <h4 className="text-label-lg text-primary uppercase tracking-widest mb-2">
                        Accessibility
                      </h4>
                      <p className="text-body-md text-on-surface-variant">
                        Easy access by tram, metro, or walking. Paid parking available. Elevator
                        | Wheelchair accessible.
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/pricing"
                  className="inline-block w-full sm:w-auto text-center border-2 border-primary text-primary px-8 py-3 rounded-full text-label-lg hover:bg-primary hover:text-on-primary transition-all duration-500"
                >
                  View Services &amp; Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Online Sessions */}
      <Reveal>
        <section className="bg-surface-container py-[clamp(60px,10vw,120px)] px-4 md:px-16">
          <div className="max-w-[1280px] mx-auto bg-deep-green rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-center gap-8 md:gap-10">
              <div className="space-y-3">
                <h2 className="font-display text-headline-lg text-on-deep-green">
                  Online Sessions
                </h2>
                <p className="font-body text-on-deep-green/80 text-body-lg leading-relaxed">
                  Therapy that meets you wherever you are — flexible, private, and secure.
                </p>
              </div>
              <div className="flex items-start gap-4 border-t border-on-deep-green/15 pt-8">
                <Laptop className="text-on-deep-green mt-1 flex-shrink-0" size={24} />
                <div className="space-y-1.5">
                  <h4 className="text-label-lg text-on-deep-green">
                    Your safe space, just a click away
                  </h4>
                  <p className="text-on-deep-green/80 text-body-md leading-relaxed">
                    No extra software needed — join securely from your browser once your session
                    is booked.
                  </p>
                </div>
              </div>
              <Link
                href="/how-we-meet"
                className="inline-block w-full sm:w-auto bg-primary-fixed text-on-primary-fixed px-10 py-4 rounded-full text-label-lg hover:bg-white hover:scale-105 transition-all duration-500 active:scale-95 text-center"
              >
                Book Online Session
              </Link>
            </div>
            <Photo
              src="/images/online-therapy-session.png"
              alt="Woman joining an online therapy session with WellSight from her laptop"
              className="h-64 sm:h-96 lg:h-full min-h-[300px] w-full"
            />
          </div>
        </section>
      </Reveal>

      {/* Contact */}
      <Reveal>
        <section
          id="contact"
          className="py-[clamp(60px,10vw,120px)] px-4 md:px-16 bg-surface-container-low scroll-mt-24"
        >
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-12 lg:items-center">
              <div className="space-y-8 md:space-y-10">
                <h2 className="font-display text-headline-lg text-primary">Contact us</h2>
                <div className="space-y-6">
                  <a href={`mailto:${business.email}`} className="flex items-center gap-4 group">
                    <ShieldCheck
                      className="text-primary group-hover:scale-110 transition-transform"
                      size={22}
                    />
                    <span className="text-body-lg group-hover:text-primary transition-colors">
                      {business.email}
                    </span>
                  </a>
                  <a
                    href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <WhatsAppIcon
                      className="text-primary group-hover:scale-110 transition-transform"
                      size={22}
                    />
                    <span className="text-body-lg text-on-surface-variant group-hover:text-primary transition-colors">
                      WhatsApp: {business.phoneDisplay}
                    </span>
                  </a>
                  <div className="flex items-start gap-4">
                    <MapPin className="text-primary mt-1 flex-shrink-0" size={22} />
                    <span className="text-body-lg text-on-surface-variant">
                      {business.address.street}
                      <br />
                      {business.address.postalCode} {business.address.city},{" "}
                      {business.address.country}
                    </span>
                  </div>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
