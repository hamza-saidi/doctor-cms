import type { Metadata } from "next";
import Link from "next/link";
import { Ear, Globe2, ScaleIcon, HandHeart, Users2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import ExpandableSection from "@/components/ExpandableSection";
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

const approachSections = [
  {
    title: "Mental health is part of the human experience",
    paragraphs: [
      "At WellSight, we believe that psychological care is essential — not only in times of struggle, but as a foundation for growth, healing, and wellbeing. Whether you're navigating depression, anxiety, trauma, or emotional challenges, or simply seeking clarity, support, or direction — therapy can be life-changing.",
      "Psychological support isn't just for moments of crisis — it's a natural part of living a full, meaningful life. Everyone deserves access to mental health services, whether for guidance, stress management, emotional support, or simply to better understand themselves.",
      "We all pass through moments where a listening ear or professional insight makes the difference. At WellSight, we offer that space — a space to pause, explore, and move forward with clarity and confidence.",
      "Your journey matters — and at WellSight, you don't have to walk it alone.",
    ],
  },
  {
    title: "We heal the whole self, not just the symptoms",
    paragraphs: [
      "At WellSight, we believe that psychological care is not limited to reducing symptoms or easing emotional pain — it is a holistic journey that embraces the whole person. We care about what you feel, how you think, how your body connects with your emotions, and how your experiences shape your daily life.",
      "Our goal is not only to help you move through challenges, but also to support you in building deeper balance, finding inner clarity, and developing skills that sustain you in the long term. Therapy is not just about ending temporary struggles; it is a path toward broader healing and ongoing growth.",
    ],
  },
  {
    title: "Therapy with focus and purpose",
    paragraphs: [
      "At WellSight, we believe that effective therapy doesn't have to take years.",
      "Our approach is focused, goal-oriented, and time-sensitive — helping you gain relief, clarity, and tools for change without unnecessary prolongation.",
      "We work collaboratively to identify symptoms, define clear goals, and move forward with evidence-based interventions that respect your time, energy, and readiness.",
      "Because healing should empower you — not exhaust you.",
    ],
  },
] as const;

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
      <section className="bg-surface-container py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="font-display text-headline-lg text-primary mb-6">
              About WellSight — Our Approach in Helsinki
            </h1>
            <div className="space-y-4 text-on-surface-variant text-body-lg mb-8">
              <p>
                Our work supports emotional wellbeing, self-understanding, and thoughtful
                decision-making in a professional, safe, and respectful environment.
              </p>
              <p>
                At WellSight, we believe mental health is an essential part of a meaningful
                life. Our mission is to offer a supportive space where each person can explore
                their experiences, strengthen their understanding of themselves, and move
                forward with clarity and confidence.
              </p>
              <p>
                What defines our work is the balance between scientific knowledge and genuine
                human presence. Every session is approached with care, professionalism, and
                respect for the individual&apos;s pace, values, and life context.
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl service-card-shadow px-6">
              {approachSections.map((section) => (
                <ExpandableSection key={section.title} title={section.title}>
                  {section.paragraphs.map((text) => (
                    <p key={text.slice(0, 40)}>{text}</p>
                  ))}
                </ExpandableSection>
              ))}
            </div>
          </div>
          <Photo
            src="/images/about-therapy-conversation.jpg"
            alt="A supportive conversation between a WellSight psychologist and a client"
            className="aspect-[4/5] rounded-xl w-full"
          />
        </div>
      </section>

      <Reveal>
        <section className="bg-surface-container-low py-16 md:py-24 px-4 md:px-16">
          <div className="max-w-[1280px] mx-auto">
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
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="about-the-psychologist" className="bg-deep-green py-16 md:py-24 px-4 md:px-16 scroll-mt-24">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Photo
              src="/images/psychologist-portrait.png"
              alt="The psychologist behind WellSight, in her Helsinki practice"
              className="aspect-square rounded-xl w-full"
            />
            <div className="space-y-6">
              <h2 className="font-display text-headline-md text-on-deep-green">
                Meet the psychologist
              </h2>
              <div>
                <h4 className="text-label-lg text-on-deep-green mb-1 uppercase tracking-widest">
                  My Mission
                </h4>
                <p className="text-on-deep-green/80 text-body-md">{psychologistBio.mission}</p>
              </div>
              <div>
                <h4 className="text-label-lg text-on-deep-green mb-1 uppercase tracking-widest">
                  Credentials & Experience
                </h4>
                <p className="text-on-deep-green/80 text-body-md">
                  {psychologistBio.credentials}
                </p>
              </div>
              <div>
                <h4 className="text-label-lg text-on-deep-green mb-1 uppercase tracking-widest">
                  Languages
                </h4>
                <p className="text-on-deep-green/80 text-body-md">{psychologistBio.languages}</p>
              </div>
              <div>
                <h4 className="text-label-lg text-on-deep-green mb-2 uppercase tracking-widest">
                  What to Expect
                </h4>
                <ul className="space-y-1">
                  {psychologistBio.expect.map((item) => (
                    <li key={item} className="text-on-deep-green/80 text-body-md">
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
