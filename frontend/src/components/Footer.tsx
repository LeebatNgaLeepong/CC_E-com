import Link from "next/link";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All pieces" },
      { href: "/collections", label: "Collections" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/our-story", label: "Our story" },
      { href: "/support", label: "Support" },
      { href: "/register?as=seller", label: "Sell with us" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/account", label: "My account" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-12">
        <div>
          <p className="font-serif text-2xl tracking-tight">Conscious</p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.35em]">Clothing</p>
          <p className="mt-6 max-w-xs text-sm text-ink-soft">A quieter kind of everyday.</p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-semibold">{column.title}</h2>
            <ul className="mt-4 space-y-1">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-11 items-center text-sm text-ink-soft hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line px-6 py-6 text-center text-xs text-ink-soft">
        © Conscious Clothing. All rights reserved.
      </div>
    </footer>
  );
}
