import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import Link from "next/link";
import Header from "@/components/Header";
import { getDb } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { formatPeso } from "@/lib/format";

export const instant = false;

export const metadata = {
  title: "Order received",
  robots: { index: false, follow: false },
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();

  const db = await getDb();
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 pb-28 pt-40">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bloom-deep">
          Order {order.code}
        </p>
        <h1 className="mt-3 font-serif text-5xl tracking-[-0.03em]">
          Thank you, {order.customerName.split(" ")[0]}.
        </h1>
        <p className="mt-4 text-ink-soft">
          We received your order. Please have {formatPeso(order.totalCents)} ready in cash when it arrives.
          We sent the details to {order.email}.
        </p>

        <ul className="mt-10 divide-y divide-line overflow-hidden rounded-card bg-card shadow-sm">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 p-5 text-sm">
              <span>{item.quantity} × {item.productName} ({item.color}, {item.size})</span>
              <span>{formatPeso(item.priceCents * item.quantity)}</span>
            </li>
          ))}
          <li className="flex justify-between p-5 text-sm text-ink-soft">
            <span>Shipping</span>
            <span>{order.shippingCents === 0 ? "Free" : formatPeso(order.shippingCents)}</span>
          </li>
          <li className="flex justify-between p-5 font-semibold">
            <span>Total</span>
            <span>{formatPeso(order.totalCents)}</span>
          </li>
        </ul>

        <div className="mt-8 rounded-card bg-card p-5 text-sm shadow-sm">
          <p className="font-semibold">Delivering to</p>
          <p className="mt-1 text-ink-soft">{order.customerName} · {order.phone}</p>
          <p className="text-ink-soft">{order.shippingAddress}</p>
        </div>

        <Link href="/shop" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-btn px-8 font-semibold text-on-btn hover:bg-btn-hover">
          Keep shopping
        </Link>
      </main>
    </>
  );
}
