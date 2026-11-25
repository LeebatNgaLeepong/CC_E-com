import { Suspense } from "react";
import { io } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { getDb } from "../../../../back-end/src/db";
import { orders } from "../../../../back-end/src/db/schema";
import { formatPeso } from "@/lib/format";
import Link from "next/link";

export const metadata = { title: "My account" };
export const instant = false;

export default function AccountPage() {
  return (
    <Suspense fallback={<p className="text-ink-soft">Loading account…</p>}>
      <AccountContent />
    </Suspense>
  );
}

async function AccountContent() {
  await io();
  const session = await auth();
  if (!session) redirect("/login");

  const db = await getDb();
  const recent = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, session.user.id))
    .orderBy(desc(orders.createdAt))
    .limit(5);

  return (
    <>
      <h1 className="font-serif text-5xl tracking-[-0.03em]">
        Hello{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}.
      </h1>
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Recent orders</h2>
        {recent.length === 0 ? (
          <p className="mt-4 text-ink-soft">No orders yet. When you place one, it will show up here.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-card bg-card">
            {recent.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <Link href={`/order/${order.id}`} className="font-medium underline">
                    Order {order.code || order.id.slice(0, 8)}
                  </Link>
                  <p className="text-sm text-ink-soft">
                    {order.createdAt.toLocaleDateString("en-PH")} · {order.status}
                  </p>
                </div>
                <p className="font-semibold">{formatPeso(order.totalCents)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
