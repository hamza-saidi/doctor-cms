"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n";

const formLabels: Record<Locale, Record<string, string>> = {
  en: {
    firstName: "First Name (required)",
    lastName: "Last Name (required)",
    email: "Email (required)",
    message: "Your Message",
    send: "Send Message",
    sending: "Sending…",
    error: "Something went wrong — please try again.",
    sentTitle: "Message sent",
    sentBody: "Thank you — we'll get back to you shortly.",
  },
  fi: {
    firstName: "Etunimi (pakollinen)",
    lastName: "Sukunimi (pakollinen)",
    email: "Sähköposti (pakollinen)",
    message: "Viestisi",
    send: "Lähetä viesti",
    sending: "Lähetetään…",
    error: "Jotain meni pieleen — yritä uudelleen.",
    sentTitle: "Viesti lähetetty",
    sentBody: "Kiitos — otamme sinuun yhteyttä pian.",
  },
  ar: {
    firstName: "الاسم الأول (مطلوب)",
    lastName: "اسم العائلة (مطلوب)",
    email: "البريد الإلكتروني (مطلوب)",
    message: "رسالتك",
    send: "إرسال الرسالة",
    sending: "جارٍ الإرسال…",
    error: "حدث خطأ ما — يرجى المحاولة مرة أخرى.",
    sentTitle: "تم إرسال الرسالة",
    sentBody: "شكرًا لك — سنتواصل معك قريبًا.",
  },
};

export default function ContactForm({ locale = "en" }: { locale?: Locale }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const t = formLabels[locale];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-surface-container-lowest p-6 md:p-10 rounded-2xl service-card-shadow text-center">
        <p className="text-headline-sm font-display text-primary mb-2">{t.sentTitle}</p>
        <p className="text-on-surface-variant">{t.sentBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-container-lowest p-6 md:p-10 rounded-2xl service-card-shadow space-y-6 transition-all duration-500 hover:shadow-xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-label-lg text-on-surface-variant">
            {t.firstName}
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            type="text"
            className="w-full border border-outline-variant focus:border-primary focus:ring-primary rounded-lg p-3 bg-surface-container-lowest transition-all"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-label-lg text-on-surface-variant">
            {t.lastName}
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            type="text"
            className="w-full border border-outline-variant focus:border-primary focus:ring-primary rounded-lg p-3 bg-surface-container-lowest transition-all"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-label-lg text-on-surface-variant">
          {t.email}
        </label>
        <input
          id="email"
          name="email"
          required
          type="email"
          className="w-full border border-outline-variant focus:border-primary focus:ring-primary rounded-lg p-3 bg-surface-container-lowest transition-all"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-label-lg text-on-surface-variant">
          {t.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full border border-outline-variant focus:border-primary focus:ring-primary rounded-lg p-3 bg-surface-container-lowest transition-all"
        />
      </div>
      {status === "error" && <p className="text-error text-sm">{t.error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-primary text-on-primary py-4 rounded-lg text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all duration-500 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
      >
        {status === "sending" ? t.sending : t.send}
      </button>
    </form>
  );
}
