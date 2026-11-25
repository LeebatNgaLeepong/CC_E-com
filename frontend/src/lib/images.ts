import "server-only";
import { asc, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { productImages } from "@/db/schema";

export type ProductImageRow = {
  url: string;
  alt: string;
  color: string | null;
  position: number;
};

export async function getImagesByProduct(productIds: string[]) {
  const map = new Map<string, ProductImageRow[]>();
  if (productIds.length === 0) return map;

  const db = await getDb();
  const rows = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, productIds))
    .orderBy(asc(productImages.position));

  for (const row of rows) {
    const list = map.get(row.productId) ?? [];
    list.push({
      url: row.url,
      alt: row.alt,
      color: row.color,
      position: row.position,
    });
    map.set(row.productId, list);
  }
  return map;
}

export function pickImage(images: ProductImageRow[] | undefined, color?: string | null) {
  if (!images?.length) return null;
  return images.find((image) => image.color === color) ?? images[0];
}
