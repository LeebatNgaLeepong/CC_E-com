"use client";

import { useState } from "react";
import ProductImage from "@/components/ProductImage";
import type { ProductImageRow } from "@/lib/images";

export default function ProductGallery({ images, name }: { images: ProductImageRow[]; name: string }) {
  const [index, setIndex] = useState(0);

  const current = images[index] ?? images[0];

  return (
    <div>
      <ProductImage
        src={current?.url}
        alt={current?.alt ?? name}
        sizes="(min-width: 1024px) 55vw, 100vw"
        priority
      />
      {images.length > 1 && (
        <ul className="mt-4 flex gap-3" aria-label="Product views">
          {images.map((image, position) => (
            <li key={image.url} className="w-20">
              <button
                type="button"
                onClick={() => setIndex(position)}
                aria-label={`Show view ${position + 1} of ${images.length}`}
                aria-current={position === index ? "true" : undefined}
                className={`block w-full rounded-control ring-2 ${position === index ? "ring-ink" : "ring-transparent"}`}
              >
                <ProductImage src={image.url} alt="" sizes="80px" rounded="rounded-control" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
