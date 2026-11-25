import { eq } from "drizzle-orm";
import { collections, productImages, products, variants } from "./schema";
import { scriptDb } from "./script-db";

const sizes = ["XS", "S", "M", "L", "XL"] as const;

const collectionSeeds = [
  { slug: "essentials", name: "Essentials" },
  { slug: "sets", name: "Sets" },
  { slug: "knitwear", name: "Knitwear" },
] as const;

const catalog = [
  {
    slug: "softline-tee", name: "Softline Tee", collection: "essentials", fit: "Essential", tone: "rose",
    colors: ["Rose"], priceCents: 185000,
    description: "A relaxed short-sleeve tee for everyday wear.",
    images: [
      { color: "Rose", file: "softline-tee-rose-1.jpg", alt: "Rose short-sleeve tee, flat lay" },
      { color: "Rose", file: "softline-tee-rose-2.jpg", alt: "Rose short-sleeve tee, second view" },
    ],
  },
  {
    slug: "cloud-set", name: "Cloud Set", collection: "sets", fit: "Relaxed", tone: "blush",
    colors: ["Blush", "Sage"], priceCents: 320000,
    description: "A relaxed two-piece sweatshirt and jogger set.",
    images: [
      { color: "Blush", file: "cloud-set-blush.jpg", alt: "Blush sweatshirt and jogger set, flat lay" },
      { color: "Sage", file: "cloud-set-sage.jpg", alt: "Sage sweatshirt and jogger set, flat lay" },
    ],
  },
  {
    slug: "meadow-knit", name: "Meadow Knit", collection: "knitwear", fit: "Lightweight", tone: "sage",
    colors: ["Sage"], priceCents: 278000,
    description: "A textured crew-neck knit in a soft sage.",
    images: [{ color: "Sage", file: "meadow-knit-sage.jpg", alt: "Sage waffle-knit sweater, flat lay" }],
  },
  {
    slug: "field-shirt", name: "Field Shirt", collection: "essentials", fit: "Relaxed", tone: "sage",
    colors: ["Sage"], priceCents: 249000,
    description: "A button-up shirt with a chest pocket and an easy fit.",
    images: [{ color: "Sage", file: "linen-shirt-sage.jpg", alt: "Sage button-up shirt with chest pocket, flat lay" }],
  },
  {
    slug: "signature-crew", name: "Signature Crew", collection: "essentials", fit: "Relaxed", tone: "blush",
    colors: ["Black"], priceCents: 295000,
    description: "A relaxed crew-neck sweatshirt with the wordmark on the chest.",
    images: [{ color: "Black", file: "signature-crew-black.jpg", alt: "Black crew-neck sweatshirt with wordmark, flat lay" }],
  },
  {
    slug: "quiet-cardigan", name: "Quiet Cardigan", collection: "knitwear", fit: "Oversized", tone: "rose",
    colors: ["Rose"], priceCents: 335000,
    description: "An oversized button-front cardigan in a chunky knit.",
    images: [{ color: "Rose", file: "quiet-cardigan-rose.jpg", alt: "Rose chunky-knit cardigan with buttons, flat lay" }],
  },
] as const;

async function seedCatalog() {
  const { db, dispose } = await scriptDb();
  try {
    const collectionIds = new Map<string, string>();
    for (const collection of collectionSeeds) {
      const [row] = await db
        .insert(collections)
        .values(collection)
        .onConflictDoUpdate({
          target: collections.slug,
          set: { name: collection.name },
        })
        .returning({ id: collections.id });
      if (!row) throw new Error(`Could not create or find collection "${collection.slug}"`);
      collectionIds.set(collection.slug, row.id);
    }

    for (const item of catalog) {
      const collectionId = collectionIds.get(item.collection);
      if (!collectionId) throw new Error(`Missing collection "${item.collection}" for "${item.slug}"`);

      const [product] = await db
        .insert(products)
        .values({
          slug: item.slug,
          name: item.name,
          description: item.description,
          fit: item.fit,
          tone: item.tone,
          collectionId,
        })
        .onConflictDoUpdate({
          target: products.slug,
          set: {
            name: item.name,
            description: item.description,
            fit: item.fit,
            tone: item.tone,
            collectionId,
          },
        })
        .returning({ id: products.id });
      if (!product) throw new Error(`Could not create or find product "${item.slug}"`);

      await db.delete(productImages).where(eq(productImages.productId, product.id));
      for (const [position, image] of item.images.entries()) {
        await db.insert(productImages).values({
          productId: product.id,
          color: image.color,
          url: `/images/products/${image.file}`,
          alt: image.alt,
          position,
        });
      }

      for (const color of item.colors) {
        for (const size of sizes) {
          const stock =
            size === "XS" && color === item.colors[0] ? 0
            : size === "L" && color === item.colors[item.colors.length - 1] ? 2
            : 12;

          await db
            .insert(variants)
            .values({
              productId: product.id,
              sku: `${item.slug}-${size}-${color}`.toLowerCase(),
              size,
              color,
              priceCents: item.priceCents,
              stock,
            })
            .onConflictDoUpdate({
              target: variants.sku,
              set: {
                productId: product.id,
                size,
                color,
                priceCents: item.priceCents,
                stock,
              },
            });
        }
      }
      console.log(`Seeded ${item.name}`);
    }
    console.log("Catalog seed complete");
  } finally {
    await dispose();
  }
}

seedCatalog().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
