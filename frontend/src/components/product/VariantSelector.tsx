"use client";

import { useMemo, useState, useTransition } from "react";
import { formatPeso } from "@/lib/format";
import { addToCart } from "@/app/(store)/cart/actions";
import BagToast from "@/components/BagToast";

type Variant = { id: string; size: string; color: string; priceCents: number; stock: number };
const SIZE_ORDER = ["XS", "S", "M", "L", "XL"];
const sizeRank = (size: string) => {
  const index = SIZE_ORDER.indexOf(size);
  return index < 0 ? 99 : index;
};

export default function VariantSelector({
  variants,
  color,
  onColorChange,
}: {
  variants: Variant[];
  color: string;
  onColorChange: (color: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colors = useMemo(() => [...new Set(variants.map((variant) => variant.color))], [variants]);
  const sizes = useMemo(
    () => [...new Set(variants.map((variant) => variant.size))].sort((a, b) => sizeRank(a) - sizeRank(b)),
    [variants],
  );
  const [size, setSize] = useState<string | null>(null);

  const find = (selectedColor: string, selectedSize: string) =>
    variants.find((variant) => variant.color === selectedColor && variant.size === selectedSize);
  const selected = size ? find(color, size) : undefined;
  const price = selected?.priceCents ?? Math.min(...variants.map((variant) => variant.priceCents));
  const label = variants.length === 0 ? "Unavailable" : selected ? "Add to bag" : "Select a size";

  function pickColor(nextColor: string) {
    onColorChange(nextColor);
    if (size && (find(nextColor, size)?.stock ?? 0) === 0) setSize(null);
  }

  function handleAdd() {
    if (!selected) return;
    setError(null);
    startTransition(async () => {
      const result = await addToCart(selected.id);
      if (result.ok) setAdded(true);
      else setError(result.message ?? "Something went wrong.");
    });
  }

  return (
    <div>
      <p className="text-2xl font-semibold">{formatPeso(Number.isFinite(price) ? price : 0)}</p>
      {colors.length > 0 && (
        <fieldset className="mt-8">
          <legend className="text-sm font-semibold">
            Color: <span className="font-normal text-ink-soft">{color}</span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {colors.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => pickColor(option)}
                aria-pressed={option === color}
                className={`min-h-11 rounded-full px-5 text-sm font-medium transition ${
                  option === color ? "btn-primary" : "bg-surface hover:bg-ink/10"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {sizes.length > 0 && (
        <fieldset className="mt-8">
          <legend className="text-sm font-semibold">Size</legend>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {sizes.map((option) => {
              const variant = find(color, option);
              const unavailable = !variant || variant.stock === 0;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={unavailable}
                  onClick={() => setSize(option)}
                  aria-pressed={option === size}
                  className={`min-h-12 rounded-control text-sm font-semibold transition ${
                    option === size ? "btn-primary" : "bg-surface hover:bg-ink/10"
                  } disabled:cursor-not-allowed disabled:text-ink-soft/50 disabled:line-through`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {selected && selected.stock > 0 && selected.stock <= 3 && (
            <p className="mt-3 text-sm text-bloom-deep">Only {selected.stock} left</p>
          )}
        </fieldset>
      )}
      <button
        type="button"
        disabled={!selected || selected.stock === 0 || pending}
        onClick={handleAdd}
        className="btn-primary mt-8 min-h-14 w-full rounded-full text-lg font-semibold"
      >
        {pending ? "Adding…" : label}
      </button>
      <p role="alert" aria-live="polite" className="mt-3 min-h-5 text-sm text-red-700 dark:text-red-300">{error}</p>
      {added && <BagToast onDone={() => setAdded(false)} />}
    </div>
  );
}
