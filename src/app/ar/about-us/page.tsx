import type { Metadata } from "next";
import { Ear, Globe2, ScaleIcon, HandHeart, Users2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/ar/about-us");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/ar/about-us" },
  };
}

const principles = [
  { icon: Ear, title: "الاستماع بإنصات", description: "نحن لا نسمعك فقط - بل ننصت بقلوبنا وعقولنا." },
  { icon: Globe2, title: "الاحترام الثقافي", description: "نحن نحترم ونُرحب بالجميع، على اختلاف خلفياتهم وثقافاتهم." },
  { icon: ScaleIcon, title: "النزاهة", description: "نحن نلتزم بالمعايير الأخلاقية والشفافية في كل ما نقوم به." },
  { icon: HandHeart, title: "الحيادية", description: "نرحّب بقصتك كما هي، بلا أحكام ولا تصنيفات." },
  { icon: Users2, title: "الشمولية", description: "يستحق الجميع الحصول على رعاية جيدة خالية من التحيز." },
];

export default function AboutUsPageAr() {
  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto">
        <div className="max-w-3xl">
          <h1 className="font-display text-headline-lg text-primary mb-6">
            نبذة عن WellSight — أخصائية نفسية في هلسنكي
          </h1>
          <p className="text-on-surface-variant text-body-lg mb-4">
            نؤمن في WellSight بأن الصحة النفسية جزء أساسي من حياة متوازنة وذات معنى. ومن هنا
            جاءت رسالتنا: توفير مساحة آمنة، مهنية، قائمة على المعرفة العلمية، يجد فيها كل شخص
            الدعم الذي يحتاجه لفهم نفسه بشكل أعمق، والنمو، والتقدّم بثقة.
          </p>
          <p className="text-on-surface-variant text-body-lg">
            ما يميز WellSight هو الجمع بين المعرفة العلمية الموثوقة والحضور الإنساني الدافئ. نسعى
            لأن تكون كل جلسة فرصة حقيقية لاستعادة التوازن، واتخاذ خطوات ذات معنى.
          </p>
        </div>
      </section>

      <Reveal>
        <section className="bg-surface-container py-16 md:py-24 px-4 md:px-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-display text-headline-md text-primary">
                الصحة النفسية أوسع من مجرد أعراض
              </h2>
              <p className="text-on-surface-variant text-body-md">
                في WellSight نؤمن أن الرعاية النفسية لا تقتصر على تخفيف الأعراض أو تقليل الألم
                العاطفي، بل هي رحلة شمولية تحتضن الإنسان بكامله.
              </p>
              <h2 className="font-display text-headline-md text-primary pt-4">
                العلاج قصير الأمد… خطوات واضحة وأثر عميق
              </h2>
              <p className="text-on-surface-variant text-body-md">
                نؤمن بأن العلاج الفعال لا يجب أن يستغرق سنوات. نتّبع أسلوبًا عمليًا ومركّزًا،
                نضع أهدافًا واضحة ونعمل معك بخطوات محددة تساعدك على إيجاد الراحة والوضوح.
              </p>
            </div>
            <Photo
              src="/images/about-therapy-conversation.jpg"
              alt="حوار داعم بين أخصائية WellSight النفسية وإحدى العميلات"
              className="aspect-[4/5] rounded-xl w-full"
            />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto">
          <h2 className="font-display text-headline-md text-primary mb-10 text-center">
            القيم التي نعمل بها
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
        <section className="bg-deep-green py-16 md:py-24 px-4 md:px-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Photo
              src="/images/psychologist-portrait.png"
              alt="الأخصائية النفسية في WellSight داخل عيادتها في هلسنكي"
              className="aspect-square rounded-xl w-full"
            />
            <div className="space-y-6">
              <h2 className="font-display text-headline-md text-on-deep-green">رسالتي</h2>
              <p className="text-on-deep-green/80 text-body-md">
                يكمن وراء كل صراع قصة تنتظر من يفهمها، وقد قادني هذا الاعتقاد إلى إنشاء
                WellSight. تأسست WellSight على وعد بسيط: أن تكون مساحة آمنة وداعمة لاستكشاف
                الشفاء والعافية النفسية.
              </p>
              <div>
                <h4 className="text-label-lg text-on-deep-green mb-1 uppercase tracking-widest">
                  المؤهلات العلمية والعملية
                </h4>
                <p className="text-on-deep-green/80 text-body-md">
                  بكالوريوس في علم النفس | ماجستير في علم النفس العصبي | العلاج بتقنية EMDR |
                  العلاج بالتعرض المطول (PE) | العلاج المرتكز على المشاعر (EFT) للأزواج والأسر.
                </p>
              </div>
              <div>
                <h4 className="text-label-lg text-on-deep-green mb-1 uppercase tracking-widest">اللغات</h4>
                <p className="text-on-deep-green/80 text-body-md">
                  الخدمات باللغتين العربية والإنجليزية، مع كفاءة ثقافية عالية.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
