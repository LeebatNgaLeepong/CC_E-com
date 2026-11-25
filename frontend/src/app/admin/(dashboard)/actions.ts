"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../../../../back-end/src/db";
import { users } from "../../../../../back-end/src/db/schema";
import { requireAdmin } from "@/auth-guards";

const userIdSchema = z.string().uuid();
const statusSchema = z.enum(["active", "suspended"]);

export async function setSellerStatus(userId: string, status: "active" | "suspended") {
  await requireAdmin();
  const id = userIdSchema.parse(userId);
  const nextStatus = statusSchema.parse(status);
  const db = await getDb();

  await db
    .update(users)
    .set({ status: nextStatus })
    .where(and(eq(users.id, id), eq(users.role, "seller")));

  revalidatePath("/admin");
}
