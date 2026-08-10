import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

const inputClasses =
  "w-full border border-line bg-warm-white px-3.5 py-3 text-sm text-charcoal placeholder:text-earth focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange";

export function TextField({
  label,
  required,
  error,
  register,
  type = "text",
  className,
}: {
  label: string;
  required?: boolean;
  error?: FieldError;
  register: UseFormRegisterReturn;
  type?: string;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-grey">
        {label}
        {required && <span className="text-orange"> *</span>}
      </span>
      <input type={type} className={inputClasses} {...register} />
      {error && <span className="mt-1 block text-xs text-orange-dark">{error.message}</span>}
    </label>
  );
}

export function TextAreaField({
  label,
  required,
  error,
  register,
  rows = 5,
  className,
}: {
  label: string;
  required?: boolean;
  error?: FieldError;
  register: UseFormRegisterReturn;
  rows?: number;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-grey">
        {label}
        {required && <span className="text-orange"> *</span>}
      </span>
      <textarea rows={rows} className={inputClasses} {...register} />
      {error && <span className="mt-1 block text-xs text-orange-dark">{error.message}</span>}
    </label>
  );
}

export function SelectField({
  label,
  required,
  error,
  register,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  error?: FieldError;
  register: UseFormRegisterReturn;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-grey">
        {label}
        {required && <span className="text-orange"> *</span>}
      </span>
      <select className={inputClasses} {...register}>
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-orange-dark">{error.message}</span>}
    </label>
  );
}
