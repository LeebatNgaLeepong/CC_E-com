"use server";

import { headers } from "next/headers";
import { AuthError } from "next-auth";
import { signIn } from "../../auth";
import { env } from "../../../../back-end/src/lib/env";
import { rateLimit } from "../../../../back-end/src/lib/rate-limit";

type Portal = "consumer" | "seller" | "admin";

const destination: Record<Portal, string> = {
  consumer: "/account",
  seller: "/seller",
  admin: "/admin",
};

export async function loginAction(portal: Portal, _prev: string | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const requestedCallback = String(formData.get("callbackUrl") ?? "");
  const callbackUrl = portal === "consumer" && requestedCallback.startsWith("/account/basket")
    ? requestedCallback
    : destination[portal];
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0] ?? "local";
  const allowed = rateLimit(`${portal}:${ip}:${email}`, env.LOGIN_MAX_ATTEMPTS, env.LOGIN_WINDOW_MINUTES * 60_000);
  if (!allowed) return "Too many attempts. Please try again later.";

  try {
    await signIn(portal, { email, password, redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) return "Invalid email or password.";
    throw error;
  }
}
