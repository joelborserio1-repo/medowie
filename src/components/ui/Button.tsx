import Link from "next/link";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[3px] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange";

const variants: Record<Variant, string> = {
  primary: "bg-orange text-warm-white hover:bg-orange-dark",
  secondary: "border border-charcoal text-charcoal hover:border-orange hover:text-orange",
  ghost: "border border-warm-white/60 text-warm-white hover:border-warm-white hover:bg-warm-white/10",
};

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function Button({ children, variant = "primary", href, type = "button", onClick, className, disabled }: ButtonProps) {
  const classes = clsx(base, variants[variant], disabled && "cursor-not-allowed opacity-50", className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
