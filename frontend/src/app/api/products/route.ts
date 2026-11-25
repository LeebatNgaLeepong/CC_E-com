import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../../back-end/src/db";
import { collections, products, variants } from "../../../../../back-end/src/db/schema";

export async function GET() {
  const db = await getDb();
  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      description: products.description,
      active: products.active,
      collection: collections.name,
      variantId: variants.id,
      size: variants.size,
      color: variants.color,
      priceCents: variants.priceCents,
      stock: variants.stock,
    })
    .from(products)
    .leftJoin(collections, eq(products.collectionId, collections.id))
    .leftJoin(variants, eq(variants.productId, products.id))
    .where(eq(products.active, true));

  const catalog = new Map<string, {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    active: boolean;
    collection: string | null;
    variants: Array<{
      id: string;
      size: string;
      color: string;
      priceCents: number;
      stock: number;
    }>;
  }>();

  for (const row of rows) {
    if (!catalog.has(row.id)) {
      catalog.set(row.id, {
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description,
        active: row.active,
        collection: row.collection,
        variants: [],
      });
    }

    if (row.variantId && row.size && row.color && row.priceCents !== null && row.stock !== null) {
      catalog.get(row.id)!.variants.push({
        id: row.variantId,
        size: row.size,
        color: row.color,
        priceCents: row.priceCents,
        stock: row.stock,
      });
    }
  }

  return NextResponse.json([...catalog.values()]);
}
