"use client";

import { useActionState } from "react";
import Field from "@/components/auth/Field";
import { placeOrder, type CheckoutState } from "@/app/(store)/checkout/actions";

export default function CheckoutForm({
  prefill,
}: {
  prefill: { name?: string; email?: string };
}) {
  const [state, formAction, pending] =
    useActionState<CheckoutState, FormData>(placeOrder, undefined);
  const value = (key: string, fallback = "") =>
    state?.values?.[key] ?? fallback;

  return (
    <form action={formAction} className="space-y-10" noValidate>
      <section>
        <h2 className="text-xl font-semibold">Contact</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" name="name" autoComplete="name" required defaultValue={value("name", prefill.name)} />
          <Field label="Mobile number" name="phone" type="tel" autoComplete="tel" placeholder="09XX XXX XXXX" required defaultValue={value("phone")} />
          <div className="sm:col-span-2">
            <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={value("email", prefill.email)} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Delivery address</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Street, building, house no." name="line1" autoComplete="address-line1" required defaultValue={value("line1")} />
          </div>
          <Field label="Barangay" name="barangay" required defaultValue={value("barangay")} />
          <Field label="City or municipality" name="city" autoComplete="address-level2" required defaultValue={value("city")} />
          <Field label="Province" name="province" autoComplete="address-level1" required defaultValue={value("province")} />
          <Field label="Postal code" name="postalCode" inputMode="numeric" autoComplete="postal-code" required defaultValue={value("postalCode")} />
        </div>
      </section>

      <fieldset>
        <legend className="text-xl font-semibold">Payment</legend>
        <div className="mt-4 space-y-3">
          <label className="flex min-h-14 items-center gap-3 rounded-control bg-card p-4 ring-2 ring-ink">
            <input type="radio" name="payment" value="cod" defaultChecked />
            <span>
              <span className="block font-medium">Cash on delivery</span>
              <span className="block text-sm text-ink-soft">Pay in cash when your order arrives.</span>
            </span>
          </label>
          <label className="flex min-h-14 items-center gap-3 rounded-control bg-card/60 p-4 text-ink-soft">
            <input type="radio" disabled />
            <span>Card, GCash or Maya (coming soon)</span>
          </label>
        </div>
      </fieldset>

      <div>
        <p role="alert" aria-live="polite" className="min-h-6 text-sm text-red-700 dark:text-red-300">{state?.error}</p>
        <button
          disabled={pending}
          className="btn-primary mt-2 min-h-14 w-full rounded-full text-lg font-semibold"
        >
          {pending ? "Placing order…" : "Place order"}
        </button>
      </div>
    </form>
  );
}
