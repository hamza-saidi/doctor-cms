// Fallback title/description per page — used if a PageSeo row is somehow
// missing, and as the seed data reflecting the Lot 3 keyword research
// (see the keyword research report for the reasoning behind each choice).
export const seoDefaults: Record<string, { title: string; description: string }> = {
  "/": {
    title: "WellSight — Psychologist in Helsinki | Therapy in English & Arabic",
    description:
      "Private psychological practice in Helsinki offering therapy, consultation and family sessions in English and Arabic — in person near Kamppi or online.",
  },
  "/about-us": {
    title: "Arabic & English Speaking Psychologist in Helsinki | About WellSight",
    description:
      "Meet the licensed psychologist behind WellSight: evidence-based, culturally sensitive care in English and Arabic, with particular experience supporting immigrants and refugees.",
  },
  "/our-services": {
    title: "Therapy, Consultation & Couples Sessions in Helsinki | WellSight",
    description:
      "Explore WellSight's psychological services in Helsinki: therapy, consultation, peer group sessions, and neuropsychological assessment (coming soon) — in English and Arabic.",
  },
  "/how-we-meet": {
    title: "Online Therapy Finland or In-Person in Kamppi, Helsinki",
    description:
      "Choose how to meet: in-person sessions minutes from Kamppi and Helsinki Central Station, or secure online therapy from anywhere in Finland — in English and Arabic.",
  },
  "/firstsession": {
    title: "What to Expect in Your First Therapy Session | WellSight Helsinki",
    description:
      "Thinking about starting therapy? Learn what to expect in your first session with a psychologist at WellSight — a safe, confidential space in Helsinki or online.",
  },
  "/book-and-pay": {
    title: "Book a Therapy Session — Psychologist Near Kamppi, Helsinki",
    description:
      "Request a therapy, consultation, or peer group session with a licensed psychologist in Helsinki or online. Available in English and Arabic.",
  },

  // Finnish — titles made unique per page (the live site shared one title
  // across all fi subpages); descriptions carried over from the real site.
  "/fi": {
    title: "WellSight — Psykologi Helsingissä | Terapia ja konsultointi",
    description:
      "Helsingissä toimiva yksityinen psykologinen vastaanotto, joka tarjoaa ammattimaista psykologista neuvontaa ja terapiaa yksilöille, pariskunnille ja perheille englanniksi ja arabiaksi.",
  },
  "/fi/about-us": {
    title: "Psykologi Helsingissä | Tietoa WellSightistä",
    description:
      "Tutustu WellSightiin, yksityiseen psykologiseen vastaanottoon Helsingissä, joka tarjoaa ammattimaista psykologista neuvontaa ja terapiaa englanniksi ja arabiaksi.",
  },
  "/fi/our-services": {
    title: "Terapia, konsultointi ja neuropsykologia | WellSight Helsinki",
    description:
      "Tutustu WellSightin psykologisiin palveluihin Helsingissä: ammattitaitoista neuvontaa ja lyhytaikaista terapiaa yksilöille, pariskunnille ja perheille englanniksi ja arabiaksi.",
  },
  "/fi/how-we-meet": {
    title: "Verkkoterapia tai lähitapaaminen Kampissa, Helsinki",
    description:
      "Valitse tapaamistapa: henkilökohtaiset tapaamiset Helsingin toimistollamme tai verkkotuki missä tahansa oletkin. Luottamuksellinen, joustava ja saatavilla englanniksi ja arabiaksi.",
  },
  "/fi/firstsession": {
    title: "Mitä odottaa ensimmäiseltä terapiakäynniltä | WellSight",
    description:
      "Harkitsetko terapian aloittamista? Tutustu WellSightin psykologin ensimmäisen istunnon kulkuun. Turvallinen, luottamuksellinen tila Helsingissä tai verkossa.",
  },
  "/fi/book-and-pay": {
    title: "Varaa terapia-aika — Psykologi lähellä Kamppia, Helsinki",
    description:
      "Varaa aika psykologille WellSightissa. Valitse sinulle sopiva aika vastaanotolle verkossa tai Helsingissä.",
  },

  // Arabic — same approach: unique titles per page, descriptions from the
  // real site.
  "/ar": {
    title: "WellSight — أخصائية نفسية في هلسنكي | العلاج والاستشارة بالعربية",
    description:
      "عيادة نفسية خاصة في هلسنكي تقدم استشارات وعلاج نفسي احترافي للأفراد والأزواج والعائلات باللغتين الإنجليزية والعربية.",
  },
  "/ar/about-us": {
    title: "أخصائية نفسية ناطقة بالعربية في هلسنكي | عن WellSight",
    description:
      "تعرف على WellSight، عيادة نفسية خاصة في هلسنكي تقدم استشارات وعلاج نفسي احترافي للأفراد والأزواج والعائلات باللغتين الإنجليزية والعربية.",
  },
  "/ar/our-services": {
    title: "العلاج والاستشارة النفسية في هلسنكي | خدمات WellSight",
    description:
      "اكتشف خدمات WellSight النفسية في هلسنكي: استشارات مهنية وعلاج قصير الأمد للأفراد والأزواج والعائلات باللغتين الإنجليزية والعربية.",
  },
  "/ar/how-we-meet": {
    title: "علاج عبر الإنترنت أو حضوريًا قرب كامبّي، هلسنكي",
    description:
      "اختر طريقة اللقاء: جلسات حضورية في هلسنكي أو عبر الإنترنت. نقدّم لك الدعم أينما كنت، بسرية ومرونة، وباللغتين العربية والإنجليزية.",
  },
  "/ar/firstsession": {
    title: "ما يمكن توقعه في جلستك العلاجية الأولى | WellSight",
    description:
      "هل تفكر في بدء العلاج؟ تعرف على ما يمكن توقعه في جلستك الأولى مع أخصائي نفسي في WellSight. مكان آمن وسري في هلسنكي أو عبر الإنترنت.",
  },
  "/ar/book-and-pay": {
    title: "احجز جلسة علاجية — أخصائية نفسية قرب كامبّي، هلسنكي",
    description:
      "احجز جلستك مع طبيب نفسي مرخص في هلسنكي أو عبر الإنترنت. خدمات العلاج والاستشارة متوفرة في مكان آمن وسري وداعم.",
  },
};
