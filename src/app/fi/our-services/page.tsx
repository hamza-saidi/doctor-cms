import type { Metadata } from "next";
import Link from "next/link";
import { Users, Heart, MessageCircle, Stethoscope, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/fi/our-services");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/fi/our-services" },
  };
}

const serviceImages: Record<string, string> = {
  konsultointi: "/images/consultation-room.jpg",
  terapia: "/images/therapy-room-helsinki.jpg",
  neuropsykologia: "/images/neuropsychology-assessment.jpg",
};

// Maps this page's Finnish slugs to the English Prisma slugs the actual
// booking form (English-only) reads, so the service pre-selects correctly
// after the fi → fi/book-and-pay → book-and-pay hand-off.
const englishSlugs: Record<string, string> = {
  konsultointi: "consultation",
  terapia: "therapy",
  vertaisryhmat: "peer-group",
  neuropsykologia: "neuropsychology",
};

const services = [
  {
    slug: "konsultointi",
    name: "Konsultointi",
    icon: MessageCircle,
    shortDescription: "Ammatillinen konsultaatio elämän eri tilanteiden selkeyttämiseen ja päätöksenteon tueksi.",
    duration: "50 minuuttia",
    fee: "90 €",
    includes: "Yksilöllinen neuvontatapaaminen psykologin kanssa, tilaa pohdiskeluun.",
    detail: [
      "Konsultaatiossa voidaan käsitellä monenlaisia elämäntilanteita, kuten ihmissuhteisiin tai perheeseen liittyviä pohdintoja, työelämän kuormitusta, ammatillisia haasteita, uupumusta tai päätöksiä, jotka kaipaavat selkeyttä.",
      "Konsultaatio ei ole terapiaa eikä tunne-elämän syvällistä käsittelyä. Se tarjoaa ammatillisen ja kannattelevan tilan yhteiseen ajatteluun ilman pitkäaikaista hoitoa tai sitoutumista.",
    ],
    available: true,
  },
  {
    slug: "terapia",
    name: "Terapia",
    icon: Heart,
    shortDescription: "Yksilöllinen istunto, jossa keskitytään psykologiseen tukeen, uusien näkökulmien löytämiseen ja henkilökohtaiseen kasvuun.",
    duration: "50 min",
    fee: "90 €",
    includes: "Arviointi, terapeuttiset menetelmät ja hoitosuunnitelma.",
    detail: [
      "Istunnoissa voidaan käsitellä henkilökohtaisia huolia, parisuhde- ja ihmissuhdeongelmia, perheeseen ja vanhemmuuteen liittyviä kysymyksiä sekä elämänmuutoksiin liittyviä haasteita, käyttäen esimerkiksi CBT-, EMDR- tai ACT-menetelmiä.",
      "Tarjoamme lyhytkestoista terapiaa, yleensä 8–12 istuntoa, joskus jopa 20. Istuntoja ohjaa laillistettu psykologi, joka noudattaa suomalaisia ammattistandardeja.",
    ],
    available: true,
  },
  {
    slug: "vertaisryhmat",
    name: "Vertaisryhmät",
    icon: Users,
    shortDescription: "Ryhmä, jossa jaetaan kokemuksia ja käsitellään yhteisiä teemoja (esim. omaishoitajat, maahanmuuttajat).",
    duration: "60–90 min",
    fee: "50 € / hlö",
    includes: "Ohjattua keskustelua ja mahdollisuus jakaa omia kokemuksia.",
    detail: ["Ryhmien teemat ja aikataulut voivat vaihdella ajan myötä."],
    available: true,
  },
  {
    slug: "neuropsykologia",
    name: "Neuropsykologia",
    icon: Stethoscope,
    shortDescription: "Erikoistuneet kognitiiviset arvioinnit ja aivoterveyden seuranta — parhaillaan kehitteillä.",
    duration: "60–90 minuuttia",
    fee: "Ei vielä saatavilla",
    includes: "Kliininen haastattelu, standardoidut kognitiiviset työkalut, yhteenveto.",
    detail: [
      "Neuropsykologiset arvioinnit toteutetaan aina kasvotusten. Etä- tai verkkotestaus ei ole mahdollista. Arvioinnit ovat saatavilla arabiaksi ja englanniksi.",
    ],
    available: false,
  },
];

export default function OurServicesPageFi() {
  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
        <h1 className="font-display text-headline-lg text-primary mb-4">
          Palvelumme Helsingissä
        </h1>
        <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">
          Yksilökäynnit, vertaisryhmät ja erikoisarvioinnit — räätälöity tarpeisiisi.
        </p>
      </section>

      {services.map((service, i) => (
        <Reveal key={service.slug}>
          <section id={service.slug} className={`px-4 md:px-16 py-12 md:py-16 scroll-mt-24 ${i % 2 === 1 ? "bg-surface-container-high" : ""}`}>
            <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1">
                <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center mb-4">
                  <service.icon className="text-primary-fixed" size={26} />
                </div>
                <h2 className="font-display text-headline-md text-primary mb-2">{service.name}</h2>
                <p className="text-on-surface-variant text-body-md">{service.shortDescription}</p>
                {!service.available && (
                  <span className="inline-block mt-4 bg-primary/90 text-white px-4 py-1 rounded-full text-xs text-label-lg">
                    KEHITTEILLÄ
                  </span>
                )}
              </div>
              <div className="lg:col-span-2 space-y-6">
                {serviceImages[service.slug] && (
                  <Photo
                    src={serviceImages[service.slug]}
                    alt={`${service.name} WellSightin vastaanotolla, Helsinki`}
                    className="hidden md:block aspect-[4/3] rounded-xl w-full max-w-xs"
                  />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-container-lowest rounded-xl p-6 service-card-shadow">
                  <div>
                    <p className="text-label-md uppercase tracking-widest text-on-surface-variant/70 mb-1">Kesto</p>
                    <p className="text-body-md text-on-surface">{service.duration}</p>
                  </div>
                  <div>
                    <p className="text-label-md uppercase tracking-widest text-on-surface-variant/70 mb-1">Hinta</p>
                    <p className="text-body-md text-on-surface">{service.fee}</p>
                  </div>
                  <div>
                    <p className="text-label-md uppercase tracking-widest text-on-surface-variant/70 mb-1">Sisältää</p>
                    <p className="text-body-md text-on-surface">{service.includes}</p>
                  </div>
                </div>
                <div className="space-y-3 text-on-surface-variant text-body-md">
                  {service.detail.map((p) => (
                    <p key={p.slice(0, 30)}>{p}</p>
                  ))}
                </div>
                {service.available ? (
                  <Link href={`/fi/book-and-pay?service=${englishSlugs[service.slug] ?? ""}`} className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-full text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-105">
                    <CheckCircle2 size={18} />
                    Varaa {service.name.toLowerCase()}
                  </Link>
                ) : (
                  <button className="border-2 border-outline text-outline px-8 py-3 rounded-full text-label-lg cursor-not-allowed" disabled>
                    Ilmoita kiinnostuksesta
                  </button>
                )}
              </div>
            </div>
          </section>
        </Reveal>
      ))}
    </>
  );
}
