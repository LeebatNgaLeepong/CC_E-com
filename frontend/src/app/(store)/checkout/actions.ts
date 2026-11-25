"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import type { BatchItem } from "drizzle-orm/batch";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { orderItems, orders, variants } from "@/db/schema";
import { clearCart, getCart } from "@/lib/cart";
import { sendMail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";
import { formatPeso } from "@/lib/format";

export type CheckoutState =
  | { error?: string; values?: Record<string, string> }
  | undefined;

const text = (label: string, max = 120) =>
  z.string().trim().min(2, `Enter your ${label}`).max(max);

const checkoutSchema = z.object({
  name: text("full name", 80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone: z
    .string()
    .transform((value) => value.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(/^(\+?63|0)9\d{9}$/, "Enter a valid Philippine mobile number")),
  line1: z.string().trim().min(5, "Enter your street address").max(120),
  barangay: text("barangay", 80),
  city: text("city or municipality", 80),
  province: text("province", 80),
  postalCode: z.string().trim().regex(/^\d{4}$/, "Enter a 4-digit postal code"),
  payment: z.literal("cod"),
});

function orderCode() {
  const chars = Array.from(
    crypto.getRandomValues(new Uint8Array(6)),
    (byte) => (byte % 36).toString(36),
  );
  return `ORD-${chars.join("").toUpperCase()}`;
}

function isStockError(error: unknown) {
  const message = `${String(error)} ${String((error as { cause?: unknown })?.cause ?? "")}`;
  return message.includes("CHECK constraint") || message.includes("stock_non_negative");
}

export async function placeOrder(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const values = Object.fromEntries(
    [...formData].filter(([, value]) => typeof value === "string"),
  ) as Record<string, string>;

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(`order:${ip}`, 5, 15 * 60 * 1000)) {
    return { error: "Too many orders from this device. Please try again later.", values };
  }

  const parsed = checkoutSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, values };
  }
  const details = parsed.data;

  const cart = await getCart();
  if (cart.items.length === 0) {
    return { error: "Your bag is empty.", values };
  }
  if (cart.hasIssues) {
    return { error: "Something in your bag changed. Please review it first.", values };
  }

  const session = await auth();
  const userId = session?.user.role === "customer" ? session.user.id : null;
  const orderId = crypto.randomUUID();
  const code = orderCode();
  const shippingAddress =
    `${details.line1}, ${details.barangay}, ${details.city}, ${details.province} ${details.postalCode}`;

  const db = await getDb();
  const statements = [
    db.insert(orders).values({
      id: orderId,
      code,
      userId,
      customerName: details.name,
      email: details.email,
      phone: details.phone,
      status: "pending",
      subtotalCents: cart.subtotalCents,
      shippingCents: cart.shippingCents,
      totalCents: cart.totalCents,
      paymentMethod: "cod",
      shippingAddress,
    }),
    ...cart.items.map((item) =>
      db.insert(orderItems).values({
        orderId,
        variantId: item.variantId,
        productName: item.name,
        size: item.size,
        color: item.color,
        quantity: item.qty,
        priceCents: item.priceCents,
      }),
    ),
    ...cart.items.map((item) =>
      db
        .update(variants)
        .set({ stock: sql`${variants.stock} - ${item.qty}` })
        .where(eq(variants.id, item.variantId)),
    ),
  ];

  try {
    await db.batch(
      statements as unknown as [BatchItem<"sqlite">, ...BatchItem<"sqlite">[]],
    );
  } catch (error) {
    if (isStockError(error)) {
      return { error: "Sorry, an item just sold out. Please review your bag.", values };
    }
    console.error("placeOrder failed", error);
    return { error: "We couldn't place your order. Please try again.", values };
  }

  try {
    await sendMail({
      to: details.email,
      subject: `We received your order ${code}`,
      text: `Thank you, ${details.name}. Your total is ${formatPeso(cart.totalCents)}, payable on delivery.`,
    });
  } catch (error) {
    console.error("order email failed", error);
  }

  await clearCart();
  redirect(`/order/${orderId}`);
}
