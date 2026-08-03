import { XCircle, CheckCircle2 } from "lucide-react";

export type MisunderstandingItem = { misconception: string; clarification: string };

export default function Misunderstandings({ items }: { items: readonly MisunderstandingItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {items.map((item) => (
        <div
          key={item.misconception}
          className="bg-surface-container-lowest rounded-xl p-6 service-card-shadow space-y-3"
        >
          <p className="flex items-start gap-2.5 text-on-surface-variant/70 text-body-md line-through decoration-error/40">
            <XCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
            {item.misconception}
          </p>
          <p className="flex items-start gap-2.5 text-on-surface text-body-md font-medium">
            <CheckCircle2 size={20} className="text-primary flex-shrink-0 mt-0.5" />
            {item.clarification}
          </p>
        </div>
      ))}
    </div>
  );
}
