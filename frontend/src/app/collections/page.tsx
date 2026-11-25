import { Suspense } from "react";
import { io } from "next/cache";
import Link from "next/link";
import Header from "@/components/Header";
import { getFacets } from "@/lib/catalog";

export const metadata = { title: "Collections" };
export const instant = false;

const tints = ["#e99fb3", "#799f76", "#d37897"];

export default function CollectionsPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-[1280px] px-6 py-40 text-ink-soft">Loading collections…</main>}>
      <CollectionsContent />
    </Suspense>
  );
}

async function CollectionsContent() {
  await io();
  const { collections } = await getFacets();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1280px] px-6 pb-28 pt-40 md:px-12">
        <h1 className="font-serif text-5xl tracking-[-0.03em] md:text-7xl">Collections</h1>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {collections.map((collection, index) => (
            <Link
              key={collection.slug}
              href={`/shop?collection=${collection.slug}`}
              className="flex aspect-[4/5] items-end rounded-card p-8"
              style={{ background: `linear-gradient(145deg, ${tints[index % tints.length]}cc, ${tints[index % tints.length]})` }}
            >
              <span className="rounded-full bg-card/80 px-5 py-3 font-serif text-4xl tracking-tight text-ink">
                {collection.name}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
