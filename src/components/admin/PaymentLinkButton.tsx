"use client";

import { useState } from "react";
import { Copy, Check, CreditCard } from "lucide-react";

export default function PaymentLinkButton({
  bookingId,
  existingUrl,
  paid,
}: {
  bookingId: string;
  existingUrl: string | null;
  paid: boolean;
}) {
  const [url, setUrl] = useState(existingUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function generateLink() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/payment-link`, {
        method: "POST",
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to generate link.");
      setUrl(body.url);
      setEmailSent(Boolean(body.emailSent));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate link.");
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (paid) {
    return <span className="text-sm text-primary font-medium">Paid ✓</span>;
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {url ? (
        <>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy payment link"}
          </button>
          {emailSent && (
            <span className="text-xs text-on-surface-variant/70">Confirmation emailed to client</span>
          )}
        </>
      ) : (
        <button
          onClick={generateLink}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm bg-primary-container text-on-primary-container px-3 py-1.5 rounded-full hover:opacity-90 disabled:opacity-60"
        >
          <CreditCard size={14} />
          {loading ? "Generating…" : "Generate payment link"}
        </button>
      )}
      {error && <p className="text-error text-xs max-w-[220px] text-right">{error}</p>}
    </div>
  );
}
