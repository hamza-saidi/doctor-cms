import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/ar/book-and-pay");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/ar/book-and-pay" },
  };
}

const services = [
  { name: "جلسة علاجية", duration: "50 دقيقة", fee: "90 يورو" },
  { name: "جلسة استشارية", duration: "50 دقيقة", fee: "90 يورو" },
  { name: "الدعم الجماعي", duration: "60-90 دقيقة", fee: "50 يورو للشخص" },
];

export default function BookAndPayPageAr() {
  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
        <h1 className="font-display text-headline-lg text-primary mb-4">احجزي جلستك</h1>
        <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">
          سيتم مراجعة طلب الحجز، وستصلك رسالة تأكيد عبر البريد الإلكتروني تتضمن رابط دفع آمن.
          يُعدّ الموعد مؤكدًا فقط بعد إتمام عملية الدفع.
        </p>
      </section>

      <Reveal>
        <section className="px-4 md:px-16 pb-16">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="font-display text-headline-sm text-primary mb-2">الأسعار</h2>
            {services.map((s) => (
              <div key={s.name} className="bg-surface-container-lowest rounded-xl p-5 service-card-shadow flex justify-between items-start gap-4">
                <div>
                  <p className="text-primary font-medium">{s.name}</p>
                  <p className="text-on-surface-variant text-sm">{s.duration}</p>
                </div>
                <p className="text-primary text-label-lg whitespace-nowrap">{s.fee}</p>
              </div>
            ))}

            <div className="bg-surface-container rounded-xl p-6 mt-8 text-center">
              <p className="text-on-surface-variant text-sm mb-4">
                نظام الحجز متاح حاليًا باللغة الإنجليزية. يمكنك مع ذلك اختيار الموعد والدفع
                بأمان — فقط نصوص النموذج تظهر بالإنجليزية.
              </p>
              <Link href="/book-and-pay" className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-105">
                المتابعة إلى الحجز
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
