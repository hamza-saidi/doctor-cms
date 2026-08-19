// Centralized site content — reused across pages/components and, later, the
// admin/CMS layer. Real copy carried over from wellsightcare.com, not placeholder.

export const business = {
  name: "WellSight",
  legalName: "Pelhaj Psyk",
  businessId: "3506274-6",
  license: "Licensed Psychologist (Valvira)",
  tagline: "Your space to explore healing, clarity & personal growth",
  email: "info@wellsight.fi",
  phone: "+358505340403",
  phoneDisplay: "+358 (0) 505 3 4040 3",
  whatsapp: "+358505340403",
  address: {
    street: "Lapinrinne 1",
    postalCode: "00180",
    city: "Helsinki",
    country: "Finland",
    countryCode: "FI",
  },
  hours: [
    { days: "Monday – Friday", hours: "8:00 AM – 6:00 PM" },
    { days: "Weekends", hours: "By request, subject to availability" },
  ],
  geo: {
    // Lapinrinne 1, Helsinki — used for LocalBusiness structured data
    lat: 60.1672,
    lng: 24.9277,
  },
  emergencyNotice:
    "We do not provide emergency or crisis services – in an emergency, please call 112.",
} as const;

export const nav = [
  { label: "Our Approach", href: "/about-us" },
  { label: "Services", href: "/our-services" },
  { label: "How We Meet", href: "/how-we-meet" },
  { label: "Starting Therapy", href: "/firstsession" },
] as const;

export type Service = {
  slug: string;
  name: string;
  shortDescription: string;
  duration: string;
  fee: string;
  priceCents: number | null; // exact billable amount; null = not billable online yet
  includes: string;
  status: "available" | "comingSoon";
  detail: string[];
};

export const services: Service[] = [
  {
    slug: "consultation",
    name: "Consultation",
    shortDescription:
      "A professional space for reflection, clarity, and thoughtful decision-making.",
    duration: "50 minutes",
    fee: "€90",
    priceCents: 9000,
    includes:
      "One-on-one consultation with a psychologist, space for reflection, brief notes if needed.",
    status: "available",
    detail: [
      "For personal or family-related reflections, relationship-related thinking, work-related stress, burnout, work–life balance concerns, or decisions that require clarity and perspective.",
      "Consultation is not psychotherapy — it does not include diagnosis, emotional processing, or treatment planning. If a deeper therapeutic process is needed, we discuss suitable next steps with you.",
    ],
  },
  {
    slug: "therapy",
    name: "Therapy",
    shortDescription:
      "Short and long-term sessions focused on emotional healing, growth, and self-understanding.",
    duration: "50 minutes",
    fee: "€90",
    priceCents: 9000,
    includes: "Initial assessment, therapeutic tools, and collaborative treatment planning.",
    status: "available",
    detail: [
      "One-on-one therapeutic sessions using CBT, EMDR, ACT, or other evidence-based approaches adapted to your needs — for personal, couple & relationship, family & parenting, or life-transition concerns.",
      "Typically 8 to 12 sessions, sometimes up to 20, at clinical discretion. Led by a licensed psychologist following Finnish professional standards. We focus on mild to moderate cases — for complex or severe conditions, we provide professional referrals.",
    ],
  },
  {
    slug: "peer-group",
    name: "Peer Group Sessions",
    shortDescription:
      "Facilitated group spaces built around shared themes, psychoeducation, and practical strategies.",
    duration: "60–90 minutes",
    fee: "€50 per person",
    priceCents: 5000,
    includes: "Structured group input, guided discussion, optional journaling or reflection tools.",
    status: "available",
    detail: [
      "Examples include groups for caregivers and immigrants; themes and schedules may vary over time.",
    ],
  },
  {
    slug: "neuropsychology",
    name: "Neuropsychology",
    shortDescription:
      "Specialized cognitive assessments and brain health monitoring, currently under development.",
    duration: "60–90 minutes",
    fee: "Not yet available",
    priceCents: null,
    includes: "Clinical interview, standardized cognitive tools (e.g. MoCA, Stroop, Trail Making), summary report.",
    status: "comingSoon",
    detail: [
      "Will cover cognitive assessment, monitoring of neurological conditions (Parkinson's, MS, epilepsy), and family guidance sessions. Assessments must be conducted in person — remote testing is not possible. Available in Arabic or English.",
    ],
  },
];

export const packages = [
  {
    name: "Package of Two Sessions",
    description: "Book two therapy sessions at once and get a 10% bundle discount.",
    fee: "€162",
    originalFee: "€180",
    note: "The second session is scheduled via email after your first booking is confirmed.",
  },
  {
    name: "Package of Three Sessions + Follow-Up",
    description:
      "Book three sessions in advance and receive a complimentary 10-day between-session follow-up (regularly €40).",
    fee: "€270",
    originalFee: undefined,
    note: "Sessions two and three, plus the follow-up add-on, are arranged via email once your first booking is confirmed.",
  },
  {
    name: "Student & Adolescent Discount",
    description: "10% discount on all services for full-time students and adolescents (ages 15–18).",
    fee: undefined,
    originalFee: undefined,
    note: undefined,
  },
  {
    name: "NGO & Community Support Rates",
    description: "NGOs and organizations can contact us for partnership packages or reduced rates.",
    fee: undefined,
    originalFee: undefined,
    note: undefined,
  },
] as const;

export const misunderstandings = [
  {
    misconception: "I'll get a treatment plan or results right away.",
    clarification: "The first session is for understanding your story. The plan develops gradually.",
  },
  {
    misconception: "The psychologist will immediately solve my problem.",
    clarification: "Therapy is a process — meaningful change takes time.",
  },
  {
    misconception: "If I don't know what to say, it's a failure.",
    clarification: "Silence, hesitation, or scattered thoughts are all valid ways to begin.",
  },
  {
    misconception: "The psychologist has to share my documents with government authorities.",
    clarification:
      "Therapy records are private. They are only shared if you request it in writing, or if there is a clear legal obligation.",
  },
  {
    misconception: "The psychologist can read my mind.",
    clarification: "Psychologists are not mind readers. We rely on what you share and our knowledge to support you.",
  },
  {
    misconception: "If I hide details, the therapist will figure it out anyway.",
    clarification:
      "Therapy works best with honesty and trust. Holding back details may delay progress, while openness helps reach the best outcome.",
  },
] as const;

export const values = [
  {
    icon: "shield",
    title: "Confidentiality",
    description: "At the heart of every interaction is our commitment to your privacy.",
  },
  {
    icon: "heart",
    title: "Inclusivity",
    description: "A safe, non-judgmental space for all identities and backgrounds.",
  },
  {
    icon: "brain",
    title: "Evidence-Based",
    description: "Scientifically-backed clinical methods for proven results.",
  },
  {
    icon: "sparkles",
    title: "Trusted Care",
    description: "High-end expertise combined with genuine human warmth.",
  },
] as const;

export const psychologistBio = {
  mission:
    "Behind every struggle lies a story waiting to be understood — that belief led me to create WellSight. Over the years, I've explored what it truly means to think, feel, and struggle, and how we can find our way back to balance. WellSight was founded on a simple promise: a safe, supportive space to be heard.",
  credentials:
    "BSc in Psychology · MSc in Neuropsychology · EMDR Therapy · Prolonged Exposure (PE) Therapy · Emotionally Focused Therapy (EFT) for Couples and Families · Neuropsychological Assessment.",
  languages: "Services in Arabic & English; culturally sensitive care.",
  values: "Respect · Evidence-based practice · Cultural inclusivity · Clarity & transparency · Confidentiality · Compassion.",
  expect: [
    "A safe, judgement-free space.",
    "Clear, collaborative plans.",
    "Focus on your therapeutic goals.",
    "Room for open, free expression.",
    "Your privacy, fully protected.",
  ],
} as const;
