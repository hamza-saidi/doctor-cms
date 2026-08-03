import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import Misunderstandings from "@/components/Misunderstandings";
import { getPageSeo } from "@/lib/pageSeo";

// Client-provided translation (real copy, not machine-translated).
const misunderstandingsAr = [
  {
    misconception: "سأحصل على خطة العلاج أو النتائج على الفور.",
    clarification: "الجلسة الأولى هي لفهم قصتك. تتطور الخطة تدريجياً.",
  },
  {
    misconception: "سيحل الأخصائي النفسي مشكلتي على الفور.",
    clarification: "العلاج عبارة عن عملية - التغيير الهادف يستغرق وقتًا.",
  },
  {
    misconception: "إذا لم أعرف ماذا أقول، فهذا فشل.",
    clarification: "الصمت أو التردد أو الأفكار المبعثرة كلها طرق صحيحة للبدء.",
  },
  {
    misconception: "يجب على الأخصائي النفسي مشاركة مستنداتي مع السلطات الحكومية.",
    clarification:
      "سجلات العلاج النفسي خاصة. ولا تتم مشاركتها إلا إذا طلبت ذلك كتابياً، أو إذا كان هناك التزام قانوني واضح.",
  },
  {
    misconception: "يمكن الأخصائي النفسي قراءة أفكاري.",
    clarification: "الأخصائيون النفسيون ليسوا قارئي أفكار. نحن نعتمد على ما تشاركه أنت ومعرفتنا لدعمك.",
  },
  {
    misconception: "إذا أخفيت التفاصيل، سيكتشف المعالج ذلك على أي حال.",
    clarification:
      "يعمل العلاج بشكل أفضل مع الصدق والثقة. قد يؤدي إخفاء التفاصيل إلى تأخير التقدم، بينما يساعد الانفتاح على الوصول إلى أفضل النتائج.",
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/ar/firstsession");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/ar/firstsession" },
  };
}

export default function FirstSessionPageAr() {
  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-headline-lg text-primary mb-6">
              بدء العلاج — جلستك الأولى
            </h1>
            <div className="space-y-5 text-on-surface-variant text-body-lg">
              <p>
                بصفتي أخصائية نفسية، يتمثل دوري في الاستماع بانتباه إلى قصتك بعناية واحترام. هذه
                هي مساحتك لمشاركة قصتك بالسرعة التي تناسبك وبكلماتك الخاصة.
              </p>
              <p>
                لا تحتاجين إلى إعداد كلمات مثالية أو تفسيرات دقيقة، فتركيزي منصبّ على أن أكون
                حاضرة معك بالكامل، وأساعدك على التأمل والتفكير.
              </p>
              <p>
                الجلسة الأولى ليست مخصّصة لإيجاد حلول سريعة أو نتائج فورية، بل تُعتبر نقطة انطلاق
                لفهم خلفيتك ومشاعرك والعوامل التي تشكّل تجربتك.
              </p>
            </div>
          </div>
          <Photo
            src="/images/consultation-room.jpg"
            alt="غرفة استشارات هادئة وخاصة في WellSight حيث تُعقد الجلسات الأولى"
            className="aspect-[4/5] rounded-xl w-full"
          />
        </div>
      </section>

      <Reveal>
        <section className="bg-surface-container py-16 md:py-24 px-4 md:px-16">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="font-display text-headline-md text-primary mb-10 text-center">
              المعتقدات
            </h2>
            <Misunderstandings items={misunderstandingsAr} />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
          <HeartHandshake className="text-primary mx-auto mb-4" size={32} />
          <h2 className="font-display text-headline-md text-primary mb-6">
            مستعدة لاتخاذ الخطوة الأولى؟
          </h2>
          <Link href="/ar/book-and-pay" className="inline-block bg-primary text-on-primary px-10 py-4 rounded-full text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-105">
            احجزي جلسة
          </Link>
        </section>
      </Reveal>
    </>
  );
}
