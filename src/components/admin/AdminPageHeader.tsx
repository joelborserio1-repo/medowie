import Link from "next/link";

export function AdminPageHeader({
  title,
  action,
}: {
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="font-serif text-2xl text-brown">{title}</h1>
      {action && (
        <Link
          href={action.href}
          className="rounded-[3px] bg-orange px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-warm-white hover:bg-orange-dark"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
