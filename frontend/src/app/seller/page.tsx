import { Suspense } from "react";
import { io } from "next/cache";
import { count, eq } from "drizzle-orm";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { getDb } from "../../../../back-end/src/db";
import { products, sellerProfiles } from "../../../../back-end/src/db/schema";
import StatCard from "@/components/portal/StatCard";

export const metadata = { title: "Seller dashboard" };
export const instant = false;

export default function SellerPage() {
  return (
    <Suspense fallback={<p className="text-ink-soft">Loading seller dashboard…</p>}>
      <SellerContent />
    </Suspense>
  );
}

async function SellerContent() {
  await io();
  const session = await auth();
  if (!session) redirect("/login?as=seller");

  const db = await getDb();
  const userId = session.user.id;
  const [profile] = await db.select().from(sellerProfiles).where(eq(sellerProfiles.userId, userId)).limit(1);
  const [{ n: productCount }] = await db
    .select({ n: count() })
    .from(products)
    .where(eq(products.sellerId, userId));

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bloom-deep">Your shop</p>
      <h1 className="mt-2 font-serif text-5xl tracking-[-0.03em]">{profile?.shopName ?? "Your shop"}</h1>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Products" value={productCount} />
        <StatCard label="Open orders" value={0} />
        <StatCard label="This month's sales" value="₱0" />
      </div>
      <p className="mt-10 text-ink-soft">
        Product management (add, edit, stock) is the next feature for this portal.
      </p>
    </>
  );
}
