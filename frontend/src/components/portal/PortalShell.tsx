import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function PortalShell({
  portalName,
  email,
  nav,
  signOutTo = "/login",
  children,
}: {
  portalName: string;
  email: string;
  nav: { href: string; label: string }[];
  signOutTo?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100svh] portal-bg">
      <div className="sticky top-4 z-40 h-0">
        <header className="glass glass-strong mx-auto mt-4 flex h-16 w-[min(1180px,calc(100%-2rem))] items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <span className="font-serif text-xl tracking-tight">{portalName}</span>
            <nav aria-label={`${portalName} navigation`} className="hidden gap-5 text-sm font-medium md:flex">
              {nav.map((item) => (
                <Link key={item.href} href={item.href}>{item.label}</Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink-soft md:inline">{email}</span>
            <SignOutButton redirectTo={signOutTo} />
          </div>
        </header>
      </div>
      <main className="mx-auto max-w-[1180px] px-4 pb-20 pt-32">{children}</main>
    </div>
  );
}
