"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/auth";
import { getDb } from "@/db";
import { supportMessages } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { sendMail } from "@/lib/mail";
import { SUPPORT_EMAIL } from "@/lib/site";

export type SupportState =
  | { ok?: boolean; error?: string; values?: Record<string, string> }
  | undefined;

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  topic: z.enum(["order", "sizing", "returns", "other"], { message: "Choose a topic" }),
  orderCode: z.string().trim().max(20).optional().transform((value) => value || null),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(2000),
});

export async function sendSupportMessage(
  _previous: SupportState,
  formData: FormData,
): Promise<SupportState> {
  const values = Object.fromEntries(
    [...formData].filter(([, value]) => typeof value === "string"),
  ) as Record<string, string>;

  if (values.website) return { ok: true };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(`support:${ip}`, 5, 60 * 60 * 1000)) {
    return { error: "Too many messages. Please try again later.", values };
  }

  const parsed = schema.safeParse(values);
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };
  const details = parsed.data;

  const session = await auth();
  const db = await getDb();
  await db.insert(supportMessages).values({
    ...details,
    userId: session?.user.role === "customer" ? session.user.id : null,
  });

  try {
    await sendMail({
      to: SUPPORT_EMAIL,
      subject: `[Support] ${details.topic}: ${details.name}`,
      text: `${details.message}\n\nFrom: ${details.name} <${details.email}>${details.orderCode ? `\nOrder: ${details.orderCode}` : ""}`,
    });
  } catch (error) {
    console.error("support email failed", error);
  }

  return { ok: true };
}
