import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import Misunderstandings from "@/components/Misunderstandings";
import { misunderstandings } from "@/lib/content";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/firstsession");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/firstsession" },
  };
}

export default function FirstSessionPage() {
  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="font-display text-headline-lg text-primary mb-6">
              Starting Therapy — Your First Session
            </h1>
            <div className="space-y-5 text-on-surface-variant text-body-lg">
              <p>
                As a psychologist, my role is to listen attentively to your story with care and
                respect. This is your space to share at your own pace and in your own words.
              </p>
              <p>
                There is no &ldquo;right&rdquo; or &ldquo;wrong&rdquo; way to tell your story.
                Simply sharing it as you have lived it is enough. Being yourself is more than
                enough.
              </p>
              <p>
                You don&apos;t need to prepare perfect words or explanations. My focus is on
                being fully present with you, helping you reflect, and supporting you in making
                sense of your experiences.
              </p>
              <p>
                The first session is not about quick solutions or instant results. Instead,
                it&apos;s a starting point — an opportunity to understand your background,
                emotions, and the factors shaping your situation. Together, we begin laying the
                foundation for meaningful work ahead.
              </p>
            </div>
          </div>
          <Photo
            src="/images/consultation-room.jpg"
            alt="A calm, private consultation room at WellSight where first sessions take place"
            className="aspect-[4/5] rounded-xl w-full order-1 lg:order-2"
          />
        </div>
      </section>

      <Reveal>
        <section className="bg-surface-container py-16 md:py-24 px-4 md:px-16">
          <div className="max-w-[1280px] mx-auto">
            <h2 className="font-display text-headline-md text-primary mb-10 text-center">
              Common Misunderstandings about Therapy
            </h2>
            <Misunderstandings items={misunderstandings} />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
          <HeartHandshake className="text-primary mx-auto mb-4" size={32} />
          <h2 className="font-display text-headline-md text-primary mb-6">
            Ready to take the first step?
          </h2>
          <Link
            href="/book-and-pay"
            className="inline-block bg-primary text-on-primary px-10 py-4 rounded-full text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-105"
          >
            Book a Session
          </Link>
        </section>
      </Reveal>
    </>
  );
}
