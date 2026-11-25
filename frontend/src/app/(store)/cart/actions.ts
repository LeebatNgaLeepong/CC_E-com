"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { products, variants } from "@/db/schema";
import { MAX_LINES, MAX_QTY, readCart, writeCart } from "@/lib/cart";

export async function addToCart(
  variantId: string,
): Promise<{ ok: boolean; message?: string }> {
  const parsed = z.string().uuid().safeParse(variantId);
  if (!parsed.success) return { ok: false, message: "That item isn't available." };

  const db = await getDb();
  const [variant] = await db
    .select({ stock: variants.stock })
    .from(variants)
    .innerJoin(products, eq(products.id, variants.productId))
    .where(and(eq(variants.id, parsed.data), eq(products.active, true)))
    .limit(1);

  if (!variant || variant.stock < 1) {
    return { ok: false, message: "Sorry, that size just sold out." };
  }

  const lines = await readCart();
  const line = lines.find((entry) => entry.v === parsed.data);
  const max = Math.min(MAX_QTY, variant.stock);

  if (line) {
    if (line.q >= max) {
      return { ok: false, message: `You already have the most we can offer (${max}) in your bag.` };
    }
    line.q += 1;
  } else {
    if (lines.length >= MAX_LINES) return { ok: false, message: "Your bag is full." };
    lines.push({ v: parsed.data, q: 1 });
  }

  await writeCart(lines);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateQty(variantId: string, qty: number) {
  const id = z.string().uuid().parse(variantId);
  const lines = await readCart();
  const next = qty <= 0
    ? lines.filter((line) => line.v !== id)
    : lines.map((line) =>
        line.v === id
          ? { ...line, q: Math.min(Math.floor(qty), MAX_QTY) }
          : line,
      );

  await writeCart(next);
  revalidatePath("/", "layout");
}
