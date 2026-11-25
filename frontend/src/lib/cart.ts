import "server-only";
import { cookies } from "next/headers";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { products, variants } from "@/db/schema";
import { totals } from "@/lib/shipping";

export const MAX_QTY = 10;
export const MAX_LINES = 20;

const CART_COOKIE = "cart";

const linesSchema = z
  .array(z.object({ v: z.string().uuid(), q: z.number().int().min(1).max(MAX_QTY) }))
  .max(MAX_LINES);

export type Line = z.infer<typeof linesSchema>[number];

export async function readCart(): Promise<Line[]> {
  const raw = (await cookies()).get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = linesSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export async function writeCart(lines: Line[]) {
  (await cookies()).set(CART_COOKIE, JSON.stringify(lines), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearCart() {
  (await cookies()).delete(CART_COOKIE);
}

export async function getCartCount() {
  return (await readCart()).reduce((n, line) => n + line.q, 0);
}

export async function getCart() {
  const lines = await readCart();
  if (lines.length === 0) {
    return { items: [], count: 0, hasIssues: false, ...totals(0) };
  }

  const db = await getDb();
  const rows = await db
    .select({
      variantId: variants.id,
      size: variants.size,
      color: variants.color,
      priceCents: variants.priceCents,
      stock: variants.stock,
      productId: products.id,
      name: products.name,
      slug: products.slug,
      tone: products.tone,
    })
    .from(variants)
    .innerJoin(products, eq(products.id, variants.productId))
    .where(and(inArray(variants.id, lines.map((line) => line.v)), eq(products.active, true)));

  const byId = new Map(rows.map((row) => [row.variantId, row]));
  const items = lines.flatMap((line) => {
    const row = byId.get(line.v);
    if (!row) return [];
    const qty = Math.min(line.q, row.stock);
    return [{
      ...row,
      requested: line.q,
      qty,
      lineCents: row.priceCents * qty,
      soldOut: row.stock === 0,
      adjusted: row.stock > 0 && qty < line.q,
    }];
  });

  const subtotalCents = items.reduce((sum, item) => sum + item.lineCents, 0);
  return {
    items,
    count: items.reduce((sum, item) => sum + item.qty, 0),
    hasIssues: items.length !== lines.length || items.some((item) => item.soldOut || item.adjusted),
    ...totals(subtotalCents),
  };
}
