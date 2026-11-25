import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, check, index } from "drizzle-orm/sqlite-core";

const id = () => text("id").primaryKey().$defaultFn(() => crypto.randomUUID());
const createdAt = () =>
  integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date());

export const users = sqliteTable("users", {
  id: id(),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["customer", "seller", "admin"] }).notNull().default("customer"),
  status: text("status", { enum: ["active", "pending", "suspended"] }).notNull().default("active"),
  createdAt: createdAt(),
});

export const sellerProfiles = sqliteTable("seller_profiles", {
  id: id(),
  userId: text("user_id").notNull().unique().references(() => users.id),
  shopName: text("shop_name").notNull(),
  createdAt: createdAt(),
});

export const collections = sqliteTable("collections", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
});

export const products = sqliteTable("products", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  fit: text("fit"),
  tone: text("tone", { enum: ["rose", "blush", "sage"] }).notNull().default("rose"),
  collectionId: text("collection_id").references(() => collections.id),
  sellerId: text("seller_id").references(() => users.id),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: createdAt(),
});

export const variants = sqliteTable(
  "variants",
  {
    id: id(),
    productId: text("product_id").notNull().references(() => products.id),
    sku: text("sku").notNull().unique(),
    size: text("size").notNull(),
    color: text("color").notNull(),
    priceCents: integer("price_cents").notNull(),
    stock: integer("stock").notNull().default(0),
  },
  (t) => [
    check("stock_non_negative", sql`${t.stock} >= 0`),
    index("variants_product_idx").on(t.productId),
  ],
);

export const productImages = sqliteTable(
  "product_images",
  {
    id: id(),
    productId: text("product_id").notNull().references(() => products.id),
    color: text("color"),
    url: text("url").notNull(),
    alt: text("alt").notNull(),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("product_images_product_idx").on(t.productId)],
);

export const orders = sqliteTable("orders", {
  id: id(),
  code: text("code").notNull().unique().default(""),
  userId: text("user_id").references(() => users.id),
  customerName: text("customer_name").notNull().default(""),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  status: text("status", {
    enum: ["pending", "paid", "fulfilled", "cancelled", "refunded"],
  }).notNull().default("pending"),
  subtotalCents: integer("subtotal_cents").notNull().default(0),
  shippingCents: integer("shipping_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentRef: text("payment_ref"),
  shippingAddress: text("shipping_address").notNull(),
  createdAt: createdAt(),
});

export const orderItems = sqliteTable("order_items", {
  id: id(),
  orderId: text("order_id").notNull().references(() => orders.id),
  variantId: text("variant_id").notNull().references(() => variants.id),
  productName: text("product_name").notNull().default(""),
  size: text("size").notNull().default(""),
  color: text("color").notNull().default(""),
  quantity: integer("quantity").notNull(),
  priceCents: integer("price_cents").notNull(),
});

export const supportMessages = sqliteTable("support_messages", {
  id: id(),
  userId: text("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  topic: text("topic", { enum: ["order", "sizing", "returns", "other"] }).notNull(),
  orderCode: text("order_code"),
  message: text("message").notNull(),
  status: text("status", { enum: ["open", "resolved"] }).notNull().default("open"),
  createdAt: createdAt(),
});
