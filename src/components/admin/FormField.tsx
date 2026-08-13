const inputClasses =
  "w-full border border-line bg-warm-white px-3 py-2.5 text-sm text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange";

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  step,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  step?: string;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-grey">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? undefined}
        required={required}
        step={step}
        className={inputClasses}
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  rows = 5,
  className,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  className?: string;
  placeholder?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-grey">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? undefined}
        rows={rows}
        placeholder={placeholder}
        className={inputClasses}
      />
    </label>
  );
}

export function Select({
  label,
  name,
  defaultValue,
  options,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-grey">{label}</span>
      <select name={name} defaultValue={defaultValue ?? undefined} className={inputClasses}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Checkbox({
  label,
  name,
  defaultChecked,
  className,
  value,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  className?: string;
  value?: string;
}) {
  return (
    <label className={`flex items-center gap-2 text-sm text-charcoal ${className ?? ""}`}>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} value={value} className="h-4 w-4" />
      {label}
    </label>
  );
}

export function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="rounded-[3px] bg-orange px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-warm-white hover:bg-orange-dark"
    >
      {label}
    </button>
  );
}
