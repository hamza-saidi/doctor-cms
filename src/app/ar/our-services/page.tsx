import type { Metadata } from "next";
import Link from "next/link";
import { Users, Heart, MessageCircle, Stethoscope, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/ar/our-services");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/ar/our-services" },
  };
}

const serviceImages: Record<string, string> = {
  "الاستشارات": "/images/consultation-room.jpg",
  "العلاج": "/images/therapy-room-helsinki.jpg",
  "علم-النفس-العصبي": "/images/neuropsychology-assessment.jpg",
};

// Maps this page's Arabic slugs to the English Prisma slugs the actual
// booking form (English-only) reads, so the service pre-selects correctly
// after the ar → ar/book-and-pay → book-and-pay hand-off.
const englishSlugs: Record<string, string> = {
  "الاستشارات": "consultation",
  "العلاج": "therapy",
  "الدعم-الجماعي": "peer-group",
  "علم-النفس-العصبي": "neuropsychology",
};

const services = [
  {
    slug: "الاستشارات",
    name: "الاستشارات النفسية والأسرية",
    icon: MessageCircle,
    shortDescription: "استشارات مهنية تهدف إلى تنظيم الأفكار ودعم اتخاذ القرارات.",
    duration: "50 دقيقة",
    fee: "90 يورو",
    includes: "استشارة فردية مع أخصائي نفسي، ومساحة للتفكير المنظم.",
    detail: [
      "يمكن أن تتناول هذه الجلسات قضايا حياتية مختلفة، مثل التفكير في العلاقات الشخصية أو الأسرية، الضغوط المهنية، الإرهاق الوظيفي، أو قرارات تتطلّب وضوحًا.",
      "هذه الجلسات ليست علاجًا نفسيًا عميقًا، بل توفّر فرصة للتفكير المشترك مع مختص ضمن إطار مهني داعم، وبدون الحاجة إلى التزام طويل الأمد.",
    ],
    available: true,
  },
  {
    slug: "العلاج",
    name: "الدعم والجلسات العلاجية",
    icon: Heart,
    shortDescription: "جلسات علاجية قصيرة لاستكشاف الشفاء العاطفي والنمو وفهم الذات.",
    duration: "50 دقيقة",
    fee: "90 يورو",
    includes: "تقييم مبدئي، أدوات علاجية، ووضع خطة علاجية مشتركة.",
    detail: [
      "قد تساعد جلساتنا الفردية في التعامل مع التحديات النفسية والحياتية بأسلوب عملي، بما في ذلك التحديات الزوجية والأسرية أو التحولات الحياتية.",
      "نقدّم جلسات علاجية قصيرة المدى، عادة ما بين 8 و12 جلسة، وقد تمتد أحيانًا إلى 20 جلسة، على يد أخصائي نفسي معتمد ووفقًا للمعايير المهنية الفنلندية.",
    ],
    available: true,
  },
  {
    slug: "الدعم-الجماعي",
    name: "جلسات الدعم الجماعي",
    icon: Users,
    shortDescription: "جلسات جماعية لتبادل الدعم والفهم حول قضايا مشتركة (مثل تحديات الهجرة).",
    duration: "60-90 دقيقة",
    fee: "50 يورو للشخص",
    includes: "حوار موجَّه، وأنشطة مساندة مثل التدوين وأدوات التأمل الذاتي.",
    detail: ["قد تختلف مواعيد المجموعات ومواضيعها بمرور الوقت."],
    available: true,
  },
  {
    slug: "علم-النفس-العصبي",
    name: "علم النفس العصبي",
    icon: Stethoscope,
    shortDescription: "تقييمات معرفية متخصصة ومراقبة صحة الدماغ — قيد التطوير حاليًا.",
    duration: "60-90 دقيقة",
    fee: "غير متاحة بعد",
    includes: "مقابلة سريرية، أدوات معرفية معيارية، وملخص موجز.",
    detail: [
      "يجب إجراء التقييمات النفسية العصبية حضوريًا دائمًا. الاختبار عن بُعد غير ممكن. ستتوفر الخدمات باللغتين العربية والإنجليزية.",
    ],
    available: false,
  },
];

export default function OurServicesPageAr() {
  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
        <h1 className="font-display text-headline-lg text-primary mb-4">خدماتنا في هلسنكي</h1>
        <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">
          جلسات فردية، جلسات جماعية، وتقييمات متخصصة — مصممة خصيصًا لأهدافك.
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
                    قيد التطوير
                  </span>
                )}
              </div>
              <div className="lg:col-span-2 space-y-6">
                {serviceImages[service.slug] && (
                  <Photo
                    src={serviceImages[service.slug]}
                    alt={`${service.name} في عيادة WellSight بهلسنكي`}
                    className="hidden md:block aspect-[4/3] rounded-xl w-full max-w-xs"
                  />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-container-lowest rounded-xl p-6 service-card-shadow">
                  <div>
                    <p className="text-label-md uppercase tracking-widest text-on-surface-variant/70 mb-1">المدة</p>
                    <p className="text-body-md text-on-surface">{service.duration}</p>
                  </div>
                  <div>
                    <p className="text-label-md uppercase tracking-widest text-on-surface-variant/70 mb-1">الرسوم</p>
                    <p className="text-body-md text-on-surface">{service.fee}</p>
                  </div>
                  <div>
                    <p className="text-label-md uppercase tracking-widest text-on-surface-variant/70 mb-1">تشمل</p>
                    <p className="text-body-md text-on-surface">{service.includes}</p>
                  </div>
                </div>
                <div className="space-y-3 text-on-surface-variant text-body-md">
                  {service.detail.map((p) => (
                    <p key={p.slice(0, 30)}>{p}</p>
                  ))}
                </div>
                {service.available ? (
                  <Link href={`/ar/book-and-pay?service=${englishSlugs[service.slug] ?? ""}`} className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-full text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-105">
                    <CheckCircle2 size={18} />
                    احجزي الآن
                  </Link>
                ) : (
                  <button className="border-2 border-outline text-outline px-8 py-3 rounded-full text-label-lg cursor-not-allowed" disabled>
                    سجّلي اهتمامك
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
