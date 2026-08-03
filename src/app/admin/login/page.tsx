"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Login failed.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-surface-container-lowest p-8 rounded-2xl service-card-shadow space-y-5"
      >
        <h1 className="font-display text-headline-sm text-primary text-center">
          WellSight Admin
        </h1>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-label-lg text-on-surface-variant">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            className="w-full border border-outline-variant focus:border-primary rounded-lg p-3 bg-surface-container-lowest"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-label-lg text-on-surface-variant">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full border border-outline-variant focus:border-primary rounded-lg p-3 bg-surface-container-lowest"
          />
        </div>
        {error && <p className="text-error text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary py-3 rounded-lg text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
