import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { SignOutButton } from "@/components/admin/SignOutButton";

const NAV = [
  { section: "", items: [{ label: "Dashboard", href: "/admin" }] },
  {
    section: "Content",
    items: [
      { label: "Stallions", href: "/admin/stallions" },
      { label: "Horses for Sale", href: "/admin/horses-for-sale" },
      { label: "Yearlings", href: "/admin/yearlings" },
      { label: "Progeny", href: "/admin/progeny" },
      { label: "Results", href: "/admin/results" },
      { label: "News", href: "/admin/news" },
      { label: "Forms & Contracts", href: "/admin/forms" },
    ],
  },
  {
    section: "Operations",
    items: [
      { label: "Enquiries", href: "/admin/enquiries" },
      { label: "Media", href: "/admin/media" },
    ],
  },
  {
    section: "Site",
    items: [
      { label: "Site Content", href: "/admin/site-content" },
      { label: "Settings", href: "/admin/settings" },
    ],
  },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-line bg-warm-white md:block">
        <div className="border-b border-line px-6 py-5">
          <p className="font-serif text-lg text-brown">Medowie Lodge</p>
          <p className="text-xs text-grey">Admin</p>
        </div>
        <nav className="px-3 py-4">
          {NAV.map((group) => (
            <div key={group.section} className="mb-5">
              {group.section && (
                <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-earth">
                  {group.section}
                </p>
              )}
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-[3px] px-3 py-2 text-sm text-charcoal hover:bg-parchment hover:text-orange"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-line px-6 py-4">
          <p className="mb-2 truncate text-xs text-grey">{admin.email}</p>
          <SignOutButton />
        </div>
      </aside>

      <div className="flex-1">
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
