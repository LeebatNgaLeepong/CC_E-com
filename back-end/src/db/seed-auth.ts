import bcrypt from "bcryptjs";
import { users, sellerProfiles } from "./schema";
import { scriptDb } from "./script-db";

type Seed = { email?: string; password?: string; role: "admin" | "seller" | "customer"; name: string };

const seeds: Seed[] = [
  { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, role: "admin", name: "Store Admin" },
  { email: process.env.SELLER_EMAIL, password: process.env.SELLER_PASSWORD, role: "seller", name: "Demo Seller" },
  { email: process.env.CONSUMER_EMAIL, password: process.env.CONSUMER_PASSWORD, role: "customer", name: "Demo Customer" },
];

async function main() {
  const { db, dispose } = await scriptDb();
  for (const seed of seeds) {
    if (!seed.email || !seed.password) {
      console.warn(`Skipping ${seed.role}: missing email or password in .env`);
      continue;
    }
    const passwordHash = await bcrypt.hash(seed.password, 12);
    const [row] = await db
      .insert(users)
      .values({ email: seed.email.toLowerCase(), passwordHash, role: seed.role, status: "active", name: seed.name })
      .onConflictDoUpdate({
        target: users.email,
        set: { passwordHash, role: seed.role, status: "active", name: seed.name },
      })
      .returning({ id: users.id });

    if (seed.role === "seller") {
      await db.insert(sellerProfiles).values({ userId: row.id, shopName: "Demo Shop" }).onConflictDoNothing();
    }
    console.log(`Seeded ${seed.role}: ${seed.email}`);
  }
  await dispose();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
