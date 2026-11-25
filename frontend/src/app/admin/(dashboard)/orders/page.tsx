import { desc } from "drizzle-orm";
import { io } from "next/cache";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { formatPeso } from "@/lib/format";
import { cancelOrder, markFulfilled } from "./actions";

export const metadata = { title: "Orders" };
export const instant = false;

export default async function AdminOrdersPage() {
  await io();
  const db = await getDb();
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(100);

  return (
    <>
      <h1 className="font-serif text-5xl tracking-[-0.03em]">Orders</h1>
      {rows.length === 0 ? (
        <p className="mt-8 text-ink-soft">No orders yet.</p>
      ) : (
        <ul className="mt-10 divide-y divide-line overflow-hidden rounded-card bg-card shadow-sm">
          {rows.map((order) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium">{order.code} · {formatPeso(order.totalCents)}</p>
                <p className="text-sm text-ink-soft">
                  {order.customerName} · {order.phone} · {order.createdAt.toLocaleDateString("en-PH")} · {order.status}
                </p>
                <p className="text-sm text-ink-soft">{order.shippingAddress}</p>
              </div>
              {order.status === "pending" && (
                <div className="flex gap-2">
                  <form action={cancelOrder.bind(null, order.id)}>
                    <button className="min-h-11 rounded-full bg-ink/5 px-5 text-sm font-semibold hover:bg-ink/10">
                      Cancel
                    </button>
                  </form>
                  <form action={markFulfilled.bind(null, order.id)}>
                    <button className="min-h-11 rounded-full bg-btn px-5 text-sm font-semibold text-on-btn hover:bg-btn-hover">
                      Mark fulfilled
                    </button>
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
