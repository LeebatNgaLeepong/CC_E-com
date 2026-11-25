"use server";

import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import type { BatchItem } from "drizzle-orm/batch";
import { getDb } from "@/db";
import { orderItems, orders, variants } from "@/db/schema";
import { requireAdmin } from "@/auth-guards";

export async function markFulfilled(orderId: string) {
  await requireAdmin();
  const id = z.string().uuid().parse(orderId);
  const db = await getDb();
  await db
    .update(orders)
    .set({ status: "fulfilled" })
    .where(and(eq(orders.id, id), eq(orders.status, "pending")));
  revalidatePath("/admin/orders");
}

export async function cancelOrder(orderId: string) {
  await requireAdmin();
  const id = z.string().uuid().parse(orderId);
  const db = await getDb();

  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order || order.status !== "pending") return;

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  const statements = [
    db
      .update(orders)
      .set({ status: "cancelled" })
      .where(and(eq(orders.id, id), eq(orders.status, "pending"))),
    ...items.map((item) =>
      db
        .update(variants)
        .set({ stock: sql`${variants.stock} + ${item.quantity}` })
        .where(eq(variants.id, item.variantId)),
    ),
  ];

  await db.batch(
    statements as unknown as [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]],
  );
  revalidatePath("/admin/orders");
}
