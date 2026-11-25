import type { CSSProperties } from "react";
import { Suspense } from "react";
import { io } from "next/cache";
import { notFound } from "next/navigation";
import ArchPlaceholder from "@/components/ArchPlaceholder";
import Header from "@/components/Header";
import RewardsButton from "@/components/RewardsButton";
import VariantSelector from "@/components/product/VariantSelector";
import { getProduct } from "@/lib/catalog";

export const instant = false;

const toneColors = {
  rose: "#d37897",
  blush: "#e99fb3",
  sage: "#799f76",
} as const;

export const metadata = { title: "Product" };

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<main className="mx-auto max-w-[1280px] px-6 py-40 text-ink-soft">Loading product…</main>}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  await io();
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto grid max-w-[1280px] gap-12 px-6 pb-28 pt-40 md:px-12 lg:grid-cols-[1fr_440px]">
        <div className="grid gap-6 sm:grid-cols-2">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`flex aspect-[4/5] items-center justify-center rounded-card ${
                index === 0 ? "sm:col-span-2" : ""
              }`}
              style={{ background: `linear-gradient(145deg, ${toneColors[product.tone]}cc, ${toneColors[product.tone]})` } as CSSProperties}
            >
              <ArchPlaceholder className="h-[70%] w-[50%] opacity-30" />
            </div>
          ))}
        </div>
        <section id="purchase" className="scroll-mt-32 lg:sticky lg:top-32 lg:self-start">
          {product.fit && (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bloom-deep">{product.fit}</p>
          )}
          <h1 className="mt-2 font-serif text-5xl tracking-[-0.03em]">{product.name}</h1>
          {product.description && <p className="mt-4 text-ink-soft">{product.description}</p>}
          <div className="mt-8">
            <VariantSelector
              defaultColor={{ rose: "Rose", blush: "Blush", sage: "Sage" }[product.tone]}
              variants={product.variants.map((variant) => ({
                id: variant.id,
                size: variant.size,
                color: variant.color,
                priceCents: variant.priceCents,
                stock: variant.stock,
              }))}
            />
          </div>
          <div className="mt-10 space-y-4 border-t border-line pt-8 text-sm text-ink-soft">
            <p><span className="font-semibold text-ink">Delivery.</span> Free over ₱5,000. Cash on delivery available.</p>
            <p><span className="font-semibold text-ink">Returns.</span> Free exchanges within 7 days.</p>
          </div>
        </section>
      </main>
      <RewardsButton />
    </>
  );
}
