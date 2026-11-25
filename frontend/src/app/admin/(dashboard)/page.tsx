import { Suspense } from "react";
import { io } from "next/cache";
import { and, count, desc, eq } from "drizzle-orm";
import { getDb } from "../../../../../back-end/src/db";
import { orders, sellerProfiles, users } from "../../../../../back-end/src/db/schema";
import StatCard from "@/components/portal/StatCard";
import { setSellerStatus } from "./actions";

export const metadata = { title: "Admin" };
export const instant = false;

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="text-ink-soft">Loading admin dashboard…</p>}>
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  await io();
  const db = await getDb();
  const byRole = await db.select({ role: users.role, n: count() }).from(users).groupBy(users.role);
  const [{ n: orderCount }] = await db.select({ n: count() }).from(orders);
  const pending = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      shopName: sellerProfiles.shopName,
      createdAt: users.createdAt,
    })
    .from(users)
    .innerJoin(sellerProfiles, eq(sellerProfiles.userId, users.id))
    .where(and(eq(users.role, "seller"), eq(users.status, "pending")))
    .orderBy(desc(users.createdAt));
  const roleCount = (role: string) => byRole.find((entry) => entry.role === role)?.n ?? 0;

  return (
    <>
      <h1 className="font-serif text-5xl tracking-[-0.03em]">Overview</h1>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Customers" value={roleCount("customer")} />
        <StatCard label="Sellers" value={roleCount("seller")} />
        <StatCard label="Pending applications" value={pending.length} />
        <StatCard label="Orders" value={orderCount} />
      </div>
      <section className="mt-14">
        <h2 className="text-xl font-semibold">Seller applications</h2>
        {pending.length === 0 ? (
          <p className="mt-4 text-ink-soft">No applications waiting for review.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-card bg-card">
            {pending.map((application) => (
              <li key={application.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium">{application.shopName}</p>
                  <p className="text-sm text-ink-soft">
                    {application.name} · {application.email} · applied{" "}
                    {application.createdAt.toLocaleDateString("en-PH")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form action={setSellerStatus.bind(null, application.id, "suspended")}>
                    <button className="min-h-11 rounded-full bg-ink/5 px-5 text-sm font-semibold hover:bg-ink/10">
                      Reject
                    </button>
                  </form>
                  <form action={setSellerStatus.bind(null, application.id, "active")}>
                    <button className="btn-primary min-h-11 rounded-full px-5 text-sm font-semibold">
                      Approve
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
