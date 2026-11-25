import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { isAdminSessionExpired } from "@/auth-guards";
import PortalShell from "@/components/portal/PortalShell";

export const instant = false;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "admin") redirect("/admin/login");
  if (isAdminSessionExpired(session.user.loginAt)) {
    redirect("/admin/login?expired=1");
  }
  return (
    <PortalShell
      portalName="Admin"
      email={session.user.email ?? ""}
      nav={[
        { href: "/admin", label: "Overview" },
        { href: "/admin/orders", label: "Orders" },
        { href: "/", label: "View store" },
      ]}
      signOutTo="/admin/login"
    >
      {children}
    </PortalShell>
  );
}
