"use client";

import Link from "next/link";
import { Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import MobileNav from "./MobileNav";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadCount = () => {
      fetch("/api/cart", { cache: "no-store" })
        .then((response) => response.json())
        .then((data: unknown) => {
          if (typeof data === "object" && data !== null && "count" in data) {
            const count = (data as { count?: unknown }).count;
            setCartCount(typeof count === "number" ? count : 0);
          }
        })
        .catch(() => setCartCount(0));
    };
    loadCount();
    window.addEventListener("focus", loadCount);
    return () => window.removeEventListener("focus", loadCount);
  }, []);

  return (
    <>
      <header className="header">
        <div className="flex items-center">
          <nav className="hidden gap-8 text-base md:flex" aria-label="Primary navigation">
            <Link href="/shop">Shop</Link>
            <Link href="/collections">Collections</Link>
            <Link href="/our-story">Our story</Link>
          </nav>
          <MobileNav />
        </div>
        <Link className="wordmark" href="/" aria-label="Conscious Clothing home">
          Conscious<span>Clothing</span>
        </Link>
        <div className="header-actions">
          <ThemeToggle className="hidden md:flex" />
          <button className="icon-button" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search size={18} />
            <span>Search</span>
          </button>
          <Link className="icon-button bag-button" href="/cart" aria-label={`Open bag, ${cartCount} items`}>
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="bag-count">{cartCount}</span>}
          </Link>
        </div>
      </header>
      {searchOpen && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="Search">
          <form action="/shop" className="glass glass-strong flex w-[min(760px,100%)] items-center gap-2 p-2 pl-5">
            <Search size={20} className="shrink-0 text-ink-soft" aria-hidden />
            <input
              autoFocus
              type="search"
              name="q"
              placeholder="Search pieces"
              aria-label="Search pieces"
              className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-soft"
            />
            <button type="submit" className="btn-primary min-h-11 shrink-0 rounded-full px-5 text-sm font-semibold">
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="flex min-h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink/5 text-sm font-semibold hover:bg-ink/10 md:w-auto md:px-5"
            >
              <X size={20} aria-hidden className="md:hidden" />
              <span className="hidden md:inline">Close</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
