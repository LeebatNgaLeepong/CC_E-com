"use client";

import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
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
          <form action="/shop" className="search-panel glass-panel">
            <Search size={20} />
            <input autoFocus name="q" placeholder="Search pieces, colors, collections" aria-label="Search query" />
            <button type="submit">Search</button>
            <button type="button" onClick={() => setSearchOpen(false)}>Close</button>
          </form>
        </div>
      )}
    </>
  );
}
