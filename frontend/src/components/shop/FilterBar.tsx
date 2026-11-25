import Link from "next/link";
import type { Filters } from "@/lib/catalog";

type Facets = {
  sizes: string[];
  colors: string[];
  collections: { slug: string; name: string }[];
};

function filterHref(current: Filters, key: keyof Filters, value?: string) {
  const params = new URLSearchParams();
  for (const [currentKey, currentValue] of Object.entries(current)) {
    if (currentValue && currentKey !== key) params.set(currentKey, currentValue);
  }
  if (value) params.set(key, value);
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

function Chip({
  active,
  href,
  children,
}: {
  active: boolean;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={`inline-flex min-h-11 items-center rounded-full px-5 text-sm font-medium transition ${
        active ? "btn-primary" : "bg-surface hover:bg-ink/10"
      }`}
    >
      {children}
    </Link>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export default function FilterBar({ facets, current }: { facets: Facets; current: Filters }) {
  return (
    <div className="space-y-6">
      <Group label="Collection">
        <Chip active={!current.collection} href={filterHref(current, "collection")}>All</Chip>
        {facets.collections.map((collection) => (
          <Chip
            key={collection.slug}
            active={current.collection === collection.slug}
            href={filterHref(current, "collection", collection.slug)}
          >
            {collection.name}
          </Chip>
        ))}
      </Group>
      <Group label="Size">
        {facets.sizes.map((size) => (
          <Chip
            key={size}
            active={current.size === size}
            href={filterHref(current, "size", current.size === size ? undefined : size)}
          >
            {size}
          </Chip>
        ))}
      </Group>
      <Group label="Color">
        {facets.colors.map((color) => (
          <Chip
            key={color}
            active={current.color === color}
            href={filterHref(current, "color", current.color === color ? undefined : color)}
          >
            {color}
          </Chip>
        ))}
      </Group>
      <Group label="Sort">
        <Chip active={!current.sort || current.sort === "newest"} href={filterHref(current, "sort")}>
          Newest
        </Chip>
        <Chip active={current.sort === "price-asc"} href={filterHref(current, "sort", "price-asc")}>
          Price: low to high
        </Chip>
        <Chip active={current.sort === "price-desc"} href={filterHref(current, "sort", "price-desc")}>
          Price: high to low
        </Chip>
      </Group>
    </div>
  );
}
