export function formatCurrency(value: number | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats a fee as a plain grouped amount with a leading "$" (no currency code),
 * e.g. 27500 -> "$27,500". Used for the dual AU / NZ service-fee display.
 */
export function formatAmount(value: number | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  return `$${new Intl.NumberFormat("en-AU", { maximumFractionDigits: 0 }).format(value)}`;
}

export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function formatFee(fee: number | null | undefined, includesGst: boolean): string | null {
  const formatted = formatCurrency(fee);
  if (!formatted) return null;
  return `${formatted} ${includesGst ? "incl. GST" : "excl. GST"}`;
}

export function stallionDisplayName(name: string, countrySuffix: string | null): string {
  return countrySuffix ? `${name} ${countrySuffix}` : name;
}
