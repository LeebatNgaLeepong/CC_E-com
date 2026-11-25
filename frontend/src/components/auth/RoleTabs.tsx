import Link from "next/link";

export default function RoleTabs({
  active,
  basePath = "/login",
}: {
  active: "consumer" | "seller";
  basePath?: "/login" | "/register";
}) {
  const tabs = [
    { key: "consumer", label: "Customer", href: basePath },
    { key: "seller", label: "Seller", href: `${basePath}?as=seller` },
  ] as const;

  return (
    <nav aria-label="Account type" className="mt-6 grid grid-cols-2 rounded-full bg-ink/5 p-1">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={active === tab.key ? "page" : undefined}
          className={`flex min-h-11 items-center justify-center rounded-full text-sm font-semibold transition ${active === tab.key ? "bg-card shadow-sm" : "text-ink-soft"}`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
