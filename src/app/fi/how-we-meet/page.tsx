import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Wifi, Smartphone, MessageSquare } from "lucide-react";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import LocationMap from "@/components/LocationMap";
import { business } from "@/lib/content";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/fi/how-we-meet");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/fi/how-we-meet" },
  };
}

export default function HowWeMeetPageFi() {
  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
        <h1 className="font-display text-headline-lg text-primary mb-4">
          Kuinka tapaamme — Helsingissä tai verkossa
        </h1>
        <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">
          Tarvitsetpa mielenterveystukea, neuropsykologista arviointia tai vain haluat jakaa
          tarinasi, löydät täältä turvallisen ja tuetun tilan.
        </p>
      </section>

      <Reveal>
        <section className="px-4 md:px-16 py-12 md:py-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <LocationMap locale="fi" className="aspect-[4/3] rounded-xl w-full order-2 lg:order-1 border border-surface-variant" />
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="font-display text-headline-md text-primary">Henkilökohtaiset istunnot</h2>
              <div>
                <h4 className="text-label-lg text-primary uppercase tracking-widest mb-1">Osoite & ohjeet</h4>
                <p className="text-body-md text-on-surface">
                  {business.address.street}, {business.address.postalCode} {business.address.city}, {business.address.country}
                </p>
                <p className="text-on-surface-variant text-sm mt-1">
                  Muutaman minuutin päässä Kampista ja päärautatieasemalta. Perille pääsee
                  helposti raitiovaunulla, metrolla tai kävellen. Hissi on pyörätuolille sopiva.
                </p>
              </div>
              <div>
                <h4 className="text-label-lg text-primary uppercase tracking-widest mb-1">Aukioloajat</h4>
                <p className="text-body-md text-on-surface">Ma–Pe klo 8–18</p>
              </div>
              <div>
                <h4 className="text-label-lg text-primary uppercase tracking-widest mb-1">Yhteystiedot</h4>
                <p className="text-body-md text-on-surface">
                  WhatsApp: {business.phoneDisplay} · Sähköposti: {business.email}
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-surface-container px-4 md:px-16 py-12 md:py-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-display text-headline-md text-primary">Turvallinen verkkotila</h2>
              <div>
                <h4 className="text-label-lg text-primary uppercase tracking-widest mb-1">Miten se toimii</h4>
                <p className="text-body-md text-on-surface-variant">
                  Kun olet varannut istunnon, saat sähköpostitse suojatun linkin ja selkeät
                  ohjeet liittymistä varten. Voit valita, pidätkö kameran päällä vai pois päältä.
                </p>
              </div>
              <div>
                <h4 className="text-label-lg text-primary uppercase tracking-widest mb-2">Tekniset vaatimukset</h4>
                <ul className="space-y-2 text-on-surface-variant text-body-md">
                  <li className="flex items-center gap-2"><Wifi size={18} className="text-primary" /> Vakaa internetyhteys</li>
                  <li className="flex items-center gap-2"><Smartphone size={18} className="text-primary" /> Laite — tietokone, tabletti tai puhelin</li>
                  <li className="flex items-center gap-2"><MessageSquare size={18} className="text-primary" /> Rauhallinen ja yksityinen tila</li>
                </ul>
                <p className="text-on-surface-variant/80 text-sm mt-2">
                  Mitään ylimääräisiä ohjelmistoja ei tarvita — voit liittyä suoraan selaimestasi.
                </p>
              </div>
            </div>
            <Photo
              src="/images/online-therapy-session.png"
              alt="Nainen osallistuu WellSightin verkkoterapiaistuntoon kannettavalla tietokoneellaan"
              className="aspect-[4/3] rounded-xl w-full"
            />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6 text-primary">
            <Clock size={22} />
            <span className="text-label-lg">Valmiina, kun sinä olet</span>
          </div>
          <Link href="/fi/book-and-pay" className="inline-block bg-primary text-on-primary px-10 py-4 rounded-full text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-105">
            Varaa aika
          </Link>
        </section>
      </Reveal>
    </>
  );
}
