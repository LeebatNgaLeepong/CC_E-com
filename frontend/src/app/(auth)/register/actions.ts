"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "../../../../../back-end/src/db";
import { sellerProfiles, users } from "../../../../../back-end/src/db/schema";
import { rateLimit } from "@/lib/rate-limit";

export type RegisterState = { error?: string } | undefined;

const baseSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z
    .string()
    .min(10, "Use at least 10 characters")
    .refine((value) => new TextEncoder().encode(value).length <= 72, "Password is too long"),
});

const sellerSchema = baseSchema.extend({
  shopName: z.string().trim().min(2, "Enter your shop name").max(80),
});

async function tooManyAttempts() {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0] ?? "local";
  return !rateLimit(`register:${ip}`, 5, 60 * 60 * 1000);
}

export async function registerCustomer(
  _previousState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  if (await tooManyAttempts()) {
    return { error: "Too many attempts. Please try again later." };
  }

  const parsed = baseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { name, email, password } = parsed.data;
  const db = await getDb();
  const passwordHash = await bcrypt.hash(password, 12);

  await db
    .insert(users)
    .values({ name, email, passwordHash, role: "customer", status: "active" })
    .onConflictDoNothing({ target: users.email });

  redirect("/login?registered=1");
}

export async function applyAsSeller(
  _previousState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  if (await tooManyAttempts()) {
    return { error: "Too many attempts. Please try again later." };
  }

  const parsed = sellerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { name, email, password, shopName } = parsed.data;
  const db = await getDb();
  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash, role: "seller", status: "pending" })
    .onConflictDoNothing({ target: users.email })
    .returning({ id: users.id });

  if (user) {
    await db.insert(sellerProfiles).values({ userId: user.id, shopName });
  }

  redirect("/register/submitted");
}
