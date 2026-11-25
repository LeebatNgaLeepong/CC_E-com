import { redirect } from "next/navigation";
import { auth } from "../../auth";
import PortalShell from "@/components/portal/PortalShell";

export const instant = false;

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "customer") redirect("/login");
  return (
    <PortalShell
      portalName="My account"
      email={session.user.email ?? ""}
      nav={[{ href: "/account", label: "Overview" }, { href: "/shop", label: "Shop" }]}
    >
      {children}
    </PortalShell>
  );
}
