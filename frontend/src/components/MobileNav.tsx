"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LifeBuoy, Menu, X } from "lucide-react";
import { SUPPORT_EMAIL, SUPPORT_SUBJECT } from "@/lib/site";
import { ThemeRow } from "./ThemeToggle";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/our-story", label: "Our story" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const button = menuButton.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  function trapTab(event: React.KeyboardEvent) {
    if (event.key !== "Tab") return;
    const items = panel.current?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])",
    );
    if (!items?.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const close = () => setOpen(false);

  const drawer = (
    <div
      className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
      inert={!open}
    >
      <div
        aria-hidden
        onClick={close}
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        onKeyDown={trapTab}
        style={{ "--glass-radius": "0 28px 28px 0" } as React.CSSProperties}
        className={`glass glass-drawer absolute left-0 top-0 flex h-full w-[min(88vw,380px)] flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end">
          <button
            ref={closeButton}
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 hover:bg-ink/10"
          >
            <X size={22} />
          </button>
        </div>

        <nav aria-label="Main" className="mt-6">
          <ul className="divide-y divide-ink/10">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="block py-5 text-3xl tracking-tight"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-ink/10 pt-2">
          <ThemeRow />
        </div>

        <div className="mt-auto pt-8">
          <p className="text-sm text-ink-soft">
            Questions about an order, sizing or a return? We&rsquo;re here to help.
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(SUPPORT_SUBJECT)}`}
            className="mt-4 flex min-h-14 items-center justify-center gap-2 rounded-full bg-btn text-lg font-semibold text-on-btn transition hover:bg-btn-hover"
          >
            <LifeBuoy size={20} aria-hidden />
            Contact support
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={menuButton}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="glass-press flex h-11 w-11 items-center justify-center rounded-full hover:bg-ink/5 md:hidden"
      >
        <Menu size={22} />
      </button>

      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
