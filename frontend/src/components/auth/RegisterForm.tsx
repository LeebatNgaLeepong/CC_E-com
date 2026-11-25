"use client";

import { useActionState } from "react";
import { applyAsSeller, registerCustomer } from "@/app/(auth)/register/actions";
import Field from "./Field";

export default function RegisterForm({ seller }: { seller: boolean }) {
  const [state, formAction, pending] = useActionState(
    seller ? applyAsSeller : registerCustomer,
    undefined,
  );

  return (
    <form action={formAction} className="mt-6 space-y-4" noValidate>
      <Field label="Full name" name="name" autoComplete="name" required />
      {seller && <Field label="Shop name" name="shopName" required />}
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Password" name="password" type="password" autoComplete="new-password" required />
      <p className="text-xs text-ink-soft">Use at least 10 characters.</p>
      <p role="alert" aria-live="polite" className="min-h-5 text-sm text-red-700 dark:text-red-300">
        {state?.error}
      </p>
      <button
        disabled={pending}
        className="min-h-12 w-full rounded-full bg-btn text-base font-semibold text-on-btn transition hover:bg-btn-hover disabled:opacity-60"
      >
        {pending ? "Please wait…" : seller ? "Submit application" : "Create account"}
      </button>
    </form>
  );
}
