import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import Misunderstandings from "@/components/Misunderstandings";
import { getPageSeo } from "@/lib/pageSeo";

// Client-provided translation (real copy, not machine-translated).
const misunderstandingsFi = [
  {
    misconception: "Saan heti hoitosuunnitelman tai tulokset.",
    clarification: "Ensimmäinen tapaaminen on tarkoitettu tilanteesi ymmärtämiseen. Suunnitelma rakentuu vähitellen.",
  },
  {
    misconception: "Psykologi ratkaisee ongelmani välittömästi.",
    clarification: "Terapiassa muutos on prosessi, ja se vie aikaa.",
  },
  {
    misconception: "Jos en tiedä mitä sanoa, olen epäonnistunut.",
    clarification: "Myös hiljaisuus, epäröinti tai keskeneräiset ajatukset ovat täysin ok tapa aloittaa.",
  },
  {
    misconception: "Psykologin on jaettava tietoni viranomaisten kanssa.",
    clarification: "Keskustelut ovat luottamuksellisia. Tietoja jaetaan vain, jos annat siihen luvan tai laki velvoittaa.",
  },
  {
    misconception: "Psykologi voi lukea ajatuksiani.",
    clarification: "Psykologit eivät lue ajatuksia. Työ perustuu siihen, mitä jaat itse.",
  },
  {
    misconception: "Jos en kerro kaikkea, terapeutti saa sen silti selville.",
    clarification: "Avoimuus auttaa parhaiten eteenpäin. Salaaminen voi hidastaa prosessia.",
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/fi/firstsession");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/fi/firstsession" },
  };
}

export default function FirstSessionPageFi() {
  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="font-display text-headline-lg text-primary mb-6">
              Terapian aloittaminen — ensimmäinen tapaaminen
            </h1>
            <div className="space-y-5 text-on-surface-variant text-body-lg">
              <p>
                Psykologin tehtävä on kuunnella sinua tarkasti ja kunnioittavasti. Saat kertoa
                asioista omaan tahtiisi.
              </p>
              <p>
                Ei ole olemassa oikeaa tai väärää tapaa kertoa. Riittää, että kerrot sen niin kuin
                itse koet.
              </p>
              <p>
                Sinun ei tarvitse miettiä täydellisiä sanoja. Keskitymme yhdessä siihen, mikä on
                sinulle tärkeää juuri nyt.
              </p>
              <p>
                Ensimmäinen tapaaminen ei vielä tarjoa valmista ratkaisua. Se on alku, jossa
                tutustumme tilanteeseesi ja mietimme yhdessä seuraavia askelia.
              </p>
            </div>
          </div>
          <Photo
            src="/images/consultation-room.jpg"
            alt="Rauhallinen, yksityinen vastaanottohuone WellSightissa, jossa ensimmäiset tapaamiset pidetään"
            className="aspect-[4/5] rounded-xl w-full order-1 lg:order-2"
          />
        </div>
      </section>

      <Reveal>
        <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
          <HeartHandshake className="text-primary mx-auto mb-4" size={32} />
          <h2 className="font-display text-headline-md text-primary mb-6">
            Valmiina ottamaan ensimmäisen askeleen?
          </h2>
          <Link href="/fi/book-and-pay" className="inline-block bg-primary text-on-primary px-10 py-4 rounded-full text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-105">
            Varaa aika
          </Link>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-surface-container py-16 md:py-24 px-4 md:px-16">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="font-display text-headline-md text-primary mb-10 text-center">
              Yleisiä väärinkäsityksiä terapiasta
            </h2>
            <Misunderstandings items={misunderstandingsFi} />
          </div>
        </section>
      </Reveal>
    </>
  );
}
