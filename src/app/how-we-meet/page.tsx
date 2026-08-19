import type { Metadata } from "next";
import Link from "next/link";
import { Clock, MessageSquare, Wifi, Smartphone } from "lucide-react";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import LocationMap from "@/components/LocationMap";
import { business } from "@/lib/content";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/how-we-meet");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/how-we-meet" },
  };
}

export default function HowWeMeetPage() {
  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
        <h1 className="font-display text-headline-lg text-primary">
          How We Meet — In Person or Online
        </h1>
      </section>

      <Reveal>
        <section className="bg-surface-container px-4 md:px-16 py-12 md:py-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <LocationMap
              className="aspect-[4/3] rounded-xl w-full order-2 lg:order-1 border-2 border-deep-green"
            />
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="font-display text-headline-md text-primary">In-Person Sessions</h2>
              <div>
                <h4 className="text-label-lg text-primary uppercase tracking-widest mb-1">
                  Address & Directions
                </h4>
                <p className="text-body-md text-on-surface">
                  {business.address.street}, {business.address.postalCode}{" "}
                  {business.address.city}, {business.address.country}
                </p>
                <p className="text-on-surface-variant text-sm mt-1">
                  Just minutes from Kamppi and Helsinki Central Station. Easy access by tram,
                  metro, or walking. Paid parking available nearby. Elevator access | Wheelchair
                  accessible.
                </p>
              </div>
              <div>
                <h4 className="text-label-lg text-primary uppercase tracking-widest mb-1">
                  Opening Hours
                </h4>
                {business.hours.map((h) => (
                  <p key={h.days} className="text-body-md text-on-surface">
                    {h.days}: {h.hours}
                  </p>
                ))}
              </div>
              <div>
                <h4 className="text-label-lg text-primary uppercase tracking-widest mb-1">
                  Contact
                </h4>
                <p className="text-body-md text-on-surface">
                  WhatsApp: {business.phoneDisplay} · Email: {business.email}
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-surface-container-low px-4 md:px-16 py-12 md:py-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-center">
            <h2 className="font-display text-headline-md text-primary lg:col-start-1 lg:row-start-1">
              Online Sessions
            </h2>
            <Photo
              src="/images/online-therapy-session.png"
              alt="Woman joining an online therapy session with WellSight from her laptop"
              className="aspect-[4/3] rounded-xl w-full lg:col-start-2 lg:row-start-1 lg:row-span-2"
            />
            <div className="space-y-6 lg:col-start-1 lg:row-start-2">
              <div>
                <h4 className="text-label-lg text-primary uppercase tracking-widest mb-1">
                  How It Works
                </h4>
                <p className="text-body-md text-on-surface-variant">
                  Once you book your session, you&apos;ll receive a secure link by email with
                  simple instructions on how to join. At the scheduled time, simply click the
                  link to join your therapist online — private and hassle-free. You can choose
                  whether to keep your camera on or off, whatever makes you feel most
                  comfortable.
                </p>
              </div>
              <div className="mt-4">
                <h4 className="text-label-lg text-primary uppercase tracking-widest mb-3">
                  Technical Requirements
                </h4>
                <div className="bg-surface-container-lowest rounded-xl p-6 service-card-shadow space-y-4">
                  {[
                    { icon: Wifi, text: "A stable internet connection" },
                    { icon: Smartphone, text: "A device — computer, tablet, or phone" },
                    { icon: MessageSquare, text: "A quiet and private space" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-primary-fixed" />
                      </div>
                      <p className="text-on-surface text-body-md">{text}</p>
                    </div>
                  ))}
                  <p className="text-on-surface-variant text-sm border-t border-outline-variant/40 pt-4">
                    No extra software is needed — you can join directly from your browser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6 text-primary">
            <Clock size={22} />
            <span className="text-label-lg">Ready when you are</span>
          </div>
          <Link
            href="/book-and-pay"
            className="inline-block bg-primary text-on-primary px-10 py-4 rounded-full text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-105"
          >
            Book a Session
          </Link>
        </section>
      </Reveal>
    </>
  );
}
