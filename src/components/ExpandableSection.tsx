"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

// Collapsed by default — only the heading shows until the visitor clicks.
// Sections toggle independently (not single-open accordion) so a visitor can
// have "Who Is This For?" and "About This Service" open at the same time.
export default function ExpandableSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-outline-variant/40 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-display text-headline-sm text-primary">{title}</span>
        <ChevronDown
          className={`text-primary shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          size={20}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-6 text-on-surface-variant text-body-md space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
