import { collections, products, variants } from "./schema";
import { scriptDb } from "./script-db";

const sizes = ["XS", "S", "M", "L", "XL"] as const;

const collectionSeeds = [
  { slug: "essentials", name: "Essentials" },
  { slug: "sets", name: "Sets" },
  { slug: "knitwear", name: "Knitwear" },
] as const;

const catalog = [
  {
    slug: "softline-tee",
    name: "Softline Tee",
    collection: "essentials",
    fit: "Essential",
    tone: "rose",
    colors: ["Rose", "Cream"],
    priceCents: 185000,
    description: "A soft everyday tee in organic cotton jersey.",
  },
  {
    slug: "cloud-set",
    name: "Cloud Set",
    collection: "sets",
    fit: "Relaxed",
    tone: "blush",
    colors: ["Blush"],
    priceCents: 320000,
    description: "A relaxed two-piece set in brushed cotton.",
  },
  {
    slug: "meadow-knit",
    name: "Meadow Knit",
    collection: "knitwear",
    fit: "Lightweight",
    tone: "sage",
    colors: ["Sage", "Oat"],
    priceCents: 278000,
    description: "A lightweight knit for cool evenings.",
  },
  {
    slug: "linen-shirt",
    name: "Linen Shirt",
    collection: "essentials",
    fit: "Relaxed",
    tone: "sage",
    colors: ["Sage", "Cream"],
    priceCents: 249000,
    description: "A breathable linen shirt with a soft collar.",
  },
  {
    slug: "everyday-trouser",
    name: "Everyday Trouser",
    collection: "essentials",
    fit: "Straight",
    tone: "blush",
    colors: ["Blush", "Oat"],
    priceCents: 295000,
    description: "Straight-leg trousers with an easy waist.",
  },
  {
    slug: "quiet-cardigan",
    name: "Quiet Cardigan",
    collection: "knitwear",
    fit: "Oversized",
    tone: "rose",
    colors: ["Rose"],
    priceCents: 335000,
    description: "An oversized cardigan in a soft knit.",
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
