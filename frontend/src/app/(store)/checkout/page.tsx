import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Header from "@/components/Header";
import OrderSummary from "@/components/cart/OrderSummary";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getCart } from "@/lib/cart";
import { formatPeso } from "@/lib/format";

export const metadata = { title: "Checkout" };
export const instant = false;

export default async function CheckoutPage() {
  const cart = await getCart();
  if (cart.items.length === 0 || cart.hasIssues) redirect("/cart");

  const session = await auth();
  const prefill =
    session?.user.role === "customer"
      ? { name: session.user.name ?? undefined, email: session.user.email ?? undefined }
      : {};

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1180px] px-6 pb-28 pt-40 md:px-12">
        <h1 className="font-serif text-5xl tracking-[-0.03em] md:text-7xl">Checkout</h1>
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
          <CheckoutForm prefill={prefill} />
          <OrderSummary
            subtotalCents={cart.subtotalCents}
            shippingCents={cart.shippingCents}
            totalCents={cart.totalCents}
          >
            <ul className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
              {cart.items.map((item) => (
                <li key={item.variantId} className="flex justify-between gap-4">
                  <span>{item.qty} × {item.name} ({item.color}, {item.size})</span>
                  <span>{formatPeso(item.lineCents)}</span>
                </li>
              ))}
            </ul>
          </OrderSummary>
        </div>
      </main>
    </>
  );
}
