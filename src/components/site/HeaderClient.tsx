"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Training", href: "/training" },
  { label: "Yearling Preparation", href: "/yearling-preparation" },
  { label: "Horses for Sale", href: "/horses-for-sale" },
  { label: "About", href: "/about" },
  { label: "Forms & Contracts", href: "/forms" },
  { label: "Contact", href: "/contact" },
];

interface StallionNavItem {
  name: string;
  slug: string;
  countrySuffix: string | null;
}

export function HeaderClient({ stallions }: { stallions: StallionNavItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stallionMenuOpen, setStallionMenuOpen] = useState(false);
  const pathname = usePathname();

  const [previousPathname, setPreviousPathname] = useState(pathname);
  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setMobileOpen(false);
    setStallionMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b border-line bg-warm-white/95 backdrop-blur transition-[padding] duration-200",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-xl font-semibold tracking-wide text-brown sm:text-2xl">
            MEDOWIE LODGE
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          <Link
            href="/"
            className={clsx(
              "text-[13px] font-medium uppercase tracking-[0.08em] text-charcoal hover:text-orange",
              pathname === "/" && "text-orange"
            )}
          >
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setStallionMenuOpen(true)}
            onMouseLeave={() => setStallionMenuOpen(false)}
          >
            <button
              type="button"
              className={clsx(
                "text-[13px] font-medium uppercase tracking-[0.08em] text-charcoal hover:text-orange",
                pathname.startsWith("/stallions") && "text-orange"
              )}
              aria-expanded={stallionMenuOpen}
              onClick={() => setStallionMenuOpen((v) => !v)}
            >
              Stallions
            </button>
            {stallionMenuOpen && (
              <div className="absolute left-0 top-full min-w-[220px] border border-line bg-warm-white pt-1 shadow-[0_8px_20px_-8px_rgba(37,26,10,0.25)]">
                <Link
                  href="/stallions"
                  className="block border-b border-line px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-orange hover:bg-parchment"
                >
                  All Stallions
                </Link>
                {stallions.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/stallions/${s.slug}`}
                    className="block px-4 py-2.5 text-[14px] text-charcoal hover:bg-parchment"
                  >
                    {s.name}
                    {s.countrySuffix ? ` ${s.countrySuffix}` : ""}
                  </Link>
                ))}
                {stallions.length === 0 && (
                  <p className="px-4 py-2.5 text-[13px] text-grey">No stallions published yet</p>
                )}
              </div>
            )}
          </div>

          {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-[13px] font-medium uppercase tracking-[0.08em] text-charcoal hover:text-orange",
                pathname.startsWith(link.href) && "text-orange"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex">
          <Button href="/book-a-mare">Book a Mare</Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center border border-line lg:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-[5px]">
            <span className="block h-[1.5px] w-5 bg-charcoal" />
            <span className="block h-[1.5px] w-5 bg-charcoal" />
            <span className="block h-[1.5px] w-5 bg-charcoal" />
          </div>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-line bg-warm-white lg:hidden">
          <nav className="flex flex-col px-5 py-4" aria-label="Mobile">
            <Link href="/" className="border-b border-line py-3 text-sm uppercase tracking-[0.08em]">
              Home
            </Link>
            <Link href="/stallions" className="border-b border-line py-3 text-sm uppercase tracking-[0.08em]">
              Stallions
            </Link>
            {stallions.map((s) => (
              <Link
                key={s.slug}
                href={`/stallions/${s.slug}`}
                className="border-b border-line py-2 pl-4 text-sm text-grey"
              >
                {s.name}
                {s.countrySuffix ? ` ${s.countrySuffix}` : ""}
              </Link>
            ))}
            {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-line py-3 text-sm uppercase tracking-[0.08em]"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <Button href="/book-a-mare" className="w-full">
                Book a Mare
              </Button>
              <Button href="/contact" variant="secondary" className="w-full">
                Enquire
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
