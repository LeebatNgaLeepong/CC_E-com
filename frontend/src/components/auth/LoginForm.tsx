"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/(auth)/actions";
import Field from "./Field";

export default function LoginForm({
  portal,
  tone = "light",
  callbackUrl,
}: {
  portal: "consumer" | "seller" | "admin";
  tone?: "light" | "dark";
  callbackUrl?: string;
}) {
  const [error, formAction, pending] = useActionState(loginAction.bind(null, portal), undefined);
  const dark = tone === "dark";
  return (
    <form action={formAction} className="mt-6 space-y-4" noValidate>
      {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
      <Field label="Email" name="email" type="email" autoComplete="email" required tone={tone} />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required tone={tone} />
      <p role="alert" aria-live="polite" className={`min-h-5 text-sm ${dark ? "text-red-300" : "text-red-700"}`}>{error}</p>
      <button disabled={pending}       className={`min-h-12 w-full rounded-full text-base font-semibold transition disabled:opacity-60 ${dark ? "bg-white text-[#1d1d1f] hover:bg-white/90" : "btn-primary"}`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
