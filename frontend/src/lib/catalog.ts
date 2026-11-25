import "server-only";
import { and, asc, desc, eq, min, sql, type SQL } from "drizzle-orm";
import { getDb } from "../../../back-end/src/db";
import { collections, products, variants } from "../../../back-end/src/db/schema";
import { getImagesByProduct, pickImage } from "@/lib/images";

export const SIZE_ORDER = ["XS", "S", "M", "L", "XL"];

export type Filters = {
  collection?: string;
  size?: string;
  color?: string;
  q?: string;
  sort?: "newest" | "price-asc" | "price-desc";
};

export async function listProducts(filters: Filters = {}) {
  const db = await getDb();
  const conditions: SQL[] = [eq(products.active, true)];

  if (filters.collection) conditions.push(eq(collections.slug, filters.collection));
  if (filters.size) conditions.push(eq(variants.size, filters.size));
  if (filters.color) conditions.push(eq(variants.color, filters.color));
  const query = filters.q?.trim().slice(0, 100);
  if (query) {
    conditions.push(
      sql`instr(lower(${products.name} || ' ' || coalesce(${products.description}, '')), lower(${query})) > 0`,
    );
  }

  const minPrice = min(variants.priceCents);
  const order =
    filters.sort === "price-asc" ? asc(minPrice)
    : filters.sort === "price-desc" ? desc(minPrice)
    : desc(products.createdAt);

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      fit: products.fit,
      tone: products.tone,
      minPrice,
      colors: sql<string | null>`group_concat(DISTINCT ${variants.color})`,
      inStock: sql<number>`max(case when ${variants.stock} > 0 then 1 else 0 end)`,
    })
    .from(products)
    .innerJoin(variants, eq(variants.productId, products.id))
    .leftJoin(collections, eq(collections.id, products.collectionId))
    .where(and(...conditions))
    .groupBy(products.id)
    .orderBy(order);

  const images = await getImagesByProduct(rows.map((row) => row.id));
  return rows.map((row) => ({
    ...row,
    minPrice: row.minPrice ?? 0,
    colors: row.colors?.split(",").sort() ?? [],
    inStock: row.inStock > 0,
    image: pickImage(images.get(row.id), filters.color),
  }));
}

export async function getProduct(slug: string) {
  const db = await getDb();
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.active, true)))
    .limit(1);
  if (!product) return null;

  const list = await db.select().from(variants).where(eq(variants.productId, product.id));
  const rank = (size: string) => {
    const index = SIZE_ORDER.indexOf(size);
    return index < 0 ? 99 : index;
  };
  list.sort((a, b) => a.color.localeCompare(b.color) || rank(a.size) - rank(b.size));
  const images = (await getImagesByProduct([product.id])).get(product.id) ?? [];
  return { ...product, variants: list, images };
}

export async function getFacets() {
  const db = await getDb();
  const [sizes, colors, productCollections] = await Promise.all([
    db
      .selectDistinct({ value: variants.size })
      .from(variants)
      .innerJoin(products, eq(products.id, variants.productId))
      .where(eq(products.active, true)),
    db
      .selectDistinct({ value: variants.color })
      .from(variants)
      .innerJoin(products, eq(products.id, variants.productId))
      .where(eq(products.active, true)),
    db
      .selectDistinct({ id: collections.id, slug: collections.slug, name: collections.name })
      .from(collections)
      .innerJoin(products, eq(products.collectionId, collections.id))
      .where(eq(products.active, true))
      .orderBy(asc(collections.name)),
  ]);

  const rank = (size: string) => {
    const index = SIZE_ORDER.indexOf(size);
    return index < 0 ? 99 : index;
  };
  return {
    sizes: sizes.map((entry) => entry.value).sort((a, b) => rank(a) - rank(b)),
    colors: colors.map((entry) => entry.value).sort(),
    collections: productCollections,
  };
}
