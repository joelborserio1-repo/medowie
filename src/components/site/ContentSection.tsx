import { clsx } from "clsx";

export function ContentSection({
  heading,
  body,
  eyebrow,
  tint = false,
}: {
  heading: string | null | undefined;
  body: string | null | undefined;
  eyebrow?: string;
  tint?: boolean;
}) {
  if (!body) return null;

  return (
    <section className={clsx("border-b border-line py-14", tint && "bg-parchment")}>
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <div>
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            <h2 className="font-serif text-2xl text-brown">{heading}</h2>
          </div>
          <div className="max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-charcoal">{body}</div>
        </div>
      </div>
    </section>
  );
}
