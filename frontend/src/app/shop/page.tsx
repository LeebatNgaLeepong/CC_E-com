import { Suspense } from "react";
import { io } from "next/cache";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import RewardsButton from "@/components/RewardsButton";
import Footer from "@/components/Footer";
import FilterBar from "@/components/shop/FilterBar";
import { getFacets, listProducts, type Filters } from "@/lib/catalog";

export const metadata = { title: "Shop" };
export const instant = false;

const SORTS = ["newest", "price-asc", "price-desc"] as const;

export default function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<main className="mx-auto max-w-[1280px] px-6 py-40 text-ink-soft">Loading shop…</main>}>
      <ShopContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ShopContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await io();
  const search = await searchParams;
  const one = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const sortParam = one(search.sort);
  const filters: Filters = {
    collection: one(search.collection),
    size: one(search.size),
    color: one(search.color),
    q: one(search.q),
    sort: SORTS.find((sort) => sort === sortParam),
  };
  const [items, facets] = await Promise.all([listProducts(filters), getFacets()]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1280px] px-6 pb-28 pt-40 md:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bloom-deep">Shop</p>
        <h1 className="mt-3 font-serif text-5xl tracking-[-0.03em] md:text-7xl">All pieces</h1>
        <form action="/shop" className="mt-8 flex max-w-xl gap-3">
          <label className="sr-only" htmlFor="shop-search">Search products</label>
          <input
            id="shop-search"
            name="q"
            defaultValue={filters.q}
            placeholder="Search pieces, colors, collections"
            className="min-h-12 min-w-0 flex-1 rounded-full border border-line bg-card px-5"
          />
          <button className="btn-primary min-h-12 rounded-full px-6 font-semibold">Search</button>
        </form>

        <div className="mt-12 grid gap-12 lg:grid-cols-[260px_1fr]">
          <details open className="group">
            <summary className="mb-6 min-h-11 cursor-pointer rounded-full bg-surface px-5 py-3 text-sm font-semibold lg:hidden">
              Filters
            </summary>
            <aside aria-label="Filters">
              <FilterBar facets={facets} current={filters} />
            </aside>
          </details>
          <section aria-label="Products">
            {items.length === 0 ? (
              <p className="text-ink-soft">No pieces match these filters. Try removing one.</p>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((product) => (
                  <ProductCard
                    key={product.id}
                    slug={product.slug}
                    name={product.name}
                    priceCentavos={product.minPrice}
                    subline={`${product.colors[0] ?? ""}${product.fit ? ` / ${product.fit}` : ""}`}
                    tone={product.tone}
                    soldOut={!product.inStock}
                    image={product.image}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <RewardsButton />
      <Footer />
    </>
  );
}
