import { asc, desc } from "drizzle-orm";
import { io } from "next/cache";
import { getDb } from "@/db";
import { supportMessages } from "@/db/schema";
import { resolveMessage } from "./actions";

export const metadata = { title: "Support inbox" };
export const instant = false;

export default async function AdminSupportPage() {
  await io();
  const db = await getDb();
  const rows = await db
    .select()
    .from(supportMessages)
    .orderBy(asc(supportMessages.status), desc(supportMessages.createdAt))
    .limit(100);

  return (
    <>
      <h1 className="font-serif text-5xl tracking-[-0.03em]">Support inbox</h1>
      {rows.length === 0 ? (
        <p className="mt-8 text-ink-soft">No messages yet.</p>
      ) : (
        <ul className="mt-10 divide-y divide-line overflow-hidden rounded-card bg-card shadow-sm">
          {rows.map((message) => (
            <li key={message.id} className="space-y-3 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {message.name} · {message.topic}
                    {message.orderCode ? ` · ${message.orderCode}` : ""}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {message.email} · {message.createdAt.toLocaleDateString("en-PH")} · {message.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent("Re: your message to us")}`}
                    className="inline-flex min-h-11 items-center rounded-full bg-ink/5 px-5 text-sm font-semibold hover:bg-ink/10"
                  >
                    Reply
                  </a>
                  {message.status === "open" && (
                    <form action={resolveMessage.bind(null, message.id)}>
                      <button className="btn-primary min-h-11 rounded-full px-5 text-sm font-semibold">
                        Mark resolved
                      </button>
                    </form>
                  )}
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm">{message.message}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
