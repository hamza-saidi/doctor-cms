import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Heart, Brain, Sparkles, CheckCircle2, MapPin, Clock, TrainFront, Laptop } from "lucide-react";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import ContactForm from "@/components/ContactForm";
import LocationMap from "@/components/LocationMap";
import { business } from "@/lib/content";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/ar");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/ar" },
  };
}

export default function HomePageAr() {
  return (
    <>
      <section className="relative min-h-[600px] h-[80vh] md:h-[780px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-primary">
          <Image
            src="/images/hero-calm-woman-lakeside.jpg"
            alt="امرأة تجد الهدوء والوضوح في الهواء الطلق — التوازن الذي يدعمه علاج WellSight"
            fill
            sizes="100vw"
            priority
            className="object-cover object-[68%_28%]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/75 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-primary/10" />
        </div>
        <div className="relative z-10 px-4 md:px-16 max-w-[1280px] mx-auto w-full">
          <div className="max-w-2xl text-white">
            <h1 className="font-display text-display-lg mb-4">
              WellSight — أخصائية نفسية في هلسنكي
            </h1>
            <p className="font-display text-headline-md leading-tight mb-8 md:mb-10 opacity-90">
              مساحتك لاستكشاف الشفاء والوضوح والنمو الشخصي
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/ar/book-and-pay" className="bg-white text-on-primary-fixed px-8 py-4 rounded-full text-label-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 text-center">
                احجز جلستك
              </Link>
              <Link href="/ar/about-us" className="border border-white/40 backdrop-blur-sm text-white px-8 py-4 rounded-full text-label-lg hover:bg-white/20 hover:scale-105 transition-all duration-500 text-center">
                نبذة عنا
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="py-[clamp(60px,10vw,120px)] px-4 md:px-16 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 md:space-y-8">
              <h2 className="font-display text-headline-lg text-primary">من نحن</h2>
              <div className="space-y-4 md:space-y-6 text-on-surface-variant text-body-lg">
                <p>
                  جاء تأسيس WellSight من إيماننا العميق بأهمية أن يجد الإنسان مساحة آمنة وذات
                  معنى، يستعيد فيها توازنه، ويجد الإصغاء الحقيقي، والدعم الذي يحتاجه ليفهم ذاته
                  بعمق.
                </p>
                <p>
                  في WellSight ندمج بين العلم والإنسانية، لنوفّر بيئة مهنية، رحبة، ومبنية على
                  الثقة، حيث يصبح النمو الشخصي والراحة النفسية ممكنَين وقابلَين للتحقق.
                </p>
                <Link href="/ar/about-us" className="inline-block text-primary border-b border-primary/30 pb-1 text-label-lg hover:border-primary hover:opacity-70 transition-all duration-500">
                  تعرّف على الأخصائية النفسية خلف WellSight
                </Link>
              </div>
            </div>
            <div>
              <Photo
                src="/images/therapy-room-helsinki.jpg"
                alt="غرفة العلاج الهادئة في عيادة WellSight بهلسنكي"
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
              <h2 className="font-display text-headline-lg text-primary mb-4">خدماتنا</h2>
              <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">
                دعم نفسي مصمم خصيصًا لرحلتك نحو الوضوح والعافية.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-surface-container-lowest rounded-xl overflow-hidden service-card-shadow flex flex-col">
                <Photo
                  src="/images/consultation-room.jpg"
                  alt="الاستشارات النفسية في عيادة WellSight بهلسنكي"
                  className="h-48 md:h-64 w-full"
                />
                <div className="p-6 md:p-8 flex-grow">
                  <h3 className="font-display text-headline-sm text-primary mb-3">الاستشارات النفسية والأسرية</h3>
                  <p className="text-on-surface-variant text-body-md">
                    استشارات مهنية تهدف إلى تنظيم الأفكار ودعم اتخاذ القرارت.
                  </p>
                </div>
                <div className="p-6 md:p-8 pt-0 mt-auto">
                  <Link href="/ar/our-services" className="block w-full text-center py-3 rounded-full text-label-lg border-2 border-primary text-primary hover:bg-primary hover:text-on-primary transition-all duration-500">
                    عرض تفاصيل الاستشارة
                  </Link>
                </div>
              </div>
              <div className="relative bg-surface-container-lowest rounded-xl overflow-hidden service-card-shadow flex flex-col border-2 border-primary/10">
                <Photo
                  src="/images/therapy-room-helsinki.jpg"
                  alt="جلسات العلاج النفسي في عيادة WellSight بهلسنكي"
                  className="h-48 md:h-64 w-full"
                />
                <div className="p-6 md:p-8 flex-grow">
                  <h3 className="font-display text-headline-sm text-primary mb-3">الدعم والجلسات العلاجية</h3>
                  <p className="text-on-surface-variant text-body-md">
                    جلسات علاجية قصيرة للشفاء العاطفي والنمو وفهم الذات.
                  </p>
                </div>
                <div className="p-6 md:p-8 pt-0 mt-auto">
                  <Link href="/ar/book-and-pay" className="block w-full text-center py-3 rounded-full text-label-lg bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-all duration-500">
                    احجز جلسة علاجية
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-[clamp(60px,10vw,120px)] px-4 md:px-16 max-w-[1280px] mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="space-y-6 md:space-y-8">
              <h2 className="font-display text-headline-lg text-primary">لماذا WellSight‏؟</h2>
              <ul className="space-y-4">
                {["السرّية أساس رعايتنا", "جلسات حضورية أو عبر الإنترنت", "بيئة آمنة وشاملة ترحّب بالجميع"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-label-lg text-primary">
                    <CheckCircle2 size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-primary-fixed p-6 md:p-8 rounded-xl">
                  <ShieldCheck className="text-primary mb-4" size={32} strokeWidth={1.5} />
                  <h4 className="font-display text-headline-sm text-primary mb-2">السرّية</h4>
                  <p className="text-on-surface-variant text-body-md">السرّية أساس رعايتنا في كل تفاعل.</p>
                </div>
                <div className="bg-primary-fixed-dim p-6 md:p-8 rounded-xl">
                  <Heart className="text-primary mb-4" size={32} strokeWidth={1.5} />
                  <h4 className="font-display text-headline-sm text-primary mb-2">الشمولية</h4>
                  <p className="text-on-surface-variant text-body-md">بيئة آمنة وشاملة ترحّب بالجميع.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-primary-fixed p-6 md:p-8 rounded-xl">
                  <Brain className="text-primary mb-4" size={32} strokeWidth={1.5} />
                  <h4 className="font-display text-headline-sm text-primary mb-2">مبني على الأدلة</h4>
                  <p className="text-on-surface-variant text-body-md">رعاية واضحة وهادفة تساعدك على التقدّم.</p>
                </div>
                <div className="bg-primary-fixed p-6 md:p-8 rounded-xl">
                  <Sparkles className="text-primary mb-4" size={32} strokeWidth={1.5} />
                  <h4 className="font-display text-headline-sm text-primary mb-2">ثقة ومهنية</h4>
                  <p className="text-on-surface-variant text-body-md">ترافقك في كل خطوة من رحلتك.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="bg-surface py-[clamp(60px,10vw,120px)] px-4 md:px-16 border-t border-surface-variant">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">
              <div className="lg:col-span-7">
                <LocationMap locale="ar" className="h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl border-2 border-deep-green w-full" />
              </div>
              <div className="lg:col-span-5 flex flex-col justify-center space-y-8 md:space-y-12">
                <h2 className="font-display text-headline-lg text-primary">الموقع</h2>
                <div className="space-y-6 md:space-y-8">
                  <div className="flex gap-4 md:gap-6">
                    <MapPin className="text-primary flex-shrink-0" size={28} />
                    <div>
                      <p className="text-body-lg text-on-surface">
                        {business.address.street}<br />
                        {business.address.postalCode} {business.address.city}, {business.address.country}
                      </p>
                      <p className="mt-2 text-on-surface-variant text-body-md italic">
                        على بُعد دقائق قليلة من كامبّي ومحطة هلسنكي المركزية.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 md:gap-6">
                    <Clock className="text-primary flex-shrink-0" size={28} />
                    <p className="text-body-lg text-on-surface">الاثنين – الجمعة: 8:00 – 18:00</p>
                  </div>
                  <div className="flex gap-4 md:gap-6">
                    <TrainFront className="text-primary flex-shrink-0" size={28} />
                    <p className="text-body-md text-on-surface-variant">
                      سهل الوصول بالترام أو المترو أو مشيًا على الأقدام.
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
              <h2 className="font-display text-headline-lg text-on-deep-green">الجلسات أونلاين</h2>
              <p className="font-body text-on-deep-green/80 text-body-lg">
                خدماتنا عبر الإنترنت مصممة لتناسب أسلوب حياتك — مرنة وسرية وآمنة تمامًا.
              </p>
              <div className="flex items-start gap-4">
                <Laptop className="text-on-deep-green mt-1 flex-shrink-0" size={24} />
                <p className="text-on-deep-green/80 text-body-md">
                  لا حاجة إلى برامج إضافية — انضم مباشرةً من متصفحك بعد الحجز.
                </p>
              </div>
              <Link href="/ar/how-we-meet" className="inline-block w-full sm:w-auto bg-primary-fixed text-on-primary-fixed px-10 py-4 rounded-full text-label-lg hover:bg-white hover:scale-105 transition-all duration-500 text-center">
                احجز جلسة أونلاين
              </Link>
            </div>
            <Photo
              src="/images/online-therapy-session.png"
              alt="امرأة تنضم إلى جلسة علاج عبر الإنترنت مع WellSight من حاسوبها المحمول"
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
                <h2 className="font-display text-headline-lg text-primary">تواصل معنا</h2>
                <div className="space-y-6">
                  <a href={`mailto:${business.email}`} className="flex items-center gap-4 group">
                    <span className="text-body-lg group-hover:text-primary transition-colors">{business.email}</span>
                  </a>
                  <p className="text-body-lg text-on-surface-variant">WhatsApp: {business.phoneDisplay}</p>
                </div>
              </div>
              <ContactForm locale="ar" />
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
