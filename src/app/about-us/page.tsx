import type { Metadata } from "next";
import Link from "next/link";
import { Ear, Globe2, ScaleIcon, HandHeart, Users2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import { psychologistBio } from "@/lib/content";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/about-us");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/about-us" },
  };
}

const principles = [
  { icon: Ear, title: "Deep Listening", description: "We don't just hear you — we listen with our hearts and minds." },
  { icon: Globe2, title: "Cultural Sensitivity", description: "We honor your identity, background, and lived experience." },
  { icon: ScaleIcon, title: "Integrity", description: "We uphold ethical standards and transparency in all that we do." },
  { icon: HandHeart, title: "Non-Judgment", description: "Your story is welcome, just as it is — no shame, no labels." },
  { icon: Users2, title: "Inclusivity", description: "Everyone deserves access to quality care, free of prejudice or bias." },
];

export default function AboutUsPage() {
  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto">
        <div className="max-w-3xl">
          <h1 className="font-display text-headline-lg text-primary mb-6">
            About WellSight — Our Approach in Helsinki
          </h1>
          <p className="text-on-surface-variant text-body-lg mb-4">
            Our work supports emotional wellbeing, self-understanding, and thoughtful
            decision-making in a professional, safe, and respectful environment.
          </p>
          <p className="text-on-surface-variant text-body-lg mb-4">
            At WellSight, we believe mental health is an essential part of a meaningful life.
            Our mission is to offer a supportive space where each person can explore their
            experiences, strengthen their understanding of themselves, and move forward with
            clarity and confidence.
          </p>
          <p className="text-on-surface-variant text-body-lg">
            What defines our work is the balance between scientific knowledge and genuine human
            presence. Every session is approached with care, professionalism, and respect for
            the individual&apos;s pace, values, and life context.
          </p>
        </div>
      </section>

      <Reveal>
        <section className="bg-surface-container py-16 md:py-24 px-4 md:px-16">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="font-display text-headline-md text-primary">
                We heal the whole self, not just the symptoms
              </h2>
              <p className="text-on-surface-variant text-body-md">
                Psychological care is not limited to reducing symptoms or easing emotional pain
                — it is a holistic journey that embraces the whole person. We care about what
                you feel, how you think, how your body connects with your emotions, and how your
                experiences shape your daily life.
              </p>
              <h2 className="font-display text-headline-md text-primary pt-4">
                Therapy with focus and purpose
              </h2>
              <p className="text-on-surface-variant text-body-md">
                Effective therapy doesn&apos;t have to take years. Our approach is focused,
                goal-oriented, and time-sensitive — helping you gain relief, clarity, and tools
                for change without unnecessary prolongation. Because healing should empower you
                — not exhaust you.
              </p>
            </div>
            <Photo
              src="/images/about-therapy-conversation.jpg"
              alt="A supportive conversation between a WellSight psychologist and a client"
              className="aspect-[4/5] rounded-xl w-full"
            />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto">
          <h2 className="font-display text-headline-md text-primary mb-10 text-center">
            The values we live by
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {principles.map((p) => (
              <div
                key={p.title}
                className="bg-surface-container-lowest p-6 rounded-xl service-card-shadow text-center"
              >
                <p.icon className="text-primary mx-auto mb-3" size={28} />
                <h3 className="font-display text-headline-sm text-primary mb-2">{p.title}</h3>
                <p className="text-on-surface-variant text-sm">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="about-the-psychologist" className="bg-primary-container py-16 md:py-24 px-4 md:px-16 scroll-mt-24">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Photo
              src="/images/psychologist-portrait.png"
              alt="The psychologist behind WellSight, in her Helsinki practice"
              className="aspect-square rounded-xl w-full"
            />
            <div className="space-y-6">
              <h2 className="font-display text-headline-md text-primary-fixed">
                Meet the psychologist
              </h2>
              <div>
                <h4 className="text-label-lg text-white mb-1 uppercase tracking-widest">
                  My Mission
                </h4>
                <p className="text-on-primary-container text-body-md">{psychologistBio.mission}</p>
              </div>
              <div>
                <h4 className="text-label-lg text-white mb-1 uppercase tracking-widest">
                  Credentials & Experience
                </h4>
                <p className="text-on-primary-container text-body-md">
                  {psychologistBio.credentials}
                </p>
              </div>
              <div>
                <h4 className="text-label-lg text-white mb-1 uppercase tracking-widest">
                  Languages
                </h4>
                <p className="text-on-primary-container text-body-md">{psychologistBio.languages}</p>
              </div>
              <div>
                <h4 className="text-label-lg text-white mb-2 uppercase tracking-widest">
                  What to Expect
                </h4>
                <ul className="space-y-1">
                  {psychologistBio.expect.map((item) => (
                    <li key={item} className="text-on-primary-container text-body-md">
                      · {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/book-and-pay"
                className="inline-block bg-primary-fixed text-on-primary-fixed px-8 py-3 rounded-full text-label-lg hover:bg-white hover:scale-105 transition-all duration-500"
              >
                Book a Session
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
