import { Suspense } from "react";
import { io } from "next/cache";
import Storefront from "@/components/Storefront";
import { listProducts } from "@/lib/catalog";

export const instant = false;

export default function Home() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center text-ink-soft">Loading storefront…</main>}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  await io();
  const products = await listProducts({ sort: "newest" });
  return <Storefront products={products.slice(0, 3)} />;
}
