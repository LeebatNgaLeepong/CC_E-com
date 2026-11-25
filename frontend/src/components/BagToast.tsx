"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Check } from "lucide-react";

export default function BagToast({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timeout = setTimeout(onDone, 5000);
    return () => clearTimeout(timeout);
  }, [onDone]);

  return (
    <div
      role="status"
      className="glass glass-strong fixed bottom-6 left-1/2 z-50 flex min-h-12 -translate-x-1/2 items-center gap-3 whitespace-nowrap pl-5 pr-2 text-sm"
    >
      <Check size={16} aria-hidden />
      <span>Added to bag</span>
      <Link href="/cart" className="inline-flex min-h-11 items-center rounded-full px-4 font-semibold underline">
        View bag
      </Link>
    </div>
  );
}
