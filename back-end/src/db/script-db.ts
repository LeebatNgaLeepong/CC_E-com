import { getPlatformProxy } from "wrangler";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export async function scriptDb() {
  const { env, dispose } = await getPlatformProxy<{ DB: D1Database }>();
  return { db: drizzle(env.DB, { schema }), dispose };
}
