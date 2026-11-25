import { redirect } from "next/navigation";
import { auth } from "../../auth";
import PortalShell from "@/components/portal/PortalShell";

export const instant = false;

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "seller") redirect("/login?as=seller");
  return (
    <PortalShell
      portalName="Seller"
      email={session.user.email ?? ""}
      nav={[{ href: "/seller", label: "Overview" }]}
      signOutTo="/login?as=seller"
    >
      {children}
    </PortalShell>
  );
}
