import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import RewardsButton from "@/components/RewardsButton";

type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  fit: string | null;
  tone: "rose" | "blush" | "sage";
  minPrice: number;
  colors: string[];
  inStock: boolean;
};

export default function Storefront({
  products,
}: {
  products: StoreProduct[];
}) {
  return (
    <main className="store-shell">
      <Header />

      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-art" aria-hidden="true">
          <div className="look-card look-pink"><div className="look-garment"><span className="look-sleeve left" /><span className="look-body" /><span className="look-sleeve right" /></div></div>
          <div className="look-card look-sage"><div className="look-garment"><span className="look-sleeve left" /><span className="look-body" /><span className="look-sleeve right" /></div></div>
          <div className="look-card look-mist"><div className="look-garment"><span className="look-sleeve left" /><span className="look-body" /><span className="look-sleeve right" /></div></div>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">A quieter kind of everyday</p>
          <h1 id="hero-heading">Made for the life<br />you live.</h1>
          <a className="primary-button" href="#shop">Shop the collection <ArrowRight size={17} /></a>
        </div>
      </section>

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
            />
          ))}
        </div>
      </section>

      <RewardsButton />
    </main>
  );
}
