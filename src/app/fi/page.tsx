import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Heart, Brain, Sparkles, CheckCircle2, MapPin, Clock, TrainFront, Laptop } from "lucide-react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import ServiceCarousel, { type CarouselService } from "@/components/ServiceCarousel";
import ContactForm from "@/components/ContactForm";
import LocationMap from "@/components/LocationMap";
import { business } from "@/lib/content";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/fi");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/fi" },
  };
}

// Mirrors the same four services translated on /fi/our-services — kept as a
// separate hardcoded list (not Prisma-backed) since service name/description
// have no translation columns in the database.
const fiServices: CarouselService[] = [
  {
    slug: "konsultointi",
    imageKey: "consultation",
    name: "Konsultointi",
    shortDescription:
      "Ammatillinen konsultaatio elämän eri tilanteiden selkeyttämiseen ja päätöksenteon tueksi.",
    duration: "50 minuuttia",
    fee: "90 €",
    status: "available",
  },
  {
    slug: "terapia",
    imageKey: "therapy",
    name: "Terapia",
    shortDescription:
      "Yksilöllinen istunto, jossa keskitytään psykologiseen tukeen, uusien näkökulmien löytämiseen ja henkilökohtaiseen kasvuun.",
    duration: "50 min",
    fee: "90 €",
    status: "available",
  },
  {
    slug: "vertaisryhmat",
    imageKey: "peer-group",
    name: "Vertaisryhmät",
    shortDescription:
      "Ryhmä, jossa jaetaan kokemuksia ja käsitellään yhteisiä teemoja (esim. omaishoitajat, maahanmuuttajat).",
    duration: "60–90 min",
    fee: "50 € / hlö",
    status: "available",
  },
  {
    slug: "neuropsykologia",
    imageKey: "neuropsychology",
    name: "Neuropsykologia",
    shortDescription:
      "Erikoistuneet kognitiiviset arvioinnit ja aivoterveyden seuranta — parhaillaan kehitteillä.",
    duration: "60–90 minuuttia",
    fee: "Ei vielä saatavilla",
    status: "comingSoon",
  },
];

export default function HomePageFi() {
  return (
    <>
      <section className="relative min-h-[600px] h-[80vh] md:h-[780px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-primary">
          <Image
            src="/images/hero-calm-woman-lakeside.jpg"
            alt="Nainen löytää rauhan ja selkeyden ulkona — WellSightin terapian tukema tasapaino"
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
              WellSight — Psykologi Helsingissä
            </h1>
            <p className="font-display text-headline-md leading-tight mb-8 md:mb-10 opacity-90">
              Tarjoamme tutkimukseen perustuvaa ja käytännönläheistä psykologista tukea.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/fi/book-and-pay" className="bg-white text-on-primary-fixed px-8 py-4 rounded-full text-label-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 text-center">
                Varaa aika
              </Link>
              <Link href="/fi/about-us" className="border border-white/40 backdrop-blur-sm text-white px-8 py-4 rounded-full text-label-lg hover:bg-white/20 hover:scale-105 transition-all duration-500 text-center">
                Meistä
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="py-[clamp(60px,10vw,120px)] px-4 md:px-16 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
              <h2 className="font-display text-headline-lg text-primary">Keitä olemme</h2>
              <div className="space-y-4 md:space-y-6 text-on-surface-variant text-body-lg">
                <p>
                  Palveluihimme kuuluvat terapia, neuropsykologinen arviointi sekä yksilö- ja
                  perhekonsultaatio.
                </p>
                <p>
                  Meille on tärkeää, että jokaisella on mahdollisuus turvalliseen ja rauhalliseen
                  tilaan, jossa voi pysähtyä, tulla kuulluksi ja löytää tilaa omille
                  ajatuksilleen. Tuemme sinua oman tilanteesi ymmärtämisessä ja autamme löytämään
                  selkeyttä arkeen.
                </p>
                <Link href="/fi/about-us" className="inline-block text-primary border-b border-primary/30 pb-1 text-label-lg hover:border-primary hover:opacity-70 transition-all duration-500">
                  Tutustu WellSightin psykologiin
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Photo
                src="/images/therapy-room-helsinki.jpg"
                alt="WellSightin rauhallinen vastaanottohuone Helsingissä"
                className="aspect-[4/3] md:aspect-[4/5] rounded-xl w-full"
              />
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-surface-container py-[clamp(60px,10vw,120px)] px-4 md:px-16">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-display text-headline-lg text-primary mb-4">Palvelumme</h2>
              <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">
                Räätälöityä psykologista tukea omaan tilanteeseesi.
              </p>
            </div>
            <ServiceCarousel services={fiServices} locale="fi" />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-[clamp(60px,10vw,120px)] px-4 md:px-16 max-w-[1280px] mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-primary-fixed p-6 md:p-8 rounded-xl">
                  <ShieldCheck className="text-primary mb-4" size={32} strokeWidth={1.5} />
                  <h4 className="font-display text-headline-sm text-primary mb-2">Luottamuksellisuus</h4>
                  <p className="text-on-surface-variant text-body-md">Luottamuksellisuus aina etusijalla.</p>
                </div>
                <div className="bg-primary-fixed-dim p-6 md:p-8 rounded-xl">
                  <Heart className="text-primary mb-4" size={32} strokeWidth={1.5} />
                  <h4 className="font-display text-headline-sm text-primary mb-2">Osallistava ilmapiiri</h4>
                  <p className="text-on-surface-variant text-body-md">Turvallinen ja osallistava ilmapiiri kaikille.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-primary-fixed p-6 md:p-8 rounded-xl">
                  <Brain className="text-primary mb-4" size={32} strokeWidth={1.5} />
                  <h4 className="font-display text-headline-sm text-primary mb-2">Näyttöön perustuva</h4>
                  <p className="text-on-surface-variant text-body-md">Selkeä ja tavoitteellinen hoito.</p>
                </div>
                <div className="bg-primary-fixed p-6 md:p-8 rounded-xl">
                  <Sparkles className="text-primary mb-4" size={32} strokeWidth={1.5} />
                  <h4 className="font-display text-headline-sm text-primary mb-2">Luotettava psykologi</h4>
                  <p className="text-on-surface-variant text-body-md">Vahvaa ammattitaitoa ja aitoa läsnäoloa.</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6 md:space-y-8">
              <h2 className="font-display text-headline-lg text-primary">Miksi WellSight?</h2>
              <ul className="space-y-4">
                {["Online- ja lähitapaamiset.", "Selkeä ja tavoitteellinen hoito.", "Luotettava psykologi."].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-label-lg text-primary">
                    <CheckCircle2 size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-surface py-[clamp(60px,10vw,120px)] px-4 md:px-16 border-t border-surface-variant">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">
              <div className="lg:col-span-7 order-2 lg:order-1">
                <LocationMap locale="fi" className="h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl border-2 border-deep-green w-full" />
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center space-y-8 md:space-y-12 order-1 lg:order-2">
                <h2 className="font-display text-headline-lg text-primary">Sijainti</h2>
                <div className="space-y-6 md:space-y-8">
                  <div className="flex gap-4 md:gap-6">
                    <MapPin className="text-primary flex-shrink-0" size={28} />
                    <div>
                      <p className="text-body-lg text-on-surface">
                        {business.address.street}<br />
                        {business.address.postalCode} {business.address.city}, {business.address.country}
                      </p>
                      <p className="mt-2 text-on-surface-variant text-body-md italic">
                        Muutaman minuutin päässä Kampista ja päärautatieasemalta.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 md:gap-6">
                    <Clock className="text-primary flex-shrink-0" size={28} />
                    <p className="text-body-lg text-on-surface">Ma–Pe klo 8–18</p>
                  </div>
                  <div className="flex gap-4 md:gap-6">
                    <TrainFront className="text-primary flex-shrink-0" size={28} />
                    <p className="text-body-md text-on-surface-variant">
                      Perille pääsee helposti raitiovaunulla, metrolla tai kävellen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-[clamp(60px,10vw,120px)] px-4 md:px-16 max-w-[1280px] mx-auto">
          <div className="bg-deep-green rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 lg:p-20 flex flex-col justify-center space-y-6 md:space-y-8">
              <h2 className="font-display text-headline-lg text-on-deep-green">Verkkotapaamiset</h2>
              <p className="font-body text-on-deep-green/80 text-body-lg">
                Verkkopalvelumme sopii arkeesi – joustavaa, luottamuksellista ja turvallista.
              </p>
              <div className="flex items-start gap-4">
                <Laptop className="text-on-deep-green mt-1 flex-shrink-0" size={24} />
                <p className="text-on-deep-green/80 text-body-md">
                  Ei ylimääräisiä ohjelmia — liity suoraan selaimestasi varauksen jälkeen.
                </p>
              </div>
              <Link href="/fi/how-we-meet" className="inline-block w-full sm:w-auto bg-primary-fixed text-on-primary-fixed px-10 py-4 rounded-full text-label-lg hover:bg-white hover:scale-105 transition-all duration-500 text-center">
                Varaa verkkotapaaminen
              </Link>
            </div>
            <Photo
              src="/images/online-therapy-session.png"
              alt="Nainen osallistuu WellSightin verkkoterapiaistuntoon kannettavalla tietokoneellaan"
              className="h-64 sm:h-96 lg:h-full min-h-[300px] w-full"
            />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-[clamp(60px,10vw,120px)] px-4 md:px-16 bg-surface-container-low">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="space-y-8 md:space-y-10">
                <h2 className="font-display text-headline-lg text-primary">Ota yhteyttä</h2>
                <div className="space-y-6">
                  <a href={`mailto:${business.email}`} className="flex items-center gap-4 group">
                    <span className="text-body-lg group-hover:text-primary transition-colors">{business.email}</span>
                  </a>
                  <p className="text-body-lg text-on-surface-variant">WhatsApp: {business.phoneDisplay}</p>
                </div>
              </div>
              <ContactForm locale="fi" />
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
