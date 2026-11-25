import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import RewardsButton from "@/components/RewardsButton";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  fit: string | null;
  tone: "rose" | "blush" | "sage";
  minPrice: number;
  colors: string[];
  inStock: boolean;
  image: { url: string; alt: string } | null;
};

export default function Storefront({
  products,
}: {
  products: StoreProduct[];
}) {
  return (
    <main className="store-shell">
      <Header />

      <Hero />

      <section className="product-section" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow">New in</p><h2>Everyday essentials</h2></div>
          <Link href="/shop">View all <ArrowRight size={15} /></Link>
        </div>
        <div className="product-grid">
          {products.map((product) => (
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
      </section>

      <RewardsButton />
      <Footer />
    </main>
  );
}
