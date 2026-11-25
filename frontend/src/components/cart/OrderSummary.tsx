import { formatPeso } from "@/lib/format";

export default function OrderSummary({
  subtotalCents,
  shippingCents,
  totalCents,
  children,
}: {
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  children?: React.ReactNode;
}) {
  return (
    <aside className="rounded-card bg-card p-6 shadow-sm lg:sticky lg:top-32 lg:self-start">
      <h2 className="text-xl font-semibold">Order summary</h2>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd>{formatPeso(subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-soft">Shipping</dt>
          <dd>{shippingCents === 0 ? "Free" : formatPeso(shippingCents)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-4 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPeso(totalCents)}</dd>
        </div>
      </dl>
      {children}
    </aside>
  );
}
