import { Suspense } from "react";
import { io } from "next/cache";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import RewardsButton from "@/components/RewardsButton";
import Footer from "@/components/Footer";
import ProductView from "@/components/product/ProductView";
import { getProduct } from "@/lib/catalog";

export const instant = false;

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
      <main className="mx-auto max-w-[1280px] px-6 pb-28 pt-40 md:px-12">
        <ProductView
          name={product.name}
          fit={product.fit}
          description={product.description}
          images={product.images}
          variants={product.variants.map((variant) => ({
            id: variant.id,
            size: variant.size,
            color: variant.color,
            priceCents: variant.priceCents,
            stock: variant.stock,
          }))}
        />
      </main>
      <RewardsButton />
      <Footer />
    </>
  );
}
