import type { Metadata } from "next";
import { Ear, Globe2, ScaleIcon, HandHeart, Users2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/fi/about-us");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/fi/about-us" },
  };
}

const principles = [
  { icon: Ear, title: "Syvä kuuntelu", description: "Emme vain kuule – kuuntelemme sydämellä ja mielellä." },
  { icon: Globe2, title: "Kulttuurinen herkkyys", description: "Kunnioitamme identiteettiäsi, taustaasi ja kokemustasi." },
  { icon: ScaleIcon, title: "Rehellisyys", description: "Noudatamme eettisiä normeja ja avoimuutta kaikessa toiminnassamme." },
  { icon: HandHeart, title: "Muu kuin tuomio", description: "Tarinasi on tervetullut juuri sellaisena kuin se on." },
  { icon: Users2, title: "Osallisuus", description: "Kaikki ansaitsevat laadukkaan ja ennakkoluulottoman hoidon." },
];

export default function AboutUsPageFi() {
  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto">
        <div className="max-w-3xl">
          <h1 className="font-display text-headline-lg text-primary mb-6">
            Tietoa WellSightistä — psykologi Helsingissä
          </h1>
          <p className="text-on-surface-variant text-body-lg mb-4">
            Tämä on sydänkeskeinen lähestymistapa, jossa läsnäolo, myötätunto ja syvä kuuntelu
            ohjaavat jokaista vuorovaikutusta. Sinua ei koskaan hoputeta tai tuomita, vaan näemme
            sinut aidosti ja kuljemme rinnallasi.
          </p>
          <p className="text-on-surface-variant text-body-lg">
            Lähtökohtasi voi olla mikä tahansa – kuljemme rinnallasi kohti selkeyttä, voimaa ja
            hyvinvointia.
          </p>
        </div>
      </section>

      <Reveal>
        <section className="bg-surface-container py-16 md:py-24 px-4 md:px-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-display text-headline-md text-primary">
                Hoidamme kokonaisuutta, emme vain oireita
              </h2>
              <p className="text-on-surface-variant text-body-md">
                Psykologinen tuki ei ole pelkkää oireiden lievittämistä. Katsomme ihmistä
                kokonaisuutena – ajatukset, tunteet ja kokemukset. Tavoitteena on vahvistaa
                voimavaroja ja taitoja, jotka kantavat pitkällä.
              </p>
              <h2 className="font-display text-headline-md text-primary pt-4">
                Terapia, jossa on tavoite ja merkitys
              </h2>
              <p className="text-on-surface-variant text-body-md">
                Hyvä hoito voi edetä tuloksellisesti myös ilman vuosien prosessia.
                Lähestymistapamme on selkeä, tavoitteellinen ja tarpeisiisi räätälöity. Saat
                voimaa ja konkreettisia työkaluja muutokseen ilman turhaa kuormitusta.
              </p>
            </div>
            <Photo
              src="/images/about-therapy-conversation.jpg"
              alt="Tukea antava keskustelu WellSightin psykologin ja asiakkaan välillä"
              className="aspect-[4/5] rounded-xl w-full"
            />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto">
          <h2 className="font-display text-headline-md text-primary mb-10 text-center">
            Arvot, joiden mukaan toimimme
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {principles.map((p) => (
              <div key={p.title} className="bg-surface-container-lowest p-6 rounded-xl service-card-shadow text-center">
                <p.icon className="text-primary mx-auto mb-3" size={28} />
                <h3 className="font-display text-headline-sm text-primary mb-2">{p.title}</h3>
                <p className="text-on-surface-variant text-sm">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-primary-container py-16 md:py-24 px-4 md:px-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Photo
              src="/images/psychologist-portrait.png"
              alt="WellSightin psykologi omassa vastaanotossaan Helsingissä"
              className="aspect-square rounded-xl w-full"
            />
            <div className="space-y-6">
              <h2 className="font-display text-headline-md text-primary-fixed">Tehtäväni</h2>
              <p className="text-on-primary-container text-body-md">
                Jokaisen kamppailun takana on tarina, joka odottaa ymmärrystä, ja tämä usko sai
                minut perustamaan WellSightin. WellSight perustettiin yksinkertaisen lupauksen
                varaan: turvallinen, kannustava tila, jossa voi tutkia paranemista ja henkistä
                hyvinvointia.
              </p>
              <div>
                <h4 className="text-label-lg text-white mb-1 uppercase tracking-widest">
                  Todistukset ja kokemus
                </h4>
                <p className="text-on-primary-container text-body-md">
                  Psykologian kandidaatti | Neuropsykologian maisteri | EMDR-terapia |
                  Pitkäkestoinen altistusterapia (PE) | Tunnekeskeinen terapia (EFT) pareille ja
                  perheille | Neuropsykologinen arviointi.
                </p>
              </div>
              <div>
                <h4 className="text-label-lg text-white mb-1 uppercase tracking-widest">Kielet</h4>
                <p className="text-on-primary-container text-body-md">
                  Palvelut arabiaksi ja englanniksi; kulttuurisensitiivinen hoito.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
