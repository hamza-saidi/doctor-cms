import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Wifi, Smartphone, MessageSquare } from "lucide-react";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import LocationMap from "@/components/LocationMap";
import { business } from "@/lib/content";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/ar/how-we-meet");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/ar/how-we-meet" },
  };
}

export default function HowWeMeetPageAr() {
  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
        <h1 className="font-display text-headline-lg text-primary mb-4">
          كيف نلتقي — حضوريًا في هلسنكي أو عبر الإنترنت
        </h1>
        <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">
          سواء كنت تسعى للحصول على دعم نفسي، أو لإجراء تقييم عصبي معرفي، أو حتى لمجرد مشاركة
          قصتك، ستجد هنا مكانًا يوفّر لك شعورًا بالأمان والدعم.
        </p>
      </section>

      <Reveal>
        <section className="bg-primary-fixed/40 px-4 md:px-16 py-12 md:py-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <LocationMap locale="ar" className="aspect-[4/3] rounded-xl w-full border-2 border-deep-green" />
            <div className="space-y-6">
              <h2 className="font-display text-headline-md text-primary">حضوريًا في هلسنكي</h2>
              <div>
                <h4 className="text-label-lg text-primary uppercase tracking-widest mb-1">العنوان وطرق الوصول</h4>
                <p className="text-body-md text-on-surface">
                  {business.address.street}، {business.address.postalCode} {business.address.city}، {business.address.country}
                </p>
                <p className="text-on-surface-variant text-sm mt-1">
                  على بُعد دقائق قليلة من كامبّي ومحطة هلسنكي المركزية. سهل الوصول بالترام أو
                  المترو أو مشيًا. المكان مزوّد بمصعد ومهيّأ لاستخدام الكراسي المتحركة.
                </p>
              </div>
              <div>
                <h4 className="text-label-lg text-primary uppercase tracking-widest mb-1">ساعات العمل</h4>
                <p className="text-body-md text-on-surface">من الاثنين إلى الجمعة: 8:00 – 18:00</p>
              </div>
              <div>
                <h4 className="text-label-lg text-primary uppercase tracking-widest mb-1">التواصل</h4>
                <p className="text-body-md text-on-surface">
                  WhatsApp: {business.phoneDisplay} · البريد الإلكتروني: {business.email}
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
              <h2 className="font-display text-headline-md text-primary">الجلسات أونلاين</h2>
              <div>
                <h4 className="text-label-lg text-primary uppercase tracking-widest mb-1">كيف تعمل</h4>
                <p className="text-body-md text-on-surface-variant">
                  بعد حجز جلستك، ستصلك رسالة عبر البريد الإلكتروني تحتوي على رابط آمن مع خطوات
                  واضحة للانضمام. يمكنك اختيار ما إذا كنت تريدين إبقاء الكاميرا في وضع التشغيل.
                </p>
              </div>
              <div className="mt-4">
                <h4 className="text-label-lg text-primary uppercase tracking-widest mb-2">المتطلبات الفنية</h4>
                <ul className="space-y-2 text-on-surface-variant text-body-md">
                  <li className="flex items-center gap-2"><Wifi size={18} className="text-primary" /> شبكة إنترنت ثابتة</li>
                  <li className="flex items-center gap-2"><Smartphone size={18} className="text-primary" /> جهاز — كمبيوتر أو تابلت أو هاتف</li>
                  <li className="flex items-center gap-2"><MessageSquare size={18} className="text-primary" /> مكان هادئ وخاص</li>
                </ul>
                <p className="text-on-surface-variant/80 text-sm mt-2">
                  لا حاجة إلى برامج إضافية — يمكنك الانضمام مباشرةً من متصفحك.
                </p>
              </div>
            </div>
            <Photo
              src="/images/online-therapy-session.png"
              alt="امرأة تنضم إلى جلسة علاج عبر الإنترنت مع WellSight من حاسوبها المحمول"
              className="aspect-[4/3] rounded-xl w-full"
            />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6 text-primary">
            <Clock size={22} />
            <span className="text-label-lg">جاهزون عندما تكونين مستعدة</span>
          </div>
          <Link href="/ar/book-and-pay" className="inline-block bg-primary text-on-primary px-10 py-4 rounded-full text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-105">
            احجزي جلسة
          </Link>
        </section>
      </Reveal>
    </>
  );
}
