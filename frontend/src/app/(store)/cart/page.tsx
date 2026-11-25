import Link from "next/link";
import Header from "@/components/Header";
import OrderSummary from "@/components/cart/OrderSummary";
import { getCart, MAX_QTY } from "@/lib/cart";
import { formatPeso } from "@/lib/format";
import ProductImage from "@/components/ProductImage";
import { updateQty } from "./actions";

export const metadata = { title: "Your bag" };
export const instant = false;

export default async function CartPage() {
  const cart = await getCart();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1180px] px-6 pb-28 pt-40 md:px-12">
        <h1 className="font-serif text-5xl tracking-[-0.03em] md:text-7xl">Your bag</h1>

        {cart.items.length === 0 ? (
          <div className="mt-12">
            <p className="text-ink-soft">Your bag is empty.</p>
            <Link href="/shop" className="btn-primary mt-6 inline-flex min-h-12 items-center rounded-full px-8 font-semibold">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_380px]">
            <ul className="divide-y divide-line overflow-hidden rounded-card bg-card shadow-sm">
              {cart.items.map((item) => {
                const maxQty = Math.min(item.stock, MAX_QTY);
                return (
                  <li key={item.variantId} className="flex gap-5 p-5">
                    <ProductImage
                      src={item.image?.url}
                      alt={item.image?.alt ?? item.name}
                      tone={item.tone}
                      sizes="96px"
                      className="h-28 w-24 shrink-0"
                      rounded="rounded-control"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between gap-4">
                        <div>
                          <Link href={`/product/${item.slug}`} className="text-lg font-semibold">{item.name}</Link>
                          <p className="text-sm text-ink-soft">{item.color} / {item.size}</p>
                        </div>
                        <p className="font-semibold">{formatPeso(item.priceCents)}</p>
                      </div>

                      {item.soldOut && <p className="text-sm text-red-700 dark:text-red-300">Sold out. Remove it to continue.</p>}
                      {item.adjusted && <p className="text-sm text-red-700 dark:text-red-300">Only {item.qty} available. Update your quantity.</p>}

                      <div className="mt-3 flex items-center gap-3">
                        <form action={updateQty.bind(null, item.variantId, item.requested - 1)}>
                          <button aria-label={`Decrease quantity of ${item.name}`} className="h-11 w-11 rounded-full bg-surface text-lg hover:bg-ink/10">-</button>
                        </form>
                        <span className="min-w-6 text-center" aria-live="polite">{item.soldOut ? 0 : item.qty}</span>
                        <form action={updateQty.bind(null, item.variantId, item.qty + 1)}>
                          <button
                            aria-label={`Increase quantity of ${item.name}`}
                            disabled={item.soldOut || item.qty >= maxQty}
                            className="h-11 w-11 rounded-full bg-surface text-lg hover:bg-ink/10 disabled:opacity-40"
                          >+</button>
                        </form>
                        <form action={updateQty.bind(null, item.variantId, 0)} className="ml-auto">
                          <button className="min-h-11 px-2 text-sm font-semibold underline">Remove</button>
                        </form>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <OrderSummary subtotalCents={cart.subtotalCents} shippingCents={cart.shippingCents} totalCents={cart.totalCents}>
              {cart.hasIssues ? (
                <p className="mt-6 text-sm text-red-700 dark:text-red-300">Update your bag to continue.</p>
              ) : (
                <Link href="/checkout" className="btn-primary mt-6 flex min-h-14 items-center justify-center rounded-full text-lg font-semibold">
                  Check out
                </Link>
              )}
            </OrderSummary>
          </div>
        )}
      </main>
    </>
  );
}
