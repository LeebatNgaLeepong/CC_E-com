"use client";

import { useActionState } from "react";
import Field from "@/components/auth/Field";
import { sendSupportMessage, type SupportState } from "@/app/support/actions";

const control =
  "mt-2 block min-h-12 w-full rounded-control bg-card px-4 text-base text-ink outline-none ring-1 ring-ink/10 focus-visible:ring-2 focus-visible:ring-ink";

export default function SupportForm({ prefill }: { prefill: { name?: string; email?: string } }) {
  const [state, formAction, pending] = useActionState<SupportState, FormData>(
    sendSupportMessage,
    undefined,
  );
  const value = (key: string, fallback = "") => state?.values?.[key] ?? fallback;

  if (state?.ok) {
    return (
      <div role="status" className="rounded-card bg-card p-8 shadow-sm">
        <h2 className="font-serif text-3xl tracking-tight">Message sent</h2>
        <p className="mt-3 text-ink-soft">Thank you. We&rsquo;ll reply to the email address you gave us.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" autoComplete="name" required defaultValue={value("name", prefill.name)} />
        <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={value("email", prefill.email)} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label htmlFor="topic" className="block text-sm font-medium">
          Topic
          <select id="topic" name="topic" required defaultValue={value("topic", "order")} className={control}>
            <option value="order">An order</option>
            <option value="sizing">Sizing and fit</option>
            <option value="returns">Returns and exchanges</option>
            <option value="other">Something else</option>
          </select>
        </label>
        <Field label="Order number (optional)" name="orderCode" placeholder="ORD-XXXXXX" defaultValue={value("orderCode")} />
      </div>
      <label htmlFor="message" className="block text-sm font-medium">
        How can we help?
        <textarea id="message" name="message" rows={6} required defaultValue={value("message")} className={`${control} py-3`} />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <p role="alert" aria-live="polite" className="min-h-5 text-sm text-red-700 dark:text-red-300">
        {state?.error}
      </p>
      <button disabled={pending} className="btn-primary min-h-14 w-full rounded-full text-lg font-semibold sm:w-auto sm:px-12">
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
