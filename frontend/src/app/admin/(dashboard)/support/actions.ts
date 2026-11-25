"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { supportMessages } from "@/db/schema";
import { requireAdmin } from "@/auth-guards";

export async function resolveMessage(messageId: string) {
  await requireAdmin();
  const id = z.string().uuid().parse(messageId);
  const db = await getDb();
  await db.update(supportMessages).set({ status: "resolved" }).where(eq(supportMessages.id, id));
  revalidatePath("/admin/support");
}
