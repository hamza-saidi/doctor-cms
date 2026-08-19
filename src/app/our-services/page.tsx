import type { Metadata } from "next";
import Link from "next/link";
import { Users, Heart, MessageCircle, Stethoscope, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import ExpandableSection from "@/components/ExpandableSection";
import { prisma } from "@/lib/prisma";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/our-services");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/our-services" },
  };
}

const serviceIcons: Record<string, typeof Users> = {
  consultation: MessageCircle,
  therapy: Heart,
  "peer-group": Users,
  neuropsychology: Stethoscope,
};

// Same photography used to present these services on the home page.
const serviceImages: Record<string, string> = {
  consultation: "/images/consultation-room.jpg",
  therapy: "/images/therapy-room-helsinki.jpg",
  neuropsychology: "/images/neuropsychology-assessment.jpg",
};

type ContentBlock = { type: "p"; text: string } | { type: "ul"; label?: string; items: string[] };
type ServiceSection = { title: string; blocks: ContentBlock[] };

const p = (text: string): ContentBlock => ({ type: "p", text });
const ul = (items: string[], label?: string): ContentBlock => ({ type: "ul", label, items });

// Expandable "About This Service" / "Who Is This For?" / "Tools We Use" /
// "Important to Know" content, replacing the old flat service.detail
// paragraphs. Every service uses this same four-section structure so the
// page reads consistently as visitors move from card to card. The source
// copy bundled Therapy, Peer Group Sessions, and the Follow-Up add-on into
// one narrative, but the site models them as separate service cards (each
// with its own price and booking flow), so that copy is split across the
// "therapy" and "peer-group" entries below to match. Where the source copy
// didn't give a distinct "Who Is This For?" / "Tools We Use" paragraph for
// a service (currently Peer Group only), that section is drafted from facts
// already stated elsewhere in that service's own approved copy rather than
// introducing new claims — worth a client read-through before publishing.
// Not every service has all four sections; only ones with real content render.
const serviceSections: Record<string, ServiceSection[]> = {
  consultation: [
    {
      title: "About This Service",
      blocks: [
        p(
          "Sometimes we need a calm and safe space to organize our thoughts, understand what we're experiencing, or view a situation from a clearer perspective."
        ),
        p(
          "Consultation services are usually offered as a one-time or short-term session with a mental health professional, focused on clarity, reflection, and structured thinking to support decisions relevant to the current stage of life."
        ),
        p(
          "These sessions may address a range of life situations, including personal or family-related reflections, relationship-related thinking, work-related stress, professional challenges, burnout, work–life balance concerns, or personal and career decisions that require clarity and perspective."
        ),
        p(
          "Consultation sessions are not psychotherapy and do not focus on deep emotional processing. Instead, they provide a professional and supportive space for shared reflection, without the need for long-term treatment or commitment."
        ),
      ],
    },
    {
      title: "Who Is This For?",
      blocks: [
        ul([
          "People seeking brief, focused support without engaging in long-term therapy.",
          "Individuals facing a personal, relational, family, or work-related situation and needing greater clarity to make a decision.",
          "Those who prefer to think things through out loud with a professional and explore available options.",
          "Employees or professionals experiencing work-related stress, burnout, or challenges in balancing work and personal life.",
          "Anyone looking for a safe, neutral space for structured thinking without judgment or external pressure.",
          "People seeking practical and professional guidance without engaging in deep emotional or therapeutic work.",
        ]),
      ],
    },
    {
      title: "Important to Know",
      blocks: [
        p(
          "Consultation is not therapy. These sessions do not include diagnosis, emotional processing, or treatment planning. If it becomes clear during the session that a deeper therapeutic process is needed, we will discuss suitable next steps with you."
        ),
        p(
          "These sessions do not provide ready-made answers or personal opinions. The professional's role is to support you in gaining clarity, exploring new perspectives, and making your own confident decision."
        ),
      ],
    },
  ],
  therapy: [
    {
      title: "About This Service",
      blocks: [
        p(
          "At WellSight, we provide a wide range of psychological care for individuals and families across different life stages. Whether you're seeking short therapy sessions, steadier emotions, or clearer direction in your relationships, our work is structured to meet diverse needs with warmth and professionalism."
        ),
        p(
          "Our mental health services include three main categories: individual sessions, peer group sessions, and follow-up add-ons for support between sessions."
        ),
        ul(
          [
            "Personal concerns (e.g., depression, anxiety, OCD, stress, trauma)",
            "Couple & relationship concerns (e.g., communication, conflict, trust, separation)",
            "Family & parenting concerns (e.g., parenting, family conflict, co-parenting)",
            "Life transitions & special contexts (e.g., immigration, health challenges, major changes)",
          ],
          "Therapy Sessions — our one-on-one sessions may address a wide range of concerns, including:"
        ),
        p(
          "Follow-Up Add-On (between sessions): optional support that includes mood tracking, short journaling, therapist feedback, and check-ins over a defined period (e.g., 10–20 days). This is an add-on available during booking, not a standalone service."
        ),
      ],
    },
    {
      title: "Who Is This For?",
      blocks: [
        ul(
          [
            "Adults experiencing low mood, anxiety, trauma-related symptoms, obsessive thoughts, or general overwhelm and uncertainty.",
            "Adolescents (15+) seeking a safe space to explore emotions, voice concerns, and strengthen self-understanding.",
            "Families working through communication difficulties, emotional tension, or periods of transition and change.",
            "Refugees, immigrants, and newcomers to Finland navigating cultural adjustment and uncertainty.",
            "Arabic-speaking clients who prefer care in their native language within a culturally informed space.",
            "Individuals seeking short-term therapy focused on clarity, direction, and practical support within a time-limited framework.",
          ],
          "Our therapy services support individuals and families seeking meaningful guidance, deeper understanding, and sustainable emotional growth, including:"
        ),
      ],
    },
    {
      title: "Tools We Use",
      blocks: [
        p(
          "We draw from a wide range of evidence-based therapies, supportive tools, and practical techniques to meet your individual needs. Approaches may include CBT, ACT, and EMDR-informed methods, as well as techniques that support emotional regulation, trauma processing, and self-awareness. The specific methods are selected according to each client's therapy goals and individual needs."
        ),
        p(
          "We also integrate psychoeducation, attachment-based insights, and creative or symbolic tools to support your healing journey."
        ),
      ],
    },
    {
      title: "Important to Know",
      blocks: [
        p(
          "We offer short-term therapy and mental health support, typically 8 to 12 sessions, sometimes up to 20, upon clinical discretion based on progress and goals. Sessions are led by a licensed psychologist, following Finnish professional standards."
        ),
        p(
          "Our focus is on mild to moderate cases. For complex or severe mental health conditions (e.g. severe psychiatric disorders), we will offer professional referrals to psychotherapists, psychiatrists, or other specialists as needed."
        ),
      ],
    },
  ],
  "peer-group": [
    {
      title: "About This Service",
      blocks: [
        ul(
          [
            "Peer support groups (e.g., women, caregivers, migrants)",
            "Thematic groups (e.g., anxiety, grief)",
            "Psychoeducational groups (stress management, emotional regulation)",
            "Growth & awareness circles (e.g., empowerment, self-worth)",
          ],
          "Facilitated group spaces built around shared themes, with emphasis on psychoeducation, emotional validation, and practical strategies. Examples include:"
        ),
      ],
    },
    {
      title: "Who Is This For?",
      blocks: [
        ul(
          [
            "People who relate to a specific shared experience, such as caregiving or migration, and want to connect with others facing similar challenges.",
            "Individuals looking for a supportive space to explore a specific theme, such as anxiety or grief, alongside others.",
            "Anyone wanting practical, psychoeducational tools for stress management and emotional regulation in a group setting.",
            "Individuals interested in personal growth and self-awareness within a facilitated group format.",
          ],
          "Peer group sessions may be a good fit if you're looking for connection and shared understanding alongside practical guidance, including:"
        ),
      ],
    },
    {
      title: "Tools We Use",
      blocks: [
        p(
          "Sessions are facilitated using structured group discussion, guided psychoeducational input, and optional journaling or reflection exercises. The facilitator keeps the group focused on the shared theme while making space for each participant to contribute at their own comfort level."
        ),
      ],
    },
    {
      title: "Important to Know",
      blocks: [
        p(
          "Peer group sessions are a shared, facilitated space rather than one-on-one therapy — the focus is on connection, psychoeducation, and mutual support rather than individualized treatment planning."
        ),
        p(
          "Group schedules and themes may vary over time, and group size is set to keep the space comfortable and focused for participants."
        ),
      ],
    },
  ],
  neuropsychology: [
    {
      title: "About This Service",
      blocks: [
        p(
          "This service is currently under development. Once launched, it will offer comprehensive neuropsychological assessments designed to evaluate memory, attention, language, problem-solving, and other key cognitive abilities. These assessments will use standardized and scientifically validated tools to help identify the root of difficulties such as problems in learning, processing speed, or concentration."
        ),
      ],
    },
    {
      title: "Who Is This For?",
      blocks: [
        ul(
          [
            "Adults experiencing memory problems, attention difficulties, or cognitive changes.",
            "Clients with neurological conditions such as Parkinson's, MS, or epilepsy who need cognitive monitoring.",
            "Family members seeking guidance and understanding of a loved one's cognitive profile.",
            "Arabic-speaking clients who require culturally and linguistically appropriate assessment.",
          ],
          "This service is designed for:"
        ),
      ],
    },
    {
      title: "Tools We Use",
      blocks: [
        p(
          "We use a range of internationally recognized tools to assess memory, attention, executive functioning, and related brain abilities. Assessments may include well-known and validated methods (such as Stroop-, WCST-, CPT-3-, and MoCA-type tests), selected according to licensing and each client's specific needs."
        ),
      ],
    },
    {
      title: "Important to Know",
      blocks: [
        p(
          "Neuropsychological assessments must be conducted in person. Remote or online testing is not possible due to standardized administration protocols."
        ),
        p(
          "We continuously review the quality of our services in collaboration with experienced neuropsychology specialists to ensure the highest standards of care. All reviews are conducted with full confidentiality, without sharing any identifying client information, and are strictly aimed at ensuring service quality and effectiveness."
        ),
      ],
    },
  ],
};

export default async function OurServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <section className="bg-tertiary-container py-16 md:py-24 px-4 md:px-16">
        <div className="max-w-[1280px] mx-auto text-center">
          <h1 className="font-display text-headline-lg text-on-tertiary-container">
            Our Services in Helsinki
          </h1>
        </div>
      </section>

      {services.map((service, i) => {
        const Icon = serviceIcons[service.slug] ?? Heart;
        return (
          <Reveal key={service.slug}>
            <section
              id={service.slug}
              className={`px-4 md:px-16 py-12 md:py-16 scroll-mt-24 ${
                i % 2 === 1 ? "bg-surface-container-high" : ""
              }`}
            >
              <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1">
                  {serviceImages[service.slug] ? (
                    <Photo
                      src={serviceImages[service.slug]}
                      alt={`${service.name} at WellSight, Helsinki`}
                      className={`h-36 md:h-40 w-full rounded-xl mb-4 ${
                        service.status === "comingSoon" ? "grayscale-[0.5] opacity-70" : ""
                      }`}
                    />
                  ) : (
                    <ImagePlaceholder
                      label={service.name}
                      icon={Icon}
                      className="h-36 md:h-40 w-full rounded-xl mb-4"
                    />
                  )}
                  <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center mb-4">
                    <Icon className="text-primary-fixed" size={26} />
                  </div>
                  <h2 className="font-display text-headline-md text-primary mb-2">
                    {service.name}
                  </h2>
                  <p className="text-on-surface-variant text-body-md">
                    {service.shortDescription}
                  </p>
                  {service.status === "comingSoon" && (
                    <span className="inline-block mt-4 bg-primary/90 text-white px-4 py-1 rounded-full text-xs text-label-lg">
                      COMING SOON
                    </span>
                  )}
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-surface-container-lowest rounded-xl p-6 service-card-shadow">
                    <div>
                      <p className="text-label-md uppercase tracking-widest text-on-surface-variant/70 mb-1">
                        Duration
                      </p>
                      <p className="text-body-md text-on-surface">{service.duration}</p>
                    </div>
                    <div>
                      <p className="text-label-md uppercase tracking-widest text-on-surface-variant/70 mb-1">
                        Fee
                      </p>
                      <p className="text-body-md text-on-surface">{service.fee}</p>
                    </div>
                    <div>
                      <p className="text-label-md uppercase tracking-widest text-on-surface-variant/70 mb-1">
                        Includes
                      </p>
                      <p className="text-body-md text-on-surface">{service.includes}</p>
                    </div>
                  </div>

                  {serviceSections[service.slug] ? (
                    <div className="bg-surface-container-lowest rounded-xl service-card-shadow px-6">
                      {serviceSections[service.slug].map((section) => (
                        <ExpandableSection key={section.title} title={section.title}>
                          {section.blocks.map((block, idx) =>
                            block.type === "p" ? (
                              <p key={idx}>{block.text}</p>
                            ) : (
                              <div key={idx}>
                                {block.label && (
                                  <p className="text-on-surface font-medium mb-2">{block.label}</p>
                                )}
                                <ul className="list-disc pl-5 space-y-1.5">
                                  {block.items.map((item) => (
                                    <li key={item.slice(0, 40)}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )
                          )}
                        </ExpandableSection>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 text-on-surface-variant text-body-md">
                      {service.detail
                        .split("\n\n")
                        .filter(Boolean)
                        .map((paragraph) => (
                          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                        ))}
                    </div>
                  )}

                  {service.status === "available" ? (
                    <Link
                      href={`/book-and-pay?service=${service.slug}`}
                      className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-full text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-105"
                    >
                      <CheckCircle2 size={18} />
                      Book your {service.name.toLowerCase()} now
                    </Link>
                  ) : (
                    <button
                      className="border-2 border-outline text-outline px-8 py-3 rounded-full text-label-lg cursor-not-allowed"
                      disabled
                    >
                      Register interest
                    </button>
                  )}
                </div>
              </div>
            </section>
          </Reveal>
        );
      })}

      <Reveal>
        <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
          <h2 className="font-display text-headline-md text-primary mb-8">Reach Out</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="border-2 border-primary text-primary px-8 py-3 rounded-full text-label-lg hover:bg-primary hover:text-on-primary transition-all duration-500"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </Reveal>
    </>
  );
}
