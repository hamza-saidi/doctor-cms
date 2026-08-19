import { prisma } from "@/lib/prisma";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Helsinki",
  }).format(date);
}

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-headline-md text-primary mb-8">Contact Messages</h1>

      {messages.length === 0 && (
        <p className="text-on-surface-variant text-sm">No messages yet.</p>
      )}

      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-surface-container-lowest rounded-xl p-6 service-card-shadow"
          >
            <div className="flex justify-between items-start gap-4">
              <p className="text-on-surface font-medium">
                {msg.firstName} {msg.lastName}
              </p>
              <p className="text-on-surface-variant/70 text-xs whitespace-nowrap">
                {formatDateTime(msg.createdAt)}
              </p>
            </div>
            <a
              href={`mailto:${msg.email}`}
              className="text-primary text-sm hover:underline"
            >
              {msg.email}
            </a>
            {msg.message && (
              <p className="text-on-surface-variant text-sm mt-3">{msg.message}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
