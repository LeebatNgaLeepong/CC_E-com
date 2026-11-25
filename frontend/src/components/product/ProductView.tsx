"use client";

import { useMemo, useState } from "react";
import ProductGallery from "./ProductGallery";
import VariantSelector from "./VariantSelector";
import type { ProductImageRow } from "@/lib/images";

type Variant = { id: string; size: string; color: string; priceCents: number; stock: number };

export default function ProductView({
  name,
  fit,
  description,
  images,
  variants,
}: {
  name: string;
  fit: string | null;
  description: string | null;
  images: ProductImageRow[];
  variants: Variant[];
}) {
  const colors = useMemo(() => [...new Set(variants.map((variant) => variant.color))], [variants]);
  const [color, setColor] = useState(colors[0] ?? "");
  const shown = useMemo(() => {
    const matching = images.filter((image) => image.color === color);
    return matching.length ? matching : images;
  }, [images, color]);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_440px]">
      <ProductGallery key={color} images={shown} name={name} />
      <section id="purchase" className="scroll-mt-32 lg:sticky lg:top-32 lg:self-start">
        {fit && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bloom-deep">{fit}</p>}
        <h1 className="mt-2 font-serif text-5xl tracking-[-0.03em]">{name}</h1>
        {description && <p className="mt-4 text-ink-soft">{description}</p>}
        <div className="mt-8">
          <VariantSelector variants={variants} color={color} onColorChange={setColor} />
        </div>
        <div className="mt-10 space-y-4 border-t border-line pt-8 text-sm text-ink-soft">
          <p><span className="font-semibold text-ink">Delivery.</span> Free over ₱5,000. Cash on delivery available.</p>
          <p><span className="font-semibold text-ink">Returns.</span> Free exchanges within 7 days.</p>
        </div>
      </section>
    </div>
  );
}
