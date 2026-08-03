import type { LucideIcon } from "lucide-react";
import { ImageIcon } from "lucide-react";

// Stand-in for real photography, which the client has not supplied yet.
// Deliberately not hotlinking the Stitch mockup's temporary Google-hosted
// preview images — those are ephemeral prototype assets, not licensed photos.
export default function ImagePlaceholder({
  label,
  icon: Icon = ImageIcon,
  className = "",
}: {
  label: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary-container/25 via-surface-container to-secondary-container/30 text-on-surface-variant/70 ${className}`}
    >
      <Icon size={28} strokeWidth={1.25} />
      <span className="text-label-md uppercase tracking-widest text-center px-6">{label}</span>
    </div>
  );
}
