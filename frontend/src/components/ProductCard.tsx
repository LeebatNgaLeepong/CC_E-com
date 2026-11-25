"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { ShoppingBag } from "lucide-react";
import { formatPeso } from "@/lib/format";
import ProductImage from "./ProductImage";

const toneColors = {
  rose: "#d37897",
  blush: "#e99fb3",
  sage: "#799f76",
} as const;

export default function ProductCard({
  slug,
  name,
  priceCentavos,
  subline,
  tone,
  soldOut = false,
  image,
}: {
  slug: string;
  name: string;
  priceCentavos: number;
  subline: string;
  tone: keyof typeof toneColors;
  soldOut?: boolean;
  image?: { url: string; alt: string } | null;
}) {
  return (
    <article className="product-card">
      <div className="product-image" style={{ "--product": toneColors[tone] } as CSSProperties}>
        <Link href={`/product/${slug}`} className="absolute inset-0" aria-label={`View ${name}`} />
        <ProductImage
          src={image?.url}
          alt={image?.alt ?? name}
          tone={tone}
          sizes="(min-width: 1280px) 400px, (min-width: 640px) 45vw, 90vw"
          rounded="rounded-none"
        />
        {soldOut && (
          <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold">
            Sold out
          </span>
        )}
        {!soldOut && (
          <Link
            href={`/product/${slug}#purchase`}
            className="quick-add"
            aria-label={`Choose a variant of ${name}`}
          >
            <ShoppingBag size={17} />
          </Link>
        )}
      </div>
      <div className="product-meta">
        <div>
          <h3><Link href={`/product/${slug}`}>{name}</Link></h3>
          <p>{subline}</p>
        </div>
        <strong>{formatPeso(priceCentavos)}</strong>
      </div>
    </article>
  );
}
